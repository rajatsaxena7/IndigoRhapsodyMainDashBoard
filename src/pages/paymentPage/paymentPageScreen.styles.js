import styled from "styled-components";

export const PaymentPageWrap = styled.div`
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;

  /* Page Header */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 32px;
    padding: 24px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid #f0f0f0;

    .header-content {
      flex: 1;
    }

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;
    }
  }

  /* Statistics Cards */
  .stat-card {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid #f0f0f0;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .ant-statistic-title {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }

    .ant-statistic-content {
      font-size: 24px;
      font-weight: 600;
    }
  }

  /* Content Cards */
  .content-card {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid #f0f0f0;
    overflow: hidden;

    .ant-card-head {
      background: #fafafa;
      border-bottom: 2px solid #f0f0f0;
      padding: 16px 24px;

      .ant-card-head-title {
        font-size: 16px;
        font-weight: 600;
        color: #1a1a1a;
      }
    }

    .ant-card-body {
      padding: 24px;
    }
  }

  /* Enhanced button styling */
  .ant-btn {
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.3s ease;

    &.ant-btn-primary {
      box-shadow: 0 2px 4px rgba(24, 144, 255, 0.2);
      
      &:hover {
        box-shadow: 0 4px 8px rgba(24, 144, 255, 0.3);
        transform: translateY(-1px);
      }
    }

    &.ant-btn-text {
      &:hover {
        background: rgba(0, 0, 0, 0.04);
      }
    }
  }

  /* Animation for cards */
  .stat-card,
  .content-card {
    animation: fadeInUp 0.6s ease-out;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    padding: 16px;

    .page-header {
      padding: 16px;
      margin-bottom: 24px;
    }

    .content-card {
      .ant-card-body {
        padding: 16px;
      }
    }
  }
`;