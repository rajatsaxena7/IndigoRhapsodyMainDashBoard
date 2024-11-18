import React from "react";
import { ManageDesignerWrap } from "./manageDesignerScreen.styles";
import ManageDesignerCard from "../../components/ManageDesigners/manageDesignerCard";
import ManageDesignerTable from "../../components/ManageDesigners/table/manageDesignerTable";

const ManageDesignerScreen = () => {
  return (
    <ManageDesignerWrap className="content-area">
      <div className="area-row ar-one">
        <ManageDesignerCard />
        <ManageDesignerTable />
      </div>
      {/* <div style={{ fontSize: "24px", color: "black" }}>rajat</div> */}
    </ManageDesignerWrap>
  );
};

export default ManageDesignerScreen;
