import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Select,
  Tag,
  Button,
  Space,
  Modal,
  message,
  Form,
  Card,
  Row,
  Col,
  Statistic,
  Upload,
} from "antd";
import {
  SearchOutlined,
  ExportOutlined,
  EyeOutlined,
  FilterOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import * as XLSX from "xlsx";
import ProductDetailModal from "../../components/ManageProducts/ProductDetailModal";
import { getAllProducts, bulkUpdateProducts } from "../../service/productApi";
import { getAllDesignersForFilter } from "../../service/designerApi";
import { getAllCategoriesForFilter, getAllSubCategoriesForFilter } from "../../service/categoryApi";

const { Option } = Select;
const { Search } = Input;

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedDesigner, setSelectedDesigner] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailModalLoading, setDetailModalLoading] = useState(false);

  // Unique lists for filters
  const [designers, setDesigners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    // Delay filter data loading to prevent authentication conflicts
    setTimeout(() => {
      fetchFilterData();
    }, 1000);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      message.loading({ content: 'Fetching all products...', key: 'products' });
      
      const response = await getAllProducts();
      
      // Handle the new response structure: { success, message, data: { products: [...] } }
      let productsArray = [];
      
      if (response.success && response.data && response.data.products) {
        productsArray = response.data.products;
      } else if (Array.isArray(response)) {
        // Fallback for direct array response
        productsArray = response;
      } else if (response.products) {
        // Fallback for old structure
        productsArray = response.products;
      }
      
      console.log('Products fetched:', productsArray.length, productsArray);
      
      if (productsArray.length > 0) {
        setProducts(productsArray);
        setFilteredProducts(productsArray);
        
        // Extract filter data from products as fallback if API calls fail
        extractFilterDataFromProducts(productsArray);
        
        message.success({ 
          content: `Successfully loaded ${productsArray.length} products`, 
          key: 'products',
          duration: 2
        });
      } else {
        message.warning({ content: "No products found", key: 'products' });
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      message.error({ 
        content: "Failed to fetch products. Please try again.", 
        key: 'products',
        duration: 3
      });
    } finally {
      setLoading(false);
    }
  };

  const extractFilterDataFromProducts = (productsArray) => {
    // Extract unique designers - handle nested userId structure
    const designerMap = new Map();
    productsArray.forEach(p => {
      if (p.designer) {
        const designerId = p.designer._id || p.designer.userId?._id || "Unknown";
        const designerName = p.designer.displayName || p.designer.userId?.displayName || "Unknown";
        if (designerId && designerName) {
          designerMap.set(designerId, designerName);
        }
      }
    });
    
    if (designerMap.size > 0 && designers.length === 0) {
      const designerObjects = Array.from(designerMap.entries()).map(([id, name]) => ({
        id: id,
        name: name
      }));
      setDesigners(designerObjects);
    }

    // Extract unique categories
    const uniqueCategories = [...new Set(productsArray.map(p => p.category?.name || "Unknown"))];
    if (uniqueCategories.length > 0 && categories.length === 0) {
      const categoryObjects = uniqueCategories.map(category => ({
        id: category,
        name: category
      }));
      setCategories(categoryObjects);
    }

    // Extract unique subcategories
    const uniqueSubCategories = [...new Set(productsArray.map(p => p.subCategory?.name || "Unknown"))];
    if (uniqueSubCategories.length > 0 && subCategories.length === 0) {
      const subCategoryObjects = uniqueSubCategories.map(subCategory => ({
        id: subCategory,
        name: subCategory
      }));
      setSubCategories(subCategoryObjects);
    }
  };

  const fetchFilterData = async () => {
    try {
      setFilterLoading(true);
      
      // Fetch designers
      try {
        const designersResponse = await getAllDesignersForFilter();
        if (designersResponse && designersResponse.designers) {
          const designerNames = designersResponse.designers.map(designer => ({
            id: designer._id || designer.userId?._id || "Unknown",
            name: designer.displayName || designer.userId?.displayName || "Unknown"
          }));
          setDesigners(designerNames);
        }
      } catch (error) {
        console.error("Failed to fetch designers:", error);
        // Don't show error message, just log it
      }

      // Fetch categories
      try {
        const categoriesResponse = await getAllCategoriesForFilter();
        if (categoriesResponse && categoriesResponse.categories) {
          const categoryNames = categoriesResponse.categories.map(category => ({
            id: category._id,
            name: category.name
          }));
          setCategories(categoryNames);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        // Don't show error message, just log it
      }

      // Fetch subcategories
      try {
        const subCategoriesResponse = await getAllSubCategoriesForFilter();
        if (subCategoriesResponse && subCategoriesResponse.subCategories) {
          const subCategoryNames = subCategoriesResponse.subCategories.map(subCategory => ({
            id: subCategory._id,
            name: subCategory.name
          }));
          setSubCategories(subCategoryNames);
        }
      } catch (error) {
        console.error("Failed to fetch subcategories:", error);
        // Don't show error message, just log it
      }
    } catch (error) {
      console.error("Failed to fetch filter data:", error);
      // Don't show error message to avoid authentication issues
    } finally {
      setFilterLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    applyFilters(value, selectedDesigner, selectedCategory, selectedSubCategory);
  };

  const handleDesignerFilter = (value) => {
    setSelectedDesigner(value);
    applyFilters(searchText, value, selectedCategory, selectedSubCategory);
  };

  const handleCategoryFilter = (value) => {
    setSelectedCategory(value);
    applyFilters(searchText, selectedDesigner, value, selectedSubCategory);
  };

  const handleSubCategoryFilter = (value) => {
    setSelectedSubCategory(value);
    applyFilters(searchText, selectedDesigner, selectedCategory, value);
  };

  const applyFilters = (search, designer, category, subCategory) => {
    let filtered = [...products];

    // Search filter
    if (search) {
      filtered = filtered.filter((product) =>
        product.productName.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Designer filter
    if (designer && designer !== "All") {
      filtered = filtered.filter((product) => {
        const designerId = product.designer?._id || product.designer?.userId?._id;
        const designerName = product.designer?.displayName || product.designer?.userId?.displayName;
        return designerId === designer || designerName === designer;
      });
    }

    // Category filter
    if (category && category !== "All") {
      filtered = filtered.filter((product) => 
        product.category?._id === category || product.category?.name === category
      );
    }

    // Sub-category filter
    if (subCategory && subCategory !== "All") {
      filtered = filtered.filter((product) => 
        product.subCategory?._id === subCategory || product.subCategory?.name === subCategory
      );
    }

    setFilteredProducts(filtered);
  };

         const handleExport = () => {
     const dataToExport = filteredProducts.map((product) => ({
         "Product ID": product._id || "N/A",
         "SKU": product.sku || "N/A",
        "Product Name": product.productName,
        "Category": product.category?.name || "N/A",
        "Sub Category": product.subCategory?.name || "N/A",
                "Designer": product.designer?.displayName || product.designer?.userId?.displayName || product.designer?._id || "N/A",
        "Designer Approved": product.designer?.is_approved ? "Yes" : "No",
        "Price": product.price || 0,
        "MRP": product.mrp || 0,
        "Discount %": product.discountPercentage || 0,
        "Fit": product.fit || "N/A",
        "Fabric": product.fabric || "N/A",
        "Material": product.material || "N/A",
        "Status": product.enabled ? "Active" : "Inactive",
        "In Stock": product.in_stock ? "Yes" : "No",
        "Returnable": product.returnable ? "Yes" : "No",
        "Trending": product.isTrending ? "Yes" : "No",
        "Description": product.description || "N/A",
        "Total Variants": product.variants?.length || 0,
        "Total Sizes": product.variants?.reduce((sum, v) => sum + (v.sizes?.length || 0), 0) || 0,
        "Total Stock": product.variants?.reduce((sum, v) => sum + (v.sizes?.reduce((s, size) => s + (size.stock || 0), 0) || 0), 0) || 0,
        "Wishlist Count": product.wishlistCount || 0,
        "Average Rating": product.averageRating || 0,
        "Created At": product.createdDate ? new Date(product.createdDate).toLocaleDateString() : "N/A",
        "Updated At": product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : "N/A",
     }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "Products.xlsx");
    message.success("Products exported successfully!");
  };

  const handleCSVUpload = async (file) => {
    try {
      setUploadLoading(true);
      message.loading({ content: 'Uploading CSV file...', key: 'upload' });

      const response = await bulkUpdateProducts(file);
      
      message.success({ 
        content: response.message || 'Products updated successfully!', 
        key: 'upload',
        duration: 3
      });

      // Refresh the products list after successful update
      await fetchProducts();
      
    } catch (error) {
      console.error("Failed to upload CSV:", error);
      message.error({ 
        content: error.message || 'Failed to update products. Please check your CSV format.', 
        key: 'upload',
        duration: 5
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const beforeUpload = (file) => {
    const isCSV = file.type === 'text/csv' || file.name.endsWith('.csv');
    if (!isCSV) {
      message.error('You can only upload CSV files!');
      return false;
    }
    
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('CSV file must be smaller than 2MB!');
      return false;
    }
    
    return true;
  };

  const downloadCSVTemplate = () => {
    const templateData = [
      {
        "Product ID": "687f9f25f20b966c8834cd80",
        "SKU": "MS12",
        "Product Name": "Sample Product Name",
        "Price": "2500",
        "MRP": "3500",
        "Description": "Sample product description",
        "Enabled": "true",
        "In Stock": "true",
        "Returnable": "true",
        "Trending": "false"
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "products_update_template.csv");
    message.success("CSV template downloaded!");
  };

  const showProductDetail = (product) => {
    setSelectedProduct(product);
    setIsDetailModalVisible(true);
  };

  const handleModalClose = () => {
    setIsDetailModalVisible(false);
    setSelectedProduct(null);
  };

  const getTotalValue = () => {
    return filteredProducts.reduce((sum, product) => sum + (product.price || 0), 0);
  };

  const getAveragePrice = () => {
    if (filteredProducts.length === 0) return 0;
    return Math.round(getTotalValue() / filteredProducts.length);
  };

  const columns = [
    {
      title: "Product",
      key: "product",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src={record.coverImage}
            alt={record.productName}
            style={{
              width: 60,
              height: 60,
              objectFit: "cover",
              borderRadius: "8px",
            }}
            onError={(e) => {
              e.target.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN";
            }}
          />
          <div>
            <div style={{ fontWeight: "600", color: "#1a1a1a" }}>
              {record.productName}
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {record.category?.name} • {record.subCategory?.name}
            </div>
                         <div style={{ fontSize: "11px", color: "#999" }}>
               ID: {record._id?.slice(-8)} • SKU: {record.sku || 'N/A'}
             </div>
          </div>
        </div>
      ),
    },
         {
               title: "Designer",
        key: "designer",
        render: (_, record) => (
          <div>
            <Tag color="blue">
              {record.designer?.displayName || record.designer?.userId?.displayName || record.designer?._id || "Unknown"}
            </Tag>
            {record.designer?.is_approved && (
              <div style={{ fontSize: "11px", color: "#52c41a", marginTop: "2px" }}>
                ✓ Approved
              </div>
            )}
          </div>
        ),
     },
         {
       title: "Price & Stock",
       key: "priceStock",
       render: (_, record) => (
         <div>
           <div style={{ fontWeight: "600", color: "#52c41a", fontSize: "14px" }}>
             ₹{record.price?.toLocaleString() || "0"}
           </div>
           {record.mrp && record.mrp > record.price && (
             <div style={{ fontSize: "10px", color: "#999", textDecoration: "line-through" }}>
               MRP: ₹{record.mrp?.toLocaleString()}
             </div>
           )}
           <div style={{ fontSize: "11px", color: "#666" }}>
             {record.variants?.reduce((sum, v) => sum + (v.sizes?.reduce((s, size) => s + (size.stock || 0), 0) || 0), 0) || 0} in stock
           </div>
         </div>
       ),
       sorter: (a, b) => (a.price || 0) - (b.price || 0),
     },
    {
      title: "Status",
      dataIndex: "enabled",
      key: "enabled",
      render: (enabled) => (
        <Tag color={enabled ? "green" : "red"}>
          {enabled ? "Active" : "Inactive"}
        </Tag>
      ),
      filters: [
        { text: "Active", value: true },
        { text: "Inactive", value: false },
      ],
      onFilter: (value, record) => record.enabled === value,
    },
         {
       title: "Variants & Sizes",
       key: "variants",
       render: (_, record) => (
         <div>
           <div style={{ fontSize: "12px", color: "#666" }}>
             {record.variants?.length || 0} colors
           </div>
           <div style={{ fontSize: "12px", color: "#666" }}>
             {record.variants?.reduce((sum, v) => sum + (v.sizes?.length || 0), 0) || 0} sizes
           </div>
           {record.fit && (
             <div style={{ fontSize: "11px", color: "#999" }}>
               {record.fit}
             </div>
           )}
           {record.fabric && (
             <div style={{ fontSize: "11px", color: "#999" }}>
               {record.fabric}
             </div>
           )}
         </div>
       ),
     },
    {
      title: "Created",
      key: "created",
             render: (_, record) => (
         <div style={{ fontSize: "12px", color: "#666" }}>
           {record.createdDate ? new Date(record.createdDate).toLocaleDateString() : "N/A"}
         </div>
       ),
       sorter: (a, b) => new Date(a.createdDate || 0) - new Date(b.createdDate || 0),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => showProductDetail(record)}
            style={{
              borderRadius: "6px",
              fontWeight: "500",
            }}
          >
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <ManageProductsWrap>
      <div className="page-header">
        <div className="header-content">
          <h2>Manage Products</h2>
          <p>Manage and view all products in the system</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Products"
              value={filteredProducts.length}
              valueStyle={{ color: "#667eea" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Value"
              value={getTotalValue()}
              prefix="₹"
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Average Price"
              value={getAveragePrice()}
              prefix="₹"
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Card style={{ marginBottom: "24px" }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8}>
            <Search
              placeholder="Search products..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              onSearch={handleSearch}
            />
          </Col>
          <Col xs={24} sm={4}>
                         <Select
               placeholder="Designer"
               style={{ width: "100%" }}
               value={selectedDesigner}
               onChange={handleDesignerFilter}
               size="large"
               loading={filterLoading}
             >
               <Option value="All">All Designers</Option>
               {designers.map((designer) => (
                 <Option key={designer.id} value={designer.id}>
                   {designer.name}
                 </Option>
               ))}
             </Select>
          </Col>
          <Col xs={24} sm={4}>
                         <Select
               placeholder="Category"
               style={{ width: "100%" }}
               value={selectedCategory}
               onChange={handleCategoryFilter}
               size="large"
               loading={filterLoading}
             >
               <Option value="All">All Categories</Option>
               {categories.map((category) => (
                 <Option key={category.id} value={category.id}>
                   {category.name}
                 </Option>
               ))}
             </Select>
          </Col>
          <Col xs={24} sm={4}>
                         <Select
               placeholder="Sub Category"
               style={{ width: "100%" }}
               value={selectedSubCategory}
               onChange={handleSubCategoryFilter}
               size="large"
               loading={filterLoading}
             >
               <Option value="All">All Sub Categories</Option>
               {subCategories.map((subCategory) => (
                 <Option key={subCategory.id} value={subCategory.id}>
                   {subCategory.name}
                 </Option>
               ))}
             </Select>
          </Col>
                     <Col xs={24} sm={3}>
             <Button
               type="primary"
               icon={<ExportOutlined />}
               size="large"
               onClick={handleExport}
               style={{ width: "100%" }}
             >
               Export
             </Button>
           </Col>
           <Col xs={24} sm={3}>
             <Upload
               name="csvFile"
               accept=".csv"
               beforeUpload={beforeUpload}
               customRequest={({ file }) => handleCSVUpload(file)}
               showUploadList={false}
             >
               <Button
                 type="default"
                 icon={<UploadOutlined />}
                 size="large"
                 loading={uploadLoading}
                 style={{ width: "100%" }}
               >
                 Update CSV
               </Button>
             </Upload>
           </Col>
           <Col xs={24} sm={2}>
             <Button
               type="dashed"
               size="large"
               onClick={downloadCSVTemplate}
               style={{ width: "100%" }}
               title="Download CSV Template"
             >
               📋
             </Button>
           </Col>
        </Row>
      </Card>

      {/* Products Table */}
      <Card>
        <Table
          dataSource={filteredProducts.map((product, index) => ({
            key: index,
            ...product,
          }))}
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} products`,
          }}
          loading={loading}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Product Detail Modal */}
      <ProductDetailModal
        visible={isDetailModalVisible}
        onClose={handleModalClose}
        product={selectedProduct}
        loading={detailModalLoading}
      />
    </ManageProductsWrap>
  );
};

// Styled Components
const ManageProductsWrap = styled.div`
  padding: 24px;

  .page-header {
    margin-bottom: 24px;
    
    .header-content {
      h2 {
        font-size: 28px;
        font-weight: 600;
        color: #1a1a1a;
        margin: 0 0 8px 0;
      }
      
      p {
        color: #666;
        margin: 0;
        font-size: 16px;
      }
    }
  }

  .ant-card {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid #f0f0f0;
  }

  .ant-table {
    .ant-table-thead > tr > th {
      background: #fafafa;
      border-bottom: 2px solid #f0f0f0;
      font-weight: 600;
      color: #1a1a1a;
    }

    .ant-table-tbody > tr > td {
      border-bottom: 1px solid #f5f5f5;
    }

    .ant-table-tbody > tr:hover > td {
      background: #f8f9fa;
    }
  }

  .ant-select {
    .ant-select-selector {
      border-radius: 8px;
    }
  }

  .ant-input-search {
    .ant-input {
      border-radius: 8px;
    }
  }
`;

export default ManageProducts;
