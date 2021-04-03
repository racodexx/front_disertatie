import React, { useState } from "react";
import styled from "styled-components";
import { Steps } from "primereact/steps";
import { Button } from "primereact/button";

import ShoppingCartStep2 from "./ShoppingCartStep2";
import ShoppingCartStep1 from "./ShoppingCartStep1";
import ShoppingCartStep3 from "./ShoppingCartStep3";
import PaymentType from "../../utils/enums/PaymentType";

const PageWrapper = styled.div`
  width: 70%;
  margin: auto;
  @media only screen and (max-width: 900px) {
    width: 90%;
  }
`;

const StepsWrapper = styled.div`
  display: contents;
  .p-steps {
    margin: auto;
    max-width: 600px;
    padding: 30px 0px;
  }
`;

const ContentWrapper = styled.div`
  .text-center {
    text-align: center;
  }
  .text-right {
    text-align: right;
  }
`;

const PaymentSteps = {
  OrderDetails: 0,
  ConfirmProducts: 1,
  Payment: 2,
};

const ShoppingCart = () => {
  const [step, setStep] = useState(PaymentSteps.OrderDetails);

  const [orderDetails, setOrderDetails] = useState({
    name: "",
    street: "",
    number: "",
    phone: "",
    email: "",
    description: "",
    includeDelivery: false,
    paymentType: PaymentType.Card,
    stripePaymentId: "",
  });

  const items = [
    { id: PaymentSteps.OrderDetails, label: "Order details" },
    { id: PaymentSteps.ConfirmProducts, label: "Confirm products" },
    { id: PaymentSteps.Payment, label: "Payment" },
  ];

  const nextStep = () => {
    let newStep;
    switch (step) {
      case PaymentSteps.OrderDetails:
        newStep = PaymentSteps.ConfirmProducts;
        break;

      case PaymentSteps.ConfirmProducts:
        newStep = PaymentSteps.Payment;
        break;

      default:
        break;
    }
    if (!newStep) {
      return;
    }
    setStep(newStep);
  };

  return (
    <PageWrapper>
      <StepsWrapper>
        <Steps
          model={items}
          activeIndex={step}
          onSelect={(e) => {
            setStep(e.index);
          }}
          readOnly={false}
        />
      </StepsWrapper>
      <ContentWrapper>
        {step === PaymentSteps.ConfirmProducts && (
          <ShoppingCartStep2 includeDelivery={orderDetails.includeDelivery} />
        )}
        {step === PaymentSteps.OrderDetails && (
          <ShoppingCartStep1 state={orderDetails} setState={setOrderDetails} />
        )}
        {step === PaymentSteps.Payment && <ShoppingCartStep3 />}
      </ContentWrapper>
      {step !== PaymentSteps.Payment && (
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <Button onClick={nextStep}>Next step</Button>
        </div>
      )}
    </PageWrapper>
  );
};
export default ShoppingCart;
