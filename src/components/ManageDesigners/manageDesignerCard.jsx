import React, { useEffect, useState } from "react";
import {
  Pending_account,
  Approved_count,
  updateDesignerApprovalStatus,
  Total_count,
} from "../../service/designerApi";
import { ManageDesignerCardWrap } from "./manageDesignerCard.Styles";
import { BlockContentWrap, BlockTitle } from "../../styles/global/default";
function ManageDesignerCard() {
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const pendingData = await Pending_account();
        setPendingCount(pendingData.pendingCount);

        const approvedData = await Approved_count();
        setApprovedCount(approvedData.approvedCount);

        const totalCount = await Total_count();
        setTotalCount(totalCount.totalDesigners);
      } catch (error) {
        console.error("Error fetching counts:", error.message);
      }
    };

    fetchCounts();
  }, []);

  const handleApprovalChange = async (designerId, isApproved) => {
    try {
      const updatedData = await updateDesignerApprovalStatus(
        designerId,
        isApproved
      );
      console.log("Approval status updated:", updatedData);
    } catch (error) {
      console.error("Error updating approval status:", error.message);
    }
  };
  return (
    <ManageDesignerCardWrap>
      <div className="block-head">
        <div className="block-head-1">
          <BlockContentWrap>
            <div className="cards">
              <div className="card-item card-misty-rose">
                <div className="card-item-value">{approvedCount}</div>
                <p className="card-item-text text">Total Approved</p>
              </div>
              <div className="card-item card-violet">
                <div className="card-item-value">{pendingCount}</div>
                <p className="card-item-text text">Total Pending</p>
              </div>
              <div className="card-item card-coffee">
                <div className="card-item-value">{totalCount}</div>
                <p className="card-item-text text">Total Designers</p>
              </div>
            </div>
          </BlockContentWrap>
        </div>
      </div>
    </ManageDesignerCardWrap>
  );
}

export default ManageDesignerCard;
