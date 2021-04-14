import React from "react";
import styled from "styled-components";
import PaymentType from "../../../utils/enums/PaymentType";
const OrderDetailsWrapper = styled.div`
  .contact-details {
    background-color: aliceblue;
    padding: 20px;
  }
  .products-list {
    .p-grid {
      margin-top: unset;
    }
    .product-list-header {
      background-color: lightgrey;
    }
    .product-list-item {
      padding: 5px 0px;
      :nth-child(odd) {
        background-color: aliceblue;
      }
    }
  }
`;

const OrderDetailsView = ({ order }) => {
  const products = order.products.map((x) => {
    return (
      <div className="p-grid product-list-item">
        <div className="p-col-5 value">{x.product._id}</div>
        <div className="p-col-5 value">{x.product.name}</div>
        <div className="p-col-2 value">{x.quantity}</div>
      </div>
    );
  });
  return (
    <OrderDetailsWrapper>
      <div className="p-grid">
        <div className="p-col-6">
          <div className="p-grid">
            <label className="p-col-4">Order Id</label>
            <div className="p-col-8 value">{order._id}</div>
          </div>
          <div className="p-grid">
            <label className="p-col-4">Date</label>
            <div className="p-col-8 value">{order.date}</div>
          </div>
          <div className="p-grid">
            <label className="p-col-4">Time</label>
            <div className="p-col-8 value">{order.time}</div>
          </div>
          <div className="p-grid">
            <label className="p-col-4">Include delivery</label>
            <div className="p-col-8 value">
              {order.includeDelivery ? "Yes" : "No"}
            </div>
          </div>
          <div className="p-grid">
            <label className="p-col-4">Price</label>
            <div className="p-col-8 value">{order.price}</div>
          </div>
          <div className="p-grid">
            <label className="p-col-4">Payment type</label>
            <div className="p-col-8 value">
              {order.paymentType === PaymentType.Card ? "Card" : "Cash"}
            </div>
          </div>
          <div className="p-grid">
            <label className="p-col-4">Is paid</label>
            <div className="p-col-8 value">
              {order.stripePaymentId ? "Yes" : "No"}
            </div>
          </div>
        </div>
        <div className="p-col-6 contact-details">
          <h3>Contact details</h3>
          {order.includeDelivery && (
            <>
              <div className="p-grid">
                <label className="p-col-4">Street</label>
                <div className="p-col-8 value">{order.street}</div>
              </div>
              <div className="p-grid">
                <label className="p-col-4">Number</label>
                <div className="p-col-8 value">{order.number}</div>
              </div>
            </>
          )}
          <div className="p-grid">
            <label className="p-col-4">Phone number</label>
            <div className="p-col-8 value">{order.phone}</div>
          </div>
        </div>
      </div>
      <div className="products-list">
        <h3>Ordered products</h3>
        <div className="p-grid product-list-header">
          <label className="p-col-5">Id</label>
          <label className="p-col-5">Name</label>
          <label className="p-col-2">Quantity</label>
        </div>
        {products}
      </div>
    </OrderDetailsWrapper>
  );
};
export default OrderDetailsView;
