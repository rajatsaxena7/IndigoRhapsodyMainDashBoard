import styled from "styled-components";
import { BlockContentWrap } from "../../styles/global/default";

export const OrdersPageWrap = styled.div`
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

    .order-distribution {
      .distribution-item {
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }

        .distribution-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;

          .ant-typography {
            margin: 0;
          }
        }
      }
    }

    .analytics-metrics {
      .analytics-item {
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }

        .analytics-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;

          .ant-typography {
            margin: 0;
          }
        }

        .analytics-value {
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

  .filter-card {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid #f0f0f0;
    background: white;

    .ant-card-body {
      padding: 24px;
    }
  }

  .table-card {
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

  // Enhanced modal styling
  .modern-modal {
    .ant-modal-header {
      border-bottom: 1px solid #f0f0f0;
      padding: 20px 24px;
    }

    .ant-modal-body {
      padding: 24px;
    }

    .ant-modal-footer {
      border-top: 1px solid #f0f0f0;
      padding: 16px 24px;
    }

    .ant-descriptions {
      .ant-descriptions-item-label {
        font-weight: 500;
        color: #1a1a1a;
      }
    }

    .ant-tabs {
      .ant-tabs-tab {
        font-weight: 500;
      }

      .ant-tabs-tab-active {
        color: #1890ff;
      }
    }
  }

  // Enhanced input styling
  .ant-input,
  .ant-select-selector {
    border-radius: 8px;
    border: 1px solid #d9d9d9;
    transition: all 0.3s ease;

    &:hover {
      border-color: #40a9ff;
    }

    &:focus,
    &.ant-input-focused,
    &.ant-select-focused .ant-select-selector {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
  }

  // Enhanced list styling
  .ant-list {
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

      .order-distribution {
        .distribution-item {
          margin-bottom: 12px;
        }
      }

      .analytics-metrics {
        .analytics-item {
          margin-bottom: 12px;

          .analytics-value {
            .ant-typography {
              font-size: 20px !important;
            }
          }
        }
      }

      .quick-actions {
        .ant-btn {
          font-size: 12px;
          padding: 4px 8px;
        }
      }
    }

    .filter-card {
      margin-bottom: 16px;

      .ant-card-body {
        padding: 16px;
      }
    }

    .table-card {
      margin-bottom: 16px;

      .ant-card-head {
        padding: 0 16px;
      }

      .ant-card-body {
        padding: 16px;
      }
    }

    .modern-modal {
      .ant-modal-header {
        padding: 16px 20px;
      }

      .ant-modal-body {
        padding: 20px;
      }

      .ant-modal-footer {
        padding: 12px 20px;
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
      .order-distribution {
        .distribution-item {
          .distribution-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      }

      .analytics-metrics {
        .analytics-item {
          .analytics-value {
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
