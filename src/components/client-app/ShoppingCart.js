import React, { useState } from "react";
import styled from "styled-components";
import { Steps } from "primereact/steps";
import { Button } from "primereact/button";

import ShoppingCartStep1 from "./ShoppingCartStep1";
import ShoppingCartStep2 from "./ShoppingCartStep2";

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
  ConfirmProducts: 0,
  ContactDetails: 1,
  Payment: 2,
};

const ShoppingCart = () => {
  const [step, setStep] = useState(PaymentSteps.ConfirmProducts);

  const [clientDetails, setClientDetails] = useState({
    name: "",
    phone: "",
    address: "",
    orderDetails: "",
  });

  const items = [
    { id: PaymentSteps.ConfirmProducts, label: "Confirm products" },
    { id: PaymentSteps.ContactDetails, label: "Contact details" },
    { id: PaymentSteps.Payment, label: "Payment" },
  ];

  const nextStep = () => {
    let newStep;
    switch (step) {
      case PaymentSteps.ConfirmProducts:
        newStep = PaymentSteps.ContactDetails;
        break;

      case PaymentSteps.ContactDetails:
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
        {step === PaymentSteps.ConfirmProducts && <ShoppingCartStep1 />}
        {step === PaymentSteps.ContactDetails && (
          <ShoppingCartStep2
            state={clientDetails}
            setState={setClientDetails}
          />
        )}
        {step === PaymentSteps.Payment && <>Payment</>}
      </ContentWrapper>
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <Button onClick={nextStep}>Next step</Button>
      </div>
    </PageWrapper>
  );
};
export default ShoppingCart;
