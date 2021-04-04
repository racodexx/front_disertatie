import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { Steps } from "primereact/steps";
import { Button } from "primereact/button";

import ShoppingCartContext from "./contexts/ShoppingCartContext";
import ShoppingCartStep2 from "./ShoppingCartStep2";
import ShoppingCartStep1 from "./ShoppingCartStep1";
import ShoppingCartStep3 from "./ShoppingCartStep3";
import PaymentType from "../../utils/enums/PaymentType";

import { getProducts } from "../../services/productService";
import { getCartProducts } from "../../utils/util";

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
const FreeDeliveryLimit = 35;
const DeliveryFee = 10;

const ShoppingCart = () => {
  const [step, setStep] = useState(PaymentSteps.OrderDetails);
  const [hasLoaded, setHasLoaded] = useState(false);

  const [cartState, setCartState] = useState({
    orderDetails: {
      products: [],
      name: "",
      street: "",
      number: "",
      phone: "",
      email: "",
      description: "",
      includeDelivery: false,
      paymentType: PaymentType.Card,
      stripePaymentId: "",
      totalPrice: 0,
      deliveryCost: 0,
    },
    cartItems: [],
    freeDeliveryLimit: FreeDeliveryLimit,
  });

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }
    updatePrice();
  }, [hasLoaded]);

  const load = async () => {
    let storedProducts = getCartProducts();
    let searchParameters = { ids: Object.keys(storedProducts) };
    let result = await getProducts(searchParameters);
    let newState = { ...cartState };
    newState.orderDetails.products = storedProducts;
    newState.cartItems = result.data;
    setCartState(newState);
    setHasLoaded(true);
  };

  const updatePrice = () => {
    let totalPrice = 0;
    let deliveryCost = 0;
    for (let product of cartState.cartItems) {
      totalPrice +=
        product.price * cartState.orderDetails.products[product._id];
    }

    if (
      cartState.orderDetails.includeDelivery &&
      totalPrice < FreeDeliveryLimit
    ) {
      deliveryCost = DeliveryFee;
    }
    let newState = { ...cartState };
    newState.orderDetails.totalPrice = totalPrice;
    newState.orderDetails.deliveryCost = deliveryCost;
    setCartState(newState);
  };

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

  const summaryItems = cartState.cartItems.map((x) => {
    return {
      productName: x.name,
      quantity: cartState.orderDetails.products[x._id],
      price: cartState.orderDetails.products[x._id] * x.price,
    };
  });

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
        <ShoppingCartContext.Provider value={{ cartState, setCartState }}>
          {step === PaymentSteps.OrderDetails && <ShoppingCartStep1 />}
          {step === PaymentSteps.ConfirmProducts && (
            <ShoppingCartStep2 updatePrice={updatePrice} />
          )}
          {step === PaymentSteps.Payment && (
            <ShoppingCartStep3 summaryItems={summaryItems} />
          )}
        </ShoppingCartContext.Provider>
      </ContentWrapper>
      {step !== PaymentSteps.Payment && (
        <div style={{ textAlign: "center", margin: "20px 0px" }}>
          <Button onClick={nextStep}>Next step</Button>
        </div>
      )}
    </PageWrapper>
  );
};
export default ShoppingCart;
