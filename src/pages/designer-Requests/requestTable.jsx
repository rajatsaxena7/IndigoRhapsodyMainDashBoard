import React, { useState, useEffect } from "react";
import { Table, Button, Tag, Modal, Input, message } from "antd";
import axios from "axios";

const BASE_URL = "https://indigo-rhapsody-backend-ten.vercel.app";

const RequestTable = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [adminComments, setAdminComments] = useState("");

  // Fetch update requests
  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/designer/update-requests/latest`
      );
      const updateRequests = response.data.updateRequests.map((request) => ({
        ...request,
        displayName: request.designerId.userId.displayName,
        email: request.designerId.userId.email,
        phoneNumber: request.designerId.userId.phoneNumber,
      }));
      setData(updateRequests);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching requests:", error);
      message.error("Failed to fetch requests");
    }
  };

  // Approve or reject a request
  const reviewRequest = async (requestId, status) => {
    try {
      await axios.put(`${BASE_URL}/designer/review/${requestId}`, {
        status,
        adminComments,
      });
      message.success(`Request ${status.toLowerCase()} successfully!`);
      fetchRequests(); // Refresh the table after action
      setIsModalVisible(false); // Close the modal after action
    } catch (error) {
      console.error("Error reviewing request:", error);
      message.error("Failed to review request");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const columns = [
    {
      title: "Designer Name",
      dataIndex: "displayName",
      key: "displayName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "Pending"
              ? "blue"
              : status === "Approved"
              ? "green"
              : "red"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        record.status === "Pending" && (
          <Button
            type="primary"
            onClick={() => {
              setSelectedRequest(record);
              console.log("Selected Request:", record); // Log the selected request
              setIsModalVisible(true); // Open the modal
            }}
          >
            Review
          </Button>
        ),
    },
  ];

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRequest(null); // Reset the selected request when closing the modal
  };

  return (
    <div>
      <h1>Update Requests</h1>
      <Table
        dataSource={data}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />
      {/* Modal for approving/rejecting requests */}
      {selectedRequest && (
        <Modal
          title="Review Update Request"
          visible={isModalVisible} // Ensure modal visibility is controlled by state
          onCancel={handleModalClose} // Close modal and reset selectedRequest
          footer={[
            <Button
              key="reject"
              type="danger"
              onClick={() => reviewRequest(selectedRequest._id, "Rejected")}
            >
              Reject
            </Button>,
            <Button
              key="approve"
              type="primary"
              onClick={() => reviewRequest(selectedRequest._id, "Approved")}
            >
              Approve
            </Button>,
          ]}
        >
          <h3>
            Designer Name: {selectedRequest?.designerId?.userId?.displayName}
          </h3>
          <h4>Email: {selectedRequest?.designerId?.userId?.email}</h4>
          <h4>Phone: {selectedRequest?.designerId?.userId?.phoneNumber}</h4>

          <h4>Requested Updates:</h4>
          <div>
            {selectedRequest?.requestedUpdates ? (
              Object.entries(selectedRequest.requestedUpdates).map(
                ([key, value]) => (
                  <div key={key} style={{ marginBottom: "10px" }}>
                    <strong>{key}:</strong>{" "}
                    {key === "logoUrl" || key === "backGroundImage" ? (
                      <div>
                        <img
                          src={value}
                          alt={key}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            marginTop: "5px",
                            borderRadius: "5px",
                          }}
                        />
                      </div>
                    ) : (
                      <span>{value}</span>
                    )}
                  </div>
                )
              )
            ) : (
              <p>No updates available</p>
            )}
          </div>

          <Input.TextArea
            rows={3}
            placeholder="Add admin comments (optional)"
            value={adminComments}
            onChange={(e) => setAdminComments(e.target.value)}
          />
        </Modal>
      )}
    </div>
  );
};

export default RequestTable;
