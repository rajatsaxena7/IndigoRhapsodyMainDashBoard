import React, { useEffect, useState } from "react";
import {
  Table,
  message,
  Space,
  Image,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Tag,
  Select,
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Avatar,
  Tooltip,
  Progress,
  Badge,
  Switch,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  TagsOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import {
  GetSubCategories,
  DeleteSubCategory,
  CreateSubCategory,
  UpdateSubCategory,
  ApproveSubCategory,
  GetCategories,
} from "../../../service/categoryApi";
import { storage } from "../../../service/FirebaseService";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const { Option } = Select;
const { Title, Text } = Typography;

function SubCategoryTable({ onDataUpdate }) {
  const [subcategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [currentSubCategory, setCurrentSubCategory] = useState(null);
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState(null);

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, []);

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const data = await GetSubCategories();
      setSubCategories(data.subCategories || []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      message.error("Error fetching subcategories");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await GetCategories();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Error fetching categories");
    }
  };

  const showModal = (type, subcategory = null) => {
    setModalType(type);
    setCurrentSubCategory(subcategory);
    setIsModalVisible(true);
    if (subcategory) {
      form.setFieldsValue({
        name: subcategory.name,
        categoryId: subcategory.categoryId?._id,
      });
    } else {
      form.resetFields();
    }
    setFile(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setFile(null);
  };

  const handleFileChange = (info) => {
    const { fileList } = info;

    if (fileList.length === 0) {
      setFile(null);
    }
  };

  const uploadImageToFirebase = async (file) => {
    try {
      const timestamp = Date.now();
      const fileRef = ref(storage, `subcategory/${timestamp}_${file.name}`);

      const snapshot = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      return url;
    } catch (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
  };

  const handleAddEdit = async (values) => {
    try {
      setUploading(true);

      let image = currentSubCategory?.image || "";

      if (file) {
        image = await uploadImageToFirebase(file);
      } else if (modalType === "add" && !image) {
        throw new Error("Please upload an image.");
      }

      const subcategoryData = {
        name: values.name,
        image: image,
        categoryId: values.categoryId,
      };

      if (!subcategoryData.name || !subcategoryData.image) {
        throw new Error("Name and image are required");
      }

      if (modalType === "add") {
        await CreateSubCategory(subcategoryData);
        message.success("Subcategory added successfully");
      } else {
        await UpdateSubCategory(currentSubCategory._id, subcategoryData);
        message.success("Subcategory updated successfully");
      }

      fetchSubCategories();
      if (onDataUpdate) onDataUpdate();
      handleCancel();
    } catch (error) {
      message.error(error.message || "Error saving subcategory");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    setSubCategoryToDelete(id);
    setDeleteConfirmVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await DeleteSubCategory(subCategoryToDelete);
      message.success("Subcategory deleted successfully");
      fetchSubCategories();
      if (onDataUpdate) onDataUpdate();
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      message.error("Error deleting subcategory");
    } finally {
      setDeleteConfirmVisible(false);
      setSubCategoryToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmVisible(false);
    setSubCategoryToDelete(null);
  };

  const handleApproveToggle = async (id, isApproved) => {
    try {
      await ApproveSubCategory(id, !isApproved);
      message.success(
        `Subcategory ${isApproved ? "unapproved" : "approved"} successfully`
      );
      fetchSubCategories();
      if (onDataUpdate) onDataUpdate();
    } catch (error) {
      message.error("Error updating approval status");
    }
  };

  const columns = [
    {
      title: "Subcategory Info",
      key: "subcategoryInfo",
      render: (_, record) => (
        <Space>
          <Avatar
            size={48}
            src={record.image}
            icon={<TagsOutlined />}
            style={{ backgroundColor: '#52c41a' }}
          />
          <div>
            <div style={{ fontWeight: 500, fontSize: '16px', color: '#1a1a1a' }}>
              {record.name}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              ID: {record._id?.substring(0, 8)}...
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Parent Category",
      dataIndex: ["categoryId", "name"],
      key: "categoryName",
      render: (categoryName, record) => (
        <Space>
          <FolderOutlined style={{ color: '#1890ff' }} />
          <Text strong>{categoryName || "N/A"}</Text>
        </Space>
      ),
    },
    {
      title: "Image Preview",
      dataIndex: "image",
      key: "image",
      render: (imageUrl) => (
        imageUrl ? (
          <Tooltip title="Click to view full image">
            <Image
              width={60}
              height={60}
              src={imageUrl}
              alt="Subcategory"
              style={{ borderRadius: 8, objectFit: 'cover' }}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
            />
          </Tooltip>
        ) : (
          <div style={{ 
            width: 60, 
            height: 60, 
            backgroundColor: '#f5f5f5', 
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999'
          }}>
            <TagsOutlined style={{ fontSize: 24 }} />
          </div>
        )
      ),
    },
    {
      title: "Approval Status",
      dataIndex: "isApproved",
      key: "isApproved",
      render: (isApproved, record) => (
        <Space direction="vertical" size="small">
          <Tag
            color={isApproved ? "green" : "orange"}
            icon={isApproved ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
            style={{ margin: 0 }}
          >
            {isApproved ? "Approved" : "Pending"}
          </Tag>
          <Switch
            size="small"
            checked={isApproved}
            onChange={() => handleApproveToggle(record._id, isApproved)}
            checkedChildren="✓"
            unCheckedChildren="✗"
          />
        </Space>
      ),
      filters: [
        { text: "Approved", value: true },
        { text: "Pending", value: false },
      ],
      onFilter: (value, record) => record.isApproved === value,
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date) => (
        <Space direction="vertical" size="small">
          <Text strong style={{ fontSize: '14px' }}>
            {new Date(date).toLocaleDateString()}
          </Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <CalendarOutlined style={{ marginRight: 4 }} />
            {new Date(date).toLocaleTimeString()}
          </Text>
        </Space>
      ),
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                Modal.info({
                  title: `Subcategory: ${record.name}`,
                  content: (
                    <div>
                      <p><strong>Name:</strong> {record.name}</p>
                      <p><strong>Category:</strong> {record.categoryId?.name || 'N/A'}</p>
                      <p><strong>Status:</strong> {record.isApproved ? 'Approved' : 'Pending'}</p>
                      <p><strong>Created:</strong> {new Date(record.createdDate).toLocaleString()}</p>
                      {record.image && (
                        <div>
                          <p><strong>Image:</strong></p>
                          <Image
                            width={200}
                            src={record.image}
                            alt={record.name}
                            style={{ borderRadius: 8 }}
                          />
                        </div>
                      )}
                    </div>
                  ),
                  width: 500,
                });
              }}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Tooltip title="Edit Subcategory">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showModal("edit", record)}
              style={{ color: '#52c41a' }}
            />
          </Tooltip>
          <Tooltip title="Delete Subcategory">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record._id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const approvedCount = subcategories.filter(sub => sub.isApproved).length;
  const pendingCount = subcategories.filter(sub => !sub.isApproved).length;

  return (
    <div>
      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card className="summary-card">
            <Statistic
              title="Total Subcategories"
              value={subcategories.length}
              valueStyle={{ color: '#52c41a' }}
              prefix={<TagsOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="summary-card">
            <Statistic
              title="Approved"
              value={approvedCount}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="summary-card">
            <Statistic
              title="Pending Approval"
              value={pendingCount}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Action Button */}
      <div style={{ marginBottom: 16, textAlign: "right" }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          size="large"
          onClick={() => showModal("add")}
          style={{ borderRadius: 8 }}
        >
          Add Subcategory
        </Button>
      </div>

      {/* Table */}
      <Card className="table-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Progress type="circle" percent={75} size="small" />
            <Text style={{ display: 'block', marginTop: 16 }}>Loading subcategories...</Text>
          </div>
        ) : subcategories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <TagsOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
            <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>
              No subcategories found. Create your first subcategory!
            </Text>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={subcategories}
            rowKey="_id"
            pagination={{
              pageSize: 8,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} subcategories`
            }}
            className="modern-table"
          />
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={
          <Space>
            {modalType === "add" ? (
              <PlusOutlined style={{ color: '#52c41a' }} />
            ) : (
              <EditOutlined style={{ color: '#1890ff' }} />
            )}
            <span>{modalType === "add" ? "Add New Subcategory" : "Edit Subcategory"}</span>
          </Space>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        className="modern-modal"
      >
        <Form form={form} layout="vertical" onFinish={handleAddEdit}>
          <Form.Item
            name="name"
            label="Subcategory Name"
            rules={[
              { required: true, message: "Please enter the subcategory name" },
              { min: 2, message: "Subcategory name must be at least 2 characters" }
            ]}
          >
            <Input 
              placeholder="Enter subcategory name..."
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
          
          <Form.Item
            name="categoryId"
            label="Parent Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select 
              placeholder="Select a category"
              size="large"
              style={{ borderRadius: 8 }}
            >
              {categories.map((category) => (
                <Option key={category._id} value={category._id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            label="Subcategory Image"
            rules={[
              {
                required: modalType === "add",
                message: "Please upload an image",
              },
            ]}
          >
            <Upload
              beforeUpload={(file) => {
                setFile(file);
                return false;
              }}
              onChange={handleFileChange}
              showUploadList={false}
              accept="image/*"
              maxCount={1}
            >
              <div className="upload-area">
                <UploadOutlined style={{ fontSize: 48, color: '#52c41a' }} />
                <div style={{ marginTop: 8 }}>
                  <Text strong>Click to upload image</Text>
                </div>
                <Text type="secondary">Support for JPG, PNG, GIF up to 2MB</Text>
              </div>
            </Upload>
            {file && (
              <div style={{ marginTop: 8 }}>
                <Tag color="green">{file.name}</Tag>
              </div>
            )}
            {modalType === "edit" && currentSubCategory?.image && !file && (
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">Current image:</Text>
                <Image
                  width={100}
                  src={currentSubCategory.image}
                  alt="Current Subcategory"
                  style={{ marginTop: 8, borderRadius: 8 }}
                />
              </div>
            )}
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              size="large"
              loading={uploading}
              style={{ borderRadius: 8 }}
            >
              {uploading 
                ? (modalType === "add" ? 'Creating Subcategory...' : 'Updating Subcategory...')
                : (modalType === "add" ? 'Create Subcategory' : 'Update Subcategory')
              }
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        open={deleteConfirmVisible}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        okText="Delete"
        cancelText="Cancel"
        okType="danger"
      >
        <p>Are you sure you want to delete this subcategory? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}

export default SubCategoryTable;
