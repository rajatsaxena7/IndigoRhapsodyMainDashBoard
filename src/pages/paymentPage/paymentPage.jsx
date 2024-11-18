import React from "react";
import { PaymentPageWrap } from "./paymentPageScreen.styles";
import PaymentPageTable from "../../components/paymentPage/paymentPageTable";

function PaymentPage() {
  return (
    <PaymentPageWrap>
      <PaymentPageTable />
    </PaymentPageWrap>
  );
}

export default PaymentPage;
