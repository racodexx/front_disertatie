import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Steps } from "primereact/steps";
import { Button } from "primereact/button";

import ShoppingCartContext from "./contexts/ShoppingCartContext";
import ShoppingCartStep2 from "./ShoppingCartStep2";
import ShoppingCartStep1 from "./ShoppingCartStep1";
import ShoppingCartStep3 from "./ShoppingCartStep3";
import AgreeTerms from "./AgreeTerms";
import PaymentType from "../../utils/enums/PaymentType";

import { getProducts } from "../../services/productService";
import {
  getCartProducts_LS,
  saveUserOrderDetails_LS,
  getUserOrderDetails_LS,
  setCartProducts_LS,
} from "../../utils/util";

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

const NoItems = styled.div`
  text-align: center;
  position: absolute;
  width: 70%;
  top: 20%;
  transform: translateY(-20%);
  left: 50%;
  transform: translateX(-50%);
  i {
    font-size: 200px;
    color: #ff8c00a8;
  }
  h1 {
    margin-bottom: 40px;
  }
  @media only screen and (max-width: 500px) {
    i {
      font-size: 100px;
    }
  }
`;

const OrderRegistered = styled.div`
  width: 70%;
  position: absolute;
  top: 20%;
  transform: translateY(-20%);
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  i {
    color: green;
    font-size: 80px;
  }
  .delivery-info {
    font-weight: 500;
    color: darkorange;
  }
`;

const PaymentSteps = {
  OrderDetails: 0,
  ConfirmProducts: 1,
  Payment: 2,
  Finalized: 3,
};
const FreeDeliveryLimit = 35;
const DeliveryFee = 10;

const ShoppingCart = () => {
  const [step, setStep] = useState(PaymentSteps.OrderDetails);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [orderDetailsFieldErrors, setOrderDetailsFieldErrors] = useState({});

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
    //eslint-disable-next-line
  }, [
    hasLoaded,
    cartState.orderDetails.products,
    cartState.orderDetails.includeDelivery,
  ]);

  const load = async () => {
    let storedProducts = getCartProducts_LS();
    let searchParameters = { ids: Object.keys(storedProducts) };
    let result = await getProducts(searchParameters);
    let newState = { ...cartState };
    newState.orderDetails.products = storedProducts;
    newState.cartItems = result.data;
    setUserOrderDetailsFromLocalstorage(newState);
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
    console.log({ totalPrice });
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

  const setUserOrderDetailsFromLocalstorage = (newState) => {
    let browserData = getUserOrderDetails_LS();
    if (browserData.name) {
      newState.orderDetails.name = browserData.name;
    }
    if (browserData.phone) {
      newState.orderDetails.phone = browserData.phone;
    }
    if (browserData.email) {
      newState.orderDetails.email = browserData.email;
    }
    if (browserData.includeDelivery) {
      newState.orderDetails.includeDelivery = browserData.includeDelivery;
      if (browserData.street) {
        newState.orderDetails.street = browserData.street;
      }
      if (browserData.number) {
        newState.orderDetails.number = browserData.number;
      }
    }
  };

  const storeUserOrderData = () => {
    let dataToStore = {
      name: cartState.orderDetails.name,
      phone: cartState.orderDetails.phone,
      email: cartState.orderDetails.email,
    };
    if (cartState.orderDetails.includeDelivery) {
      dataToStore.includeDelivery = true;
      dataToStore.street = cartState.orderDetails.street;
      dataToStore.number = cartState.orderDetails.number;
    }
    saveUserOrderDetails_LS(dataToStore);
  };
  const nextStep = (index) => {
    if (index !== null) {
      if (step === PaymentSteps.OrderDetails) {
        let isValid = checkOrderDetails();
        if (!isValid) {
          return;
        }
      }
      setStep(index);
      return;
    }
    let newStep;
    switch (step) {
      case PaymentSteps.OrderDetails:
        let isValid = checkOrderDetails();
        if (!isValid) {
          return;
        }
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

  const checkOrderDetails = () => {
    let errors = {};
    if (!cartState.orderDetails.name) {
      errors["name"] = "Name is required!";
    }
    if (!cartState.orderDetails.phone) {
      errors["phone"] = "Phone number is required!";
    }
    if (!cartState.orderDetails.email) {
      errors["email"] = "Email is required!";
    }
    if (cartState.orderDetails.includeDelivery) {
      if (!cartState.orderDetails.street) {
        errors["street"] = "Street is required!";
      }
      if (!cartState.orderDetails.number) {
        errors["number"] = "Address number is required!";
      }
    }

    if (Object.keys(errors).length === 0) {
      storeUserOrderData();
      return true;
    }
    setOrderDetailsFieldErrors(errors);
    return false;
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
      <AgreeTerms />
      {step !== PaymentSteps.Finalized && (
        <>
          {cartState.cartItems.length ? (
            <>
              <StepsWrapper>
                <Steps
                  model={items}
                  activeIndex={step}
                  onSelect={(e) => {
                    nextStep(e.index);
                  }}
                  readOnly={false}
                />
              </StepsWrapper>
              <ContentWrapper>
                <ShoppingCartContext.Provider
                  value={{ cartState, setCartState }}
                >
                  {step === PaymentSteps.OrderDetails && (
                    <ShoppingCartStep1
                      fieldErrors={orderDetailsFieldErrors}
                      setFieldErrors={setOrderDetailsFieldErrors}
                    />
                  )}
                  {step === PaymentSteps.ConfirmProducts && (
                    <ShoppingCartStep2 updatePrice={updatePrice} />
                  )}
                  {step === PaymentSteps.Payment && (
                    <ShoppingCartStep3
                      summaryItems={summaryItems}
                      setPaymentFinalized={() => {
                        setStep(PaymentSteps.Finalized);
                        setCartProducts_LS({});
                      }}
                    />
                  )}
                </ShoppingCartContext.Provider>
              </ContentWrapper>
              {step !== PaymentSteps.Payment && (
                <div style={{ textAlign: "center", margin: "20px 0px" }}>
                  <Button onClick={() => nextStep(null)}>Next step</Button>
                </div>
              )}
            </>
          ) : (
            <NoItems>
              <i className="pi pi-shopping-cart"></i>
              <h1>Your shopping cart it's empty😞</h1>
              <Button
                onClick={() => {
                  window.location.href = "/#/client/menu";
                }}
              >
                Start shopping
              </Button>
            </NoItems>
          )}
        </>
      )}
      {step === PaymentSteps.Finalized && (
        <OrderRegistered>
          <i className="pi pi-check-circle"></i>
          <h1>Your order has been successfully registered!</h1>
          <div className="delivery-info">
            {cartState.orderDetails.includeDelivery
              ? "The order will be delivered in about 45 minutes"
              : "You can pick up the order in about 25 minutes"}
          </div>
        </OrderRegistered>
      )}
    </PageWrapper>
  );
};
export default ShoppingCart;
