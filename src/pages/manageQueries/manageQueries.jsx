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
} from "antd";
import {
  MessageOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  MailOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { ManageQueriesWrap } from "./manageQueries.styles";
import ManageQueriesTable from "./manageQueriesTable";
import { getQueries } from "../../service/queriesService";

const { Title, Text } = Typography;

const ManageQueries = () => {
  const [stats, setStats] = useState({
    totalQueries: 0,
    completedQueries: 0,
    pendingQueries: 0,
    todayQueries: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getQueries();
      const queries = data || [];
      
      const completedQueries = queries.filter(query => query.status === 'completed').length;
      const pendingQueries = queries.filter(query => query.status !== 'completed').length;
      const todayQueries = queries.filter(query => {
        const today = new Date().toDateString();
        const queryDate = new Date(query.createdAt || query.createdDate).toDateString();
        return queryDate === today;
      }).length;

      setStats({
        totalQueries: queries.length,
        completedQueries,
        pendingQueries,
        todayQueries,
      });
    } catch (error) {
      console.error("Error fetching queries stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDataUpdate = () => {
    fetchStats();
  };

  return (
    <ManageQueriesWrap>
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>
            <MessageOutlined style={{ marginRight: 12, color: '#1890ff' }} />
            Customer Queries Management
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Manage and respond to customer inquiries and support requests
          </Text>
        </div>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />}
          onClick={fetchStats}
          loading={loading}
          style={{ borderRadius: 8 }}
        >
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Queries"
              value={stats.totalQueries}
              valueStyle={{ color: '#1890ff' }}
              prefix={<MessageOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Completed"
              value={stats.completedQueries}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Pending"
              value={stats.pendingQueries}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<ClockCircleOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Today's Queries"
              value={stats.todayQueries}
              valueStyle={{ color: '#722ed1' }}
              prefix={<UserOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      {/* Content Card */}
      <Card className="content-card">
        <div className="card-header">
          <div className="header-info">
            <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>
              <MailOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              Customer Queries
            </Title>
            <Text type="secondary">
              Manage all customer inquiries and support requests
            </Text>
          </div>
          <Badge 
            count={stats.totalQueries} 
            style={{ backgroundColor: '#1890ff' }}
            showZero
          />
        </div>
        <Divider style={{ margin: '16px 0' }} />
        <ManageQueriesTable onDataUpdate={handleDataUpdate} />
      </Card>
    </ManageQueriesWrap>
  );
};

export default ManageQueries;
