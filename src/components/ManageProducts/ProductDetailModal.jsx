import React from "react";
import { Modal, Button, Tag, Divider, Row, Col, Typography, Space, Image, Descriptions, Badge } from "antd";
import { 
  ShoppingOutlined, 
  UserOutlined, 
  TagOutlined, 
  DollarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  IdcardOutlined,
  BarcodeOutlined,
  StockOutlined
} from "@ant-design/icons";
import styled from "styled-components";

const { Title, Text, Paragraph } = Typography;

const ProductDetailModal = ({ 
  visible, 
  onClose, 
  product, 
  loading = false 
}) => {
  if (!product) return null;

  const formatPrice = (price) => {
    return price ? `₹${price.toLocaleString()}` : 'Not specified';
  };

  const getStatusColor = (enabled) => {
    return enabled ? 'success' : 'error';
  };

  const getStatusIcon = (enabled) => {
    return enabled ? <CheckCircleOutlined /> : <CloseCircleOutlined />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalStock = () => {
    if (!product.variants) return 0;
    return product.variants.reduce((sum, variant) => {
      return sum + (variant.sizes?.reduce((s, size) => s + (size.stock || 0), 0) || 0);
    }, 0);
  };

  const getTotalVariants = () => {
    return product.variants?.length || 0;
  };

  const getTotalSizes = () => {
    if (!product.variants) return 0;
    return product.variants.reduce((sum, variant) => sum + (variant.sizes?.length || 0), 0);
  };

  return (
    <StyledModal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      closeIcon={<CloseOutlined style={{ fontSize: '18px' }} />}
      destroyOnClose
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <LoadingSpinner />
          <Text>Loading product details...</Text>
        </div>
      ) : (
        <ModalContent>
                     {/* Header Section */}
           <HeaderSection>
             <Row gutter={[24, 16]} align="middle">
               <Col xs={24} sm={8}>
                 <ProductImageContainer>
                   <ProductImage 
                     src={product.coverImage}
                     alt={product.productName}
                     fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                   />
                   <StatusBadge>
                     <Tag 
                       color={getStatusColor(product.enabled)}
                       icon={getStatusIcon(product.enabled)}
                     >
                       {product.enabled ? 'Active' : 'Inactive'}
                     </Tag>
                   </StatusBadge>
                 </ProductImageContainer>
               </Col>
               <Col xs={24} sm={16}>
                 <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>
                   {product.productName}
                 </Title>
                 <Space direction="vertical" size="small" style={{ width: '100%' }}>
                   <InfoItem>
                     <TagOutlined style={{ color: '#667eea' }} />
                     <Text strong>{product.category?.name} • {product.subCategory?.name}</Text>
                   </InfoItem>
                                       <InfoItem>
                      <UserOutlined style={{ color: '#667eea' }} />
                      <Text>
                        Designer: {product.designer?.displayName || product.designer?._id || 'Unknown'}
                        {product.designer?.is_approved && (
                          <Tag color="green" style={{ marginLeft: '8px' }}>✓ Approved</Tag>
                        )}
                      </Text>
                    </InfoItem>
                   <InfoItem>
                     <DollarOutlined style={{ color: '#667eea' }} />
                     <Text strong style={{ color: '#52c41a', fontSize: '18px' }}>
                       {formatPrice(product.price)}
                     </Text>
                   </InfoItem>
                   <InfoItem>
                     <StockOutlined style={{ color: '#667eea' }} />
                     <Text>
                       Stock: {getTotalStock()} units • {getTotalVariants()} variants • {getTotalSizes()} sizes
                     </Text>
                   </InfoItem>
                 </Space>
               </Col>
             </Row>
           </HeaderSection>

          <Divider />

                     {/* Product Details Section */}
           <Section>
             <SectionTitle>
               <InfoCircleOutlined style={{ color: '#667eea', marginRight: '8px' }} />
               Product Details
             </SectionTitle>
             <Descriptions 
               bordered 
               column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}
               size="small"
               style={{ marginBottom: '16px' }}
             >
                               <Descriptions.Item label="Product ID" span={1}>
                  <Text code>{product._id}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="SKU" span={1}>
                  {product.sku || 'Not specified'}
                </Descriptions.Item>
                <Descriptions.Item label="Fit" span={1}>
                  {product.fit || 'Not specified'}
                </Descriptions.Item>
                <Descriptions.Item label="Fabric" span={1}>
                  {product.fabric || 'Not specified'}
                </Descriptions.Item>
                <Descriptions.Item label="Material" span={1}>
                  {product.material || 'Not specified'}
                </Descriptions.Item>
               <Descriptions.Item label="Status" span={1}>
                 <Badge 
                   status={product.enabled ? 'success' : 'error'} 
                   text={product.enabled ? 'Active' : 'Inactive'} 
                 />
               </Descriptions.Item>
               <Descriptions.Item label="Total Variants" span={1}>
                 <Text strong>{getTotalVariants()}</Text>
               </Descriptions.Item>
               <Descriptions.Item label="Total Sizes" span={1}>
                 <Text strong>{getTotalSizes()}</Text>
               </Descriptions.Item>
               <Descriptions.Item label="Total Stock" span={1}>
                 <Text strong style={{ color: '#52c41a' }}>{getTotalStock()} units</Text>
               </Descriptions.Item>
                               <Descriptions.Item label="Created At" span={1}>
                  {formatDate(product.createdDate)}
                </Descriptions.Item>
               <Descriptions.Item label="Updated At" span={1}>
                 {formatDate(product.updatedAt)}
               </Descriptions.Item>
                               <Descriptions.Item label="Designer Status" span={1}>
                  {product.designer?.is_approved ? (
                    <Tag color="green">✓ Approved</Tag>
                  ) : (
                    <Tag color="orange">Pending</Tag>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="In Stock" span={1}>
                  <Badge 
                    status={product.in_stock ? 'success' : 'error'} 
                    text={product.in_stock ? 'Yes' : 'No'} 
                  />
                </Descriptions.Item>
                <Descriptions.Item label="Returnable" span={1}>
                  <Badge 
                    status={product.returnable ? 'success' : 'error'} 
                    text={product.returnable ? 'Yes' : 'No'} 
                  />
                </Descriptions.Item>
                <Descriptions.Item label="Trending" span={1}>
                  <Badge 
                    status={product.isTrending ? 'success' : 'default'} 
                    text={product.isTrending ? 'Yes' : 'No'} 
                  />
                </Descriptions.Item>
                <Descriptions.Item label="Wishlist Count" span={1}>
                  <Text strong>{product.wishlistCount || 0}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Average Rating" span={1}>
                  <Text strong>{product.averageRating || 0} ⭐</Text>
                </Descriptions.Item>
             </Descriptions>
           </Section>

          <Divider />

          {/* Description Section */}
          <Section>
            <SectionTitle>Description</SectionTitle>
            <DescriptionCard>
              <Paragraph style={{ margin: 0, fontSize: '16px', lineHeight: '1.6' }}>
                {product.description || 'No description available'}
              </Paragraph>
            </DescriptionCard>
          </Section>

                     {/* Variants Section */}
           {product.variants && product.variants.length > 0 && (
             <>
               <Divider />
               <Section>
                 <SectionTitle>Variants & Inventory</SectionTitle>
                 <Row gutter={[16, 16]}>
                   {product.variants.map((variant, index) => (
                     <Col xs={24} sm={12} key={index}>
                       <VariantCard>
                         <div style={{ marginBottom: '16px' }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <Text strong style={{ fontSize: '16px' }}>
                               {variant.color}
                             </Text>
                             <Tag color="blue">Variant {index + 1}</Tag>
                           </div>
                         </div>
                         
                         {/* Variant Images */}
                         {variant.imageList && variant.imageList.length > 0 && (
                           <div style={{ marginBottom: '20px' }}>
                             <Text type="secondary" style={{ display: 'block', marginBottom: '12px' }}>
                               Product Images ({variant.imageList.length})
                             </Text>
                             <Image.PreviewGroup>
                               <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                 {variant.imageList.slice(0, 4).map((image, imgIndex) => (
                                   <VariantImage 
                                     key={imgIndex}
                                     src={image}
                                     alt={`${variant.color} - ${imgIndex + 1}`}
                                     width={70}
                                     height={70}
                                   />
                                 ))}
                                 {variant.imageList.length > 4 && (
                                   <div style={{ 
                                     width: 70, 
                                     height: 70, 
                                     background: '#f0f0f0', 
                                     display: 'flex', 
                                     alignItems: 'center', 
                                     justifyContent: 'center',
                                     borderRadius: '8px',
                                     fontSize: '11px',
                                     color: '#666'
                                   }}>
                                     +{variant.imageList.length - 4} more
                                   </div>
                                 )}
                               </div>
                             </Image.PreviewGroup>
                           </div>
                         )}

                         {/* Sizes and Stock */}
                         {variant.sizes && variant.sizes.length > 0 && (
                           <div>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                               <Text type="secondary">
                                 Available Sizes ({variant.sizes.length})
                               </Text>
                               <Text type="secondary" style={{ fontSize: '12px' }}>
                                 Total Stock: {variant.sizes.reduce((sum, size) => sum + (size.stock || 0), 0)}
                               </Text>
                             </div>
                             <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                               {variant.sizes.map((size, sizeIndex) => (
                                 <div key={sizeIndex} style={{ 
                                   border: '1px solid #d9d9d9', 
                                   borderRadius: '6px', 
                                   padding: '8px 12px',
                                   background: '#fafafa',
                                   minWidth: '80px',
                                   textAlign: 'center'
                                 }}>
                                   <div style={{ fontWeight: '600', fontSize: '14px' }}>
                                     {size.size}
                                   </div>
                                   <div style={{ color: '#52c41a', fontSize: '12px', fontWeight: '500' }}>
                                     ₹{size.price?.toLocaleString()}
                                   </div>
                                   <div style={{ 
                                     color: size.stock > 0 ? '#52c41a' : '#ff4d4f', 
                                     fontSize: '11px',
                                     fontWeight: '500'
                                   }}>
                                     Stock: {size.stock || 0}
                                   </div>
                                 </div>
                               ))}
                             </div>
                           </div>
                         )}
                       </VariantCard>
                     </Col>
                   ))}
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

const ProductImageContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const ProductImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
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

const DescriptionCard = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
`;

const VariantCard = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
`;

const VariantImage = styled.img`
  border-radius: 8px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
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

export default ProductDetailModal;
