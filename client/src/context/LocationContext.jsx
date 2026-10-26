import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext(null);
const saveArea = (name) => {
  try {
    localStorage.setItem('carcare_area', name);
  } catch {
    // Location selection remains usable when browser storage is unavailable.
  }
};

export const HYDERABAD_AREAS = [
  { name: 'Ameerpet', lat: 17.4375, lng: 78.4483, pincode: '500016' },
  { name: 'Attapur', lat: 17.3688, lng: 78.4306, pincode: '500048' },
  { name: 'Banjara Hills', lat: 17.4156, lng: 78.4347, pincode: '500034' },
  { name: 'Begumpet', lat: 17.4448, lng: 78.4664, pincode: '500016' },
  { name: 'Gachibowli', lat: 17.4401, lng: 78.3489, pincode: '500032' },
  { name: 'HITEC City', lat: 17.4435, lng: 78.3772, pincode: '500081' },
  { name: 'Jubilee Hills', lat: 17.4325, lng: 78.4071, pincode: '500033' },
  { name: 'Kondapur', lat: 17.4697, lng: 78.3657, pincode: '500084' },
  { name: 'Kukatpally', lat: 17.4849, lng: 78.4138, pincode: '500072' },
  { name: 'LB Nagar', lat: 17.3457, lng: 78.5522, pincode: '500074' },
  { name: 'Madhapur', lat: 17.4483, lng: 78.3915, pincode: '500081' },
  { name: 'Mehdipatnam', lat: 17.3948, lng: 78.4398, pincode: '500028' },
  { name: 'Miyapur', lat: 17.4968, lng: 78.3568, pincode: '500049' },
  { name: 'Secunderabad', lat: 17.4399, lng: 78.4983, pincode: '500003' },
  { name: 'Uppal', lat: 17.4058, lng: 78.5591, pincode: '500039' },
];

export const LocationProvider = ({ children }) => {
  const savedArea = (() => {
    try {
      const name = localStorage.getItem('carcare_area');
      return HYDERABAD_AREAS.find((item) => item.name === name) || HYDERABAD_AREAS.find((item) => item.name === 'HITEC City');
    } catch {
      return HYDERABAD_AREAS.find((item) => item.name === 'HITEC City');
    }
  })();
  const [coordinates, setCoordinates] = useState({ lat: savedArea.lat, lng: savedArea.lng });
  const city = 'Hyderabad';
  const [area, setArea] = useState(savedArea.name);
  const [address, setAddress] = useState(`${savedArea.name}, Hyderabad`);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Auto detect location if permitted
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser');
      return;
    }

    setIsDetecting(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const inHyderabad = latitude >= 17.2 && latitude <= 17.65 && longitude >= 78.2 && longitude <= 78.75;
        if (!inHyderabad) {
          setErrorMsg('CarCare Connect currently serves Hyderabad only. Choose a Hyderabad area.');
          setIsDetecting(false);
          setIsGpsActive(false);
          return;
        }
        setCoordinates({ lat: latitude, lng: longitude });
        setIsGpsActive(true);
        const nearestArea = HYDERABAD_AREAS.reduce((nearest, candidate) => {
          const distance = (candidate.lat - latitude) ** 2 + (candidate.lng - longitude) ** 2;
          return !nearest || distance < nearest.distance ? { name: candidate.name, distance } : nearest;
        }, null);
        setArea(nearestArea.name);
        setAddress(`${nearestArea.name}, Hyderabad`);
        saveArea(nearestArea.name);
        setIsDetecting(false);
      },
      (err) => {
        console.warn('Geolocation access declined or unavailable:', err.message);
        setErrorMsg('Location permission denied or unavailable. Using default city.');
        setIsDetecting(false);
        setIsGpsActive(false);
      },
      { timeout: 8000 }
    );
  };

  const selectCity = (areaName) => {
    const found = HYDERABAD_AREAS.find((a) => a.name.toLowerCase() === areaName.toLowerCase());
    if (found) {
      setArea(found.name);
      setCoordinates({ lat: found.lat, lng: found.lng });
      setAddress(found.name);
      setIsGpsActive(false);
      saveArea(found.name);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        coordinates,
        city,
        area,
        address,
        isDetecting,
        isGpsActive,
        errorMsg,
        detectLocation,
        selectCity,
        setCoordinates,
        setAddress,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
