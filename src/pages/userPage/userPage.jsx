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
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  FilterOutlined,
  ExportOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ShoppingOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  FireOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import { UserPageWrap } from "./userPage.Styles";
import ManageUserCards from "../../components/ManageUsers/Cards/manageUserCards";
import ManageUserMap from "../../components/ManageUsers/Map/manageUserMap";
import ManageuserTable from "../../components/ManageUsers/Table/manageUserTable";
import ManageUserPieChart from "../../components/ManageUsers/pieCharts/manageuserPieChart";
import { getAllUsers, TotalUsers, newUsersThisMonth, mostActiveState, getDataByStates } from "../../service/userPageApi";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    newThisMonth: 0,
    mostActiveState: '',
    activeUsers: 0,
    designers: 0,
    admins: 0,
    regularUsers: 0,
  });
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchText, roleFilter]);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [usersData, totalData, newUsersData, activeStateData] = await Promise.all([
        getAllUsers(),
        TotalUsers(),
        newUsersThisMonth(),
        mostActiveState(),
      ]);

      const usersList = usersData.users || [];
      setUsers(usersList);

      // Calculate statistics
      const designers = usersList.filter(user => user.role === 'Designer').length;
      const admins = usersList.filter(user => user.role === 'Admin').length;
      const regularUsers = usersList.filter(user => user.role === 'User').length;
      const activeUsers = usersList.filter(user => {
        const lastLogin = new Date(user.last_logged_in);
        const now = new Date();
        const daysDiff = (now - lastLogin) / (1000 * 60 * 60 * 24);
        return daysDiff <= 30; // Active in last 30 days
      }).length;

      setStats({
        total: totalData.totalUsers || usersList.length,
        newThisMonth: newUsersData.newUsers || 0,
        mostActiveState: activeStateData.mostActiveState || 'N/A',
        activeUsers,
        designers,
        admins,
        regularUsers,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(user => 
        user.displayName?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.phoneNumber?.includes(searchText)
      );
    }

    // Filter by role
    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const showUserDetail = (user) => {
    setSelectedUser(user);
    setIsDetailModalVisible(true);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'red';
      case 'Designer':
        return 'blue';
      case 'User':
        return 'green';
      default:
        return 'default';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin':
        return <CrownOutlined />;
      case 'Designer':
        return <TeamOutlined />;
      case 'User':
        return <UserOutlined />;
      default:
        return <UserOutlined />;
    }
  };

  const getActivityStatus = (lastLogin) => {
    const lastLoginDate = new Date(lastLogin);
    const now = new Date();
    const daysDiff = (now - lastLoginDate) / (1000 * 60 * 60 * 24);
    
    if (daysDiff <= 1) return { status: 'active', color: 'green', text: 'Very Active' };
    if (daysDiff <= 7) return { status: 'active', color: 'blue', text: 'Active' };
    if (daysDiff <= 30) return { status: 'moderate', color: 'orange', text: 'Moderate' };
    return { status: 'inactive', color: 'red', text: 'Inactive' };
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

  const userColumns = [
    {
      title: "User Info",
      key: "userInfo",
      render: (_, record) => (
        <Space>
          <Avatar 
            size={48} 
            icon={<UserOutlined />}
            style={{ backgroundColor: '#1890ff' }}
          />
          <div>
            <div style={{ fontWeight: 500, fontSize: '16px', color: '#1a1a1a' }}>
              {record.displayName || 'Anonymous'}
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
      title: "Contact",
      key: "contact",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text strong>{record.phoneNumber || 'No phone'}</Text>
          {record.address && record.address.length > 0 && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              <EnvironmentOutlined style={{ marginRight: 4 }} />
              {record.address[0].city}, {record.address[0].state}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Role & Status",
      key: "roleStatus",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Tag 
            color={getRoleColor(record.role)} 
            icon={getRoleIcon(record.role)}
            style={{ margin: 0 }}
          >
            {record.role}
          </Tag>
          <Tag 
            color={getActivityStatus(record.last_logged_in).color}
            icon={<ClockCircleOutlined />}
            size="small"
          >
            {getActivityStatus(record.last_logged_in).text}
          </Tag>
        </Space>
      ),
      filters: [
        { text: "All", value: "all" },
        { text: "Admin", value: "Admin" },
        { text: "Designer", value: "Designer" },
        { text: "User", value: "User" },
      ],
      onFilter: (value, record) => {
        if (value === "all") return true;
        return record.role === value;
      },
    },
    {
      title: "Activity",
      key: "activity",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong>Products Viewed:</Text>
            <Text style={{ marginLeft: 8, color: '#1890ff' }}>
              {record.recentlyViewedProducts?.length || 0}
            </Text>
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Last Login: {formatDate(record.last_logged_in)}
            </Text>
          </div>
        </Space>
      ),
      sorter: (a, b) => (a.recentlyViewedProducts?.length || 0) - (b.recentlyViewedProducts?.length || 0),
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
              onClick={() => showUserDetail(record)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <UserPageWrap>
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <Spin size="large" />
          <Text style={{ display: 'block', marginTop: 16 }}>Loading user data...</Text>
        </div>
      </UserPageWrap>
    );
  }

  return (
    <UserPageWrap>
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>
            <UserOutlined style={{ marginRight: 12, color: '#1890ff' }} />
            User Management
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Manage user accounts, track activity, and analyze user behavior
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
            icon={<PlusOutlined />}
            style={{ marginRight: 8 }}
          >
            Add User
          </Button>
          <Button 
            icon={<ReloadOutlined />}
            onClick={fetchUserData}
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
              title="Total Users"
              value={stats.total}
              valueStyle={{ color: '#1890ff' }}
              prefix={<UserOutlined />}
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
              <Text type="secondary">All registered users</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Active Users"
              value={stats.activeUsers}
              valueStyle={{ color: '#52c41a' }}
              prefix={<FireOutlined />}
              suffix={
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  ({Math.round((stats.activeUsers / stats.total) * 100)}%)
                </Text>
              }
            />
            <div className="stat-description">
              <Text type="secondary">Active in last 30 days</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="New This Month"
              value={stats.newThisMonth}
              valueStyle={{ color: '#722ed1' }}
              prefix={<PlusOutlined />}
              suffix={
                <Text type="success" style={{ fontSize: '12px' }}>
                  +{Math.round((stats.newThisMonth / stats.total) * 100)}%
                </Text>
              }
            />
            <div className="stat-description">
              <Text type="secondary">New registrations</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Most Active State"
              value={stats.mostActiveState}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<EnvironmentOutlined />}
            />
            <div className="stat-description">
              <Text type="secondary">Highest user concentration</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* User Distribution and Analytics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <PieChartOutlined style={{ color: '#1890ff' }} />
                <span>User Distribution</span>
              </Space>
            }
            className="metric-card"
          >
            <div className="user-distribution">
              <div className="distribution-item">
                <div className="distribution-header">
                  <Text strong>Regular Users</Text>
                  <Text type="secondary">({stats.regularUsers})</Text>
                </div>
                <Progress 
                  percent={Math.round((stats.regularUsers / stats.total) * 100)} 
                  strokeColor="#52c41a"
                  size="small"
                />
              </div>
              <Divider />
              <div className="distribution-item">
                <div className="distribution-header">
                  <Text strong>Designers</Text>
                  <Text type="secondary">({stats.designers})</Text>
                </div>
                <Progress 
                  percent={Math.round((stats.designers / stats.total) * 100)} 
                  strokeColor="#1890ff"
                  size="small"
                />
              </div>
              <Divider />
              <div className="distribution-item">
                <div className="distribution-header">
                  <Text strong>Admins</Text>
                  <Text type="secondary">({stats.admins})</Text>
                </div>
                <Progress 
                  percent={Math.round((stats.admins / stats.total) * 100)} 
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
                <span>User Activity</span>
              </Space>
            }
            className="metric-card"
          >
            <div className="activity-metrics">
              <div className="activity-item">
                <div className="activity-header">
                  <Text strong>High Activity Users</Text>
                  <Text type="secondary">(10+ products viewed)</Text>
                </div>
                <div className="activity-value">
                  <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                    {users.filter(user => (user.recentlyViewedProducts?.length || 0) > 10).length}
                  </Text>
                </div>
              </div>
              <Divider />
              <div className="activity-item">
                <div className="activity-header">
                  <Text strong>Recent Registrations</Text>
                  <Text type="secondary">(Last 7 days)</Text>
                </div>
                <div className="activity-value">
                  <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
                    {users.filter(user => {
                      const created = new Date(user.createdTime);
                      const now = new Date();
                      const daysDiff = (now - created) / (1000 * 60 * 60 * 24);
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
                View All Users ({stats.total})
              </Button>
              <Button 
                icon={<TeamOutlined />}
                block
                size="large"
                style={{ marginBottom: 12 }}
              >
                Manage Active Users
              </Button>
              <Button 
                icon={<ExclamationCircleOutlined />}
                danger
                block
                size="large"
              >
                Remove Inactive Users
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
              placeholder="Search users by name, email, or phone..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<UserOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filter by role"
              value={roleFilter}
              onChange={setRoleFilter}
              style={{ width: '100%' }}
              prefix={<FilterOutlined />}
            >
              <Option value="all">All Roles</Option>
              <Option value="User">Regular Users</Option>
              <Option value="Designer">Designers</Option>
              <Option value="Admin">Admins</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Text type="secondary">
              Showing {filteredUsers.length} of {users.length} users
            </Text>
          </Col>
        </Row>
      </Card>

      {/* User Table */}
      <Card 
        title={
          <Space>
            <UserOutlined style={{ color: '#1890ff' }} />
            <span>User Management</span>
          </Space>
        }
        className="table-card"
      >
        <Table
          columns={userColumns}
          dataSource={filteredUsers}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`
          }}
          className="modern-table"
        />
      </Card>

      {/* User Detail Modal */}
      <Modal
        title={
          <Space>
            <UserOutlined style={{ color: '#1890ff' }} />
            <span>User Details</span>
          </Space>
        }
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Close
          </Button>,
          <Button key="edit" type="primary" icon={<TeamOutlined />}>
            Edit User
          </Button>,
        ]}
        width={800}
        className="modern-modal"
      >
        {selectedUser && (
          <div>
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Avatar 
                  size={80} 
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#1890ff' }}
                />
              </Col>
              <Col span={16}>
                <Title level={3} style={{ margin: 0 }}>
                  {selectedUser.displayName || 'Anonymous'}
                </Title>
                <Tag 
                  color={getRoleColor(selectedUser.role)} 
                  icon={getRoleIcon(selectedUser.role)}
                  style={{ marginTop: 8 }}
                >
                  {selectedUser.role}
                </Tag>
                <Tag 
                  color={getActivityStatus(selectedUser.last_logged_in).color}
                  icon={<ClockCircleOutlined />}
                  style={{ marginTop: 8, marginLeft: 8 }}
                >
                  {getActivityStatus(selectedUser.last_logged_in).text}
                </Tag>
              </Col>
            </Row>

            <Tabs defaultActiveKey="basic">
              <Tabs.TabPane tab="Basic Info" key="basic">
                <Descriptions column={2} bordered>
                  <Descriptions.Item label="Email" span={2}>
                    {selectedUser.email || 'No email'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    {selectedUser.phoneNumber || 'No phone'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Registration Date">
                    {formatDate(selectedUser.createdTime)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Last Login">
                    {formatDate(selectedUser.last_logged_in)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Products Viewed">
                    {selectedUser.recentlyViewedProducts?.length || 0}
                  </Descriptions.Item>
                </Descriptions>
              </Tabs.TabPane>

              <Tabs.TabPane tab="Address" key="address">
                {selectedUser.address && selectedUser.address.length > 0 ? (
                  <List
                    dataSource={selectedUser.address}
                    renderItem={(address, index) => (
                      <List.Item>
                        <Card size="small" style={{ width: '100%' }}>
                          <Descriptions column={1} size="small">
                            <Descriptions.Item label="Nickname">
                              {address.nick_name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Address">
                              {address.street_details}
                            </Descriptions.Item>
                            <Descriptions.Item label="City">
                              {address.city}
                            </Descriptions.Item>
                            <Descriptions.Item label="State">
                              {address.state}
                            </Descriptions.Item>
                            <Descriptions.Item label="Pincode">
                              {address.pincode}
                            </Descriptions.Item>
                          </Descriptions>
                        </Card>
                      </List.Item>
                    )}
                  />
                ) : (
                  <Text type="secondary">No address information available</Text>
                )}
              </Tabs.TabPane>

              <Tabs.TabPane tab="Recent Activity" key="activity">
                {selectedUser.recentlyViewedProducts && selectedUser.recentlyViewedProducts.length > 0 ? (
                  <List
                    dataSource={selectedUser.recentlyViewedProducts.slice(0, 10)}
                    renderItem={(product, index) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar icon={<ShoppingOutlined />} />}
                          title={`Product ID: ${product.productId}`}
                          description={`Viewed on: ${formatDate(product.viewedAt)}`}
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Text type="secondary">No recent product views</Text>
                )}
              </Tabs.TabPane>
            </Tabs>
          </div>
        )}
      </Modal>
    </UserPageWrap>
  );
};

export default UserPage;
