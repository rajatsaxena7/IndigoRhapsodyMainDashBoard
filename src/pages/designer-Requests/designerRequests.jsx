import React from "react";
import { designerRequestsWrapper } from "./designerRequest.styles";
import RequestTable from "./requestTable";

function DesignerRequests() {
  return (
    <designerRequestsWrapper>
      <RequestTable />
    </designerRequestsWrapper>
  );
}

export default DesignerRequests;
