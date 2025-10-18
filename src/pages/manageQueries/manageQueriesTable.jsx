import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  message,
  Tag,
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Avatar,
  Tooltip,
  Progress,
  Space,
  Modal,
  Input,
  Form,
  Select,
} from "antd";
import {
  MessageOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { getQueries, updateQuery, deleteQuery, resolveQuery } from "../../service/queriesService";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Search } = Input;

const ManageQueriesTable = ({ onDataUpdate }) => {
  const [queries, setQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isReplyModalVisible, setIsReplyModalVisible] = useState(false);
  const [replyForm] = Form.useForm();

  useEffect(() => {
    fetchQueries();
  }, []);

  useEffect(() => {
    filterQueries();
  }, [queries, searchText, statusFilter]);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const data = await getQueries();
      setQueries(data || []);
    } catch (error) {
      message.error("Failed to fetch queries: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterQueries = () => {
    let filtered = queries;

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(query => 
        query.designer_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        query.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        query.Message?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(query => query.status === statusFilter);
    }

    setFilteredQueries(filtered);
  };

  const handleMarkCompleted = async (id) => {
    try {
      await updateQuery(id, { status: "completed" });
      message.success("Query marked as completed");
      fetchQueries();
      if (onDataUpdate) onDataUpdate();
    } catch (error) {
      message.error("Failed to update query: " + error.message);
    }
  };

  const handleResolveQuery = async (id) => {
    try {
      await resolveQuery(id);
      message.success("Query resolved successfully");
      fetchQueries();
      if (onDataUpdate) onDataUpdate();
    } catch (error) {
      message.error("Failed to resolve query: " + error.message);
    }
  };

  const handleDeleteQuery = async (id) => {
    try {
      await deleteQuery(id);
      message.success("Query deleted successfully");
      fetchQueries();
      if (onDataUpdate) onDataUpdate();
    } catch (error) {
      message.error("Failed to delete query: " + error.message);
    }
  };

  const showDetailModal = (query) => {
    setSelectedQuery(query);
    setIsDetailModalVisible(true);
  };

  const showReplyModal = (query) => {
    setSelectedQuery(query);
    setIsReplyModalVisible(true);
    replyForm.resetFields();
  };

  const handleReply = async (values) => {
    try {
      // Here you would typically send the reply via API
      message.success("Reply sent successfully");
      setIsReplyModalVisible(false);
      replyForm.resetFields();
    } catch (error) {
      message.error("Failed to send reply: " + error.message);
    }
  };

  const columns = [
    {
      title: "Customer Info",
      key: "customerInfo",
      render: (_, record) => (
        <Space>
          <Avatar
            size={48}
            icon={<UserOutlined />}
            style={{ backgroundColor: '#1890ff' }}
          />
          <div>
            <div style={{ fontWeight: 500, fontSize: '16px', color: '#1a1a1a' }}>
              {record.designer_name || 'Anonymous'}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              <MailOutlined style={{ marginRight: 4 }} />
              {record.email || 'No email'}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Message Preview",
      dataIndex: "Message",
      key: "message",
      render: (message) => (
        <div style={{ maxWidth: 300 }}>
          <Paragraph
            ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
            style={{ margin: 0, fontSize: '14px' }}
          >
            {message || 'No message'}
          </Paragraph>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={status === "completed" ? "green" : "orange"}
          icon={status === "completed" ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
          style={{ margin: 0, fontWeight: 500 }}
        >
          {status === "completed" ? "Completed" : "Pending"}
        </Tag>
      ),
      filters: [
        { text: "All", value: "all" },
        { text: "Pending", value: "pending" },
        { text: "Completed", value: "completed" },
      ],
      onFilter: (value, record) => {
        if (value === "all") return true;
        return record.status === value;
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date, record) => (
        <Space direction="vertical" size="small">
          <Text strong style={{ fontSize: '14px' }}>
            {new Date(date || record.createdDate).toLocaleDateString()}
          </Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <CalendarOutlined style={{ marginRight: 4 }} />
            {new Date(date || record.createdDate).toLocaleTimeString()}
          </Text>
        </Space>
      ),
      sorter: (a, b) => new Date(a.createdAt || a.createdDate) - new Date(b.createdAt || b.createdDate),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => showDetailModal(record)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Tooltip title="Reply">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showReplyModal(record)}
              style={{ color: '#52c41a' }}
            />
          </Tooltip>
          {record.status !== "completed" && (
            <Tooltip title="Mark Completed">
              <Button
                type="text"
                icon={<CheckCircleOutlined />}
                onClick={() => handleMarkCompleted(record._id)}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
          )}
          <Tooltip title="Delete Query">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                Modal.confirm({
                  title: "Delete Query",
                  content: "Are you sure you want to delete this query?",
                  okText: "Delete",
                  okType: "danger",
                  onOk: () => handleDeleteQuery(record._id),
                });
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const completedCount = queries.filter(query => query.status === 'completed').length;
  const pendingCount = queries.filter(query => query.status !== 'completed').length;

  return (
    <div>
      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card className="summary-card">
            <Statistic
              title="Total Queries"
              value={queries.length}
              valueStyle={{ color: '#1890ff' }}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="summary-card">
            <Statistic
              title="Completed"
              value={completedCount}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="summary-card">
            <Statistic
              title="Pending"
              value={pendingCount}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="filter-card" style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Search queries..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              prefix={<FilterOutlined />}
            >
              <Option value="all">All Status</Option>
              <Option value="pending">Pending</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Button 
              type="primary" 
              icon={<ReloadOutlined />}
              onClick={fetchQueries}
              loading={loading}
              style={{ width: '100%' }}
            >
              Refresh
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card className="table-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Progress type="circle" percent={75} size="small" />
            <Text style={{ display: 'block', marginTop: 16 }}>Loading queries...</Text>
          </div>
        ) : filteredQueries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <MessageOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
            <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>
              {queries.length === 0 ? 'No queries found.' : 'No queries match your filters.'}
            </Text>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredQueries}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} queries`
            }}
            className="modern-table"
          />
        )}
      </Card>

      {/* Detail Modal */}
      <Modal
        title={
          <Space>
            <MessageOutlined style={{ color: '#1890ff' }} />
            <span>Query Details</span>
          </Space>
        }
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Close
          </Button>,
          selectedQuery?.status !== "completed" && (
            <Button 
              key="complete" 
              type="primary" 
              icon={<CheckCircleOutlined />}
              onClick={() => {
                handleMarkCompleted(selectedQuery._id);
                setIsDetailModalVisible(false);
              }}
            >
              Mark Completed
            </Button>
          ),
        ].filter(Boolean)}
        width={700}
        className="modern-modal"
      >
        {selectedQuery && (
          <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Text strong>Customer Name:</Text>
                <br />
                <Text>{selectedQuery.designer_name || 'Anonymous'}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Email:</Text>
                <br />
                <Text>{selectedQuery.email || 'No email'}</Text>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Text strong>Status:</Text>
                <br />
                <Tag
                  color={selectedQuery.status === "completed" ? "green" : "orange"}
                  icon={selectedQuery.status === "completed" ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                >
                  {selectedQuery.status === "completed" ? "Completed" : "Pending"}
                </Tag>
              </Col>
              <Col span={12}>
                <Text strong>Date:</Text>
                <br />
                <Text>{new Date(selectedQuery.createdAt || selectedQuery.createdDate).toLocaleString()}</Text>
              </Col>
            </Row>
            <div>
              <Text strong>Message:</Text>
              <div style={{ 
                marginTop: 8, 
                padding: 12, 
                backgroundColor: '#f8f9fa', 
                borderRadius: 8,
                border: '1px solid #e9ecef'
              }}>
                <Paragraph style={{ margin: 0, whiteSpace: 'pre-line' }}>
                  {selectedQuery.Message || 'No message'}
                </Paragraph>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Reply Modal */}
      <Modal
        title={
          <Space>
            <EditOutlined style={{ color: '#52c41a' }} />
            <span>Reply to Query</span>
          </Space>
        }
        open={isReplyModalVisible}
        onCancel={() => setIsReplyModalVisible(false)}
        footer={null}
        width={600}
        className="modern-modal"
      >
        <Form form={replyForm} layout="vertical" onFinish={handleReply}>
          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: "Please enter a subject" }]}
          >
            <Input placeholder="Enter subject..." />
          </Form.Item>
          <Form.Item
            name="message"
            label="Reply Message"
            rules={[{ required: true, message: "Please enter your reply" }]}
          >
            <Input.TextArea 
              rows={6} 
              placeholder="Enter your reply message..."
              style={{ resize: 'vertical' }}
            />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              size="large"
              style={{ borderRadius: 8 }}
            >
              Send Reply
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageQueriesTable;
