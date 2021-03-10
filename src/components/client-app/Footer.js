import React from "react";
import styled from "styled-components";
const Wrapper = styled.div`
  height: 50px;
  background-color: #061e38;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px;
  color: white;
  font-weight: 600;
`;
const Footer = () => {
  return <Wrapper>@Racodex 2021</Wrapper>;
};
export default Footer;
