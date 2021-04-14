import React from "react";
import { InputText } from "primereact/inputtext";
const CustomInput = ({
  id,
  label,
  value,
  onChange,
  type,
  errorMessage,
  width,
  disabled,
  required,
}) => {
  return (
    <>
      <div className="p-field">
        <label htmlFor={id} className="p-d-block">
          {label}
          {required && <span style={{ color: "red" }}>*</span>}
        </label>
        <InputText
          id={id}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          aria-describedby={`${id}-help`}
          className={`${errorMessage ? "p-invalid" : ""} p-d-block`}
          type={type}
          style={{ width }}
          disabled={disabled || false}
        />
        {errorMessage && (
          <small id={`${id}-help`} className="p-error p-d-block">
            {errorMessage}
          </small>
        )}
      </div>
    </>
  );
};
export default CustomInput;
