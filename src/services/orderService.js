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

export const deleteOrders = async (orderIds) => {
  let result = await axios.post(baseURL + "/delete", { orderIds });
  return result.data;
};

//the body needs the id of the order and the modified fields
export const updateOrder = async (order) => {
  console.log(order);
  let result = await axios.put(baseURL + "/update", order);
  return result.data;
};
