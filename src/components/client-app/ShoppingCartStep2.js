import React, { useContext } from "react";
import styled from "styled-components";
import CartItem from "../base/CartItem";
import ShoppingCartContext from "./contexts/ShoppingCartContext";
import { setCartProducts_LS, formatPrice } from "../../utils/util";

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

const ShoppingCartStep2 = ({ updatePrice }) => {
  const { cartState, setCartState } = useContext(ShoppingCartContext);

  const setOrderProductQuantity = (productId, quantity) => {
    let newState = { ...cartState };
    newState.orderDetails.products[productId] = quantity;
    setCartState(newState);
    setCartProducts_LS(newState.orderDetails.products);
    updatePrice();
  };

  const removeProduct = (productId) => {
    let newState = { ...cartState };
    let index = newState.cartItems.indexOf(
      newState.cartItems.find((x) => x._id === productId)
    );
    newState.cartItems.splice(index, 1);
    delete newState.orderDetails.products[productId];
    setCartState(newState);
    setCartProducts_LS(newState.orderDetails.products);
    updatePrice();
  };

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
      <div style={{ overflowY: "auto", maxHeight: "460px" }}>
        {cartState.cartItems &&
          cartState.cartItems.map((x, index) => (
            <CartItem
              key={index}
              product={x}
              quantity={cartState.orderDetails.products[x._id]}
              setQuantity={(quantity) => {
                if (quantity > 0) {
                  setOrderProductQuantity(x._id, quantity);
                }
              }}
              removeItem={() => {
                removeProduct(x._id);
              }}
            />
          ))}
      </div>
      <Total>
        <h1>Total</h1>
        <div className="right-side">
          <h3 style={{ marginBottom: "unset" }}>
            {formatPrice(cartState.orderDetails.totalPrice)}
          </h3>
          <div className="transport">
            {cartState.orderDetails.deliveryCost ? (
              <>
                <h3>{`+${formatPrice(
                  cartState.orderDetails.deliveryCost
                )} delivery fee`}</h3>
                <strong className="free">
                  *free delivery for orders over{" "}
                  {formatPrice(cartState.freeDeliveryLimit)}
                </strong>
                )
              </>
            ) : (
              cartState.orderDetails.includeDelivery && (
                <h3 className="free">free delivery</h3>
              )
            )}
          </div>
          <h1>
            {"=" +
              formatPrice(
                cartState.orderDetails.totalPrice +
                  cartState.orderDetails.deliveryCost
              )}
          </h1>
        </div>
      </Total>
    </>
  );
};
export default ShoppingCartStep2;
