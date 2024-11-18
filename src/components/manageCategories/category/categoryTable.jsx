import React, { useEffect, useState } from "react";
import {
  Table,
  message,
  Space,
  Image,
  Button,
  Modal,
  Form,
  Input,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  GetCategories,
  DeleteCategory,
  AddCategory,
  UpdateCategory,
} from "../../../service/categoryApi";
import { storage } from "../../../service/FirebaseService";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function CategoryTable() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [currentCategory, setCurrentCategory] = useState(null);
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await GetCategories();
      setCategories(data.categories);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Error fetching categories");
      setLoading(false);
    }
  };

  const showModal = (type, category = null) => {
    setModalType(type);
    setCurrentCategory(category);
    setIsModalVisible(true);
    if (category) {
      form.setFieldsValue({
        name: category.name,
      });
      console.log("Editing category:", category);
    } else {
      form.resetFields();
      console.log("Adding new category.");
    }
    setFile(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setFile(null);
  };

  const handleFileChange = ({ file }) => {
    if (file.status === "removed") {
      setFile(null);
    } else {
      setFile(file.originFileObj);
    }
  };

  const uploadImageToFirebase = async (file) => {
    const fileRef = ref(storage, `category/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

  const handleAddEdit = async (values) => {
    try {
      setUploading(true);

      let imageUrl = currentCategory?.imageUrl || "";
      if (file) {
        imageUrl = await uploadImageToFirebase(file);
      } else if (modalType === "add") {
        throw new Error("Please upload an image.");
      }

      const categoryData = { name: values.name, imageUrl };

      if (modalType === "add") {
        await AddCategory(categoryData);
        message.success("Category added successfully");
      } else {
        await UpdateCategory(currentCategory._id, categoryData);
        message.success("Category updated successfully");
      }

      fetchCategories();
      handleCancel();
    } catch (error) {
      console.error("Error saving category:", error);
      message.error(error.message || "Error saving category");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await DeleteCategory(id);
      message.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      message.error("Error deleting category");
    }
  };

  const columns = [
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (imageUrl) =>
        imageUrl ? <Image width={50} src={imageUrl} alt="Category" /> : "N/A",
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => showModal("edit", record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <Button type="primary" onClick={() => showModal("add")}>
          Add Category
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={categories}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />

      <Modal
        title={modalType === "add" ? "Add Category" : "Edit Category"}
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText={modalType === "add" ? "Add" : "Update"}
        confirmLoading={uploading}
      >
        <Form form={form} layout="vertical" onFinish={handleAddEdit}>
          <Form.Item
            name="name"
            label="Category Name"
            rules={[
              { required: true, message: "Please enter the category name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="image"
            label="Upload Image"
            rules={[
              {
                required: modalType === "add",
                message: "Please upload an image",
              },
            ]}
          >
            <Upload
              beforeUpload={(file) => {
                const isImage = file.type.startsWith("image/");
                if (!isImage) {
                  message.error("You can only upload image files!");
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                  message.error("Image must be smaller than 2MB!");
                }
                return isImage && isLt2M ? true : Upload.LIST_IGNORE;
              }}
              onChange={handleFileChange}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
            {file && <p>{file.name}</p>}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CategoryTable;
