import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Space,
  Button,
  Badge,
  Divider,
  Spin,
  Alert,
  Table,
  Avatar,
  Tag,
  Tooltip,
  Progress,
  List,
  Descriptions,
  Modal,
  Tabs,
  Select,
  Input,
  message,
  Popconfirm,
} from "antd";
import {
  ShoppingCartOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  FilterOutlined,
  ExportOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  UserOutlined,
  InboxOutlined,
  TruckOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { OrdersPageWrap } from "./ordersPage.Styles";
import { getAllOrders, cancelOrder, getOrderStats } from "../../service/orderApi";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    revenue: 0,
  });
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(false);

  useEffect(() => {
    fetchOrderData();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchText, statusFilter]);

  const fetchOrderData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Starting to fetch order data...");
      
      // Try to fetch orders first
      let ordersData;
      try {
        ordersData = await getAllOrders();
        console.log("Orders data received:", ordersData);
      } catch (orderError) {
        console.error("Failed to fetch orders:", orderError);
        
        // Check if it's an authentication error
        if (orderError.message.includes("Authentication") || 
            orderError.message.includes("unauthorized") || 
            orderError.message.includes("forbidden")) {
          console.log("Authentication error detected - letting apiCall handle logout");
          // Don't set error state for auth errors as they're handled by apiCall
          return;
        }
        
        // If orders fail for other reasons, try to continue with empty data
        ordersData = { orders: [] };
      }

      // Try to fetch stats
      let statsData;
      try {
        statsData = await getOrderStats();
        console.log("Stats data received:", statsData);
      } catch (statsError) {
        console.error("Failed to fetch stats:", statsError);
        // Use default stats if stats fail
        statsData = {
          totalOrders: 0,
          pendingOrders: 0,
          completedOrders: 0,
          cancelledOrders: 0,
          totalRevenue: 0
        };
      }

      const ordersList = ordersData.orders || [];
      console.log("Setting orders:", ordersList.length, "orders");
      setOrders(ordersList);

      // Calculate statistics from orders data
      const total = ordersList.length;
      const pending = ordersList.filter(order => order.status === "Order Placed").length;
      const completed = ordersList.filter(order => order.status === "Delivered").length;
      const cancelled = ordersList.filter(order => order.status === "Cancelled").length;
      const revenue = ordersList.reduce((sum, order) => sum + (order.amount || 0), 0);

      const calculatedStats = {
        total,
        pending,
        completed,
        cancelled,
        revenue,
      };
      
      console.log("Setting stats:", calculatedStats);
      setStats(calculatedStats);
    } catch (err) {
      console.error("Error fetching order data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(order => 
        order.orderId?.toLowerCase().includes(searchText.toLowerCase()) ||
        order.userId?.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        order.products?.some(product => 
          product.productName?.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const showOrderDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailModalVisible(true);
  };

  const handleCancelOrder = async (orderId) => {
    setCancellingOrder(true);
    try {
      await cancelOrder(orderId);
      message.success("Order cancelled successfully");
      fetchOrderData(); // Refresh data
    } catch (err) {
      console.error("Error cancelling order:", err);
      message.error(err.message || "Failed to cancel order");
    } finally {
      setCancellingOrder(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Placed':
        return 'blue';
      case 'Processing':
        return 'orange';
      case 'Shipped':
        return 'purple';
      case 'Delivered':
        return 'green';
      case 'Cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Order Placed':
        return <ClockCircleOutlined />;
      case 'Processing':
        return <InboxOutlined />;
      case 'Shipped':
        return <TruckOutlined />;
      case 'Delivered':
        return <CheckCircleOutlined />;
      case 'Cancelled':
        return <CloseCircleOutlined />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'orange';
      case 'Completed':
        return 'green';
      case 'Failed':
        return 'red';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const orderColumns = [
    {
      title: "Order Info",
      key: "orderInfo",
      render: (_, record) => (
        <Space>
          <Avatar 
            size={48} 
            icon={<ShoppingCartOutlined />}
            style={{ backgroundColor: '#1890ff' }}
          />
          <div>
            <div style={{ fontWeight: 500, fontSize: '16px', color: '#1a1a1a' }}>
              {record.orderId}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              <CalendarOutlined style={{ marginRight: 4 }} />
              {formatDate(record.orderDate)}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Customer",
      key: "customer",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text strong>{record.userId?.email || 'No email'}</Text>
          {record.shippingDetails?.address && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              <EnvironmentOutlined style={{ marginRight: 4 }} />
              {record.shippingDetails.address.city}, {record.shippingDetails.address.state}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Products",
      key: "products",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text strong>{record.products?.length || 0} items</Text>
          {record.products?.slice(0, 2).map((product, index) => (
            <Text key={index} type="secondary" style={{ fontSize: '12px' }}>
              {product.productName?.substring(0, 30)}...
            </Text>
          ))}
          {record.products?.length > 2 && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              +{record.products.length - 2} more
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Amount",
      key: "amount",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text strong style={{ fontSize: '16px', color: '#52c41a' }}>
            {formatCurrency(record.amount)}
          </Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.paymentMethod}
          </Text>
        </Space>
      ),
      sorter: (a, b) => (a.amount || 0) - (b.amount || 0),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Tag 
            color={getStatusColor(record.status)} 
            icon={getStatusIcon(record.status)}
            style={{ margin: 0 }}
          >
            {record.status}
          </Tag>
          <Tag 
            color={getPaymentStatusColor(record.paymentStatus)}
            icon={<CreditCardOutlined />}
            size="small"
          >
            {record.paymentStatus}
          </Tag>
        </Space>
      ),
      filters: [
        { text: "All", value: "all" },
        { text: "Order Placed", value: "Order Placed" },
        { text: "Processing", value: "Processing" },
        { text: "Shipped", value: "Shipped" },
        { text: "Delivered", value: "Delivered" },
        { text: "Cancelled", value: "Cancelled" },
      ],
      onFilter: (value, record) => {
        if (value === "all") return true;
        return record.status === value;
      },
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
              onClick={() => showOrderDetail(record)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          {record.status === "Order Placed" && (
            <Popconfirm
              title="Cancel Order"
              description="Are you sure you want to cancel this order?"
              onConfirm={() => handleCancelOrder(record._id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ loading: cancellingOrder }}
            >
              <Tooltip title="Cancel Order">
                <Button
                  type="text"
                  danger
                  icon={<CloseCircleOutlined />}
                />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <OrdersPageWrap>
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <Spin size="large" />
          <Text style={{ display: 'block', marginTop: 16 }}>Loading orders...</Text>
        </div>
      </OrdersPageWrap>
    );
  }

  return (
    <OrdersPageWrap>
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>
            <ShoppingCartOutlined style={{ marginRight: 12, color: '#1890ff' }} />
            Order Management
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Manage customer orders, track status, and process cancellations
          </Text>
        </div>
        <div className="header-actions">
          <Button 
            icon={<FilterOutlined />}
            style={{ marginRight: 8 }}
          >
            Filter
          </Button>
          <Button 
            icon={<ExportOutlined />}
            style={{ marginRight: 8 }}
          >
            Export
          </Button>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />}
            onClick={fetchOrderData}
            loading={loading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Orders"
              value={stats.total}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ShoppingCartOutlined />}
              suffix={
                <Badge 
                  count={stats.total} 
                  style={{ 
                    backgroundColor: '#1890ff',
                    marginLeft: 8 
                  }} 
                />
              }
            />
            <div className="stat-description">
              <Text type="secondary">All orders</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Pending Orders"
              value={stats.pending}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<ClockCircleOutlined />}
              suffix={
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  ({Math.round((stats.pending / stats.total) * 100)}%)
                </Text>
              }
            />
            <div className="stat-description">
              <Text type="secondary">Awaiting processing</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Completed Orders"
              value={stats.completed}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
              suffix={
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  ({Math.round((stats.completed / stats.total) * 100)}%)
                </Text>
              }
            />
            <div className="stat-description">
              <Text type="secondary">Successfully delivered</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Revenue"
              value={formatCurrency(stats.revenue)}
              valueStyle={{ color: '#722ed1' }}
              prefix={<DollarOutlined />}
            />
            <div className="stat-description">
              <Text type="secondary">From all orders</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Order Distribution and Analytics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <PieChartOutlined style={{ color: '#1890ff' }} />
                <span>Order Status Distribution</span>
              </Space>
            }
            className="metric-card"
          >
            <div className="order-distribution">
              <div className="distribution-item">
                <div className="distribution-header">
                  <Text strong>Pending Orders</Text>
                  <Text type="secondary">({stats.pending})</Text>
                </div>
                <Progress 
                  percent={Math.round((stats.pending / stats.total) * 100)} 
                  strokeColor="#fa8c16"
                  size="small"
                />
              </div>
              <Divider />
              <div className="distribution-item">
                <div className="distribution-header">
                  <Text strong>Completed Orders</Text>
                  <Text type="secondary">({stats.completed})</Text>
                </div>
                <Progress 
                  percent={Math.round((stats.completed / stats.total) * 100)} 
                  strokeColor="#52c41a"
                  size="small"
                />
              </div>
              <Divider />
              <div className="distribution-item">
                <div className="distribution-header">
                  <Text strong>Cancelled Orders</Text>
                  <Text type="secondary">({stats.cancelled})</Text>
                </div>
                <Progress 
                  percent={Math.round((stats.cancelled / stats.total) * 100)} 
                  strokeColor="#ff4d4f"
                  size="small"
                />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <BarChartOutlined style={{ color: '#52c41a' }} />
                <span>Order Analytics</span>
              </Space>
            }
            className="metric-card"
          >
            <div className="analytics-metrics">
              <div className="analytics-item">
                <div className="analytics-header">
                  <Text strong>Average Order Value</Text>
                  <Text type="secondary">per order</Text>
                </div>
                <div className="analytics-value">
                  <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                    {stats.total > 0 ? formatCurrency(stats.revenue / stats.total) : formatCurrency(0)}
                  </Text>
                </div>
              </div>
              <Divider />
              <div className="analytics-item">
                <div className="analytics-header">
                  <Text strong>Recent Orders</Text>
                  <Text type="secondary">Last 7 days</Text>
                </div>
                <div className="analytics-value">
                  <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
                    {orders.filter(order => {
                      const orderDate = new Date(order.orderDate);
                      const now = new Date();
                      const daysDiff = (now - orderDate) / (1000 * 60 * 60 * 24);
                      return daysDiff <= 7;
                    }).length}
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <LineChartOutlined style={{ color: '#722ed1' }} />
                <span>Quick Actions</span>
              </Space>
            }
            className="metric-card"
          >
            <div className="quick-actions">
              <Button 
                type="primary" 
                icon={<EyeOutlined />}
                block
                size="large"
                style={{ marginBottom: 12 }}
              >
                View All Orders ({stats.total})
              </Button>
              <Button 
                icon={<ClockCircleOutlined />}
                block
                size="large"
                style={{ marginBottom: 12 }}
              >
                Process Pending ({stats.pending})
              </Button>
              <Button 
                icon={<CheckCircleOutlined />}
                block
                size="large"
              >
                Mark as Delivered
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Card className="filter-card" style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Search orders by ID, customer email, or product..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<ShoppingCartOutlined />}
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
              <Option value="Order Placed">Order Placed</Option>
              <Option value="Processing">Processing</Option>
              <Option value="Shipped">Shipped</Option>
              <Option value="Delivered">Delivered</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Text type="secondary">
              Showing {filteredOrders.length} of {orders.length} orders
            </Text>
          </Col>
        </Row>
      </Card>

      {/* Orders Table */}
      <Card 
        title={
          <Space>
            <ShoppingCartOutlined style={{ color: '#1890ff' }} />
            <span>Order Management</span>
          </Space>
        }
        className="table-card"
      >
        <Table
          columns={orderColumns}
          dataSource={filteredOrders}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} orders`
          }}
          className="modern-table"
        />
      </Card>

      {/* Order Detail Modal */}
      <Modal
        title={
          <Space>
            <ShoppingCartOutlined style={{ color: '#1890ff' }} />
            <span>Order Details</span>
          </Space>
        }
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Close
          </Button>,
          selectedOrder?.status === "Order Placed" && (
            <Popconfirm
              key="cancel"
              title="Cancel Order"
              description="Are you sure you want to cancel this order?"
              onConfirm={() => {
                handleCancelOrder(selectedOrder._id);
                setIsDetailModalVisible(false);
              }}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ loading: cancellingOrder }}
            >
              <Button key="cancel" danger icon={<CloseCircleOutlined />}>
                Cancel Order
              </Button>
            </Popconfirm>
          ),
        ]}
        width={1000}
        className="modern-modal"
      >
        {selectedOrder && (
          <div>
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Avatar 
                  size={80} 
                  icon={<ShoppingCartOutlined />}
                  style={{ backgroundColor: '#1890ff' }}
                />
              </Col>
              <Col span={16}>
                <Title level={3} style={{ margin: 0 }}>
                  {selectedOrder.orderId}
                </Title>
                <Tag 
                  color={getStatusColor(selectedOrder.status)} 
                  icon={getStatusIcon(selectedOrder.status)}
                  style={{ marginTop: 8 }}
                >
                  {selectedOrder.status}
                </Tag>
                <Tag 
                  color={getPaymentStatusColor(selectedOrder.paymentStatus)}
                  icon={<CreditCardOutlined />}
                  style={{ marginTop: 8, marginLeft: 8 }}
                >
                  {selectedOrder.paymentStatus}
                </Tag>
              </Col>
            </Row>

            <Tabs defaultActiveKey="basic">
              <Tabs.TabPane tab="Order Info" key="basic">
                <Descriptions column={2} bordered>
                  <Descriptions.Item label="Order ID" span={2}>
                    {selectedOrder.orderId}
                  </Descriptions.Item>
                  <Descriptions.Item label="Customer Email">
                    {selectedOrder.userId?.email || 'No email'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Order Date">
                    {formatDate(selectedOrder.orderDate)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Total Amount">
                    {formatCurrency(selectedOrder.amount)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Payment Method">
                    {selectedOrder.paymentMethod}
                  </Descriptions.Item>
                  <Descriptions.Item label="Subtotal">
                    {formatCurrency(selectedOrder.subtotal)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tax Amount">
                    {formatCurrency(selectedOrder.tax_amount)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Shipping Cost">
                    {formatCurrency(selectedOrder.shipping_cost)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Discount Amount">
                    {formatCurrency(selectedOrder.discountAmount)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Notes" span={2}>
                    {selectedOrder.notes || 'No notes'}
                  </Descriptions.Item>
                </Descriptions>
              </Tabs.TabPane>

              <Tabs.TabPane tab="Products" key="products">
                {selectedOrder.products && selectedOrder.products.length > 0 ? (
                  <List
                    dataSource={selectedOrder.products}
                    renderItem={(product, index) => (
                      <List.Item>
                        <Card size="small" style={{ width: '100%' }}>
                          <Row gutter={16}>
                            <Col span={16}>
                              <Descriptions column={1} size="small">
                                <Descriptions.Item label="Product Name">
                                  {product.productName}
                                </Descriptions.Item>
                                <Descriptions.Item label="SKU">
                                  {product.sku}
                                </Descriptions.Item>
                                <Descriptions.Item label="Size">
                                  {product.size}
                                </Descriptions.Item>
                                <Descriptions.Item label="Color">
                                  {product.color}
                                </Descriptions.Item>
                                <Descriptions.Item label="Quantity">
                                  {product.quantity}
                                </Descriptions.Item>
                                <Descriptions.Item label="Price">
                                  {formatCurrency(product.price)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Shipping Status">
                                  <Tag color={product.shipping_status === 'pending' ? 'orange' : 'green'}>
                                    {product.shipping_status}
                                  </Tag>
                                </Descriptions.Item>
                              </Descriptions>
                            </Col>
                            <Col span={8}>
                              <div style={{ textAlign: 'right' }}>
                                <Text strong style={{ fontSize: '18px' }}>
                                  {formatCurrency(product.price * product.quantity)}
                                </Text>
                              </div>
                            </Col>
                          </Row>
                        </Card>
                      </List.Item>
                    )}
                  />
                ) : (
                  <Text type="secondary">No products in this order</Text>
                )}
              </Tabs.TabPane>

              <Tabs.TabPane tab="Shipping Address" key="address">
                {selectedOrder.shippingDetails?.address ? (
                  <Card size="small">
                    <Descriptions column={1} bordered>
                      <Descriptions.Item label="Street">
                        {selectedOrder.shippingDetails.address.street}
                      </Descriptions.Item>
                      <Descriptions.Item label="City">
                        {selectedOrder.shippingDetails.address.city}
                      </Descriptions.Item>
                      <Descriptions.Item label="State">
                        {selectedOrder.shippingDetails.address.state}
                      </Descriptions.Item>
                      <Descriptions.Item label="Pincode">
                        {selectedOrder.shippingDetails.address.pincode}
                      </Descriptions.Item>
                      <Descriptions.Item label="Country">
                        {selectedOrder.shippingDetails.address.country}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                ) : (
                  <Text type="secondary">No shipping address available</Text>
                )}
              </Tabs.TabPane>

              <Tabs.TabPane tab="Status Timeline" key="timeline">
                <List
                  dataSource={Object.entries(selectedOrder.statusTimestamps || {})}
                  renderItem={([status, timestamp]) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar icon={<ClockCircleOutlined />} />}
                        title={status.replace(/([A-Z])/g, ' $1').trim()}
                        description={formatDate(timestamp)}
                      />
                    </List.Item>
                  )}
                />
              </Tabs.TabPane>
            </Tabs>
          </div>
        )}
      </Modal>
    </OrdersPageWrap>
  );
};

export default OrdersPage;
