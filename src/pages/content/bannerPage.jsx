import React, { useEffect, useState } from "react";
import { Table, message, Modal, Form, Input, Button, Upload } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { uploadImageToFirebase } from "./../../service/FirebaseService"; // Import the upload function

const API_BASE_URL = "https://indigo-rhapsody-backend-ten.vercel.app";

// API Function to Fetch Banners
const GetCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/banner/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

// API Function to Delete a Banner
const DeleteBanner = async (bannerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/banner/${bannerId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete banner");
    }
    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

// API Function to Create a Banner
const CreateBanner = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/banner/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

const BannerTable = () => {
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form] = Form.useForm();

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const data = await GetCategories();
      setBanners(data.banners || []);
      message.success("Banners loaded successfully!");
    } catch (error) {
      message.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteBanner = async (bannerId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/banner/${bannerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }

      if (response.status !== 204) {
        // Or 200, if your server sends JSON
        const data = await response.json();
        message.success("Banner deleted successfully"); // Show success message
        fetchBanners(); // Refresh the banner list (recommended over full reload)
        return data;
      } else {
        message.success("Banner deleted successfully"); // Show success message for 204
        fetchBanners(); // Refresh the banner list
        return;
      }
    } catch (error) {
      console.error("DeleteBanner error:", error);
      message.error(`Error deleting banner: ${error.message}`); // Show error message to user
      throw error;
    }
  };
  const handleAddBanner = async (values) => {
    try {
      setUploading(true);

      // Access the first file in the fileList
      const fileObj = values.file[0];

      // Upload image to Firebase and get the URL
      const imageUrl = await uploadImageToFirebase(
        fileObj.originFileObj,
        "banners"
      );

      // Send the image URL and name to the backend
      const response = await CreateBanner({ name: values.name, imageUrl });
      message.success(response.message);

      setIsModalVisible(false);
      form.resetFields(); // Reset form
      fetchBanners(); // Refresh the banner list
    } catch (error) {
      message.error(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text) => <img src={text} alt="Banner" style={{ width: 100 }} />,
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button
          type="link"
          danger
          onClick={() => handleDeleteBanner(record._id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => setIsModalVisible(true)}
      >
        Add Banner
      </Button>
      <Table
        dataSource={banners.map((item, index) => ({ ...item, key: index }))}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Add Banner"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddBanner}>
          <Form.Item
            name="name"
            label="Banner Name"
            rules={[
              { required: true, message: "Please input the banner name" },
            ]}
          >
            <Input placeholder="Enter banner name" />
          </Form.Item>
          <Form.Item
            name="file"
            label="Upload Image"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              console.log("Upload event:", e);
              return e && e.fileList;
            }}
            rules={[
              { required: true, message: "Please upload a banner image" },
            ]}
          >
            <Upload
              name="file"
              listType="picture"
              maxCount={1}
              beforeUpload={() => false} // Prevent automatic upload
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={uploading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BannerTable;
