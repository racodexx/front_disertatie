import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import ContactBanner from "./ContactBanner";
import { Toast } from "primereact/toast";

import { MapContainer, TileLayer, Marker, Circle, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import pointer_red from "../../assets/images/map_pointer_red.png";
import pointer_blue from "../../assets/images/map_pointer_blue.png";
import int1 from "../../assets/images/int1.jpg";
import int2 from "../../assets/images/int2.jpg";
import int3 from "../../assets/images/int3.jpg";

import ContactUsForm from "../client-app/ContactUsForm";
import { useGeolocation } from "../../hooks/geolocation";

const Wrapper = styled.div`
  .p-grid {
    margin: 20px 0 0 0 !important;
  }
`;

const FormWrapper = styled.div`
  box-shadow: 4px 4px 10px 0px #b7b7b7;
  background-color: #f0f8ff94;
  padding: 20px;
  width: 600px;
  margin: auto;
  @media only screen and (max-width: 900px) {
    width: 100% !important;
  }
`;

const AboutRestaurantBanner = styled.div`
  width: 100%;
  text-align: center;
  .content {
    margin: auto;
    padding: 60px 25px;
    @media only screen and (max-width: 600px) {
      padding: 25px;
    }
    .title {
      color: #c17d0f;
      font-size: 24px;
      font-weight: 400;
      letter-spacing: 2px;
      margin-bottom: 20px;
    }
    .text {
      color: #929292;
      font-weight: 400;
      font-size: 17px;
      line-height: 1.6em;
      max-width: 700px;
      min-width: 300px;
      margin: auto;
    }
    .images {
      margin-top: 20px;
      img {
        width: 100%;
        padding: 0 10px;
      }
    }
  }
`;

let DefaultIcon = L.icon({
  iconUrl: pointer_red,
  iconSize: [20, 35],
});

const userLocationIcon = L.icon({
  iconUrl: pointer_blue,
  iconSize: [20, 35],
});

L.Marker.prototype.options.icon = DefaultIcon;

const Contact = () => {
  const { latitude, longitude } = useGeolocation();
  const toastRef = useRef();

  const shopCoordonates = [45.14346740339734, 24.675206429104545];
  const redOptions = { color: "#ffa500ed" };
  return (
    <Wrapper>
      <Toast ref={toastRef} />
      <div className="p-grid">
        <div className="p-col-12 p-md-7">
          <AboutRestaurantBanner>
            <div className="content">
              <div className="title">About Old Mill Restaurant</div>
              <div className="text">
                Our restaurant is very well placed, in Curtea de Arges, on Main
                Street, number 7. The place is quite large, it has space for 150
                peoples inside the restaurant and 100 peoples outside, on the
                covered terrace. The interior of the restaurant it's decorated
                in a classic style, but with few elements of modernism.
              </div>
              <div className="images p-grid">
                <div className="p-col-12 p-md-4">
                  <img src={int1} alt="interior" />
                </div>
                <div className="p-col-12 p-md-4">
                  <img src={int2} alt="interior" />
                </div>
                <div className="p-col-12 p-md-4">
                  <img src={int3} alt="interior" />
                </div>
              </div>
            </div>
          </AboutRestaurantBanner>
        </div>
        <div className="p-col-12 p-md-5">
          <FormWrapper>
            <ContactUsForm className="form" toastRef={toastRef} />
          </FormWrapper>
        </div>
      </div>
      <h1 style={{ textAlign: "center", fontFamily: "Courier New" }}>
        Map location
      </h1>
      <MapContainer
        center={shopCoordonates}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "570px", marginTop: "15px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={shopCoordonates}>
          <Popup>Old Mill Restaurant, Main Street Nr.7</Popup>
        </Marker>
        {latitude && longitude && (
          <Marker position={[latitude, longitude]} icon={userLocationIcon}>
            <Popup>Your location</Popup>
          </Marker>
        )}
        <Circle
          center={shopCoordonates}
          pathOptions={redOptions}
          radius={2000}
        />
      </MapContainer>
      <ContactBanner />
    </Wrapper>
  );
};
export default Contact;
