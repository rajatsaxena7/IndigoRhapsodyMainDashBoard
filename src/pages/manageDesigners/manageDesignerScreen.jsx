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
} from "antd";
import {
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  FilterOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { ManageDesignerWrap } from "./manageDesignerScreen.styles";
import ManageDesignerCard from "../../components/ManageDesigners/manageDesignerCard";
import ManageDesignerTable from "../../components/ManageDesigners/table/manageDesignerTable";
import {
  Pending_account,
  Approved_count,
  Total_count,
} from "../../service/designerApi";

const { Title, Text } = Typography;

const ManageDesignerScreen = () => {
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDesignerStats();
  }, []);

  const fetchDesignerStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const [pendingData, approvedData, totalData] = await Promise.all([
        Pending_account(),
        Approved_count(),
        Total_count(),
      ]);

      setStats({
        total: totalData.totalDesigners || 0,
        approved: approvedData.approvedCount || 0,
        pending: pendingData.pendingCount || 0,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDataUpdate = () => {
    fetchDesignerStats();
  };

  if (loading) {
    return (
      <ManageDesignerWrap>
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <Spin size="large" />
          <Text style={{ display: 'block', marginTop: 16 }}>Loading designer data...</Text>
        </div>
      </ManageDesignerWrap>
    );
  }

  return (
    <ManageDesignerWrap>
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>
            <TeamOutlined style={{ marginRight: 12, color: '#1890ff' }} />
            Designer Management
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Manage designer accounts, approvals, and performance
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
            Add Designer
          </Button>
          <Button 
            icon={<ReloadOutlined />}
            onClick={fetchDesignerStats}
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
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Statistic
              title="Total Designers"
              value={stats.total}
              valueStyle={{ color: '#1890ff' }}
              prefix={<TeamOutlined />}
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
              <Text type="secondary">All registered designers</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Statistic
              title="Approved Designers"
              value={stats.approved}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
              suffix={
                <Badge 
                  count={stats.approved} 
                  style={{ 
                    backgroundColor: '#52c41a',
                    marginLeft: 8 
                  }} 
                />
              }
            />
            <div className="stat-description">
              <Text type="secondary">Actively working designers</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Statistic
              title="Pending Approvals"
              value={stats.pending}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<ClockCircleOutlined />}
              suffix={
                <Badge 
                  count={stats.pending} 
                  style={{ 
                    backgroundColor: '#fa8c16',
                    marginLeft: 8 
                  }} 
                />
              }
            />
            <div className="stat-description">
              <Text type="secondary">Awaiting approval</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Approval Rate and Performance Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                <span>Approval Rate</span>
              </Space>
            }
            className="metric-card"
          >
            <div className="approval-metrics">
              <div className="approval-rate">
                <Text style={{ fontSize: '36px', fontWeight: 'bold', color: '#52c41a' }}>
                  {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
                </Text>
                <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                  of designers approved
                </Text>
              </div>
              <Divider />
              <div className="approval-breakdown">
                <div className="breakdown-item">
                  <Text strong>Approved:</Text>
                  <Text style={{ color: '#52c41a', marginLeft: 8 }}>
                    {stats.approved} designers
                  </Text>
                </div>
                <div className="breakdown-item">
                  <Text strong>Pending:</Text>
                  <Text style={{ color: '#fa8c16', marginLeft: 8 }}>
                    {stats.pending} designers
                  </Text>
                </div>
                <div className="breakdown-item">
                  <Text strong>Rejected:</Text>
                  <Text style={{ color: '#ff4d4f', marginLeft: 8 }}>
                    {stats.total - stats.approved - stats.pending} designers
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
                <UserOutlined style={{ color: '#1890ff' }} />
                <span>Designer Activity</span>
              </Space>
            }
            className="metric-card"
          >
            <div className="activity-metrics">
              <div className="activity-item">
                <div className="activity-header">
                  <Text strong>Active This Week</Text>
                  <Text type="secondary">vs last week</Text>
                </div>
                <div className="activity-value">
                  <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                    {Math.floor(stats.approved * 0.75)}
                  </Text>
                  <Text type="success" style={{ marginLeft: 8 }}>
                    +12%
                  </Text>
                </div>
              </div>
              <Divider />
              <div className="activity-item">
                <div className="activity-header">
                  <Text strong>New Applications</Text>
                  <Text type="secondary">this month</Text>
                </div>
                <div className="activity-value">
                  <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
                    {Math.floor(stats.pending * 1.2)}
                  </Text>
                  <Text type="success" style={{ marginLeft: 8 }}>
                    +8%
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
                <EyeOutlined style={{ color: '#722ed1' }} />
                <span>Quick Actions</span>
              </Space>
            }
            className="metric-card"
          >
            <div className="quick-actions">
              <Button 
                type="primary" 
                icon={<CheckCircleOutlined />}
                block
                size="large"
                style={{ marginBottom: 12 }}
              >
                Review Pending ({stats.pending})
              </Button>
              <Button 
                icon={<EditOutlined />}
                block
                size="large"
                style={{ marginBottom: 12 }}
              >
                Manage Approved
              </Button>
              <Button 
                icon={<DeleteOutlined />}
                danger
                block
                size="large"
              >
                Remove Inactive
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Designer Management Section */}
      <Card 
        title={
          <Space>
            <TeamOutlined style={{ color: '#1890ff' }} />
            <span>Designer Management</span>
          </Space>
        }
        className="management-card"
        extra={
          <Space>
            <Button size="small">All</Button>
            <Button size="small" type="primary">Approved</Button>
            <Button size="small">Pending</Button>
          </Space>
        }
      >
        <ManageDesignerTable onDataUpdate={handleDataUpdate} />
      </Card>
    </ManageDesignerWrap>
  );
};

export default ManageDesignerScreen;
