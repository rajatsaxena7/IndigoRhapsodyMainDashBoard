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
  Switch,
} from "antd";
import {
  UploadOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  PictureOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  GetBanners,
  DeleteBanner,
  CreateBanner,
  UpdateBanner,
} from "../../service/bannerApi";
import { uploadImageToFirebase } from "../../service/FirebaseService";

const { confirm } = Modal;
const { Title, Text } = Typography;

function BannerTable({ onDataUpdate }) {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [currentBanner, setCurrentBanner] = useState(null);
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await GetBanners();
      setBanners(data.banners || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
      message.error("Error fetching banners");
    } finally {
      setLoading(false);
    }
  };

  const showModal = (type, banner = null) => {
    setModalType(type);
    setCurrentBanner(banner);
    setIsModalVisible(true);
    if (banner) {
      form.setFieldsValue({
        name: banner.name,
        isActive: banner.isActive !== false,
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

  const handleFileChange = ({ file }) => {
    if (file.status === "removed") {
      setFile(null);
    } else {
      setFile(file.originFileObj);
    }
  };

  const handleAddEdit = async (values) => {
    try {
      setUploading(true);

      let imageUrl = currentBanner?.image || "";

      if (file) {
        imageUrl = await uploadImageToFirebase(file, "banners");
      } else if (modalType === "add" && !imageUrl) {
        throw new Error("Please upload an image.");
      }

      const bannerData = {
        name: values.name,
        imageUrl,
        isActive: values.isActive,
      };

      if (modalType === "add") {
        await CreateBanner(bannerData);
        message.success("Banner added successfully");
      } else {
        await UpdateBanner(currentBanner._id, bannerData);
        message.success("Banner updated successfully");
      }

      fetchBanners();
      if (onDataUpdate) onDataUpdate();
      handleCancel();
    } catch (error) {
      console.error("Error saving banner:", error);
      message.error(error.message || "Error saving banner");
    } finally {
      setUploading(false);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this banner?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await DeleteBanner(id);
          message.success("Banner deleted successfully");
          fetchBanners();
          if (onDataUpdate) onDataUpdate();
        } catch (error) {
          console.error("Error deleting banner:", error);
          message.error(error.message || "Error deleting banner");
        }
      },
    });
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await UpdateBanner(id, { isActive: newStatus });
      message.success(`Banner ${newStatus ? "activated" : "deactivated"} successfully`);
      fetchBanners();
      if (onDataUpdate) onDataUpdate();
    } catch (error) {
      console.error("Error updating banner status:", error);
      message.error("Error updating banner status");
    }
  };

  const columns = [
    {
      title: "Banner Info",
      key: "bannerInfo",
      render: (_, record) => (
        <Space>
          <Avatar
            size={48}
            src={record.image}
            icon={<PictureOutlined />}
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
              width={80}
              height={60}
              src={imageUrl}
              alt="Banner"
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
            <PictureOutlined style={{ fontSize: 24 }} />
          </div>
        )
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive, record) => (
        <Space direction="vertical" size="small">
          <Tag
            color={isActive !== false ? "green" : "red"}
            icon={isActive !== false ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
            style={{ margin: 0 }}
          >
            {isActive !== false ? "Active" : "Inactive"}
          </Tag>
          <Switch
            size="small"
            checked={isActive !== false}
            onChange={() => handleToggleStatus(record._id, isActive !== false)}
            checkedChildren="✓"
            unCheckedChildren="✗"
          />
        </Space>
      ),
      filters: [
        { text: "Active", value: true },
        { text: "Inactive", value: false },
      ],
      onFilter: (value, record) => (record.isActive !== false) === value,
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
          <Tooltip title="View Banner Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                Modal.info({
                  title: `Banner: ${record.name}`,
                  content: (
                    <div>
                      <p><strong>Name:</strong> {record.name}</p>
                      <p><strong>Status:</strong> {record.isActive !== false ? 'Active' : 'Inactive'}</p>
                      <p><strong>Created:</strong> {new Date(record.createdDate).toLocaleString()}</p>
                      {record.image && (
                        <div>
                          <p><strong>Image:</strong></p>
                          <Image
                            width={300}
                            src={record.image}
                            alt={record.name}
                            style={{ borderRadius: 8 }}
                          />
                        </div>
                      )}
                    </div>
                  ),
                  width: 600,
                });
              }}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Tooltip title="Edit Banner">
            <Button
              type="text"
              icon={<PlusOutlined />}
              onClick={() => showModal("edit", record)}
              style={{ color: '#52c41a' }}
            />
          </Tooltip>
          <Tooltip title="Delete Banner">
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

  const activeCount = banners.filter(banner => banner.isActive !== false).length;
  const inactiveCount = banners.filter(banner => banner.isActive === false).length;

  return (
    <div>
      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card className="summary-card">
            <Statistic
              title="Total Banners"
              value={banners.length}
              valueStyle={{ color: '#1890ff' }}
              prefix={<PictureOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="summary-card">
            <Statistic
              title="Active Banners"
              value={activeCount}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="summary-card">
            <Statistic
              title="Inactive Banners"
              value={inactiveCount}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<CloseCircleOutlined />}
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
          Add Banner
        </Button>
      </div>

      {/* Table */}
      <Card className="table-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Progress type="circle" percent={75} size="small" />
            <Text style={{ display: 'block', marginTop: 16 }}>Loading banners...</Text>
          </div>
        ) : banners.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <PictureOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
            <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>
              No banners found. Create your first banner!
            </Text>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={banners}
            rowKey="_id"
            pagination={{
              pageSize: 8,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} banners`
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
              <PlusOutlined style={{ color: '#1890ff' }} />
            )}
            <span>{modalType === "add" ? "Add New Banner" : "Edit Banner"}</span>
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
            label="Banner Name"
            rules={[
              { required: true, message: "Please enter the banner name" },
              { min: 2, message: "Banner name must be at least 2 characters" }
            ]}
          >
            <Input 
              placeholder="Enter banner name..."
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
          
          <Form.Item
            name="isActive"
            label="Banner Status"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch 
              checkedChildren="Active" 
              unCheckedChildren="Inactive"
            />
          </Form.Item>
          
          <Form.Item
            label="Banner Image"
            rules={[
              {
                required: modalType === "add",
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
            {modalType === "edit" && currentBanner?.image && !file && (
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">Current image:</Text>
                <Image
                  width={100}
                  src={currentBanner.image}
                  alt="Current Banner"
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
                ? (modalType === "add" ? 'Creating Banner...' : 'Updating Banner...')
                : (modalType === "add" ? 'Create Banner' : 'Update Banner')
              }
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default BannerTable;
