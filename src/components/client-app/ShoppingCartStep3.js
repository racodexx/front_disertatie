import React, { useContext } from "react";
import styled from "styled-components";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import "../../styles/payment-form-style.css";
import { RadioButton } from "primereact/radiobutton";
import PaymentType from "../../utils/enums/PaymentType";
import PaymentButton from "./PaymentButton";
import { addOrder } from "../../services/orderService";

import ShoppingCartContext from "./contexts/ShoppingCartContext";

const PageStyle = styled.div`
  @media screen and (max-width: 550px) {
    width: 100%;
  }
  width: 500px;
  margin: auto;
`;

const SummaryWrapper = styled.div`
  background-color: aliceblue;
  padding: 20px;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  .summary-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .product {
      font-weight: 500;
      font-size: 18px;
    }
    .price {
      font-weight: 500;
    }
  }
  .totals {
    margin-top: 5px;
    font-weight: 500;
    font-size: 25px;
    padding-top: 5px;
    border-top: 1px solid #00000033;
  }
`;

const PaymentMethodWrapper = styled.div`
  width: 100%;
  align-self: center;
  box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
    0px 2px 5px 0px rgba(50, 50, 93, 0.1), 0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
  border-radius: 7px;
  padding: 20px;
  margin: auto;

  @media only screen and (max-width: 550px) {
    padding: 20px 10px;
  }
`;

const SummaryItem = ({ name, quantity, price }) => {
  return (
    <div className="summary-item">
      <div className="product">{quantity + " X " + name}</div>
      <div className="price">{price}</div>
    </div>
  );
};

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// loadStripe is initialized with your real test publishable API key.
const promise = loadStripe(
  "pk_test_51I0QVrKwRJOVXJjj6alwm3EH3qsGIGIatJofCyurbdZkWw5rPsg1c8x9sesaw2va5o8MAfrBWRq7rPGsoltRiP5z00KCS2oBkO"
);

export default function ShoppingCartStep3({
  summaryItems,
  setPaymentFinalized,
}) {
  const { cartState, setCartState } = useContext(ShoppingCartContext);
  const setPaymentType = (paymentType) => {
    let newState = { ...cartState };
    newState.orderDetails.paymentType = paymentType;
    setCartState(newState);
  };

  const saveOrder = async (stripePaymentId = null) => {
    let newOrder = {
      products: cartState.orderDetails.products,
      name: cartState.orderDetails.name,
      phone: cartState.orderDetails.phone,
      email: cartState.orderDetails.email,
      includeDelivery: cartState.orderDetails.includeDelivery,
      paymentType: cartState.orderDetails.paymentType,
    };
    if (cartState.orderDetails.includeDelivery) {
      newOrder.street = cartState.orderDetails.street;
      newOrder.number = cartState.orderDetails.number;
    }
    if (cartState.orderDetails.description) {
      newOrder.description = cartState.orderDetails.description;
    }
    if (cartState.orderDetails.paymentType === PaymentType.Card) {
      newOrder.stripePaymentId = stripePaymentId;
    }
    console.log(newOrder);
    let result = await addOrder(newOrder);
  };

  const summary = summaryItems.map((x, index) => (
    <SummaryItem
      key={index}
      name={x.productName}
      quantity={x.quantity}
      price={x.price}
    />
  ));
  return (
    <PageStyle>
      <SummaryWrapper>
        <h3 style={{ marginTop: "unset" }}>Summary</h3>
        {summary}
        {cartState.orderDetails.deliveryCost ? (
          <div className="summary-item ">
            <div className="product">Delivery fee</div>
            <div className="price">{cartState.orderDetails.deliveryCost}</div>
          </div>
        ) : (
          ""
        )}
        <div className="p-d-flex p-jc-between totals">
          <div>Total value</div>
          <div>
            {cartState.orderDetails.totalPrice +
              cartState.orderDetails.deliveryCost}
          </div>
        </div>
      </SummaryWrapper>
      <PaymentMethodWrapper>
        <h3 style={{ marginTop: "unset" }}>Payment method</h3>
        <div className="p-grid">
          <div className="p-field-radiobutton p-col-6">
            <RadioButton
              inputId="paymentCard"
              name="paymentType"
              onChange={(e) => setPaymentType(PaymentType.Card)}
              checked={cartState.orderDetails.paymentType === PaymentType.Card}
            />
            <label htmlFor="paymentCard">Online (card)</label>
          </div>
          <div className="p-field-radiobutton p-col-6">
            <RadioButton
              inputId="paymentCash"
              name="paymentType"
              onChange={(e) => setPaymentType(PaymentType.Cash)}
              checked={cartState.orderDetails.paymentType === PaymentType.Cash}
            />
            <label htmlFor="paymentCash">At delivery</label>
          </div>
        </div>
        {cartState.orderDetails.paymentType === PaymentType.Card && (
          <Elements stripe={promise}>
            <CheckoutForm
              orderDetails={cartState.orderDetails}
              saveOrder={saveOrder}
              setPaymentFinalized={setPaymentFinalized}
            />
          </Elements>
        )}
        {cartState.orderDetails.paymentType === PaymentType.Cash && (
          <PaymentButton onClick={saveOrder}>Finalize order</PaymentButton>
        )}
      </PaymentMethodWrapper>
    </PageStyle>
  );
}
