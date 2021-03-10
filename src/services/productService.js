import axios from "axios";
let baseURL = "http://localhost:4000/products";

export const getProducts = async (searchParameters = null) => {
  let params = {};
  console.log(searchParameters);
  if (searchParameters) {
    params = {
      searchParameters,
    };
  }
  let result = await axios.get(baseURL + "/search", { params });
  return result.data;
};

export const addProduct = async (product) => {
  let result = await axios.post(baseURL + "/add", product);
  return result.data;
};

export const editProduct = async (product) => {
  let result = await axios.put(baseURL + "/edit", product);
  return result.data;
};

export const deleteProduct = async (poductId) => {
  let result = await axios.post(baseURL + "/delete/?productId=" + poductId);
  return result.data;
};

export const deleteProducts = async (poductIds) => {
  let result = await axios.post(baseURL + "/delete", { poductIds });
  return result.data;
};

export const uploadPicture = async (formData) => {
  let result = await axios.post("http://localhost:9000/", formData);
  return result.data;
};
