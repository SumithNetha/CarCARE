import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useLocation, HYDERABAD_AREAS } from '../context/LocationContext';
import ProviderCard from '../components/ProviderCard';
import ProviderMap from '../components/ProviderMap';
import BookingModal from '../components/BookingModal';

const ProviderSearch = () => {
  const { city, area, coordinates, selectCity, detectLocation, isDetecting, isGpsActive } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state
  const [serviceFilter, setServiceFilter] = useState(searchParams.get('service') || 'All');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [maxDistance, setMaxDistance] = useState(searchParams.get('maxDistance') || '50');
  const [manualArea, setManualArea] = useState(searchParams.get('area') || area);
  const [pincode, setPincode] = useState(searchParams.get('pincode') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('distance');
  const [sortOrder, setSortOrder] = useState('asc');

  // View toggle: 'cards' or 'map'
  const [viewMode, setViewMode] = useState('cards');

  // Results state
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocationResult, setUserLocationResult] = useState(null);
  const [selectedProviderForBooking, setSelectedProviderForBooking] = useState(null);

  // Fetch providers function
  const fetchProviders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (serviceFilter && serviceFilter !== 'All') params.append('service', serviceFilter);
      if (minRating) params.append('minRating', minRating);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (maxDistance) params.append('maxDistance', maxDistance);
      params.append('city', 'Hyderabad');
      if (manualArea) params.append('area', manualArea);
      if (pincode) params.append('pincode', pincode);
      if (searchQuery) params.append('search', searchQuery);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);

      // Pass coordinates for Haversine distance
      if (coordinates?.lat && coordinates?.lng) {
        params.append('lat', coordinates.lat);
        params.append('lng', coordinates.lng);
      }

      const res = await api.get(`/providers?${params.toString()}`);
      if (res.data.success) {
        setProviders(res.data.data);
        setUserLocationResult(res.data.userLocation || coordinates);
      }
    } catch (err) {
      console.error('Error searching providers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [serviceFilter, minRating, maxPrice, maxDistance, manualArea, pincode, searchQuery, sortBy, sortOrder, coordinates]);

  useEffect(() => {
    setManualArea(area);
    setPincode(HYDERABAD_AREAS.find((item) => item.name === area)?.pincode || '');
  }, [area]);

  const handleManualLocationSubmit = (e) => {
    e.preventDefault();
    selectCity(manualArea);
    fetchProviders();
  };

  const handleResetFilters = () => {
    setServiceFilter('All');
    setMinRating('');
    setMaxPrice('');
    setMaxDistance('50');
    setPincode('');
    setManualArea('HITEC City');
    setSearchQuery('');
    setSortBy('distance');
    setSortOrder('asc');
  };

  return (
    <div className="container py-5">
      {/* Header Bar */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-1 mb-2 rounded-pill">
            NEARBY SEARCH
          </span>
          <h1 className="display-6 fw-bold mb-1">Find Service Providers Near You</h1>
          <p className="text-muted mb-0">
            Calculated using high-precision GPS Haversine distance from your coordinates.
          </p>
        </div>

        {/* View Toggle (List vs Map) */}
        <div className="btn-group p-1 bg-light rounded-pill border" role="group">
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 fw-semibold ${
              viewMode === 'cards' ? 'btn-primary text-white shadow-sm' : 'btn-light text-muted'
            }`}
            onClick={() => setViewMode('cards')}
          >
            <i className="bi bi-grid me-1"></i> Card View
          </button>
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 fw-semibold ${
              viewMode === 'map' ? 'btn-primary text-white shadow-sm' : 'btn-light text-muted'
            }`}
            onClick={() => setViewMode('map')}
          >
            <i className="bi bi-map me-1"></i> Interactive Map
          </button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-3">
          <div className="modern-card p-4 sticky-sidebar">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">
                <i className="bi bi-funnel text-primary me-2"></i> Filters
              </h5>
              <button
                type="button"
                className="btn btn-link p-0 small text-decoration-none text-muted"
                onClick={handleResetFilters}
              >
                Reset All
              </button>
            </div>

            {/* Location & GPS Section */}
            <div className="mb-4 pb-3 border-bottom">
              <label className="form-label small fw-semibold text-muted">Your Location</label>
              
              <button
                type="button"
                className={`btn btn-sm w-100 rounded-pill mb-2 d-flex align-items-center justify-content-center gap-2 ${
                  isGpsActive ? 'btn-outline-success fw-bold' : 'btn-outline-primary'
                }`}
                onClick={detectLocation}
                disabled={isDetecting}
              >
                {isDetecting ? (
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                ) : (
                  <i className="bi bi-crosshair"></i>
                )}
                {isGpsActive ? 'GPS Active (Current)' : 'Use Browser GPS'}
              </button>

              <div className="mb-2">
                <label className="form-label small text-muted mb-1">Select City</label>
                <select
                  className="form-select form-select-sm"
                    value={manualArea}
                  onChange={(e) => {
                      setManualArea(e.target.value);
                      setPincode(HYDERABAD_AREAS.find((item) => item.name === e.target.value)?.pincode || '');
                      selectCity(e.target.value);
                  }}
                >
                    {HYDERABAD_AREAS.map((item) => (
                      <option key={item.name} value={item.name}>
                        {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label small text-muted mb-1">Pincode (Optional)</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="e.g. 400053"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
              </div>
            </div>

            {/* Service Category */}
            <div className="mb-4 pb-3 border-bottom">
              <label className="form-label small fw-semibold text-muted">Service Category</label>
              <div className="d-flex flex-column gap-2">
                {['All', 'Car Rental', 'Car Mechanic', 'Car Washing'].map((svc) => (
                  <div className="form-check" key={svc}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="serviceCategory"
                      id={`svc-${svc}`}
                      checked={serviceFilter === svc}
                      onChange={() => setServiceFilter(svc)}
                    />
                    <label className="form-check-label small" htmlFor={`svc-${svc}`}>
                      {svc}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Distance Slider */}
            <div className="mb-4 pb-3 border-bottom">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label small fw-semibold text-muted mb-0">Max Distance</label>
                <span className="badge bg-primary">{maxDistance} km</span>
              </div>
              <input
                type="range"
                className="form-range"
                min="5"
                max="100"
                step="5"
                value={maxDistance}
                onChange={(e) => setMaxDistance(e.target.value)}
              />
              <div className="d-flex justify-content-between text-muted small" style={{ fontSize: '0.7rem' }}>
                <span>5 km</span>
                <span>50 km</span>
                <span>100 km</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-4 pb-3 border-bottom">
              <label className="form-label small fw-semibold text-muted">Minimum Rating</label>
              <select
                className="form-select form-select-sm"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
              >
                <option value="">Any Rating</option>
                <option value="4.5">★ 4.5 & Above (Excellent)</option>
                <option value="4.0">★ 4.0 & Above (Very Good)</option>
                <option value="3.5">★ 3.5 & Above (Good)</option>
              </select>
            </div>

            {/* Max Price Filter */}
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">Max Starting Price (₹)</label>
              <input
                type="number"
                className="form-control form-control-sm"
                placeholder="e.g. 2000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ================= RESULTS SECTION ================= */}
        <div className="col-lg-9">
          {/* Top Sort & Search Bar */}
          <div className="card modern-card p-3 mb-4 border-0 shadow-sm rounded-4">
            <div className="row g-2 align-items-center">
              <div className="col-md-6">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-transparent border-end-0">
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search by garage name or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-6 d-flex justify-content-md-end align-items-center gap-2">
                <span className="small text-muted text-nowrap">Sort by:</span>
                <select
                  className="form-select form-select-sm"
                  style={{ width: 'auto' }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="distance">Distance (Nearest)</option>
                  <option value="rating">Rating (Highest)</option>
                  <option value="price">Starting Price</option>
                </select>
                <select
                  className="form-select form-select-sm"
                  style={{ width: 'auto' }}
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary Counter */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fw-semibold text-dark">
              Showing {providers.length} verified {providers.length === 1 ? 'provider' : 'providers'}
            </span>
            {coordinates?.lat && (
              <span className="small text-muted">
                <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                Calculated from Lat: {coordinates.lat.toFixed(3)}, Lng: {coordinates.lng.toFixed(3)}
              </span>
            )}
          </div>

          {loading ? (
            <div className="text-center py-5 my-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="text-muted mt-2">Searching nearby service providers...</p>
            </div>
          ) : providers.length === 0 ? (
            <div className="card modern-card p-5 text-center bg-white border-0 shadow-sm rounded-4">
              <i className="bi bi-search fs-1 text-muted mb-3 d-block"></i>
              <h4 className="fw-bold text-dark">No Providers Match Your Criteria</h4>
              <p className="text-muted small max-w-500 mx-auto mb-4">
                We couldn't find any service centers matching your distance or rating filters in this area.
              </p>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm rounded-pill px-4 mx-auto"
                onClick={handleResetFilters}
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'map' ? (
            /* Interactive Map View */
            <div>
              <div className="mb-3">
                <ProviderMap
                  providers={providers}
                  userLocation={userLocationResult}
                  onSelectProvider={(p) => setSelectedProviderForBooking(p)}
                />
              </div>
              <div className="row g-3 mt-2">
                {providers.map((p) => (
                  <div key={p._id} className="col-md-6">
                    <ProviderCard
                      provider={p}
                      onBookNow={(selected) => setSelectedProviderForBooking(selected)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Grid Card View */
            <div className="row g-4">
              {providers.map((provider) => (
                <div key={provider._id} className="col-md-6">
                  <ProviderCard
                    provider={provider}
                    onBookNow={(p) => setSelectedProviderForBooking(p)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedProviderForBooking && (
        <BookingModal
          provider={selectedProviderForBooking}
          onClose={() => setSelectedProviderForBooking(null)}
        />
      )}
    </div>
  );
};

export default ProviderSearch;
