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
  Select,
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
      console.log("🔍 Fetching banners...");
      const data = await GetBanners();
      console.log("📊 Banner data received:", data);
      // Handle different response structures
      let banners = [];
      if (Array.isArray(data)) {
        banners = data;
      } else if (data && Array.isArray(data.banners)) {
        banners = data.banners;
      } else if (data && Array.isArray(data.data)) {
        banners = data.data;
      }
      console.log("📋 Processed banners:", banners);
      setBanners(banners);
    } catch (error) {
      console.error("❌ Error fetching banners:", error);
      message.error("Error fetching banners: " + (error.message || "Unknown error"));
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
        title: banner.title,
        subtitle: banner.subtitle,
        description: banner.description,
        platform: banner.platform,
        page: banner.page,
        actionUrl: banner.actionUrl,
        displayOrder: banner.displayOrder,
        buttonText: banner.buttonText,
        buttonColor: banner.buttonColor,
        textColor: banner.textColor,
        tags: banner.tags,
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
      console.log("🚀 Starting banner creation/update...", { modalType, values });

      let mobileUrl = currentBanner?.mobileUrl || "";
      let webDesktopUrl = currentBanner?.webDesktopUrl || "";
      let webTabletUrl = currentBanner?.webTabletUrl || "";

      if (file) {
        console.log("📤 Uploading image to Firebase...");
        // Upload to Firebase and use the same URL for all platforms for now
        const imageUrl = await uploadImageToFirebase(file, "banners");
        console.log("✅ Image uploaded:", imageUrl);
        mobileUrl = imageUrl;
        webDesktopUrl = imageUrl;
        webTabletUrl = imageUrl;
      } else if (modalType === "add" && !mobileUrl && !currentBanner?.mobileUrl) {
        throw new Error("Please upload an image.");
      }

      const bannerData = {
        name: values.name,
        title: values.title || values.name,
        subtitle: values.subtitle || "",
        description: values.description || "",
        platform: values.platform || "mobile",
        page: values.page || "home",
        actionType: values.actionType || "url",
        actionUrl: values.actionUrl || "/",
        displayOrder: values.displayOrder || 1,
        isActive: values.isActive,
        startDate: values.startDate || new Date().toISOString(),
        endDate: values.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        buttonText: values.buttonText || "Learn More",
        buttonColor: values.buttonColor || "#1890ff",
        textColor: values.textColor || "#FFFFFF",
        tags: values.tags || ["featured"],
        webDesktopUrl,
        webTabletUrl,
        mobileUrl,
      };

      console.log("📋 Banner data to send:", bannerData);

      if (modalType === "add") {
        console.log("➕ Creating new banner...");
        const result = await CreateBanner(bannerData);
        console.log("✅ Banner created successfully:", result);
        message.success("Banner added successfully");
      } else {
        console.log("✏️ Updating banner...");
        const result = await UpdateBanner(currentBanner._id, bannerData);
        console.log("✅ Banner updated successfully:", result);
        message.success("Banner updated successfully");
      }

      fetchBanners();
      if (onDataUpdate) onDataUpdate();
      handleCancel();
    } catch (error) {
      console.error("❌ Error saving banner:", error);
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
            src={record.mobileUrl || record.webDesktopUrl || record.image}
            icon={<PictureOutlined />}
            style={{ backgroundColor: '#1890ff' }}
          />
          <div>
            <div style={{ fontWeight: 500, fontSize: '16px', color: '#1a1a1a' }}>
              {record.name}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.title}
            </div>
            <div style={{ fontSize: '10px', color: '#999' }}>
              ID: {record._id?.substring(0, 8)}...
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Image Preview",
      dataIndex: "mobileUrl",
      key: "mobileUrl",
      render: (imageUrl, record) => {
        const displayUrl = imageUrl || record.webDesktopUrl || record.webTabletUrl || record.image;
        return displayUrl ? (
          <Tooltip title="Click to view full image">
            <Image
              width={80}
              height={60}
              src={displayUrl}
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
        );
      },
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
                      <p><strong>Title:</strong> {record.title}</p>
                      <p><strong>Subtitle:</strong> {record.subtitle}</p>
                      <p><strong>Description:</strong> {record.description}</p>
                      <p><strong>Platform:</strong> {record.platform}</p>
                      <p><strong>Page:</strong> {record.page}</p>
                      <p><strong>Action URL:</strong> {record.actionUrl}</p>
                      <p><strong>Button Text:</strong> {record.buttonText}</p>
                      <p><strong>Display Order:</strong> {record.displayOrder}</p>
                      <p><strong>Status:</strong> {record.isActive !== false ? 'Active' : 'Inactive'}</p>
                      <p><strong>Tags:</strong> {record.tags?.join(', ')}</p>
                      <p><strong>Created:</strong> {new Date(record.createdDate).toLocaleString()}</p>
                      {(record.mobileUrl || record.webDesktopUrl || record.image) && (
                        <div>
                          <p><strong>Image:</strong></p>
                          <Image
                            width={300}
                            src={record.mobileUrl || record.webDesktopUrl || record.image}
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
        width={800}
        className="modern-modal"
      >
        <Form form={form} layout="vertical" onFinish={handleAddEdit}>
          <Row gutter={16}>
            <Col span={12}>
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
            </Col>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Banner Title"
                rules={[
                  { required: true, message: "Please enter the banner title" }
                ]}
              >
                <Input 
                  placeholder="Enter banner title..."
                  size="large"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="subtitle"
                label="Subtitle"
              >
                <Input 
                  placeholder="Enter subtitle..."
                  size="large"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="buttonText"
                label="Button Text"
                initialValue="Shop Now"
              >
                <Input 
                  placeholder="Enter button text..."
                  size="large"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea 
              placeholder="Enter banner description..."
              rows={3}
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="platform"
                label="Platform"
                initialValue="mobile"
              >
                <Select size="large" style={{ borderRadius: 8 }}>
                  <Select.Option value="mobile">Mobile</Select.Option>
                  <Select.Option value="web">Web</Select.Option>
                  <Select.Option value="all">All Platforms</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="page"
                label="Page"
                initialValue="home"
              >
                <Select size="large" style={{ borderRadius: 8 }}>
                  <Select.Option value="home">Home</Select.Option>
                  <Select.Option value="products">Products</Select.Option>
                  <Select.Option value="category">Category</Select.Option>
                  <Select.Option value="all">All Pages</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="displayOrder"
                label="Display Order"
                initialValue={1}
              >
                <Input 
                  type="number"
                  placeholder="1"
                  size="large"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="actionUrl"
                label="Action URL"
                initialValue="/"
              >
                <Input 
                  placeholder="/products?category=summer"
                  size="large"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tags"
                label="Tags"
                initialValue={["featured"]}
              >
                <Select
                  mode="tags"
                  placeholder="Enter tags..."
                  size="large"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="buttonColor"
                label="Button Color"
                initialValue="#1890ff"
              >
                <Input 
                  type="color"
                  size="large"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="textColor"
                label="Text Color"
                initialValue="#FFFFFF"
              >
                <Input 
                  type="color"
                  size="large"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
            </Col>
          </Row>
          
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
            {modalType === "edit" && (currentBanner?.mobileUrl || currentBanner?.webDesktopUrl || currentBanner?.image) && !file && (
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">Current image:</Text>
                <Image
                  width={100}
                  src={currentBanner.mobileUrl || currentBanner.webDesktopUrl || currentBanner.image}
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
