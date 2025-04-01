import React, { useEffect, useState } from "react";
import { Table, Button, Modal, message, Tag, Input } from "antd";
import {
  GetVideoRequests,
  ApproveVideo,
  GetAllVideos,
  ApproveVideoContent,
} from "../../service/videoApi";
import { VideoContentWrap } from "./videoContent.Styles";

const { Search } = Input;

const VideoContent = () => {
  const [videoRequests, setVideoRequests] = useState([]);
  const [approvedVideos, setApprovedVideos] = useState([]);
  const [filteredVideoRequests, setFilteredVideoRequests] = useState([]);
  const [filteredApprovedVideos, setFilteredApprovedVideos] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingApproved, setLoadingApproved] = useState(true);
  const [errorRequests, setErrorRequests] = useState(null);
  const [errorApproved, setErrorApproved] = useState(null);
  const [searchValue, setSearchValue] = useState(""); // New search value state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

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

  // Filter videos based on the search query
  const handleSearch = (value) => {
    setSearchValue(value);
    const lowerCaseValue = value.toLowerCase();

    // Filter video requests
    const filteredRequests = videoRequests.filter((video) =>
      video.userId?.displayName?.toLowerCase().includes(lowerCaseValue)
    );
    setFilteredVideoRequests(filteredRequests);

    // Filter approved videos
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

  // Unified toggle handler in your component
  const handleToggleApproval = async (
    videoId,
    currentStatus,
    isApprovedVideo = false
  ) => {
    try {
      const newStatus = !currentStatus;

      // Call the API
      await ApproveVideoContent(videoId, newStatus);

      // Update state based on whether it's an approved video or pending request
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

        // Optional: Move between lists if needed
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
  const requestColumns = [
    {
      title: "Video URL",
      dataIndex: "demo_url",
      key: "demo_url",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: "Instagram",
      dataIndex: "instagram_User",
      key: "instagram_User",
      render: (text) => text.instagram_User || "N/A",
    },
    {
      title: "User",
      dataIndex: ["userId", "displayName"],
      key: "user",
      render: (_, record) => record.userId?.displayName || "Unknown",
    },
    {
      title: "Submission Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "is_approved",
      key: "is_approved",
      render: (status) => (
        <Tag color={status ? "green" : "orange"}>
          {status ? "Approved" : "Pending"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleView(record.demo_url)}>
            View
          </Button>

          <Button
            type="link"
            onClick={() => handleToggleApproval(record._id, record.is_approved)}
            danger={record.is_approved}
          >
            {record.is_approved ? "Unapprove" : "Approve"}
          </Button>
        </>
      ),
    },
  ];

  const approvedColumns = [
    {
      title: "Video URL",
      dataIndex: "videoUrl",
      key: "videoUrl",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: "User",
      dataIndex: ["userId", "displayName"],
      key: "user",
      render: (_, record) => record.userId?.displayName || "Unknown",
    },
    {
      title: "Likes",
      dataIndex: "no_of_likes",
      key: "no_of_likes",
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleViewDetails(record)}>
            View Details
          </Button>
          <Button
            type="link"
            onClick={() =>
              handleToggleApproval(record._id, record.is_approved, true)
            }
            danger={record.is_approved}
          >
            {record.is_approved ? "Unapprove" : "Re-approve"}
          </Button>
        </>
      ),
    },
  ];

  return (
    <VideoContentWrap>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Video Applications</h3>
        <Search
          placeholder="Search by user name"
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)} // Filter dynamically as user types
          onSearch={handleSearch}
          enterButton
          style={{ width: 300 }}
        />
      </div>
      <h4>Pending Requests</h4>
      {loadingRequests ? (
        <p>Loading pending videos...</p>
      ) : errorRequests ? (
        <p style={{ color: "red" }}> {errorRequests}</p>
      ) : (
        <Table
          dataSource={filteredVideoRequests}
          columns={requestColumns}
          pagination={{ pageSize: 10 }}
          rowKey="_id"
        />
      )}

      <h4>Approved Videos</h4>
      {loadingApproved ? (
        <p>Loading approved videos...</p>
      ) : errorApproved ? (
        <p style={{ color: "red" }}>Error: {errorApproved}</p>
      ) : (
        <Table
          dataSource={filteredApprovedVideos}
          columns={approvedColumns}
          pagination={{ pageSize: 10 }}
          rowKey="_id"
        />
      )}

      {/* Video Modal */}
      <Modal
        title="Video Player"
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
      >
        {currentVideoUrl ? (
          currentVideoUrl.includes("youtube") ? (
            <iframe
              width="100%"
              height="315"
              src={currentVideoUrl.replace("watch?v=", "embed/")}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <video width="100%" controls>
              <source src={currentVideoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )
        ) : (
          <p>No video available</p>
        )}
      </Modal>

      {/* Video Details Modal */}
      <Modal
        title="Video Details"
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
      >
        {selectedVideo && (
          <div>
            <p>
              <strong>Likes:</strong> {selectedVideo.no_of_likes}
            </p>
            <p>
              <strong>Total Comments:</strong> {selectedVideo.comments.length}
            </p>
            <p>
              <strong>Comments:</strong>
            </p>
            <ul>
              {selectedVideo.comments.map((comment) => (
                <li key={comment._id}>
                  <strong>{comment.userId.displayName}:</strong>{" "}
                  {comment.commentText}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </VideoContentWrap>
  );
};

export default VideoContent;
