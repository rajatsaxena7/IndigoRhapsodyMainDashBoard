import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space, Modal, Form, message } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../../service/blogsService"; // Adjust this path

const { Column } = Table;

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const [quillContent, setQuillContent] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const blogs = await getBlogs();
      setBlogs(blogs);
    } catch (error) {
      message.error("Failed to fetch blogs");
      console.error(error);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const showModal = (blog = null) => {
    setEditingBlog(blog);
    form.setFieldsValue(blog || { title: "", image: "" });
    setQuillContent(blog?.description || "");
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingBlog(null);
    form.resetFields();
    setQuillContent("");
  };

  const handleSubmit = async (values) => {
    if (!quillContent) {
      message.error("Description is required");
      return;
    }

    try {
      const payload = {
        ...values,
        description: quillContent,
      };

      if (editingBlog) {
        await updateBlog(editingBlog._id, payload);
        message.success("Blog updated successfully");
      } else {
        await createBlog(payload);
        message.success("Blog created successfully");
      }

      fetchBlogs();
      handleCancel();
    } catch (error) {
      console.error("Failed to save blog:", error.message);
      message.error("Error saving blog");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBlog(id);
      message.success("Blog deleted successfully");
      fetchBlogs();
    } catch (error) {
      console.error("Failed to delete blog:", error.message);
      message.error("Error deleting blog");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Space style={{ marginBottom: "16px" }}>
        <Input
          placeholder="Search blogs"
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Add Blog
        </Button>
      </Space>

      <Table dataSource={filteredBlogs} rowKey="_id">
        <Column title="Title" dataIndex="title" key="title" />
        <Column
          title="Image"
          dataIndex="image"
          key="image"
          render={(image) => (
            <img
              src={image}
              alt="Blog"
              style={{ width: 100, height: "auto", objectFit: "cover" }}
            />
          )}
        />
        <Column
          title="Actions"
          key="actions"
          render={(_, record) => (
            <Space size="middle">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => showModal(record)}
              >
                Edit
              </Button>
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record._id)}
              >
                Delete
              </Button>
            </Space>
          )}
        />
      </Table>

      <Modal
        title={editingBlog ? "Edit Blog" : "Add Blog"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter the title" }]}
          >
            <Input placeholder="Enter title" />
          </Form.Item>

          <Form.Item
            label="Description"
            required
            validateStatus={!quillContent ? "error" : ""}
            help={!quillContent ? "Please enter the description" : ""}
          >
            <ReactQuill
              theme="snow"
              value={quillContent}
              onChange={setQuillContent}
              style={{ height: "200px", marginBottom: "40px" }}
            />
          </Form.Item>

          <Form.Item
            name="image"
            label="Image URL"
            rules={[{ required: true, message: "Please enter the image URL" }]}
          >
            <Input placeholder="Enter image URL" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingBlog ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BlogsPage;
