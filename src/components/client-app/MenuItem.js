import React from "react";
import styled from "styled-components";
import { image, formatPrice } from "../../utils/util";
import ProductAvailabilityStatus from "../../utils/enums/ProductAvailabilityStatus";

const ItemWrapper = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  padding: 20px;
  margin: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  min-height: 180px;
  .price {
    font-weight: 700;
    color: orange;
  }
  &.unavailable {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media screen and (max-width: 1000px) {
    display: block;
    img {
      height: unset;
      width: 100%;
    }
  }
`;

const MenuItem = ({ item, onClick }) => {
  const isAvailable =
    item.availabilityStatusId !== ProductAvailabilityStatus.Unavailable;
  return (
    <ItemWrapper
      className={!isAvailable ? "unavailable" : ""}
      onClick={() => {
        if (isAvailable) {
          onClick();
        }
      }}
    >
      <img src={image(item._id)} alt="product" height="150" width="200" />
      <div>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <p className="price">{formatPrice(item.price)}</p>
      </div>
    </ItemWrapper>
  );
};
export default MenuItem;
