import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Space,
  Button,
  Tabs,
  Badge,
  Divider,
} from "antd";
import {
  FolderOutlined,
  TagsOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { ManageCategoriesWrap } from "./manageCategories.styles";
import CategoryTable from "../../components/manageCategories/category/categoryTable";
import SubCategoryTable from "../../components/manageCategories/subCategory/subcategoryTable";
import { GetCategories, GetSubCategories } from "../../service/categoryApi";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

function ManageCategories() {
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalSubCategories: 0,
    approvedSubCategories: 0,
    pendingSubCategories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [categoriesData, subCategoriesData] = await Promise.all([
        GetCategories(),
        GetSubCategories(),
      ]);

      const categories = categoriesData.categories || [];
      const subCategories = subCategoriesData.subCategories || [];
      const approvedSubCategories = subCategories.filter(sub => sub.isApproved).length;
      const pendingSubCategories = subCategories.filter(sub => !sub.isApproved).length;

      setStats({
        totalCategories: categories.length,
        totalSubCategories: subCategories.length,
        approvedSubCategories,
        pendingSubCategories,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDataUpdate = () => {
    fetchStats();
  };

  return (
    <ManageCategoriesWrap>
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>
            <FolderOutlined style={{ marginRight: 12, color: '#1890ff' }} />
            Category Management
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Manage product categories and subcategories
          </Text>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Categories"
              value={stats.totalCategories}
              valueStyle={{ color: '#1890ff' }}
              prefix={<FolderOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Subcategories"
              value={stats.totalSubCategories}
              valueStyle={{ color: '#52c41a' }}
              prefix={<TagsOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Approved Subcategories"
              value={stats.approvedSubCategories}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Pending Subcategories"
              value={stats.pendingSubCategories}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<ClockCircleOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      {/* Content Tabs */}
      <Card className="content-card">
        <Tabs defaultActiveKey="categories" size="large">
          <TabPane
            tab={
              <Space>
                <FolderOutlined />
                <span>Categories</span>
                <Badge count={stats.totalCategories} style={{ backgroundColor: '#1890ff' }} />
              </Space>
            }
            key="categories"
          >
            <CategoryTable onDataUpdate={handleDataUpdate} />
          </TabPane>
          <TabPane
            tab={
              <Space>
                <TagsOutlined />
                <span>Subcategories</span>
                <Badge count={stats.totalSubCategories} style={{ backgroundColor: '#52c41a' }} />
              </Space>
            }
            key="subcategories"
          >
            <SubCategoryTable onDataUpdate={handleDataUpdate} />
          </TabPane>
        </Tabs>
      </Card>
    </ManageCategoriesWrap>
  );
}

export default ManageCategories;
