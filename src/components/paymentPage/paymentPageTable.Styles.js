import styled from "styled-components";

export const PaymentPageTableWrap = styled.div`
  /* Summary Cards */
  .summary-card {
    border-radius: 8px;
    border: 1px solid #f0f0f0;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .ant-statistic-title {
      font-size: 12px;
      color: #666;
      margin-bottom: 4px;
    }

    .ant-statistic-content {
      font-size: 18px;
      font-weight: 500;
    }
  }

  /* Filters Section */
  .filters-section {
    margin-bottom: 24px;
    padding: 16px;
    background: #fafafa;
    border-radius: 8px;
    border: 1px solid #f0f0f0;

    .ant-input-search {
      .ant-input {
        border-radius: 6px;
        border: 1px solid #d9d9d9;
        transition: all 0.3s ease;

        &:hover {
          border-color: #40a9ff;
        }

        &:focus {
          border-color: #1890ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
      }

      .ant-input-search-button {
        border-radius: 0 6px 6px 0;
        border-left: none;
      }
    }

    .ant-select {
      .ant-select-selector {
        border-radius: 6px;
        border: 1px solid #d9d9d9;
        transition: all 0.3s ease;

        &:hover {
          border-color: #40a9ff;
        }

        &:focus {
          border-color: #1890ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
      }
    }
  }

  /* Table Section */
  .table-section {
    .modern-table {
      .ant-table-thead > tr > th {
        background: #fafafa;
        border-bottom: 2px solid #f0f0f0;
        font-weight: 600;
        color: #1a1a1a;
        padding: 16px;
      }

      .ant-table-tbody > tr > td {
        border-bottom: 1px solid #f5f5f5;
        padding: 16px;
      }

      .ant-table-tbody > tr:hover > td {
        background: #f8f9fa;
      }

      .ant-table-pagination {
        margin: 16px 0 0 0;
      }
    }
  }

  /* Enhanced tag styling */
  .ant-tag {
    border-radius: 4px;
    font-weight: 500;
    padding: 2px 8px;
  }

  /* Enhanced badge styling */
  .ant-badge {
    .ant-badge-count {
      border-radius: 10px;
      font-weight: 500;
      min-width: 20px;
      height: 20px;
      line-height: 20px;
    }
  }

  /* Enhanced avatar styling */
  .ant-avatar {
    border: 2px solid #f0f0f0;
    transition: all 0.3s ease;

    &:hover {
      border-color: #1890ff;
      transform: scale(1.05);
    }
  }

  /* Enhanced button styling */
  .ant-btn {
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.3s ease;

    &.ant-btn-text {
      &:hover {
        background: rgba(0, 0, 0, 0.04);
      }
    }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .filters-section {
      padding: 12px;

      .ant-space {
        gap: 8px !important;
      }

      .ant-input-search,
      .ant-select {
        width: 100% !important;
      }
    }

    .modern-table {
      .ant-table-thead > tr > th,
      .ant-table-tbody > tr > td {
        padding: 12px 8px;
      }
    }

    .summary-card {
      .ant-statistic-content {
        font-size: 16px;
      }
    }
  }

  /* Animation for summary cards */
  .summary-card {
    animation: fadeInUp 0.4s ease-out;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
