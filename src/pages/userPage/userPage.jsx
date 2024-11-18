import React from "react";
import { UserPageWrap } from "./userPage.Styles";
import ManageUserCards from "../../components/ManageUsers/Cards/manageUserCards";
import ManageUserMap from "../../components/ManageUsers/Map/manageUserMap";
import ManageuserTable from "../../components/ManageUsers/Table/manageUserTable";
import ManageUserPieChart from "../../components/ManageUsers/pieCharts/manageuserPieChart";

const UserPage = () => {
  return (
    <UserPageWrap className="content-area">
      <div className="area-row ar-one">
        <ManageUserCards />
        <ManageuserTable />
        {/* New row with flex container to align map and pie chart side-by-side */}
        <div className="map-chart-row">
          <ManageUserMap />
          <ManageUserPieChart />
        </div>
      </div>
    </UserPageWrap>
  );
};

export default UserPage;
