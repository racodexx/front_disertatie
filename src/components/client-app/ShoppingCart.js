import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Steps } from "primereact/steps";
import { Button } from "primereact/button";

import ShoppingCartStep2 from "./ShoppingCartStep2";
import ShoppingCartStep1 from "./ShoppingCartStep1";
import ShoppingCartStep3 from "./ShoppingCartStep3";
import PaymentType from "../../utils/enums/PaymentType";

import { getProducts } from "../../services/productService";
import { getCartProducts, setCartProducts } from "../../utils/util";

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

  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState();

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setCartProducts(quantities);
  }, [quantities]);

  const load = async () => {
    let storedProducts = getCartProducts();
    setQuantities(storedProducts);
    let searchParameters = { ids: Object.keys(storedProducts) };
    let result = await getProducts(searchParameters);
    setCartItems(result.data);
  };

  const getTotalPrice = () => {
    let totalPrice = 0;
    let deliveryCost = 0;
    for (let product of cartItems) {
      totalPrice += product.price * quantities[product._id];
    }

    if (orderDetails.includeDelivery && totalPrice < FreeDeliveryLimit) {
      deliveryCost = DeliveryFee;
    }
    return { totalPrice, deliveryCost };
  };

  const removeProduct = (productId) => {
    let newProducts = [...cartItems];
    let index = newProducts.indexOf(
      newProducts.find((x) => x._id === productId)
    );
    newProducts.splice(index, 1);
    setCartItems(newProducts);

    let newQuantities = { ...quantities };
    delete newQuantities[productId];
    setQuantities(newQuantities);
  };

  const { totalPrice, deliveryCost } = getTotalPrice();

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

  const summaryItems = cartItems.map((x) => {
    return {
      productName: x.name,
      quantity: quantities[x._id],
      price: quantities[x._id] * x.price,
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
        {step === PaymentSteps.OrderDetails && (
          <ShoppingCartStep1 state={orderDetails} setState={setOrderDetails} />
        )}
        {step === PaymentSteps.ConfirmProducts && (
          <ShoppingCartStep2
            includeDelivery={orderDetails.includeDelivery}
            deliveryFee={deliveryCost}
            freeDeliveryLimit={FreeDeliveryLimit}
            cartItems={cartItems}
            quantities={quantities}
            setQuantities={setQuantities}
            totalPrice={totalPrice}
            removeProduct={removeProduct}
          />
        )}
        {step === PaymentSteps.Payment && (
          <ShoppingCartStep3
            summaryItems={summaryItems}
            totalPrice={totalPrice}
            deliveryFee={orderDetails.includeDelivery && deliveryCost}
          />
        )}
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
