import React from "react";
import { Modal, Button, Tag, Avatar, Divider, Row, Col, Typography, Space } from "antd";
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined, 
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseOutlined
} from "@ant-design/icons";
import styled from "styled-components";

const { Title, Text, Paragraph } = Typography;

const DesignerDetailModal = ({ 
  visible, 
  onClose, 
  designer, 
  loading = false 
}) => {
  if (!designer) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (isApproved) => {
    return isApproved ? 'success' : 'warning';
  };

  const getStatusIcon = (isApproved) => {
    return isApproved ? <CheckCircleOutlined /> : <ClockCircleOutlined />;
  };

  // Helper function to safely get address information
  const getAddressInfo = (addressObj) => {
    if (!addressObj) return 'Not provided';
    
    // If address is a string, return it directly
    if (typeof addressObj === 'string') return addressObj;
    
    // If address is an object, format it properly
    if (typeof addressObj === 'object') {
      const parts = [];
      if (addressObj.street_details) parts.push(addressObj.street_details);
      if (addressObj.city) parts.push(addressObj.city);
      if (addressObj.state) parts.push(addressObj.state);
      if (addressObj.pincode) parts.push(addressObj.pincode);
      
      return parts.length > 0 ? parts.join(', ') : 'Not provided';
    }
    
    return 'Not provided';
  };

  // Helper function to safely get field value
  const getFieldValue = (value) => {
    if (value === null || value === undefined) return 'Not provided';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  return (
    <StyledModal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      closeIcon={<CloseOutlined style={{ fontSize: '18px' }} />}
      destroyOnClose
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <LoadingSpinner />
          <Text>Loading designer details...</Text>
        </div>
      ) : (
        <ModalContent>
          {/* Header Section */}
          <HeaderSection>
            <Row gutter={[24, 16]} align="middle">
              <Col xs={24} sm={8}>
                <AvatarContainer>
                  <StyledAvatar 
                    size={120} 
                    src={designer.logoUrl}
                    icon={<UserOutlined />}
                  />
                  <StatusBadge>
                    <Tag 
                      color={getStatusColor(designer.is_approved)}
                      icon={getStatusIcon(designer.is_approved)}
                    >
                      {designer.is_approved ? 'Approved' : 'Pending'}
                    </Tag>
                  </StatusBadge>
                </AvatarContainer>
              </Col>
              <Col xs={24} sm={16}>
                <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>
                  {designer.userId.displayName}
                </Title>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <InfoItem>
                    <MailOutlined style={{ color: '#667eea' }} />
                    <Text strong>{designer.userId.email}</Text>
                  </InfoItem>
                                     <InfoItem>
                     <PhoneOutlined style={{ color: '#667eea' }} />
                     <Text>{getFieldValue(designer.userId.phoneNumber)}</Text>
                   </InfoItem>
                  <InfoItem>
                    <CalendarOutlined style={{ color: '#667eea' }} />
                    <Text>Joined {formatDate(designer.createdTime)}</Text>
                  </InfoItem>
                </Space>
              </Col>
            </Row>
          </HeaderSection>

          <Divider />

                                {/* Location Section */}
           <Section>
             <SectionTitle>
               <EnvironmentOutlined style={{ color: '#667eea', marginRight: '8px' }} />
               Location Information
             </SectionTitle>
             <Row gutter={[16, 16]}>
               <Col xs={24} sm={12}>
                 <InfoCard>
                   <Text type="secondary">Address</Text>
                   <Text strong>{getAddressInfo(designer.userId.address)}</Text>
                 </InfoCard>
               </Col>
               <Col xs={24} sm={6}>
                 <InfoCard>
                   <Text type="secondary">City</Text>
                   <Text strong>{getFieldValue(designer.userId.city)}</Text>
                 </InfoCard>
               </Col>
               <Col xs={24} sm={6}>
                 <InfoCard>
                   <Text type="secondary">State</Text>
                   <Text strong>{getFieldValue(designer.userId.state)}</Text>
                 </InfoCard>
               </Col>
             </Row>
             <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
               <Col xs={24} sm={6}>
                 <InfoCard>
                   <Text type="secondary">Pincode</Text>
                   <Text strong>{getFieldValue(designer.userId.pincode)}</Text>
                 </InfoCard>
               </Col>
             </Row>
           </Section>

          <Divider />

          {/* About Section */}
          <Section>
            <SectionTitle>About</SectionTitle>
                         <AboutCard>
               <Paragraph style={{ margin: 0, fontSize: '16px', lineHeight: '1.6' }}>
                 {getFieldValue(designer.shortDescription)}
               </Paragraph>
             </AboutCard>
          </Section>

          {/* Portfolio Section */}
          {(designer.logoUrl || designer.backGroundImage) && (
            <>
              <Divider />
              <Section>
                <SectionTitle>Portfolio</SectionTitle>
                <Row gutter={[16, 16]}>
                  {designer.logoUrl && (
                    <Col xs={24} sm={12}>
                      <PortfolioCard>
                        <Text type="secondary" style={{ marginBottom: '8px', display: 'block' }}>
                          Logo
                        </Text>
                        <PortfolioImage 
                          src={designer.logoUrl} 
                          alt="Designer Logo"
                        />
                      </PortfolioCard>
                    </Col>
                  )}
                  {designer.backGroundImage && (
                    <Col xs={24} sm={12}>
                      <PortfolioCard>
                        <Text type="secondary" style={{ marginBottom: '8px', display: 'block' }}>
                          Cover Photo
                        </Text>
                        <PortfolioImage 
                          src={designer.backGroundImage} 
                          alt="Cover Photo"
                        />
                      </PortfolioCard>
                    </Col>
                  )}
                </Row>
              </Section>
            </>
          )}

          {/* Footer Actions */}
          <Divider />
          <FooterActions>
            <Button type="primary" size="large" onClick={onClose}>
              Close
            </Button>
          </FooterActions>
        </ModalContent>
      )}
    </StyledModal>
  );
};

// Styled Components
const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  }

  .ant-modal-header {
    border-bottom: none;
    padding: 0;
  }

  .ant-modal-body {
    padding: 0;
  }

  .ant-modal-close {
    top: 20px;
    right: 20px;
    color: #666;
    
    &:hover {
      color: #1a1a1a;
    }
  }
`;

const ModalContent = styled.div`
  padding: 32px;
`;

const HeaderSection = styled.div`
  margin-bottom: 24px;
`;

const AvatarContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const StyledAvatar = styled(Avatar)`
  border: 4px solid #f0f0f0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
`;

const StatusBadge = styled.div`
  .ant-tag {
    border-radius: 20px;
    padding: 4px 12px;
    font-weight: 600;
    border: none;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  .anticon {
    font-size: 16px;
  }
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled(Title)`
  font-size: 18px !important;
  font-weight: 600 !important;
  color: #1a1a1a !important;
  margin-bottom: 16px !important;
  display: flex;
  align-items: center;
`;

const InfoCard = styled.div`
  background: #f8f9fa;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  
  .ant-typography {
    display: block;
    margin-bottom: 4px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const AboutCard = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
`;

const PortfolioCard = styled.div`
  background: #f8f9fa;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  text-align: center;
`;

const PortfolioImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const FooterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default DesignerDetailModal;
