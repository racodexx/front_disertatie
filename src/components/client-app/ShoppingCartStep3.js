import React, { useContext } from "react";
import styled from "styled-components";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import "../../styles/payment-form-style.css";

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
  .title {
    margin-top: unset;
  }
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

export default function ShoppingCartStep3({ summaryItems }) {
  const { cartState, setCartState } = useContext(ShoppingCartContext);
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
        <h3 className="title">Summary</h3>
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
      <Elements stripe={promise}>
        <CheckoutForm orderDetails={cartState.orderDetails} />
      </Elements>
    </PageStyle>
  );
}
