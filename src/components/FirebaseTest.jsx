import React, { useState } from 'react';
import { Card, Button, Upload, message, Image, Typography, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadImageToFirebase } from '../service/FirebaseService';

const { Title, Text } = Typography;

const FirebaseTest = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      message.error('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      console.log('🧪 Testing Firebase upload with file:', file);
      
      const url = await uploadImageToFirebase(file, 'test');
      console.log('🧪 Firebase test upload successful:', url);
      
      setUploadedUrl(url);
      message.success('Image uploaded successfully!');
    } catch (error) {
      console.error('🧪 Firebase test upload failed:', error);
      message.error('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = ({ file }) => {
    if (file.status === 'removed') {
      setFile(null);
      setUploadedUrl(null);
    } else {
      setFile(file.originFileObj);
    }
  };

  return (
    <Card title="Firebase Upload Test" style={{ margin: 16 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Text strong>Test Firebase image upload functionality:</Text>
        </div>
        
        <Upload
          beforeUpload={(file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
              message.error('You can only upload image files!');
              return false;
            }
            setFile(file);
            return false;
          }}
          onChange={handleFileChange}
          showUploadList={true}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />}>Select Image</Button>
        </Upload>

        {file && (
          <div>
            <Text>Selected file: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</Text>
            <br />
            <Button 
              type="primary" 
              onClick={handleUpload} 
              loading={uploading}
              style={{ marginTop: 8 }}
            >
              {uploading ? 'Uploading...' : 'Upload to Firebase'}
            </Button>
          </div>
        )}

        {uploadedUrl && (
          <div>
            <Text strong>Upload successful!</Text>
            <br />
            <Text type="secondary">URL: {uploadedUrl}</Text>
            <br />
            <Image
              src={uploadedUrl}
              alt="Uploaded image"
              style={{ maxWidth: 300, maxHeight: 200, marginTop: 8 }}
            />
          </div>
        )}
      </Space>
    </Card>
  );
};

export default FirebaseTest;
