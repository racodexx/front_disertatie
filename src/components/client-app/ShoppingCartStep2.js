import React, { useState, useEffect } from "react";
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

let DefaultIcon = L.icon({
  iconUrl: pointer_red,
  iconSize: [20, 35],
  shadowSize: [3, 3],
  iconAnchor: [10, 35],
});

L.Marker.prototype.options.icon = DefaultIcon;

const ShoppingCartStep2 = ({ state, setState }) => {
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
  const redOptions = { color: "#ffa500ed" };

  return (
    <>
      <div className="p-grid">
        <div className="p-col-12 p-md-5">
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
            id="street"
            label="Street"
            value={state.street}
            onChange={(value) => {
              setState({ ...state, street: value });
            }}
            type="text"
            width="100%"
          />
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
          <CustomInput
            id="phone"
            label="Phone"
            value={state.phone}
            onChange={(value) => {
              setState({ ...state, phone: value });
            }}
            type="text"
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
export default ShoppingCartStep2;
