import React from "react";
import { ManageDesignerWrap } from "../manageDesigners/manageDesignerScreen.styles";
import ManageQueriesTable from "../manageQueries/manageQueriesTable"; // Add this import

const ManageQueries = () => {
  return (
    <ManageDesignerWrap className="content-area">
      <div className="area-row ar-one">
        <h2>Customer Queries</h2>
        <ManageQueriesTable />
      </div>
      <div style={{ marginTop: "24px" }}></div>
    </ManageDesignerWrap>
  );
};

export default ManageQueries;
