import React, { useEffect, useState } from "react";
import { PaymentPageTableWrap } from "./paymentPageTable.Styles";
import { 
  Table, 
  Input, 
  Tag, 
  Button, 
  Space, 
  message, 
  Select, 
  Avatar, 
  Tooltip,
  Badge,
  Typography,
  Card,
  Row,
  Col,
  Statistic
} from "antd";
import { 
  SearchOutlined, 
  UserOutlined, 
  DollarOutlined, 
  CalendarOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CreditCardOutlined,
  WalletOutlined
} from "@ant-design/icons";
import { GetPayment, UpdatePaymentStatus } from "../../service/paymentpageapi";

const { Option } = Select;
const { Text } = Typography;

function PaymentPageTable({ onDataUpdate }) {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      message.loading({ content: 'Fetching payments...', key: 'payments' });
      console.log("PaymentTable: Fetching payments...");
      const data = await GetPayment();
      const paymentsArray = data.payments || [];
      console.log("PaymentTable: Payments received:", paymentsArray.length);
      setPayments(paymentsArray);
      setFilteredPayments(paymentsArray);
      message.success({ 
        content: `Successfully loaded ${paymentsArray.length} payments`, 
        key: 'payments',
        duration: 2
      });
    } catch (error) {
      console.error("PaymentTable: Error fetching payments:", error);
      // Don't show error message if it's an auth error (apiCall will handle logout)
      if (!error.message.includes("unauthorized") && 
          !error.message.includes("forbidden") && 
          !error.message.includes("token")) {
        message.error({ 
          content: "Failed to fetch payments. Please try again.", 
          key: 'payments',
          duration: 3
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Define columns for the table
  const columns = [
    {
      title: "Customer",
      key: "customer",
      render: (_, record) => (
        <Space>
          <Avatar 
            icon={<UserOutlined />} 
            size="small"
            style={{ backgroundColor: '#1890ff' }}
          />
          <div>
            <div style={{ fontWeight: 500, fontSize: '14px' }}>
              {record.userId?.displayName || "Unknown"}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.userId?.email || "No email"}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Transaction",
      key: "transaction",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text strong style={{ fontSize: '13px', fontFamily: 'monospace' }}>
            {record.transactionId || "N/A"}
          </Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {new Date(record.createdDate).toLocaleDateString()}
          </Text>
        </Space>
      ),
    },
    {
      title: "Amount",
      key: "amount",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text strong style={{ fontSize: '16px', color: '#52c41a' }}>
            ₹{record.cartId?.total_amount?.toLocaleString() || "0"}
          </Text>
          {record.cartId?.items?.length > 0 && (
            <Text type="secondary" style={{ fontSize: '11px' }}>
              {record.cartId.items.length} items
            </Text>
          )}
        </Space>
      ),
      sorter: (a, b) => (a.cartId?.total_amount || 0) - (b.cartId?.total_amount || 0),
    },
    {
      title: "Payment Method",
      key: "paymentMethod",
      render: (_, record) => (
        <Space>
          {record.paymentMethod === "Credit Card" ? (
            <CreditCardOutlined style={{ color: '#1890ff' }} />
          ) : (
            <WalletOutlined style={{ color: '#52c41a' }} />
          )}
          <Text>{record.paymentMethod || "N/A"}</Text>
        </Space>
      ),
      filters: [
        { text: "Credit Card", value: "Credit Card" },
        { text: "Wallet", value: "Wallet" },
        { text: "UPI", value: "UPI" },
      ],
      onFilter: (value, record) => record.paymentMethod === value,
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const statusConfig = {
          "Completed": { color: "green", icon: <CheckCircleOutlined />, text: "Completed" },
          "Pending": { color: "orange", icon: <ClockCircleOutlined />, text: "Pending" },
          "Failed": { color: "red", icon: <CloseCircleOutlined />, text: "Failed" },
        };
        
        const config = statusConfig[record.paymentStatus] || statusConfig["Pending"];
        
        return (
          <Badge 
            status={config.color === "green" ? "success" : config.color === "orange" ? "processing" : "error"}
            text={
              <Tag 
                color={config.color}
                icon={config.icon}
                style={{ fontWeight: 500 }}
              >
                {config.text}
              </Tag>
            }
          />
        );
      },
      filters: [
        { text: "Completed", value: "Completed" },
        { text: "Pending", value: "Pending" },
        { text: "Failed", value: "Failed" },
      ],
      onFilter: (value, record) => record.paymentStatus === value,
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
              onClick={() => handleViewDetails(record)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          {record.paymentStatus === "Pending" && (
            <Tooltip title="Mark as Completed">
              <Button
                type="text"
                icon={<CheckCircleOutlined />}
                onClick={() => handleUpdateStatus(record._id, "Completed")}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  // Handle search functionality
  const handleSearch = (value) => {
    setSearchText(value);
    filterPayments(value, statusFilter, methodFilter);
  };

  // Handle status filter functionality
  const handleStatusChange = (value) => {
    setStatusFilter(value);
    filterPayments(searchText, value, methodFilter);
  };

  // Handle method filter functionality
  const handleMethodChange = (value) => {
    setMethodFilter(value);
    filterPayments(searchText, statusFilter, value);
  };

  // Function to filter payments based on name, status, and method
  const filterPayments = (name, status, method) => {
    const filteredData = payments.filter((payment) => {
      const matchesName = payment.userId?.displayName
        ?.toLowerCase()
        .includes(name.toLowerCase()) || 
        payment.transactionId?.toLowerCase().includes(name.toLowerCase());
      const matchesStatus = status ? payment.paymentStatus === status : true;
      const matchesMethod = method ? payment.paymentMethod === method : true;
      return matchesName && matchesStatus && matchesMethod;
    });
    setFilteredPayments(filteredData);
  };

  // Handle status update
  const handleUpdateStatus = async (paymentId, newStatus) => {
    try {
      await UpdatePaymentStatus(paymentId, newStatus);
      message.success(`Payment status updated to ${newStatus}`);
      
      // Update local state
      setPayments(prev => 
        prev.map(payment => 
          payment._id === paymentId 
            ? { ...payment, paymentStatus: newStatus }
            : payment
        )
      );
      setFilteredPayments(prev => 
        prev.map(payment => 
          payment._id === paymentId 
            ? { ...payment, paymentStatus: newStatus }
            : payment
        )
      );
      
      // Notify parent component to refresh stats
      if (onDataUpdate) {
        onDataUpdate();
      }
    } catch (error) {
      message.error(`Failed to update payment status: ${error.message}`);
    }
  };

  // Handle view details
  const handleViewDetails = (payment) => {
    // You can implement a modal here to show payment details
    message.info(`Viewing details for payment: ${payment.transactionId}`);
  };

  // Calculate summary statistics
  const totalAmount = filteredPayments.reduce((sum, payment) => 
    sum + (payment.cartId?.total_amount || 0), 0
  );
  const completedAmount = filteredPayments
    .filter(payment => payment.paymentStatus === "Completed")
    .reduce((sum, payment) => sum + (payment.cartId?.total_amount || 0), 0);

  return (
    <PaymentPageTableWrap>
      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="summary-card">
            <Statistic
              title="Filtered Payments"
              value={filteredPayments.length}
              valueStyle={{ color: '#1890ff', fontSize: '18px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="summary-card">
            <Statistic
              title="Total Amount"
              value={totalAmount}
              precision={2}
              valueStyle={{ color: '#52c41a', fontSize: '18px' }}
              prefix="₹"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="summary-card">
            <Statistic
              title="Completed Amount"
              value={completedAmount}
              precision={2}
              valueStyle={{ color: '#52c41a', fontSize: '18px' }}
              prefix="₹"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="summary-card">
            <Statistic
              title="Success Rate"
              value={payments.length > 0 ? (completedAmount / totalAmount * 100) : 0}
              precision={1}
              valueStyle={{ color: '#52c41a', fontSize: '18px' }}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <div className="filters-section">
        <Space size="middle" wrap>
          <Input.Search
            placeholder="Search by customer name or transaction ID..."
            onSearch={handleSearch}
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
          />
          <Select
            placeholder="Filter by status"
            style={{ width: 150 }}
            onChange={handleStatusChange}
            allowClear
            value={statusFilter}
          >
            <Option value="Completed">Completed</Option>
            <Option value="Pending">Pending</Option>
            <Option value="Failed">Failed</Option>
          </Select>
          <Select
            placeholder="Filter by method"
            style={{ width: 150 }}
            onChange={handleMethodChange}
            allowClear
            value={methodFilter}
          >
            <Option value="Credit Card">Credit Card</Option>
            <Option value="Wallet">Wallet</Option>
            <Option value="UPI">UPI</Option>
          </Select>
          <Button
            type="default"
            onClick={() => {
              setSearchText("");
              setStatusFilter("");
              setMethodFilter("");
              setFilteredPayments(payments);
            }}
          >
            Clear Filters
          </Button>
        </Space>
      </div>

      {/* Table */}
      <div className="table-section">
        <Table
          columns={columns}
          dataSource={filteredPayments}
          rowKey="_id"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} payments`
          }}
          className="modern-table"
          scroll={{ x: 1200 }}
        />
      </div>
    </PaymentPageTableWrap>
  );
}

export default PaymentPageTable;
