import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { image, formatPrice, addProductToCart_LS } from "../../utils/util";
const AddToCartDialog = ({ onClose, product }) => {
  const [quantity, setQuantity] = useState(1);
  const addToCart = () => {
    addProductToCart_LS(product._id, quantity);
    onClose(true);
  };

  useEffect(() => {
    setQuantity(1);
  }, [product]);

  const footer = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => onClose(false)}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={addToCart}
      />
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
        <div className="p-d-flex p-jc-between p-ai-center">
          <img src={image(product._id)} height="100" alt="product" />
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
            />
          </div>
        </div>
      )}
    </Dialog>
  );
};
export default AddToCartDialog;
