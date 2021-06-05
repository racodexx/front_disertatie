import { Button } from "primereact/button";
import React from "react";
import styled from "styled-components";

import ProductAvailabilityItem from "../base/ProductAvailabilityItem";
import { image, formatPrice } from "../../utils/util";

const Wrapper = styled.div`
  width: 95%;
  margin: auto;
  background-color: white;
  .test {
    text-align: center;
    box-shadow: 3px 3px 9px 2px grey;
    border-radius: 4px;
    .image-wrapper {
      height: 230px;
    }
    .content-wrapper {
      text-align: center;
      padding: 0px 10px 20px 10px;
      .title {
        font-size: 27px;
        font-weight: 500;
        margin-top: 10px;
      }
      .description {
        height: 30px;
      }
    }
    margin-bottom: 20px;
    margin-top: 20px;
  }
`;

const ItemImage = styled.div`
  background-image: url(${(params) => params.src});
  background-size: cover;
  height: 100%;
`;

const FeaturedItem = ({ product, addToCart }) => {
  let description =
    product.description.length > 70
      ? product.description.substring(0, 70) + "..."
      : product.description;
  return (
    <Wrapper>
      <div className="test">
        <div className="image-wrapper">
          <ItemImage src={image(product._id)} />
        </div>
        <div className="content-wrapper">
          <div className="title">{product.name}</div>
          <h3 className="p-mt-0 p-mb-3">{formatPrice(product.price)}</h3>
          <p className="description">{description}</p>
          <ProductAvailabilityItem
            availabilityStatusId={product.availabilityStatusId}
          />
          <div className="car-buttons p-mt-5">
            <Button onClick={addToCart}>Add to cart</Button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
export default FeaturedItem;
