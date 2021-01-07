import React, { useState, useEffect } from "react";
import { addBook, getBooks } from "../services/dataService";

const StartUp = () => {
  const [bookDetails, setBookDetails] = useState({
    code: "",
    title: "",
  });

  const [books, setBooks] = useState();
  const [updateState, setUpdateState] = useState(false);

  useEffect(() => {
    load();
  }, [updateState]);

  const load = async () => {
    let books = await getBooks();
    setBooks(books.data);
  };

  const setLocalState = (fieldName, fieldvalue) => {
    setBookDetails({ ...bookDetails, [fieldName]: fieldvalue });
  };

  const adaugaCarte = async () => {
    await addBook(bookDetails);
    setUpdateState(!updateState);
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
      <div>
        <h1>Books from api</h1>
        {books &&
          books.map((x, i) => {
            return <p>{`ISBN: ${x.code}, Name: ${x.title}`}</p>;
          })}
      </div>
    </>
  );
};
export default StartUp;
