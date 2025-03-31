import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space, Modal, Form } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../../service/blogsService"; // Adjust the import path as necessary

const { Column } = Table;
const { TextArea } = Input;

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const blogs = await getBlogs();
      setBlogs(blogs);
    } catch (error) {
      console.error("Failed to fetch blogs:", error.message);
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
    form.setFieldsValue(blog || { title: "", description: "", image: "" });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingBlog(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      if (editingBlog) {
        await updateBlog(editingBlog._id, values);
      } else {
        await createBlog(values);
      }
      fetchBlogs();
      handleCancel();
    } catch (error) {
      console.error("Failed to save blog:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBlog(id);
      fetchBlogs();
    } catch (error) {
      console.error("Failed to delete blog:", error.message);
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
        <Column title="Description" dataIndex="description" key="description" />
        <Column
          title="Image"
          dataIndex="image"
          key="image"
          render={(image) => (
            <img
              src={image}
              alt="Blog"
              style={{ width: 100, height: "auto" }}
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
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
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
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please enter the description" },
            ]}
          >
            <TextArea rows={4} placeholder="Enter description" />
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
