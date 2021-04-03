import React from "react";
import styled from "styled-components";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import "../../styles/payment-form-style.css";

const SummaryWrapper = styled.div``;

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// loadStripe is initialized with your real test publishable API key.
const promise = loadStripe(
  "pk_test_51I0QVrKwRJOVXJjj6alwm3EH3qsGIGIatJofCyurbdZkWw5rPsg1c8x9sesaw2va5o8MAfrBWRq7rPGsoltRiP5z00KCS2oBkO"
);

export default function ShoppingCartStep3V2() {
  return (
    <>
      <SummaryWrapper>
        <h3>Summary</h3>
      </SummaryWrapper>
      <Elements stripe={promise}>
        <CheckoutForm />
      </Elements>
    </>
  );
}
