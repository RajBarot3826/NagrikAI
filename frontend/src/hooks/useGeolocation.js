import { useState, useEffect } from 'react';

export default function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Reverse geocoding via Nominatim
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
          );
          const data = await response.json();
          
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: data.display_name,
            ward: data.address?.suburb || 'Unknown Ward'
          });
        } catch (err) {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: 'Unknown Location',
            ward: 'Unknown Ward'
          });
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  };

  return { location, error, loading, getLocation };
}
