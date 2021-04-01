const image = (name) => {
  return `http://localhost:9000/?image=${name}.jpg`;
};

const handleApiActionResult = (result, toastRef) => {
  if (toastRef) {
    toastRef.current.show({
      severity: result.status,
      summary: result.status.toUpperCase(),
      detail: result.message,
      life: 3000,
    });
  }

  return result.status === "success" ? result.data || true : false;
};

const getCartProducts = () => {
  let data = localStorage.getItem("ShoppingCartProducts");
  let parsedData = data ? JSON.parse(data) : {};
  return parsedData;
};

const setCartProducts = (products) => {
  localStorage.setItem("ShoppingCartProducts", JSON.stringify(products));
};

const addProductToCart = (productId) => {
  let data = localStorage.getItem("ShoppingCartProducts");
  let existingProducts = data ? JSON.parse(data) : {};
  existingProducts[productId] = 1;
  localStorage.setItem(
    "ShoppingCartProducts",
    JSON.stringify(existingProducts)
  );
};
const removeProductFromCart = (productId) => {
  let data = localStorage.getItem("ShoppingCartProducts");
  let existingProducts = data && JSON.parse(data);
  if (!existingProducts) {
    return;
  }
  if (existingProducts[productId]) {
    delete existingProducts[productId];
  }
  localStorage.setItem(
    "ShoppingCartProducts",
    JSON.stringify(existingProducts)
  );
};
export {
  image,
  handleApiActionResult,
  getCartProducts,
  setCartProducts,
  addProductToCart,
  removeProductFromCart,
};
