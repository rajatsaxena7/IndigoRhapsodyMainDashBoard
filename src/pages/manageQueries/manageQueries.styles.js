import styled from "styled-components";
import { BlockContentWrap } from "../../styles/global/default";

export const ManageQueriesWrap = styled.div`
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

  .content-card {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid #f0f0f0;
    background: white;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0;

      .header-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
    }
  }

  .filter-card {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid #f0f0f0;
    background: white;
  }

  .summary-card {
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
      font-size: 20px;
      font-weight: 600;
    }
  }

  .table-card {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid #f0f0f0;
    background: white;
    overflow: hidden;

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

    .ant-pagination {
      margin: 16px 0 0 0;
      text-align: right;
    }
  }

  .modern-modal {
    .ant-modal-header {
      border-bottom: 1px solid #f0f0f0;
      padding: 20px 24px;
    }

    .ant-modal-body {
      padding: 24px;
    }

    .ant-form-item-label > label {
      font-weight: 500;
      color: #1a1a1a;
    }

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
  }

  @media (max-width: 768px) {
    padding: 16px;

    .page-header {
      padding: 16px;
      margin-bottom: 16px;
      flex-direction: column;
      gap: 16px;
      align-items: flex-start;
    }

    .content-card {
      .card-header {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
      }
    }

    .summary-card {
      margin-bottom: 16px;
    }

    .table-card {
      .ant-table {
        font-size: 12px;
      }
    }
  }
`;
