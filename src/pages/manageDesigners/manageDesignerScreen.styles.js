import styled from "styled-components";
import { BlockContentWrap } from "../../styles/global/default";

export const ManageDesignerWrap = styled.div`
  ${BlockContentWrap};
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;

  .page-header {
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
      gap: 8px;
      align-items: center;
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

    .stat-description {
      margin-top: 8px;
    }
  }

  .metric-card {
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

    .approval-metrics {
      .approval-rate {
        text-align: center;
        margin-bottom: 16px;
      }

      .approval-breakdown {
        .breakdown-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

    .activity-metrics {
      .activity-item {
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }

        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;

          .ant-typography {
            margin: 0;
          }
        }

        .activity-value {
          display: flex;
          align-items: center;
          gap: 8px;

          .ant-typography {
            margin: 0;
          }
        }
      }
    }

    .quick-actions {
      .ant-btn {
        border-radius: 8px;
        font-weight: 500;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }

  .management-card {
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

  // Enhanced badge styling
  .ant-badge {
    .ant-badge-count {
      border-radius: 10px;
      font-weight: 500;
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

    .page-header {
      padding: 16px;
      margin-bottom: 16px;
      flex-direction: column;
      gap: 16px;
      align-items: flex-start;

      .header-actions {
        width: 100%;
        justify-content: flex-end;
        flex-wrap: wrap;
      }
    }

    .stat-card {
      margin-bottom: 16px;
    }

    .metric-card {
      margin-bottom: 16px;

      .ant-card-head {
        padding: 0 16px;
      }

      .ant-card-body {
        padding: 16px;
      }

      .approval-metrics {
        .approval-rate {
          .ant-typography {
            font-size: 28px !important;
          }
        }
      }

      .activity-metrics {
        .activity-item {
          .activity-value {
            .ant-typography {
              font-size: 20px !important;
            }
          }
        }
      }
    }

    .management-card {
      margin-bottom: 16px;

      .ant-card-head {
        padding: 0 16px;
      }

      .ant-card-body {
        padding: 16px;
      }
    }
  }

  @media (max-width: 576px) {
    .page-header {
      .header-content {
        .ant-typography {
          font-size: 18px !important;
        }
      }

      .header-actions {
        .ant-btn {
          font-size: 12px;
          padding: 4px 8px;
        }
      }
    }

    .stat-card {
      .ant-statistic-content {
        font-size: 20px;
      }
    }

    .metric-card {
      .approval-metrics {
        .approval-rate {
          .ant-typography {
            font-size: 24px !important;
          }
        }
      }

      .activity-metrics {
        .activity-item {
          .activity-value {
            .ant-typography {
              font-size: 18px !important;
            }
          }
        }
      }

      .quick-actions {
        .ant-btn {
          font-size: 12px;
          padding: 8px 12px;
        }
      }
    }
  }
`;
