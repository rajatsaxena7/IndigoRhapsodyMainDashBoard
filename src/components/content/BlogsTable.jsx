import React, { useState, useEffect } from "react";
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
  Switch,
  Select,
} from "antd";
import {
  UploadOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
  FileTextOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../../service/blogsService";
import { uploadImageToFirebase } from "../../service/FirebaseService";

const { confirm } = Modal;
const { Title, Text } = Typography;
const { Option } = Select;

function BlogsTable({ onDataUpdate }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [currentBlog, setCurrentBlog] = useState(null);
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [quillContent, setQuillContent] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getBlogs();
      setBlogs(data || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      message.error("Error fetching blogs");
    } finally {
      setLoading(false);
    }
  };

  const showModal = (type, blog = null) => {
    setModalType(type);
    setCurrentBlog(blog);
    setIsModalVisible(true);
    if (blog) {
      form.setFieldsValue({
        title: blog.title,
        status: blog.status || 'draft',
      });
      setQuillContent(blog.description || "");
    } else {
      form.resetFields();
      setQuillContent("");
    }
    setFile(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setQuillContent("");
    setFile(null);
  };

  const handleFileChange = ({ file }) => {
    if (file.status === "removed") {
      setFile(null);
    } else {
      setFile(file.originFileObj);
    }
  };

  const handleAddEdit = async (values) => {
    if (!quillContent.trim()) {
      message.error("Please enter the blog content");
      return;
    }

    try {
      setUploading(true);

      let imageUrl = currentBlog?.image || "";

      if (file) {
        imageUrl = await uploadImageToFirebase(file, "blogs");
      }

      const blogData = {
        title: values.title,
        description: quillContent,
        image: imageUrl,
        status: values.status,
      };

      if (modalType === "add") {
        await createBlog(blogData);
        message.success("Blog created successfully");
      } else {
        await updateBlog(currentBlog._id, blogData);
        message.success("Blog updated successfully");
      }

      fetchBlogs();
      if (onDataUpdate) onDataUpdate();
      handleCancel();
    } catch (error) {
      console.error("Error saving blog:", error);
      message.error(error.message || "Error saving blog");
    } finally {
      setUploading(false);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this blog?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteBlog(id);
          message.success("Blog deleted successfully");
          fetchBlogs();
          if (onDataUpdate) onDataUpdate();
        } catch (error) {
          console.error("Error deleting blog:", error);
          message.error(error.message || "Error deleting blog");
        }
      },
    });
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      await updateBlog(id, { status: newStatus });
      message.success(`Blog ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`);
      fetchBlogs();
      if (onDataUpdate) onDataUpdate();
    } catch (error) {
      console.error("Error updating blog status:", error);
      message.error("Error updating blog status");
    }
  };

  const columns = [
    {
      title: "Blog Info",
      key: "blogInfo",
      render: (_, record) => (
        <Space>
          <Avatar
            size={48}
            src={record.image}
            icon={<FileTextOutlined />}
            style={{ backgroundColor: '#722ed1' }}
          />
          <div>
            <div style={{ fontWeight: 500, fontSize: '16px', color: '#1a1a1a' }}>
              {record.title}
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
              width={80}
              height={60}
              src={imageUrl}
              alt="Blog"
              style={{ borderRadius: 8, objectFit: 'cover' }}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
            />
          </Tooltip>
        ) : (
          <div style={{ 
            width: 80, 
            height: 60, 
            backgroundColor: '#f5f5f5', 
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999'
          }}>
            <FileTextOutlined style={{ fontSize: 24 }} />
          </div>
        )
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Space direction="vertical" size="small">
          <Tag
            color={status === 'published' ? "green" : "orange"}
            icon={status === 'published' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
            style={{ margin: 0 }}
          >
            {status === 'published' ? "Published" : "Draft"}
          </Tag>
          <Switch
            size="small"
            checked={status === 'published'}
            onChange={() => handleToggleStatus(record._id, status)}
            checkedChildren="✓"
            unCheckedChildren="✗"
          />
        </Space>
      ),
      filters: [
        { text: "Published", value: "published" },
        { text: "Draft", value: "draft" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
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
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Blog Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                Modal.info({
                  title: `Blog: ${record.title}`,
                  content: (
                    <div>
                      <p><strong>Title:</strong> {record.title}</p>
                      <p><strong>Status:</strong> {record.status === 'published' ? 'Published' : 'Draft'}</p>
                      <p><strong>Created:</strong> {new Date(record.createdAt).toLocaleString()}</p>
                      {record.image && (
                        <div>
                          <p><strong>Image:</strong></p>
                          <Image
                            width={300}
                            src={record.image}
                            alt={record.title}
                            style={{ borderRadius: 8 }}
                          />
                        </div>
                      )}
                      <div style={{ marginTop: 16 }}>
                        <p><strong>Content:</strong></p>
                        <div 
                          dangerouslySetInnerHTML={{ __html: record.description }}
                          style={{ 
                            maxHeight: 200, 
                            overflow: 'auto', 
                            border: '1px solid #f0f0f0', 
                            padding: 12, 
                            borderRadius: 8,
                            backgroundColor: '#fafafa'
                          }}
                        />
                      </div>
                    </div>
                  ),
                  width: 700,
                });
              }}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Tooltip title="Edit Blog">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showModal("edit", record)}
              style={{ color: '#52c41a' }}
            />
          </Tooltip>
          <Tooltip title="Delete Blog">
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

  const publishedCount = blogs.filter(blog => blog.status === 'published').length;
  const draftCount = blogs.filter(blog => blog.status === 'draft').length;

  return (
    <div>
      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card className="summary-card">
            <Statistic
              title="Total Blogs"
              value={blogs.length}
              valueStyle={{ color: '#722ed1' }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="summary-card">
            <Statistic
              title="Published Blogs"
              value={publishedCount}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="summary-card">
            <Statistic
              title="Draft Blogs"
              value={draftCount}
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
          Add Blog
        </Button>
      </div>

      {/* Table */}
      <Card className="table-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Progress type="circle" percent={75} size="small" />
            <Text style={{ display: 'block', marginTop: 16 }}>Loading blogs...</Text>
          </div>
        ) : blogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <FileTextOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
            <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>
              No blogs found. Create your first blog!
            </Text>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={blogs}
            rowKey="_id"
            pagination={{
              pageSize: 8,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} blogs`
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
            <span>{modalType === "add" ? "Add New Blog" : "Edit Blog"}</span>
          </Space>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        className="modern-modal"
      >
        <Form form={form} layout="vertical" onFinish={handleAddEdit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Blog Title"
                rules={[
                  { required: true, message: "Please enter the blog title" },
                  { min: 3, message: "Blog title must be at least 3 characters" }
                ]}
              >
                <Input 
                  placeholder="Enter blog title..."
                  size="large"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Blog Status"
                initialValue="draft"
              >
                <Select size="large" style={{ borderRadius: 8 }}>
                  <Option value="draft">Draft</Option>
                  <Option value="published">Published</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            label="Blog Image"
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
                if (isImage && isLt2M) {
                  setFile(file);
                }
                return false;
              }}
              onChange={handleFileChange}
              showUploadList={false}
              accept="image/*"
            >
              <div className="upload-area">
                <UploadOutlined style={{ fontSize: 48, color: '#722ed1' }} />
                <div style={{ marginTop: 8 }}>
                  <Text strong>Click to upload image</Text>
                </div>
                <Text type="secondary">Support for JPG, PNG, GIF up to 2MB</Text>
              </div>
            </Upload>
            {file && (
              <div style={{ marginTop: 8 }}>
                <Tag color="purple">{file.name}</Tag>
              </div>
            )}
            {modalType === "edit" && currentBlog?.image && !file && (
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">Current image:</Text>
                <Image
                  width={100}
                  src={currentBlog.image}
                  alt="Current Blog"
                  style={{ marginTop: 8, borderRadius: 8 }}
                />
              </div>
            )}
          </Form.Item>

          <Form.Item
            label="Blog Content"
            required
          >
            <div style={{ border: '1px solid #d9d9d9', borderRadius: 8 }}>
              <ReactQuill
                value={quillContent}
                onChange={setQuillContent}
                placeholder="Write your blog content here..."
                style={{ height: 200 }}
              />
            </div>
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
                ? (modalType === "add" ? 'Creating Blog...' : 'Updating Blog...')
                : (modalType === "add" ? 'Create Blog' : 'Update Blog')
              }
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default BlogsTable;
