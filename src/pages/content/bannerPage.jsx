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
  PictureOutlined,
  FileTextOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { BannerContentWrap } from "./bannerPage.styles";
import BannerTable from "../../components/content/BannerTable";
import BlogsTable from "../../components/content/BlogsTable";
import { GetBanners } from "../../service/bannerApi";
import { getBlogs } from "../../service/blogsService";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ContentManagement = () => {
  const [stats, setStats] = useState({
    totalBanners: 0,
    totalBlogs: 0,
    activeBanners: 0,
    publishedBlogs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [bannersData, blogsData] = await Promise.all([
        GetBanners(),
        getBlogs(),
      ]);

      const banners = bannersData.banners || [];
      const blogs = blogsData || [];
      const activeBanners = banners.filter(banner => banner.isActive !== false).length;
      const publishedBlogs = blogs.filter(blog => blog.status === 'published').length;

      setStats({
        totalBanners: banners.length,
        totalBlogs: blogs.length,
        activeBanners,
        publishedBlogs,
      });
    } catch (error) {
      console.error("Error fetching content stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDataUpdate = () => {
    fetchStats();
  };

  return (
    <BannerContentWrap>
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>
            <PictureOutlined style={{ marginRight: 12, color: '#1890ff' }} />
            Content Management
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Manage banners, blogs, and other content assets
          </Text>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Banners"
              value={stats.totalBanners}
              valueStyle={{ color: '#1890ff' }}
              prefix={<PictureOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Active Banners"
              value={stats.activeBanners}
              valueStyle={{ color: '#52c41a' }}
              prefix={<UploadOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Blogs"
              value={stats.totalBlogs}
              valueStyle={{ color: '#722ed1' }}
              prefix={<FileTextOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Published Blogs"
              value={stats.publishedBlogs}
              valueStyle={{ color: '#52c41a' }}
              prefix={<EditOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      {/* Content Tabs */}
      <Card className="content-card">
        <Tabs defaultActiveKey="banners" size="large">
          <TabPane
            tab={
              <Space>
                <PictureOutlined />
                <span>Banners</span>
                <Badge count={stats.totalBanners} style={{ backgroundColor: '#1890ff' }} />
              </Space>
            }
            key="banners"
          >
            <BannerTable onDataUpdate={handleDataUpdate} />
          </TabPane>
          <TabPane
            tab={
              <Space>
                <FileTextOutlined />
                <span>Blogs</span>
                <Badge count={stats.totalBlogs} style={{ backgroundColor: '#722ed1' }} />
              </Space>
            }
            key="blogs"
          >
            <BlogsTable onDataUpdate={handleDataUpdate} />
          </TabPane>
        </Tabs>
      </Card>
    </BannerContentWrap>
  );
};

export default ContentManagement;
