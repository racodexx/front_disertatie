import React from "react";
import styled from "styled-components";
const Wrapper = styled.div`
  background-color: #2e3b42;
  text-align: center;
  color: white;
  .content {
    margin: auto;
    padding: 60px 25px;
    max-width: 700px;
    min-width: 300px;
    display: flex;
    justify-content: space-between;
    @media only screen and (max-width: 700px) {
      display: block;
    }
    .card {
      text-align: left;
      margin-bottom: 20px;
      .item {
        margin-bottom: 5px;
        margin-left: 20px;
        color: #929292;
        font-size: 15px;
        font-weight: 500;
      }
      .title {
        border-left: 5px solid darkorange;
        padding-left: 10px;
        margin-bottom: 10px;
        margin-left: 5px;
      }
      i {
        margin-right: 10px;
        color: darkorange;
      }
    }
  }
`;
const ContactBanner = () => {
  return (
    <Wrapper>
      <div className="content">
        <div className="card">
          <div className="title">Location</div>
          <div className="item">
            <i className="pi pi-map-marker"></i>
            <span className="text">Address: Curtea de Arges</span>
          </div>
          <div className="item">
            <i className="pi pi-map"></i>
            <span className="text">Street: Main Street</span>
          </div>
        </div>
        <div className="card">
          <div className="title">Contact details</div>
          <div className="item">
            <i className="pi pi-inbox"></i>
            <span>Email: </span>
            <a className="text" href="mailto: racodexx@gmail.com">
              racodexx@gmail.com
            </a>
          </div>
          <div className="item">
            <i className="pi pi-phone"></i>
            <span>Phone: </span>
            <a className="text" href="tel: 0741234567">
              0741234567
            </a>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
export default ContactBanner;
