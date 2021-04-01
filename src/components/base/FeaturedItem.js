import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import React from "react";
import styled from "styled-components";

import ProductAvailabilityItem from "../base/ProductAvailabilityItem";
import { image } from "../../utils/util";

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
      padding-bottom: 20px;
    }
    margin-bottom: 20px;
    margin-top: 20px;
  }
`;

const RatingWrapper = styled.div`
  .p-rating .p-rating-icon.pi-star {
    color: #ffd700;
  }
`;

const ItemImage = styled.div`
  background-image: url(${(params) => params.src});
  background-size: cover;
  height: 100%;
`;

const FeaturedItem = ({ product, addToCart }) => {
  return (
    <Wrapper>
      <div className="test">
        <div className="image-wrapper">
          <ItemImage src={image(product._id)} />
        </div>
        <div className="content-wrapper">
          <h1 className="p-mb-1">{product.name}</h1>
          <RatingWrapper>
            <Rating value={5} readOnly stars={5} cancel={false} />
          </RatingWrapper>
          <h3 className="p-mt-0 p-mb-3">${product.price}</h3>
          <p>{product.description}</p>
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
