import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const AdminLayout = (props) => {
  const NAVBAR_HEIGHT = 50;
  const FOOTER_HEIGHT = 50;
  const contentHeight = window.innerHeight - NAVBAR_HEIGHT - FOOTER_HEIGHT;
  return (
    <>
      <Navbar />
      <div
        style={{
          overflowY: "auto",
          height: contentHeight + FOOTER_HEIGHT,
        }}
      >
        <div style={{ minHeight: contentHeight }}>{props.children}</div>
        <Footer />
      </div>
    </>
  );
};
export default AdminLayout;
