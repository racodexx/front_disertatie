import axios from "axios";
let baseURL = "http://localhost:4000/orders";

export const getOrders = async () => {
  let result = await axios.get(baseURL);
  return result;
};
