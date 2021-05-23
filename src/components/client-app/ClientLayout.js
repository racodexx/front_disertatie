import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

import { useWindowDimensions } from "../../hooks/windowDimensions";

const AdminLayout = (props) => {
  const { height } = useWindowDimensions();
  const NAVBAR_HEIGHT = 50;
  const FOOTER_HEIGHT = 50;
  const contentHeight = height - NAVBAR_HEIGHT - FOOTER_HEIGHT;
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
