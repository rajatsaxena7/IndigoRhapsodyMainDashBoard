import React from 'react';
import { Card, Typography, Space, Tag } from 'antd';
import { API_BASE_URL, DEBUG } from '../config/environment';

const { Title, Text } = Typography;

const EnvironmentTest = () => {
  return (
    <Card title="Environment Configuration Test" style={{ margin: 16 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={4}>Current Environment Settings:</Title>
          <Space direction="vertical">
            <div>
              <Text strong>API Base URL: </Text>
              <Tag color="blue">{API_BASE_URL}</Tag>
            </div>
            <div>
              <Text strong>Debug Mode: </Text>
              <Tag color={DEBUG ? "green" : "red"}>{DEBUG ? "Enabled" : "Disabled"}</Tag>
            </div>
          </Space>
        </div>
        
        <div>
          <Title level={4}>Environment Variables:</Title>
          <Space direction="vertical">
            <div>
              <Text strong>VITE_CURRENT_ENV: </Text>
              <Tag>{import.meta.env.VITE_CURRENT_ENV || "Not set"}</Tag>
            </div>
            <div>
              <Text strong>VITE_API_BASE_URL_PRODUCTION: </Text>
              <Tag>{import.meta.env.VITE_API_BASE_URL_PRODUCTION || "Not set"}</Tag>
            </div>
            <div>
              <Text strong>VITE_API_BASE_URL_TESTING: </Text>
              <Tag>{import.meta.env.VITE_API_BASE_URL_TESTING || "Not set"}</Tag>
            </div>
          </Space>
        </div>
      </Space>
    </Card>
  );
};

export default EnvironmentTest;
