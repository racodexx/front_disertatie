import React from "react";
import styled from "styled-components";
import { image, formatPrice } from "../../utils/util";
import { ProductAvailabilityStatusSelection } from "../../utils/dataSelections";

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
  h3 {
    margin: 5px;
  }
  .status-name {
    font-weight: 500;
    padding: 2px 8px;
  }
  .price {
    font-weight: 700;
    color: orange;
  }

  .img {
    max-width: 200px;
  }

  @media screen and (max-width: 1000px) {
    display: block;
    img {
      height: unset;
      width: 100%;
      max-width: unset;
    }
  }
`;

const MenuItem = ({ item, onClick }) => {
  const getAvailabilityName = () => {
    if (!item) {
      return;
    }
    let obj = ProductAvailabilityStatusSelection.find(
      (x) => x.id === item.availabilityStatusId
    );
    return (
      <small
        className="status-name"
        style={{ color: obj.color, backgroundColor: obj.color + "2b" }}
      >
        {obj.name}
      </small>
    );
  };
  const availabilityName = getAvailabilityName();

  return (
    <ItemWrapper
      onClick={() => {
        onClick();
      }}
    >
      <img src={image(item._id)} alt="product" height="150" />
      <div>
        <h3>{item.name}</h3>
        {availabilityName}
        <p>
          {item.description.length < 80
            ? item.description
            : item.description.substr(0, 80) + "..."}
        </p>
        <p className="price">{formatPrice(item.price)}</p>
      </div>
    </ItemWrapper>
  );
};
export default MenuItem;
