import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { image, formatPrice, addProductToCart_LS } from "../../utils/util";
import ProductAvailabilityStatus from "../../utils/enums/ProductAvailabilityStatus";
import { ProductAvailabilityStatusSelection } from "../../utils/dataSelections";

const AddToCartDialog = ({ onClose, product }) => {
  const [quantity, setQuantity] = useState(1);
  const addToCart = () => {
    addProductToCart_LS(product._id, quantity);
    onClose(true);
  };
  useEffect(() => {
    setQuantity(1);
  }, [product]);

  const isUnavailable =
    product?.availabilityStatusId === ProductAvailabilityStatus.Unavailable;

  const getAvailability = () => {
    if (!product) {
      return;
    }
    let obj = ProductAvailabilityStatusSelection.find(
      (x) => x.id === product?.availabilityStatusId
    );
    return (
      <h3
        style={{
          color: obj.color,
          backgroundColor: obj.color + "2b",
          display: "inline-block",
          padding: "2px 8px",
        }}
      >
        {obj.name}
      </h3>
    );
  };

  const availability = getAvailability();

  const footer = (
    <React.Fragment>
      <Button onClick={addToCart} disabled={isUnavailable}>
        Add
      </Button>
    </React.Fragment>
  );

  return (
    <Dialog
      visible={product}
      style={{ width: "650px" }}
      header="Add to shopping cart"
      modal
      footer={footer}
      onHide={() => onClose(false)}
    >
      {product && (
        <>
          <img src={image(product._id)} width="100%" alt="product" />
          <div style={{ textAlign: "center" }}>{availability}</div>
          <div className="p-d-flex p-jc-between p-ai-center">
            <div>
              <p>Name</p>
              <h3>{product.name}</h3>
            </div>
            <div>
              <p>Price</p>
              <h3>{formatPrice(product.price)}</h3>
            </div>
            <div>
              <p style={{ marginBottom: "15px" }}>Quantity</p>
              <InputNumber
                value={quantity}
                onValueChange={(e) => setQuantity(e.target.value)}
                style={{ width: "60px", marginBottom: "8px" }}
                min={1}
                max={10}
                disabled={isUnavailable}
              />
            </div>
          </div>
          <p>Description</p>
          <h4>{product.description}</h4>
        </>
      )}
    </Dialog>
  );
};
export default AddToCartDialog;
