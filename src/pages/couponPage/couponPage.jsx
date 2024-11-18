import React from "react";
import { CouponPageWrap } from "./couponPage.Styles";
import CouponPageTable from "../../components/couponPage/table/couponPageTable";

function CouponPage() {
  return (
    <CouponPageWrap>
      <CouponPageTable />
    </CouponPageWrap>
  );
}

export default CouponPage;
