import React from "react";
import styled from "styled-components";
import { image } from "../../utils/util";

const Wrapper = styled.div`
  @media only screen and (max-width: 900px) {
    .description {
      display: none;
    }
    /* img {
      display: none;
    } */
  }
  @media only screen and (max-width: 769px) {
    /* .description, */
    img {
      display: none;
    }
  }
  border-bottom: 1px solid;
  &.p-grid {
    margin: unset;
  }
  h3,
  p {
    margin: unset;
  }
  .quantity-wrapper {
    text-align: center;
    margin: auto;
    .remove-item {
      margin-top: 5px;
      font-size: 14px;
      text-decoration: underline;
      color: #a3a3a3;
      cursor: pointer;
      :hover {
        color: red;
      }
    }
    .quantity {
      display: inline-flex;
      align-items: center;
      h3 {
        margin: 0px 10px;
      }
      button {
        border-radius: 50%;
      }
      i {
        font-size: 25px;
        cursor: pointer;
      }
    }
  }

  .price {
    text-align: right;
    margin: auto;
  }
`;

const CartItem = ({ product, quantity, setQuantity, removeItem }) => {
  return (
    <Wrapper className="p-grid">
      <div className="p-col-4 p-lg-8 p-md-6">
        <div style={{ display: "flex" }}>
          <img src={image(product._id)} alt="productImage" height="100" />
          <div style={{ paddingLeft: "10px" }}>
            <h3>{product.name}</h3>
            <p className="description">{product.description}</p>
          </div>
        </div>
      </div>
      <div className="p-col-4 p-lg-2 p-md-3 quantity-wrapper">
        <div className="quantity">
          <i
            className="pi pi-minus-circle"
            onClick={() => {
              setQuantity(quantity - 1);
            }}
          ></i>
          <h3>{quantity || 0}</h3>
          <i
            className="pi pi-plus-circle"
            onClick={() => {
              setQuantity(quantity + 1);
            }}
          ></i>
        </div>
        <br />
        <div className="remove-item" onClick={removeItem}>
          remove item
        </div>
      </div>
      <div className="p-col-4 p-lg-2 p-md-3 price">
        <h3>{product.price}</h3>
      </div>
    </Wrapper>
  );
};
export default CartItem;
