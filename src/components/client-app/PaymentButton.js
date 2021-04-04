import styled from "styled-components";
const PaymentButton = styled.button`
  background: #5469d4;
  font-family: Arial, sans-serif;
  color: #ffffff;
  border-radius: 0 0 4px 4px;
  border: 0;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: block;
  transition: all 0.2s ease;
  box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
  width: 100%;

  :hover {
    filter: contrast(115%);
  }
  :disabled {
    opacity: 0.5;
    cursor: default;
  }
`;
export default PaymentButton;
