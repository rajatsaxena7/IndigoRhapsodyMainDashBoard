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
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Avatar,
  Tag,
  Tooltip,
  Progress,
} from "antd";
import {
  UploadOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  FolderOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import {
  GetCategories,
  DeleteCategory,
  AddCategory,
} from "../../../service/categoryApi";
import { storage } from "../../../service/FirebaseService";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const { confirm } = Modal;
const { Title, Text } = Typography;

function CategoryTable({ onDataUpdate }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await GetCategories();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Error fetching categories");
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
    form.resetFields();
    setFile(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setFile(null);
  };

  const handleFileChange = ({ file }) => {
    if (file.status === "removed") {
      setFile(null);
    } else {
      setFile(file.originFileObj);
    }
  };

  const uploadImageToFirebase = async (file) => {
    const fileRef = ref(storage, `category/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

  const handleAdd = async (values) => {
    try {
      setUploading(true);

      if (!file) {
        throw new Error("Please upload an image.");
      }

      const imageUrl = await uploadImageToFirebase(file);
      const categoryData = { name: values.name, imageUrl };

      await AddCategory(categoryData);
      message.success("Category added successfully");
      fetchCategories();
      if (onDataUpdate) onDataUpdate();
      handleCancel();
    } catch (error) {
      console.error("Error adding category:", error);
      message.error(error.message || "Error adding category");
    } finally {
      setUploading(false);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this category?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone and will affect all associated subcategories.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await DeleteCategory(id);
          message.success("Category deleted successfully");
          fetchCategories();
          if (onDataUpdate) onDataUpdate();
        } catch (error) {
          console.error("Error deleting category:", error);
          message.error(error.message || "Error deleting category");
        }
      },
    });
  };

  const columns = [
    {
      title: "Category Info",
      key: "categoryInfo",
      render: (_, record) => (
        <Space>
          <Avatar
            size={48}
            src={record.image}
            icon={<FolderOutlined />}
            style={{ backgroundColor: '#1890ff' }}
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
              alt="Category"
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
            <FolderOutlined style={{ fontSize: 24 }} />
          </div>
        )
      ),
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
          <Tooltip title="View Category Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                Modal.info({
                  title: `Category: ${record.name}`,
                  content: (
                    <div>
                      <p><strong>Name:</strong> {record.name}</p>
                      <p><strong>ID:</strong> {record._id}</p>
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
          <Tooltip title="Delete Category">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => showDeleteConfirm(record._id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card className="summary-card">
            <Statistic
              title="Total Categories"
              value={categories.length}
              valueStyle={{ color: '#1890ff' }}
              prefix={<FolderOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="summary-card">
            <Statistic
              title="Categories with Images"
              value={categories.filter(cat => cat.image).length}
              valueStyle={{ color: '#52c41a' }}
              prefix={<UploadOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="summary-card">
            <Statistic
              title="Categories without Images"
              value={categories.filter(cat => !cat.image).length}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<FolderOutlined />}
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
          onClick={showModal}
          style={{ borderRadius: 8 }}
        >
          Add Category
        </Button>
      </div>

      {/* Table */}
      <Card className="table-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Progress type="circle" percent={75} size="small" />
            <Text style={{ display: 'block', marginTop: 16 }}>Loading categories...</Text>
          </div>
        ) : categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <FolderOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
            <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>
              No categories found. Create your first category!
            </Text>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={categories}
            rowKey="_id"
            pagination={{
              pageSize: 8,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} categories`
            }}
            className="modern-table"
          />
        )}
      </Card>

      {/* Add Category Modal */}
      <Modal
        title={
          <Space>
            <PlusOutlined style={{ color: '#1890ff' }} />
            <span>Add New Category</span>
          </Space>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        className="modern-modal"
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item
            name="name"
            label="Category Name"
            rules={[
              { required: true, message: "Please enter the category name" },
              { min: 2, message: "Category name must be at least 2 characters" }
            ]}
          >
            <Input 
              placeholder="Enter category name..."
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
          
          <Form.Item
            name="image"
            label="Category Image"
            rules={[
              {
                required: true,
                message: "Please upload an image",
              },
            ]}
          >
            <Upload
              beforeUpload={(file) => {
                const isImage = file.type.startsWith("image/");
                if (!isImage) {
                  message.error("You can only upload image files!");
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                  message.error("Image must be smaller than 2MB!");
                }
                return isImage && isLt2M ? true : Upload.LIST_IGNORE;
              }}
              onChange={handleFileChange}
              showUploadList={false}
              accept="image/*"
            >
              <div className="upload-area">
                <UploadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                <div style={{ marginTop: 8 }}>
                  <Text strong>Click to upload image</Text>
                </div>
                <Text type="secondary">Support for JPG, PNG, GIF up to 2MB</Text>
              </div>
            </Upload>
            {file && (
              <div style={{ marginTop: 8 }}>
                <Tag color="blue">{file.name}</Tag>
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
              {uploading ? 'Creating Category...' : 'Create Category'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CategoryTable;
