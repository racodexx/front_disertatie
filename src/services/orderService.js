import axios from "axios";
let baseURL = "http://localhost:4000/orders";

export const getOrders = async () => {
  let result = await axios.get(baseURL);
  return result;
};

export const addOrder = async (order) => {
  let result = await axios.post(baseURL + "/add", order);
  return result;
};
