import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Select,
  Tag,
  Button,
  Space,
  Modal,
  message,
  Form,
} from "antd";
import { ManageDesignerTableWrap } from "./manageDesignerTable.Styles";
import {
  allDesigners,
  GetDetailForDesigner,
  updateDesignerApprovalStatus,
} from "../../../service/designerApi";
import * as XLSX from "xlsx";

const { Option } = Select;

const ManageDesignerTable = () => {
  const [designers, setDesigners] = useState([]);
  const [filteredDesigners, setFilteredDesigners] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  const [selectedDesigner, setSelectedDesigner] = useState(null);

  useEffect(() => {
    const fetchDesigners = async () => {
      try {
        const data = await allDesigners();
        setDesigners(data.designers);
        setFilteredDesigners(data.designers);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch designers:", error);
        setLoading(false);
      }
    };
    fetchDesigners();
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = designers.filter((designer) =>
      designer.userId.displayName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDesigners(filtered);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    const filtered = designers.filter(
      (designer) => designer.is_approved === (value === "Approved")
    );
    setFilteredDesigners(filtered);
  };

  const handleExport = () => {
    const dataToExport = filteredDesigners.map((designer) => ({
      Name: designer.userId.displayName,
      Logo: designer.logoUrl,
      Status: designer.is_approved ? "Approved" : "Pending",
      Description: designer.shortDescription,
      "Created At": new Date(designer.createdTime).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Designers");
    XLSX.writeFile(workbook, "Designers.xlsx");
  };

  const showModal = async (designerId, isAction = false) => {
    try {
      setLoading(true);
      const data = await GetDetailForDesigner(designerId);
      setSelectedDesigner(data.designer);
      if (isAction) {
        setIsActionModalVisible(true);
      } else {
        setIsDetailModalVisible(true);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch designer details:", error);
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsDetailModalVisible(false);
    setSelectedDesigner(null);
  };

  const handleActionModalClose = () => {
    setIsActionModalVisible(false);
    setSelectedDesigner(null);
  };

  const handleApprovalAction = async (designerId, isApproved) => {
    try {
      setLoading(true);
      await updateDesignerApprovalStatus(designerId, isApproved);
      message.success(
        `Designer ${isApproved ? "approved" : "marked as pending"} successfully`
      );
      handleActionModalClose();
      const data = await allDesigners();
      setDesigners(data.designers);
      setFilteredDesigners(data.designers);
      setLoading(false);
    } catch (error) {
      message.error("Failed to update designer status");
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: ["userId", "displayName"],
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Logo",
      dataIndex: "logoUrl",
      key: "logo",
      render: (url) => (
        <img src={url} alt="Logo" style={{ width: 50, height: 50 }} />
      ),
    },
    {
      title: "Status",
      dataIndex: "is_approved",
      key: "status",
      render: (isApproved) => (
        <Tag color={isApproved ? "green" : "red"}>
          {isApproved ? "Approved" : "Pending"}
        </Tag>
      ),
      filters: [
        { text: "Approved", value: "Approved" },
        { text: "Pending", value: "Pending" },
      ],
      onFilter: (value, record) =>
        record.is_approved === (value === "Approved"),
    },
    {
      title: "Description",
      dataIndex: "shortDescription",
      key: "shortDescription",
    },
    {
      title: "Created At",
      dataIndex: "createdTime",
      key: "createdTime",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => showModal(record._id)}>
            View
          </Button>
          <Button
            type="link"
            onClick={() => showModal(record._id, true)}
            disabled={record.is_approved}
          >
            Take Action
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <ManageDesignerTableWrap>
      <div className="block-head">
        <div className="block-head-1">
          <h3>Manage Designers</h3>
        </div>
        <Space style={{ marginBottom: 16 }}>
          <Input.Search
            placeholder="Search by name..."
            onSearch={handleSearch}
            style={{ width: 200 }}
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Select
            defaultValue="All"
            style={{ width: 150 }}
            onChange={handleStatusFilterChange}
          >
            <Option value="All">All</Option>
            <Option value="Approved">Approved</Option>
            <Option value="Pending">Pending</Option>
          </Select>
          <Button type="primary" onClick={handleExport}>
            Export
          </Button>
        </Space>
      </div>
      <Table
        dataSource={filteredDesigners.map((designer, index) => ({
          key: index,
          ...designer,
        }))}
        columns={columns}
        pagination={{ pageSize: 10 }}
        loading={loading}
        bordered
      />
      <Modal
        title="Designer Details"
        visible={isDetailModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
      >
        {selectedDesigner ? (
          <div>
            <Input
              addonBefore="Name"
              value={selectedDesigner.userId.displayName}
              disabled
            />
            <Input
              addonBefore="Email"
              value={selectedDesigner.userId.email}
              disabled
              style={{ marginTop: "10px" }}
            />
            <Input
              addonBefore="Phone Number"
              value={selectedDesigner.userId.phoneNumber}
              disabled
              style={{ marginTop: "10px" }}
            />
            <Input
              addonBefore="Address"
              value={selectedDesigner.userId.address}
              disabled
              style={{ marginTop: "10px" }}
            />
            <Input
              addonBefore="City"
              value={selectedDesigner.userId.city}
              disabled
              style={{ marginTop: "10px" }}
            />
            <Input
              addonBefore="State"
              value={selectedDesigner.userId.state}
              disabled
              style={{ marginTop: "10px" }}
            />
            <Input
              addonBefore="Pincode"
              value={selectedDesigner.userId.pincode}
              disabled
              style={{ marginTop: "10px" }}
            />
            <Input.TextArea
              addonBefore="Description"
              value={selectedDesigner.shortDescription}
              disabled
              autoSize={{ minRows: 2, maxRows: 6 }}
              style={{ marginTop: "10px" }}
            />
            <Input
              addonBefore="Created At"
              value={new Date(
                selectedDesigner.createdTime
              ).toLocaleDateString()}
              disabled
              style={{ marginTop: "10px" }}
            />
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
      {/* Action Modal */}
      <Modal
        title="Review Designer Application"
        visible={isActionModalVisible}
        onCancel={handleActionModalClose}
        footer={[
          <Button
            key="approve"
            type="primary"
            onClick={() => handleApprovalAction(selectedDesigner._id, true)}
          >
            Approve
          </Button>,
          <Button
            key="reject"
            type="danger"
            onClick={() => handleApprovalAction(selectedDesigner._id, false)}
          >
            Mark as Pending
          </Button>,
          <Button key="close" onClick={handleActionModalClose}>
            Close
          </Button>,
        ]}
      >
        {selectedDesigner ? (
          <Form layout="vertical">
            <Form.Item label="Name">
              <Input value={selectedDesigner.userId.displayName} disabled />
            </Form.Item>
            <Form.Item label="Email">
              <Input value={selectedDesigner.userId.email} disabled />
            </Form.Item>
            <Form.Item label="Address">
              <Input value={selectedDesigner.userId.address} disabled />
            </Form.Item>
            <Form.Item label="State">
              <Input value={selectedDesigner.userId.state} disabled />
            </Form.Item>
            <Form.Item label="City">
              <Input value={selectedDesigner.userId.city} disabled />
            </Form.Item>
            <Form.Item label="Pincode">
              <Input value={selectedDesigner.userId.pincode} disabled />
            </Form.Item>
            <Form.Item label="About">
              <Input.TextArea
                value={selectedDesigner.shortDescription}
                disabled
              />
            </Form.Item>
            <Form.Item label="Logo">
              <img
                src={selectedDesigner.logoUrl}
                alt="Logo"
                style={{ width: 100, height: 100, marginBottom: 10 }}
              />
            </Form.Item>
            <Form.Item label="Cover Photo">
              <img
                src={selectedDesigner.backGroundImage}
                alt="Background"
                style={{ width: "100%", maxHeight: 200, marginBottom: 10 }}
              />
            </Form.Item>
          </Form>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </ManageDesignerTableWrap>
  );
};

export default ManageDesignerTable;
