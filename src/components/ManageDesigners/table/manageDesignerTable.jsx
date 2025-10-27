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
  disableDesigner,
} from "../../../service/designerApi";
import * as XLSX from "xlsx";
import DesignerDetailModal from "../DesignerDetailModal";

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
  const [detailModalLoading, setDetailModalLoading] = useState(false);

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

    if (value === "All") {
      // Reset to show all designers when "All" is selected
      setFilteredDesigners(designers);
    } else {
      // Apply the filter based on approval status
      const isApproved = value === "Approved";
      const filtered = designers.filter(
        (designer) => designer.is_approved === isApproved
      );
      setFilteredDesigners(filtered);
    }
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
      if (isAction) {
        setLoading(true);
        const data = await GetDetailForDesigner(designerId);
        setSelectedDesigner(data.designer);
        setIsActionModalVisible(true);
        setLoading(false);
      } else {
        setDetailModalLoading(true);
        setIsDetailModalVisible(true);
        const data = await GetDetailForDesigner(designerId);
        setSelectedDesigner(data.designer);
        setDetailModalLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch designer details:", error);
      setLoading(false);
      setDetailModalLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsDetailModalVisible(false);
    setSelectedDesigner(null);
    setDetailModalLoading(false);
  };

  const handleActionModalClose = () => {
    setIsActionModalVisible(false);
    setSelectedDesigner(null);
  };

  const handleToggleApproval = async (designerId) => {
    try {
      setLoading(true);
      await disableDesigner(designerId);
      message.success("Designer status updated successfully");

      // Refresh the designer list
      const data = await allDesigners();
      setDesigners(data.designers);
      setFilteredDesigners(data.designers);
    } catch (error) {
      message.error(`Failed to update designer status: ${error.message}`);
    } finally {
      setLoading(false);
    }
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
      render: (text, record) => (
        <a 
          style={{ 
            color: '#667eea', 
            fontWeight: '600',
            cursor: 'pointer',
            textDecoration: 'none'
          }}
          onClick={() => showModal(record._id)}
          onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
          onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
        >
          {text}
        </a>
      ),
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
          <Button 
            type="primary" 
            size="small"
            onClick={() => showModal(record._id)}
            style={{ 
              borderRadius: '6px',
              fontWeight: '500'
            }}
          >
            View Details
          </Button>
          <Button
            type="link"
            onClick={() =>
              handleToggleApproval(record._id, !record.is_approved)
            }
            style={{ color: record.is_approved ? "#ff4d4f" : "#52c41a" }}
          >
            {record.is_approved ? "Disable" : "Enable"}
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
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} designers`,
          pageSizeOptions: ['5', '10', '20', '50'],
          size: 'default',
          position: ['bottomRight'],
          showLessItems: false,
          hideOnSinglePage: false,
          responsive: true
        }}
        loading={loading}
        bordered
      />
      <DesignerDetailModal
        visible={isDetailModalVisible}
        onClose={handleModalClose}
        designer={selectedDesigner}
        loading={detailModalLoading}
      />
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
              <Input 
                value={
                  typeof selectedDesigner.userId.address === 'object' 
                    ? `${selectedDesigner.userId.address.street_details || ''}, ${selectedDesigner.userId.address.city || ''}, ${selectedDesigner.userId.address.state || ''}, ${selectedDesigner.userId.address.pincode || ''}`.replace(/^,\s*|,\s*$/g, '')
                    : selectedDesigner.userId.address || 'Not provided'
                } 
                disabled 
              />
            </Form.Item>
            <Form.Item label="State">
              <Input 
                value={
                  typeof selectedDesigner.userId.state === 'object' 
                    ? JSON.stringify(selectedDesigner.userId.state)
                    : selectedDesigner.userId.state || 'Not provided'
                } 
                disabled 
              />
            </Form.Item>
            <Form.Item label="City">
              <Input 
                value={
                  typeof selectedDesigner.userId.city === 'object' 
                    ? JSON.stringify(selectedDesigner.userId.city)
                    : selectedDesigner.userId.city || 'Not provided'
                } 
                disabled 
              />
            </Form.Item>
            <Form.Item label="Pincode">
              <Input 
                value={
                  typeof selectedDesigner.userId.pincode === 'object' 
                    ? JSON.stringify(selectedDesigner.userId.pincode)
                    : selectedDesigner.userId.pincode || 'Not provided'
                } 
                disabled 
              />
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
