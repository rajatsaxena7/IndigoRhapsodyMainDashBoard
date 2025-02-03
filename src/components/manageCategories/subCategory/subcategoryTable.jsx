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
  Tag,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  GetSubCategories,
  DeleteSubCategory,
  CreateSubCategory,
  UpdateSubCategory,
  ApproveSubCategory,
  GetCategories,
} from "../../../service/categoryApi";
import { storage } from "../../../service/FirebaseService";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const { Option } = Select;

function SubCategoryTable() {
  const [subcategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [currentSubCategory, setCurrentSubCategory] = useState(null);
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState(null);

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, []);

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const data = await GetSubCategories();
      setSubCategories(data.subCategories);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      message.error("Error fetching subcategories");
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await GetCategories();
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Error fetching categories");
    }
  };

  const showModal = (type, subcategory = null) => {
    setModalType(type);
    setCurrentSubCategory(subcategory);
    setIsModalVisible(true);
    if (subcategory) {
      form.setFieldsValue({
        name: subcategory.name,
        categoryId: subcategory.categoryId?._id, // Use optional chaining
      });
    } else {
      form.resetFields();
    }
    setFile(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setFile(null);
  };

  const handleFileChange = (info) => {
    const { fileList } = info;

    if (fileList.length === 0) {
      setFile(null);
    } else {
      // No action needed since file is set in beforeUpload
    }
  };

  const uploadImageToFirebase = async (file) => {
    try {
      const timestamp = Date.now();
      const fileRef = ref(storage, `subcategory/${timestamp}_${file.name}`);

      // Upload the file
      const snapshot = await uploadBytes(fileRef, file);

      // Get the download URL
      const url = await getDownloadURL(fileRef);

      return url;
    } catch (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
  };
  const handleAddEdit = async (values) => {
    try {
      setUploading(true);

      let image = currentSubCategory?.image || "";

      if (file) {
        image = await uploadImageToFirebase(file);
      } else if (modalType === "add" && !image) {
        throw new Error("Please upload an image.");
      }

      const subcategoryData = {
        name: values.name,
        image: image,
        categoryId: values.categoryId,
      };

      if (!subcategoryData.name || !subcategoryData.image) {
        throw new Error("Name and image are required");
      }

      if (modalType === "add") {
        await CreateSubCategory(subcategoryData);
        message.success("Subcategory added successfully");
      } else {
        await UpdateSubCategory(currentSubCategory._id, subcategoryData);
        message.success("Subcategory updated successfully");
      }

      // Refresh the page after successful add/edit
      window.location.reload(); // Simplest way to refresh the page

      // OR, if you want a less disruptive refresh (recommended):
      // fetchSubCategories(); // Call your existing fetch function
      // handleCancel();       // Close the modal after the refresh
    } catch (error) {
      message.error(error.message || "Error saving subcategory");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    setSubCategoryToDelete(id);
    setDeleteConfirmVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await DeleteSubCategory(subCategoryToDelete);
      message.success("Subcategory deleted successfully");
      fetchSubCategories();
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      message.error("Error deleting subcategory");
    } finally {
      setDeleteConfirmVisible(false);
      setSubCategoryToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmVisible(false);
    setSubCategoryToDelete(null);
  };

  const handleApproveToggle = async (id, isApproved) => {
    try {
      await ApproveSubCategory(id, !isApproved);
      message.success(
        `Subcategory ${isApproved ? "unapproved" : "approved"} successfully`
      );
      fetchSubCategories();
    } catch (error) {
      message.error("Error updating approval status");
    }
  };

  const columns = [
    {
      title: "Subcategory Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Category Name",
      dataIndex: ["categoryId", "name"],
      key: "categoryName",
      render: (categoryName) => categoryName || "N/A",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (imageUrl) =>
        imageUrl ? (
          <Image width={50} src={imageUrl} alt="Subcategory" />
        ) : (
          "N/A"
        ),
    },
    {
      title: "Approval Status",
      dataIndex: "isApproved",
      key: "isApproved",
      render: (isApproved) =>
        isApproved ? (
          <Tag color="green">Approved</Tag>
        ) : (
          <Tag color="red">Unapproved</Tag>
        ),
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
          <Button
            type="link"
            onClick={() => handleApproveToggle(record._id, record.isApproved)}
          >
            {record.isApproved ? "Unapprove" : "Approve"}
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
          Add Subcategory
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={subcategories}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />

      <Modal
        title={modalType === "add" ? "Add Subcategory" : "Edit Subcategory"}
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText={modalType === "add" ? "Add" : "Update"}
        confirmLoading={uploading}
      >
        <Form form={form} layout="vertical" onFinish={handleAddEdit}>
          <Form.Item
            name="name"
            label="Subcategory Name"
            rules={[
              { required: true, message: "Please enter the subcategory name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select placeholder="Select a category">
              {categories.map((category) => (
                <Option key={category._id} value={category._id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Upload Image"
            // Removed 'name' attribute to prevent conflict
            rules={[
              {
                required: modalType === "add",
                message: "Please upload an image",
              },
            ]}
          >
            <Upload
              beforeUpload={(file) => {
                setFile(file);

                return false; // Prevent automatic upload
              }}
              onChange={handleFileChange}
              showUploadList={false}
              accept="image/*"
              maxCount={1} // Enforce single file upload
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
            {file && <p>{file.name}</p>}
            {/* If editing and there's an existing image, display it */}
            {modalType === "edit" && currentSubCategory?.image && !file && (
              <Image
                width={50}
                src={currentSubCategory.image}
                alt="Current Subcategory"
                style={{ marginTop: 10 }}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Confirm Delete"
        visible={deleteConfirmVisible}
        onOk={confirmDelete}
        onCancel={cancelDelete}
      >
        Are you sure you want to delete this subcategory?
      </Modal>
    </div>
  );
}

export default SubCategoryTable;
