import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Space,
  Button,
  Progress,
  Avatar,
  List,
  Tag,
  Divider,
  Spin,
  Alert,
} from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  DollarOutlined,
  ShoppingOutlined,
  ArrowUpOutlined,
  EyeOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { DashboardScreenWrap } from "./DashboardScreen.Styles";
import DashBoardGraph from "../../components/dashBoard/DashBoardGraph";
import {
  TotalOrders,
  TotalDesigners,
  TotalProducts,
  TotalUsers,
  TotalSales,
} from "../../service/DashboardApi";

const { Title, Text } = Typography;

const DashboardScreen = () => {
  const [stats, setStats] = useState({
    orders: 0,
    designers: 0,
    products: 0,
    users: 0,
    sales: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [ordersData, designersData, productsData, usersData, salesData] = await Promise.all([
        TotalOrders(),
        TotalDesigners(),
        TotalProducts(),
        TotalUsers(),
        TotalSales(),
      ]);

      setStats({
        orders: ordersData.totalOrders || 0,
        designers: designersData.totalDesigners || 0,
        products: productsData.totalProducts || 0,
        users: usersData.totalUsers || 0,
        sales: salesData.totalSales || 0,
      });

      // Mock recent activity data
      setRecentActivity([
        {
          id: 1,
          type: 'order',
          title: 'New order received',
          description: 'Order #12345 from John Doe',
          time: '2 minutes ago',
          status: 'pending',
        },
        {
          id: 2,
          type: 'designer',
          title: 'Designer approved',
          description: 'Sarah Johnson approved as designer',
          time: '15 minutes ago',
          status: 'completed',
        },
        {
          id: 3,
          type: 'product',
          title: 'New product added',
          description: 'Product "Elegant Dress" added to catalog',
          time: '1 hour ago',
          status: 'completed',
        },
        {
          id: 4,
          type: 'user',
          title: 'New user registered',
          description: 'New customer registration',
          time: '2 hours ago',
          status: 'pending',
        },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShoppingCartOutlined style={{ color: '#1890ff' }} />;
      case 'designer':
        return <UserOutlined style={{ color: '#52c41a' }} />;
      case 'product':
        return <ShoppingOutlined style={{ color: '#722ed1' }} />;
      case 'user':
        return <UserOutlined style={{ color: '#fa8c16' }} />;
      default:
        return <ExclamationCircleOutlined style={{ color: '#666' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'pending':
        return 'orange';
      case 'failed':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined />;
      case 'pending':
        return <ClockCircleOutlined />;
      case 'failed':
        return <ExclamationCircleOutlined />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  if (loading) {
    return (
      <DashboardScreenWrap>
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <Spin size="large" />
          <Text style={{ display: 'block', marginTop: 16 }}>Loading dashboard...</Text>
        </div>
      </DashboardScreenWrap>
    );
  }

  return (
    <DashboardScreenWrap>
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>
            <BarChartOutlined style={{ marginRight: 12, color: '#1890ff' }} />
            Dashboard Overview
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Welcome back! Here's what's happening with your business today.
          </Text>
        </div>
        <div className="header-actions">
          <Button 
            type="primary" 
            icon={<ReloadOutlined />}
            onClick={fetchDashboardData}
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
              value={stats.orders}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ShoppingCartOutlined />}
                             suffix={
                 <Text type="secondary" style={{ fontSize: '12px' }}>
                   <ArrowUpOutlined style={{ marginRight: 4 }} />
                   +12%
                 </Text>
               }
            />
            <Progress 
              percent={75} 
              size="small" 
              strokeColor="#1890ff"
              showInfo={false}
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Sales"
              value={stats.sales}
              valueStyle={{ color: '#52c41a' }}
              prefix={<DollarOutlined />}
                             suffix={
                 <Text type="secondary" style={{ fontSize: '12px' }}>
                   <ArrowUpOutlined style={{ marginRight: 4 }} />
                   +8%
                 </Text>
               }
            />
            <Progress 
              percent={68} 
              size="small" 
              strokeColor="#52c41a"
              showInfo={false}
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Products"
              value={stats.products}
              valueStyle={{ color: '#722ed1' }}
              prefix={<ShoppingOutlined />}
                             suffix={
                 <Text type="secondary" style={{ fontSize: '12px' }}>
                   <ArrowUpOutlined style={{ marginRight: 4 }} />
                   +15%
                 </Text>
               }
            />
            <Progress 
              percent={82} 
              size="small" 
              strokeColor="#722ed1"
              showInfo={false}
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Users"
              value={stats.users}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<UserOutlined />}
                             suffix={
                 <Text type="secondary" style={{ fontSize: '12px' }}>
                   <ArrowUpOutlined style={{ marginRight: 4 }} />
                   +5%
                 </Text>
               }
            />
            <Progress 
              percent={45} 
              size="small" 
              strokeColor="#fa8c16"
              showInfo={false}
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts and Analytics Section */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <LineChartOutlined style={{ color: '#1890ff' }} />
                <span>Sales Analytics</span>
              </Space>
            }
            className="chart-card"
            extra={
              <Space>
                <Button size="small">Daily</Button>
                <Button size="small" type="primary">Weekly</Button>
                <Button size="small">Monthly</Button>
              </Space>
            }
          >
            <DashBoardGraph />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <PieChartOutlined style={{ color: '#52c41a' }} />
                <span>Quick Stats</span>
              </Space>
            }
            className="stats-card"
          >
            <div className="quick-stats">
              <div className="stat-item">
                <div className="stat-label">Conversion Rate</div>
                <div className="stat-value">3.2%</div>
                <Progress percent={32} size="small" strokeColor="#52c41a" />
              </div>
              <Divider />
              <div className="stat-item">
                <div className="stat-label">Average Order Value</div>
                <div className="stat-value">₹2,450</div>
                <Progress percent={78} size="small" strokeColor="#1890ff" />
              </div>
              <Divider />
              <div className="stat-item">
                <div className="stat-label">Customer Satisfaction</div>
                <div className="stat-value">4.8/5</div>
                <Progress percent={96} size="small" strokeColor="#722ed1" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity Section */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <ClockCircleOutlined style={{ color: '#fa8c16' }} />
                <span>Recent Activity</span>
              </Space>
            }
            className="activity-card"
            extra={
              <Button type="link" size="small">
                View All
              </Button>
            }
          >
            <List
              dataSource={recentActivity}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={getActivityIcon(item.type)}
                        style={{ backgroundColor: '#f0f0f0' }}
                      />
                    }
                    title={
                      <Space>
                        <Text strong>{item.title}</Text>
                        <Tag 
                          color={getStatusColor(item.status)}
                          icon={getStatusIcon(item.status)}
                          size="small"
                        >
                          {item.status}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="small">
                        <Text type="secondary">{item.description}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          <CalendarOutlined style={{ marginRight: 4 }} />
                          {item.time}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <EyeOutlined style={{ color: '#1890ff' }} />
                <span>Performance Overview</span>
              </Space>
            }
            className="performance-card"
          >
            <div className="performance-metrics">
              <div className="metric-item">
                <div className="metric-header">
                  <Text strong>Orders Today</Text>
                  <Text type="secondary">vs yesterday</Text>
                </div>
                <div className="metric-value">
                  <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                    {Math.floor(stats.orders * 0.15)}
                  </Text>
                  <Text type="success" style={{ marginLeft: 8 }}>
                    +12%
                  </Text>
                </div>
              </div>
              <Divider />
              <div className="metric-item">
                <div className="metric-header">
                  <Text strong>Revenue Today</Text>
                  <Text type="secondary">vs yesterday</Text>
                </div>
                <div className="metric-value">
                  <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                    ₹{Math.floor(stats.sales * 0.08)}
                  </Text>
                  <Text type="success" style={{ marginLeft: 8 }}>
                    +8%
                  </Text>
                </div>
              </div>
              <Divider />
              <div className="metric-item">
                <div className="metric-header">
                  <Text strong>Active Users</Text>
                  <Text type="secondary">currently online</Text>
                </div>
                <div className="metric-value">
                  <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
                    {Math.floor(stats.users * 0.25)}
                  </Text>
                  <Text type="success" style={{ marginLeft: 8 }}>
                    +5%
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </DashboardScreenWrap>
  );
};

export default DashboardScreen;
