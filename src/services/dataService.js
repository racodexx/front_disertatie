import axios from "axios";
let baseURL = "http://localhost:3000/";

export const addBook = async (data) => {
  let result = await axios.post(baseURL + "book", data);
  return result;
};
