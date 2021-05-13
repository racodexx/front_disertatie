import React from "react";
import { InputTextarea } from "primereact/inputtextarea";
const CustomTextArea = ({
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
    <div className="p-field">
      <label htmlFor={id} className="p-d-block">
        {label}
        {required && <span style={{ color: "red" }}>*</span>}
      </label>
      <InputTextarea
        id={id}
        rows={5}
        cols={30}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        style={{ width }}
        aria-describedby={`${id}-help`}
        className={`${errorMessage ? "p-invalid" : ""} p-d-block`}
        disabled={disabled}
      />
      {errorMessage && (
        <small id={`${id}-help`} className="p-error p-d-block">
          {errorMessage}
        </small>
      )}
    </div>
  );
};
export default CustomTextArea;
