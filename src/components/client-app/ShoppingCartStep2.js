import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CartItem from "../base/CartItem";

import { getProducts } from "../../services/productService";
import { getCartProducts, setCartProducts } from "../../utils/util";

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

const ShoppingCartStep2 = ({ includeDelivery }) => {
  const FreeDeliveryLimit = 35;
  const DeliveryFee = 10;
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});

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
    for (let product of cartItems) {
      totalPrice += product.price * quantities[product._id];
    }
    return totalPrice;
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
  const totalPrice = getTotalPrice();
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
          {includeDelivery && (
            <div className="transport">
              {totalPrice < FreeDeliveryLimit ? (
                <>
                  <h3>{`+${DeliveryFee} delivery fee`}</h3>
                  <strong className="free">
                    *free delivery for orders over {FreeDeliveryLimit}
                  </strong>
                </>
              ) : (
                <h3 className="free">free delivery</h3>
              )}
            </div>
          )}
          <h1>{"=" + (totalPrice + (includeDelivery ? DeliveryFee : 0))}</h1>
        </div>
      </Total>
    </>
  );
};
export default ShoppingCartStep2;
