import React, { useState, useEffect } from "react";
import { Table, Button, message, Tag } from "antd";
import { getQueries, updateBlog } from "../../service/queriesService"; // Adjust the import path as needed

const ManageQueriesTable = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const data = await getQueries();
      setQueries(data);
    } catch (error) {
      message.error("Failed to fetch queries: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (id) => {
    try {
      await updateBlog(id, { status: "completed" });
      message.success("Query marked as completed");
      fetchQueries(); // Refresh the list
    } catch (error) {
      message.error("Failed to update query: " + error.message);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "designer_name",
      key: "designer_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Message",
      dataIndex: "Message",
      key: "Message",
      render: (text) => <div style={{ whiteSpace: "pre-line" }}>{text}</div>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "completed" ? "green" : "orange"}>
          {status === "completed" ? "Completed" : "Pending"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          disabled={record.status === "completed"}
          onClick={() => handleMarkCompleted(record._id)}
        >
          Mark Completed
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={queries}
      rowKey="_id"
      loading={loading}
      pagination={{ pageSize: 10 }}
      scroll={{ x: true }}
    />
  );
};

export default ManageQueriesTable;
