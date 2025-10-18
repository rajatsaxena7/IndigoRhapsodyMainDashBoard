import styled from "styled-components";
import { BlockContentWrap } from "../../styles/global/default";

export const VideoContentWrap = styled.div`
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

  /* Modern Table Styling */
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

  /* Loading States */
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    gap: 16px;

    .ant-progress-text {
      font-size: 14px;
      color: #666;
    }
  }

  /* Error States */
  .error-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    background: #fff2f0;
    border: 1px solid #ffccc7;
    border-radius: 8px;
    margin: 16px 0;
  }

  /* Empty States */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    gap: 16px;
    background: #fafafa;
    border-radius: 8px;
    margin: 16px 0;

    .anticon {
      color: #d9d9d9;
    }
  }

  /* Modern Modal Styling */
  .modern-modal {
    .ant-modal-header {
      border-bottom: 2px solid #f0f0f0;
      padding: 20px 24px;

      .ant-modal-title {
        font-size: 18px;
        font-weight: 600;
        color: #1a1a1a;
      }
    }

    .ant-modal-body {
      padding: 24px;
    }

    .ant-modal-content {
      border-radius: 12px;
      overflow: hidden;
    }
  }

  /* Video Upload Styling */
  .video-upload {
    .ant-upload-drag {
      border: 2px dashed #d9d9d9;
      border-radius: 8px;
      background: #fafafa;
      transition: all 0.3s ease;

      &:hover {
        border-color: #1890ff;
        background: #f0f8ff;
      }

      &.ant-upload-drag-hover {
        border-color: #1890ff;
        background: #f0f8ff;
      }
    }

    .ant-upload-text {
      font-size: 16px;
      color: #1a1a1a;
      margin: 8px 0;
    }

    .ant-upload-hint {
      font-size: 14px;
      color: #666;
    }
  }

  /* Video Player Container */
  .video-player-container {
    border-radius: 8px;
    overflow: hidden;
    background: #000;
  }

  /* Video Details */
  .video-details {
    .detail-card {
      border-radius: 8px;
      border: 1px solid #f0f0f0;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);

      .ant-statistic-title {
        font-size: 12px;
        color: #666;
        margin-bottom: 4px;
      }

      .ant-statistic-content {
        font-size: 16px;
        font-weight: 500;
      }
    }

    .comments-section {
      max-height: 300px;
      overflow-y: auto;
      padding-right: 8px;

      .ant-card {
        border-radius: 8px;
        border: 1px solid #f0f0f0;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
      }
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

    .modern-table {
      .ant-table-thead > tr > th,
      .ant-table-tbody > tr > td {
        padding: 12px 8px;
      }
    }
  }

  /* Custom Scrollbar */
  .comments-section::-webkit-scrollbar {
    width: 6px;
  }

  .comments-section::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  .comments-section::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  .comments-section::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
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

  /* Enhanced search styling */
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
`;
