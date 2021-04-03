import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  MapContainer,
  TileLayer,
  Marker,
  CircleMarker,
  Circle,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import pointer_red from "../../assets/images/map_pointer_red.png";
import pointer_orange from "../../assets/images/map_pointer_orange.png";

import CustomInput from "../base/CustomInput";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";

const DeliveryOptions = styled.div`
  margin-bottom: 20px;
  .p-field-radiobutton {
    margin-bottom: unset;
  }
`;

const DeliveryInfo = styled.div`
  font-weight: 500;
  color: green;
`;

let DefaultIcon = L.icon({
  iconUrl: pointer_red,
  iconSize: [20, 35],
  shadowSize: [3, 3],
  iconAnchor: [10, 35],
});

L.Marker.prototype.options.icon = DefaultIcon;

const ShoppingCartStep1 = ({ state, setState }) => {
  const [geolocationData, setGeolocatiobData] = useState(null);

  useEffect(() => {
    const handleGeolocation = (event) => {
      setGeolocatiobData({
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

  const toRadians = (value) => {
    return (value * Math.PI) / 180;
  };

  const distance = (lat1, lat2, lon1, lon2, el1, el2) => {
    const R = 6371; // Radius of the earth
    let latDistance = toRadians(lat2 - lat1);
    let lonDistance = toRadians(lon2 - lon1);
    let a =
      Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(lonDistance / 2) *
        Math.sin(lonDistance / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = R * c * 1000; // convert to meters

    let height = el1 - el2;

    distance = Math.pow(distance, 2) + Math.pow(height, 2);
    return Math.sqrt(distance);
  };

  const redOptions = { color: "#ffa500ed" };

  const isDeliveryAvailable =
    geolocationData &&
    distance(
      shopCoordonates[0],
      geolocationData.latitude,
      shopCoordonates[1],
      geolocationData.longitude,
      2,
      2
    );
  console.log(isDeliveryAvailable);
  return (
    <>
      <div className="p-grid">
        <div className="p-col-12 p-md-5">
          <DeliveryOptions className="p-grid">
            <div className="p-field-radiobutton p-col-6">
              <RadioButton
                inputId="delivery1"
                name="delivery"
                onChange={(e) => setState({ ...state, includeDelivery: true })}
                checked={state.includeDelivery === true}
              />
              <label htmlFor="delivery1">Home delivery</label>
            </div>
            <div className="p-field-radiobutton p-col-6">
              <RadioButton
                inputId="delivery2"
                name="delivery"
                onChange={(e) => setState({ ...state, includeDelivery: false })}
                checked={state.includeDelivery === false}
              />
              <label htmlFor="delivery2">Takeaway</label>
            </div>
            {state.includeDelivery && (
              <DeliveryInfo>
                Home delivery service it's available only in Curtea de Arges
              </DeliveryInfo>
            )}
          </DeliveryOptions>
          {state.includeDelivery && (
            <div className="p-grid">
              <div className="p-col-12 p-md-8">
                <CustomInput
                  id="street"
                  label="Street"
                  value={state.street}
                  onChange={(value) => {
                    setState({ ...state, street: value });
                  }}
                  type="text"
                  width="100%"
                />
              </div>
              <div className="p-col-12 p-md-4">
                <CustomInput
                  id="number"
                  label="Number"
                  value={state.number}
                  onChange={(value) => {
                    setState({ ...state, number: value });
                  }}
                  type="text"
                  width="100%"
                />
              </div>
            </div>
          )}
          <CustomInput
            id="name"
            label="Name"
            value={state.name}
            onChange={(value) => {
              setState({ ...state, name: value });
            }}
            type="text"
            width="100%"
          />
          <CustomInput
            id="phone"
            label="Phone"
            value={state.phone}
            onChange={(value) => {
              setState({ ...state, phone: value });
            }}
            type="tel"
            width="100%"
          />
          <CustomInput
            id="email"
            label="Email"
            value={state.email}
            onChange={(value) => {
              setState({ ...state, email: value });
            }}
            type="email"
            width="100%"
          />
          <div className="p-field">
            <label htmlFor={"others"} className="p-d-block">
              Other details
            </label>
            <InputTextarea
              id="others"
              rows={5}
              cols={30}
              value={state.orderDetails}
              onChange={(e) =>
                setState({ ...state, orderDetails: e.target.value })
              }
              style={{ width: "100%" }}
            />
          </div>
        </div>
        <div className="p-col-12 p-md-7">
          {/* <h3>Delivery area</h3> */}
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
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
            {geolocationData && (
              <Marker
                position={[geolocationData.latitude, geolocationData.longitude]}
              >
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
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
    </>
  );
};
export default ShoppingCartStep1;
