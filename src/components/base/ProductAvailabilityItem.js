import React from "react";
import { ProductAvailabilityStatusSelection } from "../../utils/dataSelections";
const ProductAvailabilityItem = ({ availabilityStatusId }) => {
  let item = ProductAvailabilityStatusSelection.find(
    (x) => x.id === availabilityStatusId
  );
  return <strong style={{ color: item.color }}>{item.name}</strong>;
};
export default ProductAvailabilityItem;
