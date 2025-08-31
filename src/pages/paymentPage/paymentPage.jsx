import React, { useEffect, useState } from "react";
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Space, 
  Typography,
  Button,
  message
} from "antd";
import { 
  DollarOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  CloseCircleOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { PaymentPageWrap } from "./paymentPageScreen.styles";
import PaymentPageTable from "../../components/paymentPage/paymentPageTable";
import { GetPayment, GetPaymentStats, testPaymentAuth } from "../../service/paymentpageapi";

const { Title, Text } = Typography;

function PaymentPage() {
  const [paymentStats, setPaymentStats] = useState({
    totalPayments: 0,
    completedPayments: 0,
    pendingPayments: 0,
    failedPayments: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Test authentication first
    const testAuth = async () => {
      console.log("PaymentPage: Testing authentication...");
      const authResult = await testPaymentAuth();
      console.log("PaymentPage: Auth test result:", authResult);
      
      if (authResult) {
        fetchPaymentStats();
      } else {
        console.log("PaymentPage: Authentication failed, not proceeding with data fetch");
        setLoading(false);
      }
    };
    
    testAuth();
  }, []);

  const fetchPaymentStats = async () => {
    try {
      setLoading(true);
      console.log("Fetching payment stats...");
      const stats = await GetPaymentStats();
      console.log("Payment stats received:", stats);
      setPaymentStats(stats);
    } catch (error) {
      console.error("Failed to fetch payment stats:", error);
      // Don't show error message if it's an auth error (apiCall will handle logout)
      if (!error.message.includes("unauthorized") && 
          !error.message.includes("forbidden") && 
          !error.message.includes("token")) {
        message.error("Failed to load payment statistics. Please try again.");
      }
      
      // Fallback to calculating stats from payments data
      try {
        console.log("Trying fallback to payments data...");
        const paymentsData = await GetPayment();
        console.log("Payments data received:", paymentsData);
        calculateStatsFromPayments(paymentsData.payments || []);
      } catch (err) {
        console.error("Fallback also failed:", err);
        // Only show error if it's not an auth error
        if (!err.message.includes("unauthorized") && 
            !err.message.includes("forbidden") && 
            !err.message.includes("token")) {
          message.error("Failed to load payment data. Please check your connection.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateStatsFromPayments = (payments) => {
    console.log("Calculating stats from payments:", payments.length);
    const stats = {
      totalPayments: payments.length,
      completedPayments: payments.filter(p => p.paymentStatus === "Completed").length,
      pendingPayments: payments.filter(p => p.paymentStatus === "Pending").length,
      failedPayments: payments.filter(p => p.paymentStatus === "Failed").length,
      totalRevenue: payments
        .filter(p => p.paymentStatus === "Completed")
        .reduce((sum, p) => sum + (p.cartId?.total_amount || 0), 0)
    };
    console.log("Calculated stats:", stats);
    setPaymentStats(stats);
  };

  return (
    <PaymentPageWrap>
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>
            <DollarOutlined style={{ marginRight: 12, color: '#52c41a' }} />
            Payment Management
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Monitor and manage all payment transactions
          </Text>
        </div>
        
        <Space size="middle">
          <Button 
            type="default" 
            icon={<ReloadOutlined />}
            onClick={fetchPaymentStats}
            loading={loading}
          >
            Refresh
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Payments"
              value={paymentStats.totalPayments}
              valueStyle={{ color: '#1890ff' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Completed"
              value={paymentStats.completedPayments}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Pending"
              value={paymentStats.pendingPayments}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Revenue"
              value={paymentStats.totalRevenue}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
              prefix="₹"
            />
          </Card>
        </Col>
      </Row>

      {/* Payment Table Section */}
      <Card 
        title={
          <Space>
            <DollarOutlined style={{ color: '#52c41a' }} />
            <span>Payment Transactions</span>
          </Space>
        }
        className="content-card"
      >
        <PaymentPageTable onDataUpdate={fetchPaymentStats} />
      </Card>
    </PaymentPageWrap>
  );
}

export default PaymentPage;
