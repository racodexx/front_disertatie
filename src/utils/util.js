const image = (name) => {
  return `http://localhost:9000/?image=${name}.jpg`;
};

const showNotification = (severity, summary, detail, toastRef) => {
  if (toastRef) {
    toastRef.current.show({
      severity: severity,
      summary: summary.toUpperCase(),
      detail: detail,
      life: 3000,
    });
  }
};

const handleApiActionResult = (result, toastRef = null) => {
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

const getCartProducts_LS = () => {
  let data = localStorage.getItem("ShoppingCartProducts");
  let parsedData = data ? JSON.parse(data) : {};
  return parsedData;
};

const setCartProducts_LS = (products) => {
  localStorage.setItem("ShoppingCartProducts", JSON.stringify(products));
};

const addProductToCart_LS = (productId, quantity) => {
  let data = localStorage.getItem("ShoppingCartProducts");
  let existingProducts = data ? JSON.parse(data) : {};
  if (existingProducts[productId]) {
    existingProducts[productId] += quantity;
  } else {
    existingProducts[productId] = quantity;
  }
  localStorage.setItem(
    "ShoppingCartProducts",
    JSON.stringify(existingProducts)
  );
};
const removeProductFromCart_LS = (productId) => {
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

const saveUserOrderDetails_LS = (userDetails) => {
  localStorage.setItem("UserOrderData", JSON.stringify(userDetails));
};

const getUserOrderDetails_LS = () => {
  let data = localStorage.getItem("UserOrderData");
  if (data) {
    return JSON.parse(data);
  }
  return {};
};

const formatPrice = (value) => {
  return value.toLocaleString("ro-RO", {
    style: "currency",
    currency: "RON",
  });
};

export {
  image,
  handleApiActionResult,
  getCartProducts_LS,
  setCartProducts_LS,
  addProductToCart_LS,
  removeProductFromCart_LS,
  saveUserOrderDetails_LS,
  getUserOrderDetails_LS,
  formatPrice,
  showNotification,
};
