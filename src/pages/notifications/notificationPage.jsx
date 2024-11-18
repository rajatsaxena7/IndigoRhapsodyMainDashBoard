import React, { useState, useEffect } from "react";
import { Table, Button, Tag, Space, Modal, Form, Input, message } from "antd";
import axios from "axios";

const NotificationPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch notifications from the API
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        "https://indigo-rhapsody-backend-ten.vercel.app/notification/broadcast/all"
      ); // Update with your API path
      setDataSource(response.data.data);
    } catch (error) {
      message.error("Failed to fetch notifications.");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Show the modal for creating a new notification
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Handle modal submission
  const handleOk = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://indigo-rhapsody-backend-ten.vercel.app/notification/send-notification-to-all",
        {
          title: values.title,
          body: values.body,
          image: values.image || null,
        }
      );
      message.success("Notification sent successfully!");
      setIsModalVisible(false);
      fetchNotifications(); // Refresh the notifications list
    } catch (error) {
      message.error("Failed to send notification.");
    } finally {
      setLoading(false);
    }
  };

  // Handle modal cancellation
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Table columns
  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "volcano"}>{status}</Tag>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
    },
    {
      title: "Trigger",
      dataIndex: "trigger",
      key: "trigger",
    },
    {
      title: "Date Created",
      dataIndex: "dateCreated",
      key: "dateCreated",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary">Update</Button>
          <Button type="danger">Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", backgroundColor: "#fff" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2>Notifications</h2>
        <Button type="primary" onClick={showModal}>
          + Create Notification
        </Button>
      </div>
      <Table dataSource={dataSource} columns={columns} pagination={false} />

      {/* Modal for creating a notification */}
      <Modal
        title="Send Notification"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleOk}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter the title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Body"
            name="body"
            rules={[{ required: true, message: "Please enter the body" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Image URL" name="image">
            <Input placeholder="Optional image URL" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Send Notification
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NotificationPage;
