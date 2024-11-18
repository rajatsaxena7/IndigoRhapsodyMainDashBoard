import React from "react";
import SalesCard from "../../components/salesCard/SalesCard";
import { DashboardScreenWrap } from "./DashboardScreen.Styles";
import DashBoardGraph from "../../components/dashBoard/DashBoardGraph";

const DashboardScreen = () => {
  return (
    <DashboardScreenWrap className="content-area">
      <div className="area-row ar-one">
        <SalesCard />

        <DashBoardGraph />
      </div>
      <div className="area-row ar-two"></div>
    </DashboardScreenWrap>
  );
};

export default DashboardScreen;
