import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import ContactBanner from "./ContactBanner";
import { Toast } from "primereact/toast";

import { MapContainer, TileLayer, Marker, Circle, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import pointer_blue from "../../assets/images/map_pointer_blue.png";
import pointer_red from "../../assets/images/map_pointer_red.png";

import ContactUsForm from "../client-app/ContactUsForm";

const Wrapper = styled.div`
  .p-grid {
    margin: unset !important;
  }
`;

const FormWrapper = styled.div`
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
    max-width: 700px;
    min-width: 300px;
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
    }
  }
`;

const Contact = () => {
  const toastRef = useRef();
  const [geolocationData, setGeolocationData] = useState(null);

  const testIcon = L.icon({
    iconUrl: pointer_blue,
    iconSize: [20, 35],
  });

  useEffect(() => {
    const handleGeolocation = (event) => {
      setGeolocationData({
        latitude: event.coords.latitude,
        longitude: event.coords.longitude,
      });
    };
    let watchId = 0;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleGeolocation);
      watchId = navigator.geolocation.watchPosition(handleGeolocation);
    } else {
      // setAllowGeolocation(false);
    }
  }, []);

  const shopCoordonates = [45.14346740339734, 24.675206429104545];
  const redOptions = { color: "#ffa500ed" };
  return (
    <Wrapper>
      <Toast ref={toastRef} />
      <div className="p-grid">
        <div className="p-col-12 p-md-6">
          <AboutRestaurantBanner>
            <div className="content">
              <div className="title">About Old Mill Restaurant</div>
              <div className="text">
                There are many variations of passages of Lorem Ipsum available,
                but the majority have suffered alteration in some form, by
                injected humour, or randomised words which don't look even
                slightly believable.
              </div>
            </div>
          </AboutRestaurantBanner>
        </div>
        <div className="p-col-12 p-md-6">
          <MapContainer
            center={shopCoordonates}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "500px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={shopCoordonates}>
              <Popup>Old Mill Restaurant, Main Street Nr.7</Popup>
            </Marker>
            {geolocationData && (
              <Marker
                position={[geolocationData.latitude, geolocationData.longitude]}
                icon={testIcon}
              >
                <Popup>Your location</Popup>
              </Marker>
            )}
            <Circle
              center={shopCoordonates}
              pathOptions={redOptions}
              radius={2000}
            />
          </MapContainer>
        </div>
      </div>
      <FormWrapper>
        <ContactUsForm className="form" toastRef={toastRef} />
      </FormWrapper>
      <ContactBanner />
    </Wrapper>
  );
};
export default Contact;
