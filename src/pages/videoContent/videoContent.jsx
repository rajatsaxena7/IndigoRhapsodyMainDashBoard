import React, { useEffect, useState } from "react";
import { Table, Button, Modal, message, Tag, Input } from "antd";
import {
  GetVideoRequests,
  ApproveVideo,
  GetAllVideos,
  ApproveVideoContent,
} from "../../service/videoApi"; // API service imports
import { VideoContentWrap } from "./videoContent.Styles";

const { Search } = Input;

// Reusable VideoTable Component - Display video list with actions
const VideoTable = ({ data, columns, pagination }) => (
  <Table
    columns={columns}
    dataSource={data}
    rowKey="_id"
    pagination={pagination}
  />
);

// Reusable VideoModal Component - Display video in a modal
const VideoModal = ({ isVisible, videoUrl, onClose }) => (
  <Modal
    title="Video Player"
    visible={isVisible}
    footer={null}
    onCancel={onClose}
  >
    {videoUrl ? (
      videoUrl.includes("youtube") ? (
        <iframe
          width="100%"
          height="315"
          src={videoUrl.replace("watch?v=", "embed/")}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <video width="100%" controls>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )
    ) : (
      <p>No video available</p>
    )}
  </Modal>
);

// Main VideoContent Component
const VideoContent = () => {
  const [videoRequests, setVideoRequests] = useState([]);
  const [approvedVideos, setApprovedVideos] = useState([]);
  const [filteredVideoRequests, setFilteredVideoRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingApproved, setLoadingApproved] = useState(true);
  const [errorRequests, setErrorRequests] = useState(null);
  const [errorApproved, setErrorApproved] = useState(null);
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
      } catch (err) {
        setErrorApproved(err.message);
      } finally {
        setLoadingApproved(false);
      }
    };

    fetchVideos();
  }, []);

  const handleView = (videoUrl) => {
    setCurrentVideoUrl(videoUrl);
    setIsModalVisible(true);
  };

  const handleViewDetails = (video) => {
    setSelectedVideo(video);
    setViewModalVisible(true);
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

  const handleSearch = (value) => {
    const searchQuery = value.toLowerCase();
    const filtered = videoRequests.filter((video) =>
      video.userId.displayName.toLowerCase().includes(searchQuery)
    );
    setFilteredVideoRequests(filtered);
  };

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
      title: "Shares",
      dataIndex: "no_of_Shares",
      key: "no_of_Shares",
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
            onClick={() => handleApproveContent(record._id)}
            disabled={record.is_approved}
          >
            Approve
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
        <VideoTable
          data={filteredVideoRequests}
          columns={requestColumns}
          pagination={{ pageSize: 10 }}
        />
      )}

      {loadingApproved ? (
        <p>Loading approved videos...</p>
      ) : errorApproved ? (
        <p style={{ color: "red" }}>Error: {errorApproved}</p>
      ) : (
        <VideoTable
          data={approvedVideos}
          columns={approvedColumns}
          pagination={{ pageSize: 10 }}
        />
      )}

      <VideoModal
        isVisible={isModalVisible}
        videoUrl={currentVideoUrl}
        onClose={() => setIsModalVisible(false)}
      />

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
