import styled from "styled-components";
import { BlockWrapStyles } from "../../../styles/global/default";

export const ManageDesignerTableWrap = styled.div`
  ${BlockWrapStyles}
  margin-top: 20px;

  .block-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 24px;

    .block-title {
      margin-bottom: 4px;
    }

    .block-head-1 {
      display: flex;
      align-items: center;
      column-gap: 10px;
      color: ${(props) => props.theme.colors.cadet};

      h3 {
        font-size: 24px;
        font-weight: 600;
        color: #1a1a1a;
        margin: 0;
      }
    }
  }

  /* Enhanced table styling */
  .ant-table {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid #f0f0f0;

    .ant-table-thead > tr > th {
      background: #fafafa;
      border-bottom: 2px solid #f0f0f0;
      font-weight: 600;
      color: #1a1a1a;
      padding: 16px;
    }

    .ant-table-tbody > tr > td {
      padding: 16px;
      border-bottom: 1px solid #f5f5f5;
    }

    .ant-table-tbody > tr:hover > td {
      background: #f8f9fa;
    }

    .ant-table-tbody > tr:last-child > td {
      border-bottom: none;
    }
  }

  /* Enhanced search and filter styling */
  .ant-input-search {
    .ant-input {
      border-radius: 8px;
      border: 1px solid #d9d9d9;
      
      &:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
      }
    }
  }

  .ant-select {
    .ant-select-selector {
      border-radius: 8px;
      border: 1px solid #d9d9d9;
      
      &:hover {
        border-color: #667eea;
      }
    }
  }

  /* Enhanced button styling */
  .ant-btn-primary {
    background: #667eea;
    border-color: #667eea;
    border-radius: 8px;
    
    &:hover {
      background: #5a6fd8;
      border-color: #5a6fd8;
    }
  }

  /* Enhanced tag styling */
  .ant-tag {
    border-radius: 6px;
    font-weight: 500;
    border: none;
  }
`;
