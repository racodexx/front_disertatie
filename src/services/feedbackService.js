import axios from "axios";
let baseURL = "http://localhost:4000/feedbacks";

export const addFeedback = async (data) => {
  let result = await axios.post(baseURL + "/add", data);
  return result.data;
};

export const getFeedbacks = async () => {
  let result = await axios.get(baseURL + "/");
  return result.data;
};

export const readFeedback = async (feedbackId) => {
  const body = {
    _id: feedbackId,
  };
  let result = await axios.put(baseURL + "/read", body);
  return result.data;
};

export const sendReply = async (feedback, reply) => {
  const body = {
    _id: feedback._id,
    name: feedback.name,
    email: feedback.email,
    reply,
  };
  let result = await axios.post(baseURL + "/reply", body);
  return result.data;
};
