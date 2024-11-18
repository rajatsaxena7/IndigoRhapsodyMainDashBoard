import styled from "styled-components";
import { BlockWrapStyles } from "../../../styles/global/default";
export const ManageDesignerTableWrap = styled.div`
  ${BlockWrapStyles}
  margin-top:20px;

  .block-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    flex-wrap: wrap;

    .block-title {
      margin-bottom: 4px; /* Fixed typo */
    }

    .block-head-1 {
      display: flex;
      align-items: center;
      column-gap: 10px;
      color: ${(props) => props.theme.colors.cadet};
    }
  }
`;
