import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  /* padding: 5px 10px 0px 10px; */
  border-radius: 5px;
  margin: auto;
  width: ${(props) => props.width};
  margin-bottom: 20px;
`;

const Title = styled.div`
  font-weight: 500;
  font-style: italic;
  font-size: 30px;
  margin-left: 20px;
`;

const Section = ({ title, children, width }) => {
  return (
    <Wrapper width={width}>
      <Title>{title}</Title>
      {children}
    </Wrapper>
  );
};
export default Section;
