import React, { useState, useEffect } from "react";
import { Table, Button, Tag, Modal, Input, message } from "antd";
import { apiCall } from "../../service/apiUtils";

const RequestTable = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [adminComments, setAdminComments] = useState("");

  /* ------------------------------------------------------------------ *
   * Helpers                                                             *
   * ------------------------------------------------------------------ */

  /** Turn one raw update‑request into the flattened row the table needs */
  const normaliseRow = (req) => {
    const designer = req.designerId; // might be null
    const user = designer?.userId;
    const fallback = req.requestedUpdates; // always present

    return {
      ...req,
      displayName: user?.displayName ?? fallback?.displayName ?? "Unknown",
      email: user?.email ?? fallback?.email ?? "N/A",
      phoneNumber: user?.phoneNumber ?? fallback?.phoneNumber ?? "N/A",
      // Handle different possible date field names
      createdAt: req.requestTime || req.createdAt || req.createdDate || req.date || req.timestamp,
    };
  };

  /* ------------------------------------------------------------------ *
   * API calls                                                           *
   * ------------------------------------------------------------------ */

  const fetchRequests = async () => {
    setLoading(true);
    try {
      console.log("🔍 Fetching designer update requests...");
      const data = await apiCall("/designer/update-requests/latest", {
        method: "GET",
      });

      console.log("📊 Designer requests data received:", data);
      
      // Array safety - handle different response structures
      let raw = [];
      if (Array.isArray(data)) {
        raw = data;
      } else if (data && Array.isArray(data.updateRequests)) {
        raw = data.updateRequests;
      } else if (data && Array.isArray(data.data)) {
        raw = data.data;
      }

      console.log("📋 Processed requests:", raw);
      setData(raw.map(normaliseRow));
    } catch (err) {
      console.error("❌ Error fetching requests:", err);
      message.error("Failed to fetch requests: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const reviewRequest = async (requestId, status) => {
    try {
      console.log("🔍 Reviewing designer request:", { requestId, status, adminComments });
      const result = await apiCall(`/designer/review/${requestId}`, {
        method: "PUT",
        body: JSON.stringify({
          status,
          adminComments,
        }),
      });
      
      console.log("✅ Request review result:", result);
      message.success(`Request ${status.toLowerCase()} successfully!`);
      fetchRequests(); // refresh list
      setIsModalVisible(false);
      setAdminComments("");
      setSelectedRequest(null);
    } catch (err) {
      console.error("❌ Error reviewing request:", err);
      message.error("Failed to review request: " + (err.message || "Unknown error"));
    }
  };

  /* ------------------------------------------------------------------ *
   * Lifecycle                                                           *
   * ------------------------------------------------------------------ */

  useEffect(() => {
    fetchRequests();
  }, []);

  /* ------------------------------------------------------------------ *
   * Table definition                                                    *
   * ------------------------------------------------------------------ */

  const columns = [
    { 
      title: "Designer Name", 
      dataIndex: "displayName", 
      key: "displayName",
      sorter: (a, b) => a.displayName.localeCompare(b.displayName),
    },
    { 
      title: "Email", 
      dataIndex: "email", 
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
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
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "Approved", value: "Approved" },
        { text: "Rejected", value: "Rejected" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Request Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => {
        if (!date) return "N/A";
        const requestDate = new Date(date);
        return (
          <div>
            <div style={{ fontWeight: 500 }}>
              {requestDate.toLocaleDateString()}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {requestDate.toLocaleTimeString()}
            </div>
          </div>
        );
      },
      sorter: (a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateA - dateB;
      },
      defaultSortOrder: 'descend',
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
              setIsModalVisible(true);
            }}
          >
            Review
          </Button>
        ),
    },
  ];

  /* ------------------------------------------------------------------ *
   * Render                                                              *
   * ------------------------------------------------------------------ */

  return (
    <div>
      <h1>Update Requests</h1>

      <Table
        dataSource={data}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} requests`,
          pageSizeOptions: ['5', '10', '20', '50', '100'],
          size: 'default',
          position: ['bottomRight'],
          showLessItems: false,
          hideOnSinglePage: false,
          responsive: true,
          simple: false
        }}
        defaultSortOrder="descend"
      />

      {/* ---------- Review Modal ---------- */}
      {selectedRequest && (
        <Modal
          open={isModalVisible} // 'open' is the canonical prop in AntD v5+
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedRequest(null);
            setAdminComments("");
          }}
          title="Review Update Request"
          footer={[
            <Button
              key="reject"
              danger
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
            Designer&nbsp;Name:&nbsp;
            {selectedRequest.designerId
              ? selectedRequest.designerId.userId.displayName
              : selectedRequest.requestedUpdates.displayName}
          </h3>

          <h4>
            Email:&nbsp;
            {selectedRequest.designerId
              ? selectedRequest.designerId.userId.email
              : selectedRequest.requestedUpdates.email}
          </h4>

          <h4>
            Phone:&nbsp;
            {selectedRequest.designerId
              ? selectedRequest.designerId.userId.phoneNumber
              : selectedRequest.requestedUpdates.phoneNumber}
          </h4>

          <h4 style={{ marginTop: 16 }}>Requested Updates:</h4>
          <div style={{ maxHeight: 250, overflowY: "auto" }}>
            {selectedRequest.requestedUpdates
              ? Object.entries(selectedRequest.requestedUpdates).map(
                  ([key, value]) => (
                    <div key={key} style={{ marginBottom: 12 }}>
                      <strong>{key}:</strong>{" "}
                      {key === "logoUrl" || key === "backGroundImage" ? (
                        <img
                          src={value}
                          alt={key}
                          style={{
                            width: 120,
                            height: 120,
                            objectFit: "cover",
                            borderRadius: 6,
                            marginTop: 4,
                          }}
                        />
                      ) : Array.isArray(value) ? (
                        <pre style={{ whiteSpace: "pre-wrap" }}>
                          {JSON.stringify(value, null, 2)}
                        </pre>
                      ) : (
                        <span>{String(value)}</span>
                      )}
                    </div>
                  )
                )
              : "No updates available"}
          </div>

          <Input.TextArea
            rows={3}
            placeholder="Add admin comments (optional)"
            value={adminComments}
            onChange={(e) => setAdminComments(e.target.value)}
            style={{ marginTop: 16 }}
          />
        </Modal>
      )}
    </div>
  );
};

export default RequestTable;
