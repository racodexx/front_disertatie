import axios from "axios";
let baseURL = "http://localhost:4000/payments";

export const paymentIntent = async (orderDetails) => {
  let result = await axios.post(baseURL + "/intent", orderDetails);
  return result.data;
};
