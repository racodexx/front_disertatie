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
      <Button onClick={addToCart}>Add</Button>
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
