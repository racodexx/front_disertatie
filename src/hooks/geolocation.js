import { useState, useEffect } from "react";

const initialGeolocationState = {
  latitude: null,
  longitude: null,
  speed: null,
};

export const useGeolocation = () => {
  const [geolocation, setGeolocation] = useState(initialGeolocationState);
  let mounted = true;

  useEffect(() => {
    function handleGeolocation(event) {
      if (mounted) {
        setGeolocation({
          latitude: event.coords.latitude,
          longitude: event.coords.longitude,
          speed: event.coords.speed,
        });
      }
    }

    navigator.geolocation.getCurrentPosition(handleGeolocation);
    const watchId = navigator.geolocation.watchPosition(handleGeolocation);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      mounted = false;
    };
  }, []);

  return geolocation;
};
