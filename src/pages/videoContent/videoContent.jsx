import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  message,
  Tag,
  Input,
  Upload,
  Card,
  Row,
  Col,
  Statistic,
  Space,
  Divider,
  Typography,
  Avatar,
  Badge,
  Tooltip,
  Progress
} from "antd";
import {
  GetVideoRequests,
  ApproveVideo,
  GetAllVideos,
  ApproveVideoContent,
} from "../../service/videoApi";
import { VideoContentWrap } from "./videoContent.Styles";
import { Form } from "antd";
import { uploadImageToFirebase } from "../../service/FirebaseService";
import {
  InboxOutlined,
  PlayCircleOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  LikeOutlined,
  CommentOutlined,
  PlusOutlined,
  SearchOutlined,
  VideoCameraOutlined,
  CheckOutlined,
  CloseOutlined
} from "@ant-design/icons";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { apiCall } from "../../service/apiUtils";

const { Search } = Input;
const { Title, Text } = Typography;
const storage = getStorage();

const VideoContent = () => {
  const [videoRequests, setVideoRequests] = useState([]);
  const [approvedVideos, setApprovedVideos] = useState([]);
  const [filteredVideoRequests, setFilteredVideoRequests] = useState([]);
  const [filteredApprovedVideos, setFilteredApprovedVideos] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingApproved, setLoadingApproved] = useState(true);
  const [errorRequests, setErrorRequests] = useState(null);
  const [errorApproved, setErrorApproved] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const requestData = await GetVideoRequests();
        setVideoRequests(requestData.videoRequests || []);
        setFilteredVideoRequests(requestData.videoRequests || []);
      } catch (err) {
        setErrorRequests(err.message);
      } finally {
        setLoadingRequests(false);
      }

      try {
        const approvedData = await GetAllVideos();
        setApprovedVideos(approvedData.videos || []);
        setFilteredApprovedVideos(approvedData.videos || []);
      } catch (err) {
        setErrorApproved(err.message);
      } finally {
        setLoadingApproved(false);
      }
    };

    fetchVideos();
  }, []);

  const handleSearch = (value) => {
    setSearchValue(value);
    const lowerCaseValue = value.toLowerCase();

    const filteredRequests = videoRequests.filter((video) =>
      video.userId?.displayName?.toLowerCase().includes(lowerCaseValue)
    );
    setFilteredVideoRequests(filteredRequests);

    const filteredApproved = approvedVideos.filter((video) =>
      video.userId?.displayName?.toLowerCase().includes(lowerCaseValue)
    );
    setFilteredApprovedVideos(filteredApproved);
  };

  const handleView = (videoUrl) => {
    setCurrentVideoUrl(videoUrl);
    setIsModalVisible(true);
  };

  const handleViewDetails = (video) => {
    setSelectedVideo(video);
    setViewModalVisible(true);
  };

  const handleApprove = async (videoId, isApproved) => {
    try {
      await ApproveVideo(videoId, isApproved);
      message.success("Video approved successfully");
      setVideoRequests((prev) =>
        prev.map((video) =>
          video._id === videoId ? { ...video, is_approved: isApproved } : video
        )
      );
      setFilteredVideoRequests((prev) =>
        prev.map((video) =>
          video._id === videoId ? { ...video, is_approved: isApproved } : video
        )
      );
    } catch (error) {
      message.error(`Failed to approve video: ${error.message}`);
    }
  };

  const handleApproveContent = async (videoId) => {
    try {
      await ApproveVideoContent(videoId);
      message.success("Video re-approved successfully");
      setApprovedVideos((prev) =>
        prev.map((video) =>
          video._id === videoId ? { ...video, is_approved: true } : video
        )
      );
    } catch (error) {
      message.error(`Failed to re-approve video: ${error.message}`);
    }
  };

  const handleToggleApproval = async (
    videoId,
    currentStatus,
    isApprovedVideo = false
  ) => {
    try {
      const newStatus = !currentStatus;
      await ApproveVideoContent(videoId, newStatus);

      if (isApprovedVideo) {
        setApprovedVideos((prev) =>
          prev.map((video) =>
            video._id === videoId ? { ...video, is_approved: newStatus } : video
          )
        );
      } else {
        setVideoRequests((prev) =>
          prev.map((video) =>
            video._id === videoId ? { ...video, is_approved: newStatus } : video
          )
        );
        setFilteredVideoRequests((prev) =>
          prev.map((video) =>
            video._id === videoId ? { ...video, is_approved: newStatus } : video
          )
        );

        if (newStatus) {
          const videoToPromote = videoRequests.find((v) => v._id === videoId);
          if (videoToPromote) {
            setApprovedVideos((prev) => [
              ...prev,
              { ...videoToPromote, is_approved: true },
            ]);
            setVideoRequests((prev) => prev.filter((v) => v._id !== videoId));
            setFilteredVideoRequests((prev) =>
              prev.filter((v) => v._id !== videoId)
            );
          }
        }
      }

      message.success(
        `Video ${newStatus ? "approved" : "unapproved"} successfully`
      );
    } catch (error) {
      message.error(`Failed to toggle approval: ${error.message}`);
    }
  };

  const handleAddVideo = async (values) => {
    try {
      const file = values.videoFile?.[0]?.originFileObj;
      const videoTitle = values.title?.trim();

      if (!file) {
        return message.error("Please select a video file.");
      }

      if (!videoTitle) {
        return message.error("Please provide a title for the video.");
      }

      const fileRef = ref(storage, `videos/${Date.now()}_${file.name}`);
      const task = uploadBytesResumable(fileRef, file);

      await new Promise((resolve, reject) => {
        task.on("state_changed", null, reject, () => resolve());
      });

      const videoUrl = await getDownloadURL(fileRef);

      const res = await apiCall("/content-video/createAdminVideo", {
        method: "POST",
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          videoUrl,
          title: videoTitle,
          is_approved: true,
        }),
      });

      message.success("Video uploaded & approved!");
      setAddModalVisible(false);
      form.resetFields();

      // Refresh the video lists
      const approvedData = await GetAllVideos();
      setApprovedVideos(approvedData.videos || []);
      setFilteredApprovedVideos(approvedData.videos || []);
    } catch (err) {
      console.error(err);
      message.error(`Upload failed: ${err.message}`);
    }
  };

  // Statistics calculations
  const totalRequests = videoRequests.length;
  const pendingRequests = videoRequests.filter(v => !v.is_approved).length;
  const approvedRequests = videoRequests.filter(v => v.is_approved).length;
  const totalApprovedVideos = approvedVideos.length;
  const totalLikes = approvedVideos.reduce((sum, video) => sum + (video.no_of_likes || 0), 0);

  const requestColumns = [
    {
      title: "Creator",
      key: "creator",
      render: (_, record) => (
        <Space>
          <Avatar
            icon={<UserOutlined />}
            size="small"
            style={{ backgroundColor: '#1890ff' }}
          />
          <div>
            <div style={{ fontWeight: 500, fontSize: '14px' }}>
              {record.userId?.displayName || "Unknown"}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.instagram_User || "No Instagram"}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Video",
      key: "video",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text strong style={{ fontSize: '13px' }}>
            {record.demo_url ? "Demo Video" : "No Video"}
          </Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {new Date(record.created_at).toLocaleDateString()}
          </Text>
        </Space>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Badge
          status={record.is_approved ? "success" : "processing"}
          text={
            <Tag
              color={record.is_approved ? "green" : "orange"}
              icon={record.is_approved ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
            >
              {record.is_approved ? "Approved" : "Pending Review"}
            </Tag>
          }
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Video">
            <Button
              type="text"
              icon={<PlayCircleOutlined />}
              onClick={() => handleView(record.demo_url)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Tooltip title={record.is_approved ? "Unapprove" : "Approve"}>
            <Button
              type="text"
              icon={record.is_approved ? <CloseOutlined /> : <CheckOutlined />}
              onClick={() => handleToggleApproval(record._id, record.is_approved)}
              style={{
                color: record.is_approved ? '#ff4d4f' : '#52c41a'
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const approvedColumns = [
    {
      title: "Video Info",
      key: "videoInfo",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div style={{ fontWeight: 500, fontSize: '14px' }}>
            {record.title || "Untitled"}
          </div>
          <Space size="small">
            <Avatar
              icon={<UserOutlined />}
              size="small"
              style={{ backgroundColor: '#52c41a' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.userId?.displayName || "Unknown"}
            </Text>
          </Space>
        </Space>
      ),
    },
    {
      title: "Engagement",
      key: "engagement",
      render: (_, record) => (
        <Space size="large">
          <Space size="small">
            <LikeOutlined style={{ color: '#ff4d4f' }} />
            <Text>{record.no_of_likes || 0}</Text>
          </Space>
          <Space size="small">
            <CommentOutlined style={{ color: '#1890ff' }} />
            <Text>{record.comments?.length || 0}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: "Published",
      key: "published",
      render: (_, record) => (
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {new Date(record.createdDate).toLocaleDateString()}
        </Text>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Tag
          color={record.is_approved ? "green" : "red"}
          icon={record.is_approved ? <CheckCircleOutlined /> : <CloseOutlined />}
        >
          {record.is_approved ? "Live" : "Suspended"}
        </Tag>
      ),
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
              onClick={() => handleViewDetails(record)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Tooltip title={record.is_approved ? "Suspend" : "Activate"}>
            <Button
              type="text"
              icon={record.is_approved ? <CloseOutlined /> : <CheckOutlined />}
              onClick={() => handleToggleApproval(record._id, record.is_approved, true)}
              style={{
                color: record.is_approved ? '#ff4d4f' : '#52c41a'
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <VideoContentWrap>
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>
            <VideoCameraOutlined style={{ marginRight: 12, color: '#1890ff' }} />
            Video Content Management
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Manage video requests and approved content
          </Text>
        </div>

        <Space size="middle">
          <Search
            placeholder="Search by creator name..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            onSearch={handleSearch}
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            allowClear
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddModalVisible(true)}
            size="large"
          >
            Add Video
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Requests"
              value={totalRequests}
              valueStyle={{ color: '#1890ff' }}
              prefix={<VideoCameraOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Pending Review"
              value={pendingRequests}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Approved Videos"
              value={totalApprovedVideos}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Likes"
              value={totalLikes}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<LikeOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Video Requests Section */}
      <Card
        title={
          <Space>
            <ClockCircleOutlined style={{ color: '#fa8c16' }} />
            <span>Pending Video Requests</span>
            <Badge count={pendingRequests} style={{ backgroundColor: '#fa8c16' }} />
          </Space>
        }
        className="content-card"
        style={{ marginBottom: 24 }}
      >
        {loadingRequests ? (
          <div className="loading-state">
            <Progress type="circle" percent={75} size="small" />
            <Text>Loading pending requests...</Text>
          </div>
        ) : errorRequests ? (
          <div className="error-state">
            <Text type="danger">{errorRequests}</Text>
          </div>
        ) : filteredVideoRequests.length === 0 ? (
          <div className="empty-state">
            <VideoCameraOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
            <Text type="secondary">No pending video requests</Text>
          </div>
        ) : (
          <Table
            dataSource={filteredVideoRequests}
            columns={requestColumns}
            pagination={{
              pageSize: 8,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} requests`
            }}
            rowKey="_id"
            className="modern-table"
          />
        )}
      </Card>

      {/* Approved Videos Section */}
      <Card
        title={
          <Space>
            <CheckCircleOutlined style={{ color: '#52c41a' }} />
            <span>Approved Videos</span>
            <Badge count={totalApprovedVideos} style={{ backgroundColor: '#52c41a' }} />
          </Space>
        }
        className="content-card"
      >
        {loadingApproved ? (
          <div className="loading-state">
            <Progress type="circle" percent={75} size="small" />
            <Text>Loading approved videos...</Text>
          </div>
        ) : errorApproved ? (
          <div className="error-state">
            <Text type="danger">Error: {errorApproved}</Text>
          </div>
        ) : filteredApprovedVideos.length === 0 ? (
          <div className="empty-state">
            <CheckCircleOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
            <Text type="secondary">No approved videos yet</Text>
          </div>
        ) : (
          <Table
            dataSource={filteredApprovedVideos}
            columns={approvedColumns}
            pagination={{
              pageSize: 8,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} videos`
            }}
            rowKey="_id"
            className="modern-table"
          />
        )}
      </Card>

      {/* Add Video Modal */}
      <Modal
        title={
          <Space>
            <PlusOutlined style={{ color: '#1890ff' }} />
            <span>Upload New Video</span>
          </Space>
        }
        open={addModalVisible}
        onCancel={() => {
          setAddModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
        width={600}
        className="modern-modal"
      >
        <Form form={form} layout="vertical" onFinish={handleAddVideo}>
          <Form.Item
            label="Video Title"
            name="title"
            rules={[
              {
                required: true,
                message: "Please provide a title for the video",
              },
            ]}
          >
            <Input placeholder="Enter video title..." />
          </Form.Item>
          <Form.Item
            label="Video File"
            name="videoFile"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
            rules={[{ required: true, message: "Please upload a video file" }]}
          >
            <Upload.Dragger
              accept="video/*"
              beforeUpload={() => false}
              maxCount={1}
              className="video-upload"
            >
              <p className="ant-upload-drag-icon">
                <VideoCameraOutlined style={{ fontSize: 48, color: '#1890ff' }} />
              </p>
              <p className="ant-upload-text">
                Click or drag video file to this area
              </p>
              <p className="ant-upload-hint">
                Support for MP4, AVI, MOV formats
              </p>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              <CheckOutlined /> Upload & Approve
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Video Player Modal */}
      <Modal
        title={
          <Space>
            <PlayCircleOutlined style={{ color: '#1890ff' }} />
            <span>Video Player</span>
          </Space>
        }
        open={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        className="modern-modal"
      >
        {currentVideoUrl ? (
          <div className="video-player-container">
            {currentVideoUrl.includes("youtube") ? (
              <iframe
                width="100%"
                height="400"
                src={currentVideoUrl.replace("watch?v=", "embed/")}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <video width="100%" controls style={{ borderRadius: 8 }}>
                <source src={currentVideoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <VideoCameraOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
            <Text type="secondary">No video available</Text>
          </div>
        )}
      </Modal>

      {/* Video Details Modal */}
      <Modal
        title={
          <Space>
            <EyeOutlined style={{ color: '#1890ff' }} />
            <span>Video Details</span>
          </Space>
        }
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={600}
        className="modern-modal"
      >
        {selectedVideo && (
          <div className="video-details">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card size="small" className="detail-card">
                  <Statistic
                    title="Title"
                    value={selectedVideo.title || "Untitled"}
                    valueStyle={{ fontSize: '16px', fontWeight: 500 }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" className="detail-card">
                  <Statistic
                    title="Likes"
                    value={selectedVideo.no_of_likes || 0}
                    prefix={<LikeOutlined style={{ color: '#ff4d4f' }} />}
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" className="detail-card">
                  <Statistic
                    title="Comments"
                    value={selectedVideo.comments?.length || 0}
                    prefix={<CommentOutlined style={{ color: '#1890ff' }} />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
            </Row>

            {selectedVideo.comments?.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Divider orientation="left">Recent Comments</Divider>
                <div className="comments-section">
                  {selectedVideo.comments.slice(0, 5).map((comment) => (
                    <Card key={comment._id} size="small" style={{ marginBottom: 8 }}>
                      <Space>
                        <Avatar icon={<UserOutlined />} size="small" />
                        <div>
                          <Text strong>{comment.userId?.displayName || "Unknown"}</Text>
                          <br />
                          <Text type="secondary">{comment.commentText}</Text>
                        </div>
                      </Space>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </VideoContentWrap>
  );
};

export default VideoContent;
