import React, { useState } from "react";

import { Button } from "primereact/button";
import CustomInput from "../base/CustomInput";
import CustomTextArea from "../base/CustomTextArea";
import { addFeedback } from "../../services/feedbackService";
import { handleApiActionResult } from "../../utils/util";
const ContactUsForm = ({ toastRef }) => {
  const defaultContactFormState = {
    name: "",
    email: "",
    phone: "",
    message: "",
  };
  const [state, setState] = useState(defaultContactFormState);
  const [fieldErrors, setFieldErrors] = useState({});

  const setLocalState = (field, value) => {
    setState({ ...state, [field]: value });
    if (fieldErrors[field]) {
      clearFieldError(field);
    }
  };

  const clearFieldError = (field) => {
    let errors = { ...fieldErrors };
    delete errors[field];
    setFieldErrors(errors);
  };

  const sendFeedback = async () => {
    let isValid = validateForm();
    if (isValid) {
      let result = await addFeedback(state);
      console.log(result);
      let succes = handleApiActionResult(result, toastRef);
      if (succes) {
        setState(defaultContactFormState);
      }
    }
  };

  const validateForm = () => {
    let errors = {};
    if (!state.name) {
      errors["name"] = "Name is required!";
    }
    if (!state.email) {
      errors["email"] = "Email is required!";
    }
    if (!state.phone) {
      errors["phone"] = "Phone number is required!";
    }
    if (!state.message) {
      errors["message"] = "Message is required!";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <>
      <h2>Contact us</h2>
      <CustomInput
        id="name"
        label="Name"
        value={state.name}
        onChange={(value) => {
          setLocalState("name", value);
        }}
        type="text"
        width="100%"
        required
        errorMessage={fieldErrors["name"]}
      />
      <CustomInput
        id="phone"
        label="Phone"
        value={state.phone}
        onChange={(value) => {
          setLocalState("phone", value);
        }}
        type="text"
        width="100%"
        required
        errorMessage={fieldErrors["phone"]}
      />
      <CustomInput
        id="email"
        label="Email"
        value={state.email}
        onChange={(value) => {
          setLocalState("email", value);
        }}
        type="text"
        width="100%"
        required
        errorMessage={fieldErrors["email"]}
      />
      <CustomTextArea
        id="message"
        label="Message"
        value={state.message}
        onChange={(value) => {
          setLocalState("message", value);
        }}
        width="100%"
        required
        errorMessage={fieldErrors["message"]}
      />
      <Button onClick={sendFeedback}>Send</Button>
    </>
  );
};
export default ContactUsForm;
