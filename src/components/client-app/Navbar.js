import React from "react";
import styled from "styled-components";
import name_logo from "../../assets/images/name_logo.png";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  background-color: white;
  /* padding: 0px 10px; */
  background-color: #061e38;
`;
const LeftSide = styled.div`
  font-weight: 500;
  color: white;
  background-color: white;
  height: 100%;
  img {
    height: 100%;
    padding: 10px;
  }
`;
const RightSide = styled.div`
  display: flex;
  font-weight: 500;
`;
const ActionElement = styled.div`
  color: white;
  &.selected,
  :hover {
    background-color: orange;
    color: white;
  }
  padding: 15px;
  cursor: pointer;
  .cart {
    font-size: 20px;
  }
`;

const NavActionItem = ({ name, children }) => {
  const location = document.location.href.substring(
    document.location.href.indexOf("#/") + 1,
    document.location.href.length
  );
  const goTo = (location) => {
    window.location.href = "/#/client/" + location;
  };
  return (
    <ActionElement
      className={"button " + (location === `/client/${name}` && "selected")}
      onClick={() => {
        goTo(name);
      }}
    >
      {children}
    </ActionElement>
  );
};

const Navbar = () => {
  return (
    <Wrapper>
      <LeftSide>{/* <img src={name_logo} alt="logo" /> */}</LeftSide>
      <RightSide>
        <NavActionItem name="home">Home</NavActionItem>
        <NavActionItem name="menu">Menu</NavActionItem>
        <NavActionItem name="contact">Contact</NavActionItem>
        <NavActionItem name="shopping-cart">
          <i className="pi pi-shopping-cart"></i>
        </NavActionItem>
      </RightSide>
    </Wrapper>
  );
};
export default Navbar;
