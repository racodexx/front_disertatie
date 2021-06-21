import { useState, useEffect } from "react";

const initialGeolocationState = {
  latitude: null,
  longitude: null,
  speed: null,
};

export const useGeolocation = () => {
  const [geolocation, setGeolocation] = useState(initialGeolocationState);
  useEffect(() => {
    function handleGeolocation(event) {
      setGeolocation({
        latitude: event.coords.latitude,
        longitude: event.coords.longitude,
        speed: event.coords.speed,
      });
    }

    navigator.geolocation.getCurrentPosition(handleGeolocation);
    const watchId = navigator.geolocation.watchPosition(handleGeolocation);

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return geolocation;
};
