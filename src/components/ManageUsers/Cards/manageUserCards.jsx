import React, { useEffect, useState } from "react";
import { ManageUserCardWrap } from "./manageUserCards.Styles";
import { BlockContentWrap, BlockTitle } from "../../../styles/global/default";

import {
  newUsersThisMonth,
  mostActiveState,
  TotalUsers,
  getDataByStates,
  getAllUsers,
} from "../../../service/userPageApi";
function ManageUserCards() {
  const [newUsers, setNewUsers] = useState(0);
  const [mostActive, setMostActive] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalUsersByStates, setTotalUsersByStates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newUserData = await newUsersThisMonth();
        setNewUsers(newUserData.newUserCount);

        const mostActiveData = await mostActiveState();
        setMostActive(mostActiveData.mostActiveState);

        const totalUserData = await TotalUsers();
        setTotalUsers(totalUserData.totalUsers);

        const totalUsersByStatesData = await getDataByStates();
        setTotalUsersByStates(totalUsersByStatesData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    fetchData();
  }, []);
  return (
    <ManageUserCardWrap>
      <div className="block-head">
        <div className="block-head-1">
          <BlockContentWrap>
            <div className="cards">
              <div className="card-item card-misty-rose">
                <div className="card-item-value">{totalUsers}</div>
                <p className="card-item-text text">Total Users</p>
              </div>
              <div className="card-item card-violet">
                <div className="card-item-value">{newUsers}</div>
                <p className="card-item-text text">New Users This Month</p>
              </div>
              <div className="card-item card-coffee">
                <div className="card-item-value">{mostActive}</div>
                <p className="card-item-text text">Most Active State</p>
              </div>
            </div>
          </BlockContentWrap>
        </div>
      </div>
    </ManageUserCardWrap>
  );
}

export default ManageUserCards;
