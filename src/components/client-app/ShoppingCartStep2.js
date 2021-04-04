import React from "react";
import styled from "styled-components";
import CartItem from "../base/CartItem";

const Total = styled.div`
  display: flex;
  border-bottom: 1px solid;
  justify-content: space-between;
  .right-side {
    text-align: right;
  }
  .free {
    color: green;
  }
  .transport {
    h3 {
      margin: unset;
    }
    h1 {
      margin-top: 10px;
    }
  }
`;

const ShoppingCartStep2 = ({
  includeDelivery,
  deliveryFee,
  freeDeliveryLimit,
  cartItems,
  quantities,
  setQuantities,
  removeProduct,
  totalPrice,
}) => {
  return (
    <>
      <div className="p-grid">
        <div className="p-col-4 p-lg-8 p-md-6">
          <h3>Products</h3>
        </div>
        <div className="p-col-4 p-lg-2 p-md-3 text-center">
          <h3>Quantity</h3>
        </div>
        <div className="p-col-4 p-lg-2 p-md-3 text-right">
          <h3>Price per unit</h3>
        </div>
      </div>
      {cartItems &&
        cartItems.map((x, index) => (
          <CartItem
            key={index}
            product={x}
            quantity={quantities[x._id]}
            setQuantity={(quantity) => {
              if (quantity > 0) {
                setQuantities({ ...quantities, [x._id]: quantity });
              }
            }}
            removeItem={() => {
              removeProduct(x._id);
            }}
          />
        ))}
      <Total>
        <h1>Total</h1>
        <div className="right-side">
          <h3 style={{ marginBottom: "unset" }}>{totalPrice}</h3>
          <div className="transport">
            {deliveryFee ? (
              <>
                <h3>{`+${deliveryFee} delivery fee`}</h3>
                <strong className="free">
                  *free delivery for orders over {freeDeliveryLimit}
                </strong>
                )
              </>
            ) : (
              includeDelivery && <h3 className="free">free delivery</h3>
            )}
          </div>
          <h1>{"=" + (totalPrice + deliveryFee)}</h1>
        </div>
      </Total>
    </>
  );
};
export default ShoppingCartStep2;
