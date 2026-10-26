import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';

// Fix Leaflet's default marker icon issue in Webpack/Vite
const customMarkerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to dynamically re-center map when center coordinates change
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, 12);
    }
  }, [center, map]);
  return null;
};

const ProviderMap = ({ providers = [], userLocation = null, onSelectProvider }) => {
  const defaultCenter = userLocation
    ? [userLocation.lat, userLocation.lng]
    : providers.length > 0 && Number.isFinite(providers[0].latitude)
    ? [providers[0].latitude, providers[0].longitude]
    : [17.385, 78.4867]; // Hyderabad

  return (
    <div className="map-leaflet-wrapper position-relative">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
      >
        <MapUpdater center={defaultCenter} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location Marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
            <Popup>
              <div className="p-1 text-center">
                <span className="badge bg-danger mb-1">Your Location</span>
                <p className="small mb-0 fw-bold">You are here</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Provider Markers */}
        {providers.map((p) => {
          if (!Number.isFinite(p.latitude) || !Number.isFinite(p.longitude)) return null;
          return (
            <Marker
              key={p._id}
              position={[p.latitude, p.longitude]}
              icon={customMarkerIcon}
            >
              <Popup>
                <div style={{ maxWidth: '220px' }}>
                  <h6 className="fw-bold mb-1 text-truncate">{p.businessName}</h6>
                  <div className="d-flex align-items-center gap-1 mb-1 small">
                    <span className="text-warning fw-bold">★ {p.rating?.toFixed(1)}</span>
                    <span className="text-muted">({p.reviewCount} reviews)</span>
                  </div>
                  <p className="small text-muted mb-2 text-truncate">{p.address}, {p.city}</p>
                  {p.distance !== null && (
                    <div className="badge bg-dark mb-2">{p.distance} km away</div>
                  )}
                  <div className="d-flex gap-2">
                    <Link
                      to={`/providers/${p._id}`}
                      className="btn btn-outline-primary btn-sm py-0 px-2 small"
                    >
                      Details
                    </Link>
                    {onSelectProvider && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm py-0 px-2 small"
                        onClick={() => onSelectProvider(p)}
                      >
                        Book
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default ProviderMap;
