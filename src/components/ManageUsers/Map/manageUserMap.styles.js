import styled from "styled-components";
import { BlockWrapStyles } from "../../../styles/global/default";
export const ManageUserMapWrap = styled.div`
 
  padding: 16px;
  width:50vw
  margin-top: 25px;
  border-radius: 8px;

  .title {
    font-size: 18px;
    margin-bottom: 12px;
    color: ${(props) => props.theme.colors.cadet};
  }
`;
