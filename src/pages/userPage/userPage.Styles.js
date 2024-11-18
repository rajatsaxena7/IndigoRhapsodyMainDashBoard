import styled from "styled-components";
import { BlockContentWrap } from "../../styles/global/default";

export const UserPageWrap = styled.div`
  ${BlockContentWrap}
  .content-area {
    padding: 20px;
  }

  .area-row {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* Flex row layout for larger screens and responsive column layout for smaller ones */
  .map-chart-row {
    display: flex;
    flex-direction: row;
    gap: 10px;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  /* Optional: Control the widths to ensure both fit side-by-side on larger screens */
  .map-chart-row > div {
    flex: 0.4;

    /* Adjust widths on smaller screens */
    @media (max-width: 768px) {
      flex: 1;
      width: 100%;
    }
  }
`;
