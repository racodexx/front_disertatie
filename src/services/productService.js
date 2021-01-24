import axios from "axios";
let baseURL = "http://localhost:4000/products";

export const getProducts = async () => {
  let result = await axios.get(baseURL);
  return result;
};

export const addProduct = async (product) => {
  let result = await axios.post(baseURL + "/add", product);
  return result;
};
