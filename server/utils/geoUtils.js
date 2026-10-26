/**
 * Calculate great-circle distance between two points on the Earth's surface
 * using the Haversine formula.
 * @param {number} lat1 Latitude of point 1 in degrees
 * @param {number} lon1 Longitude of point 1 in degrees
 * @param {number} lat2 Latitude of point 2 in degrees
 * @param {number} lon2 Longitude of point 2 in degrees
 * @returns {number} Distance in kilometers rounded to 1 decimal place
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (![lat1, lon1, lat2, lon2].every(Number.isFinite)) return null;

  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return Math.round(d * 10) / 10;
}

function toRad(degrees) {
  return (degrees * Math.PI) / 180;
}

const HYDERABAD_AREAS = [
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

const HYDERABAD_BOUNDS = { minLat: 17.2, maxLat: 17.65, minLng: 78.2, maxLng: 78.75 };

function isWithinHyderabad(lat, lng) {
  return Number.isFinite(lat) && Number.isFinite(lng)
    && lat >= HYDERABAD_BOUNDS.minLat && lat <= HYDERABAD_BOUNDS.maxLat
    && lng >= HYDERABAD_BOUNDS.minLng && lng <= HYDERABAD_BOUNDS.maxLng;
}

function getHyderabadArea(name) {
  if (!name) return null;
  return HYDERABAD_AREAS.find((area) => area.name.toLowerCase() === String(name).trim().toLowerCase()) || null;
}

function getCityCoordinates(cityName) {
  return String(cityName || '').trim().toLowerCase() === 'hyderabad'
    ? { lat: 17.385, lng: 78.4867 }
    : null;
}

module.exports = {
  calculateDistance,
  getCityCoordinates,
  HYDERABAD_AREAS,
  HYDERABAD_BOUNDS,
  getHyderabadArea,
  isWithinHyderabad,
};
