import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { MapContainer, TileLayer, Marker, Circle, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import pointer_red from "../../assets/images/map_pointer_red.png";
import pointer_blue from "../../assets/images/map_pointer_blue.png";

import ShoppingCartContext from "./contexts/ShoppingCartContext";
import CustomInput from "../base/CustomInput";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";

import { useGeolocation } from "../../hooks/geolocation";

const DeliveryOptions = styled.div`
  margin-bottom: 20px;
  .p-field-radiobutton {
    margin-bottom: unset;
  }
`;

const DeliveryInfo = styled.div`
  font-weight: 500;
  color: green;
  small {
    display: block;
    color: red;
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

const shopCoordonates = [45.14346740339734, 24.675206429104545];

const redOptions = { color: "#ffa500ed" };

const maxDeliveryDistance = 2000;

const ShoppingCartStep1 = ({ fieldErrors, setFieldErrors }) => {
  const { latitude, longitude } = useGeolocation();
  const {
    cartState: { orderDetails },
    cartState,
    setCartState,
  } = useContext(ShoppingCartContext);
  const [outOfArea, setOutOfArea] = useState(false);

  useEffect(() => {
    if (!latitude || !longitude) {
      return;
    }
    let distance = getDistance(
      latitude,
      shopCoordonates[0],
      longitude,
      shopCoordonates[1],
      0,
      0
    );
    if (distance > maxDeliveryDistance) {
      setOutOfArea(true);
      setOrderDetails("includeDelivery", false);
    } else {
      setOutOfArea(false);
    }
    //eslint-disable-next-line
  }, [latitude, longitude]);

  const setOrderDetails = (key, value) => {
    let newState = { ...orderDetails };
    newState[key] = value;
    setCartState({ ...cartState, orderDetails: newState });
    clearFieldError(key);
  };

  const clearFieldError = (field) => {
    if (!fieldErrors[field]) {
      return;
    }
    let newState = { ...fieldErrors };
    delete newState[field];
    setFieldErrors(newState);
  };

  /**
   * Calculate distance between two points in latitude and longitude taking
   * into account height difference. If you are not interested in height
   * difference pass 0.0. Uses Haversine method as its base.
   *
   * lat1, lon1 Start point lat2, lon2 End point el1 Start altitude in meters
   * el2 End altitude in meters
   * @returns Distance in Meters
   */
  const getDistance = (lat1, lat2, lon1, lon2, el1, el2) => {
    const R = 6371; // Radius of the earth
    const latDistance = toRadians(lat2 - lat1);
    const lonDistance = toRadians(lon2 - lon1);
    const a =
      Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(lonDistance / 2) *
        Math.sin(lonDistance / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = R * c * 1000; // convert to meters

    const height = el1 - el2;

    distance = Math.pow(distance, 2) + Math.pow(height, 2);

    return Math.sqrt(distance);
  };

  const toRadians = (val) => {
    return val * (Math.PI / 180);
  };

  return (
    <>
      <div className="p-grid">
        <div className="p-col-12 p-md-5">
          <DeliveryOptions className="p-grid">
            <div className="p-field-radiobutton p-col-6">
              <RadioButton
                inputId="delivery1"
                name="delivery"
                onChange={(e) => setOrderDetails("includeDelivery", true)}
                checked={orderDetails.includeDelivery === true}
                disabled={outOfArea}
              />
              <label htmlFor="delivery1">Home delivery</label>
            </div>
            <div className="p-field-radiobutton p-col-6">
              <RadioButton
                inputId="delivery2"
                name="delivery"
                onChange={(e) => setOrderDetails("includeDelivery", false)}
                checked={orderDetails.includeDelivery === false}
              />
              <label htmlFor="delivery2">Take away</label>
            </div>
            <DeliveryInfo>
              Home delivery service it's available only in Curtea de Arges
              {outOfArea ? <small>You are out of area</small> : ""}
            </DeliveryInfo>
          </DeliveryOptions>
          {orderDetails.includeDelivery && (
            <div className="p-grid">
              <div className="p-col-12 p-md-8">
                <CustomInput
                  id="street"
                  label="Street"
                  value={orderDetails.street}
                  onChange={(value) => {
                    setOrderDetails("street", value);
                  }}
                  type="text"
                  width="100%"
                  required
                  errorMessage={fieldErrors["street"]}
                />
              </div>
              <div className="p-col-12 p-md-4">
                <CustomInput
                  id="number"
                  label="Number"
                  value={orderDetails.number}
                  onChange={(value) => {
                    setOrderDetails("number", value);
                  }}
                  type="text"
                  width="100%"
                  required
                  errorMessage={fieldErrors["number"]}
                />
              </div>
            </div>
          )}
          <CustomInput
            id="name"
            label="Name"
            value={orderDetails.name}
            onChange={(value) => {
              setOrderDetails("name", value);
            }}
            type="text"
            width="100%"
            required
            errorMessage={fieldErrors["name"]}
          />
          <CustomInput
            id="phone"
            label="Phone"
            value={orderDetails.phone}
            onChange={(value) => {
              setOrderDetails("phone", value);
            }}
            type="tel"
            width="100%"
            required
            errorMessage={fieldErrors["phone"]}
          />
          <CustomInput
            id="email"
            label="Email"
            value={orderDetails.email}
            onChange={(value) => {
              setOrderDetails("email", value);
            }}
            type="email"
            width="100%"
            required
            errorMessage={fieldErrors["email"]}
          />
          <div className="p-field">
            <label htmlFor={"others"} className="p-d-block">
              Other details
            </label>
            <InputTextarea
              id="others"
              rows={5}
              cols={30}
              value={orderDetails.description}
              onChange={(e) => {
                setOrderDetails("description", e.target.value);
              }}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <span style={{ color: "red" }}>*</span> - required field
          </div>
        </div>
        <div className="p-col-12 p-md-7">
          {/* <h3>Delivery area</h3> */}
          <MapContainer
            center={shopCoordonates}
            zoom={13}
            scrollWheelZoom={false}
            style={{ width: "100%", height: "100%", minHeight: "500px" }}
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
              radius={maxDeliveryDistance}
            />
          </MapContainer>
        </div>
      </div>
    </>
  );
};
export default ShoppingCartStep1;
