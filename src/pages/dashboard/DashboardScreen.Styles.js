import styled from "styled-components";
import { BlockContentWrap } from "../../styles/global/default";

export const DashboardScreenWrap = styled.div`
  ${BlockContentWrap};
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;

  .dashboard-header {
    background: white;
    padding: 24px;
    border-radius: 12px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }
  }

  .stat-card {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid #f0f0f0;
    transition: all 0.3s ease;
    cursor: pointer;

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

  .chart-card {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid #f0f0f0;
    background: white;

    .ant-card-head {
      border-bottom: 1px solid #f0f0f0;
      padding: 0 24px;
    }

    .ant-card-body {
      padding: 24px;
    }
  }

  .stats-card {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid #f0f0f0;
    background: white;

    .ant-card-head {
      border-bottom: 1px solid #f0f0f0;
      padding: 0 24px;
    }

    .ant-card-body {
      padding: 24px;
    }

    .quick-stats {
      .stat-item {
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }

        .stat-label {
          font-size: 14px;
          color: #666;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 8px;
        }
      }
    }
  }

  .activity-card {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid #f0f0f0;
    background: white;

    .ant-card-head {
      border-bottom: 1px solid #f0f0f0;
      padding: 0 24px;
    }

    .ant-card-body {
      padding: 24px;
    }

    .ant-list-item {
      padding: 12px 0;
      border-bottom: 1px solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: #f8f9fa;
        border-radius: 8px;
        margin: 0 -12px;
        padding: 12px;
      }
    }
  }

  .performance-card {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid #f0f0f0;
    background: white;

    .ant-card-head {
      border-bottom: 1px solid #f0f0f0;
      padding: 0 24px;
    }

    .ant-card-body {
      padding: 24px;
    }

    .performance-metrics {
      .metric-item {
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;

          .ant-typography {
            margin: 0;
          }
        }

        .metric-value {
          display: flex;
          align-items: center;
          gap: 8px;

          .ant-typography {
            margin: 0;
          }
        }
      }
    }
  }

  // Enhanced table styling
  .ant-table {
    .ant-table-thead > tr > th {
      background: #fafafa;
      border-bottom: 1px solid #f0f0f0;
      font-weight: 600;
      color: #1a1a1a;
    }

    .ant-table-tbody > tr > td {
      border-bottom: 1px solid #f5f5f5;
    }

    .ant-table-tbody > tr:hover > td {
      background: #f8f9fa;
    }
  }

  // Enhanced button styling
  .ant-btn {
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }

  // Enhanced card styling
  .ant-card {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid #f0f0f0;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }
  }

  // Enhanced tag styling
  .ant-tag {
    border-radius: 6px;
    font-weight: 500;
  }

  // Enhanced progress styling
  .ant-progress {
    .ant-progress-bg {
      border-radius: 4px;
    }
  }

  // Enhanced avatar styling
  .ant-avatar {
    border-radius: 8px;
  }

  // Responsive design
  @media (max-width: 768px) {
    padding: 16px;

    .dashboard-header {
      padding: 16px;
      margin-bottom: 16px;
      flex-direction: column;
      gap: 16px;
      align-items: flex-start;

      .header-actions {
        width: 100%;
        justify-content: flex-end;
      }
    }

    .stat-card {
      margin-bottom: 16px;
    }

    .chart-card,
    .stats-card {
      margin-bottom: 16px;

      .ant-card-head {
        padding: 0 16px;
      }

      .ant-card-body {
        padding: 16px;
      }
    }

    .activity-card,
    .performance-card {
      margin-bottom: 16px;

      .ant-card-head {
        padding: 0 16px;
      }

      .ant-card-body {
        padding: 16px;
      }
    }

    .quick-stats {
      .stat-item {
        margin-bottom: 12px;

        .stat-value {
          font-size: 18px;
        }
      }
    }

    .performance-metrics {
      .metric-item {
        margin-bottom: 12px;

        .metric-value {
          .ant-typography {
            font-size: 20px !important;
          }
        }
      }
    }
  }

  @media (max-width: 576px) {
    .dashboard-header {
      .header-content {
        .ant-typography {
          font-size: 18px !important;
        }
      }
    }

    .stat-card {
      .ant-statistic-content {
        font-size: 20px;
      }
    }

    .quick-stats {
      .stat-item {
        .stat-value {
          font-size: 16px;
        }
      }
    }

    .performance-metrics {
      .metric-item {
        .metric-value {
          .ant-typography {
            font-size: 18px !important;
          }
        }
      }
    }
  }
`;
