import React, { useState } from "react";
import { addBook } from "../services/dataService";

const StartUp = () => {
  const [bookDetails, setBookDetails] = useState({
    code: "",
    title: "",
  });

  const setLocalState = (fieldName, fieldvalue) => {
    setBookDetails({ ...bookDetails, [fieldName]: fieldvalue });
  };

  const adaugaCarte = async () => {
    await addBook(bookDetails);
  };
  return (
    <>
      <hr />
      <h1>Create New Book</h1>
      <hr />
      <label for="ISBN">ISBN</label>
      <input
        type="number"
        value={bookDetails.code}
        onChange={(e) => {
          setLocalState("code", e.target.value);
        }}
      />
      <br />

      <label for="Title">Title</label>
      <input
        type="text"
        value={bookDetails.title}
        onChange={(e) => {
          setLocalState("title", e.target.value);
        }}
      />
      <br />

      <button onClick={adaugaCarte}>Insert</button>
    </>
  );
};
export default StartUp;
