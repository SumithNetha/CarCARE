import React from 'react';
import { Link } from 'react-router-dom';

const ProviderCard = ({ provider, onBookNow }) => {
  const {
    _id,
    businessName,
    rating = 5.0,
    reviewCount = 0,
    distance,
    address,
    city,
    services = [],
    startingPrice = 499,
    workingHours = { open: '09:00 AM', close: '07:00 PM' },
    imageUrl,
    verified,
  } = provider;

  const getServiceBadgeClass = (s) => {
    if (s === 'Car Rental') return 'badge-rental';
    if (s === 'Car Mechanic') return 'badge-mechanic';
    return 'badge-wash';
  };

  const getServiceIcon = (s) => {
    if (s === 'Car Rental') return 'bi-key-fill';
    if (s === 'Car Mechanic') return 'bi-wrench-adjustable';
    return 'bi-droplet-fill';
  };

  return (
    <div className="card modern-card h-100 d-flex flex-column">
      {/* Image & Distance Pill */}
      <div className="provider-image-wrapper">
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80'}
          alt={businessName}
          loading="lazy"
        />
        {distance !== null && distance !== undefined && (
          <div className="distance-badge shadow-sm">
            <i className="bi bi-geo-alt-fill text-danger"></i>
            <span>{distance} km away</span>
          </div>
        )}
        {verified === 'approved' && (
          <div className="position-absolute bottom-0 start-0 m-2">
            <span className="badge-verified shadow-sm">
              <i className="bi bi-patch-check-fill me-1"></i> Verified Partner
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="card-body p-3 d-flex flex-column flex-grow-1">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <h5 className="card-title fw-bold mb-0 text-dark text-truncate" title={businessName}>
            <Link to={`/providers/${_id}`} className="text-dark text-decoration-none hover-primary">
              {businessName}
            </Link>
          </h5>
          <div className="rating-pill flex-shrink-0">
            <i className="bi bi-star-fill text-warning"></i>
            <span>{rating.toFixed(1)}</span>
            <span className="text-muted small fw-normal">({reviewCount})</span>
          </div>
        </div>

        {/* Address */}
        <p className="card-text text-muted small mb-2 text-truncate" title={`${address}, ${city}`}>
          <i className="bi bi-geo-alt me-1 text-primary"></i>
          {address}, {city}
        </p>

        {/* Operating Hours */}
        <div className="text-muted small mb-3">
          <i className="bi bi-clock me-1 text-secondary"></i>
          <span>Open: {workingHours?.open || '09:00 AM'} - {workingHours?.close || '07:00 PM'}</span>
        </div>

        {/* Services Badges */}
        <div className="d-flex flex-wrap gap-1 mb-3">
          {services.map((svc) => (
            <span key={svc} className={`badge-service ${getServiceBadgeClass(svc)}`}>
              <i className={`bi ${getServiceIcon(svc)}`}></i>
              {svc}
            </span>
          ))}
        </div>

        {/* Starting Price and Action Buttons */}
        <div className="mt-auto pt-3 border-top d-flex align-items-center justify-content-between">
          <div>
            <span className="text-muted small d-block">Starting from</span>
            <span className="fs-5 fw-bold text-dark">₹{startingPrice.toLocaleString()}</span>
          </div>

          <div className="d-flex gap-2">
            <Link to={`/providers/${_id}`} className="btn btn-outline-modern btn-sm px-2 px-md-3">
              View Details
            </Link>
            <button
              type="button"
              className="btn btn-primary-modern btn-sm px-2 px-md-3"
              onClick={() => onBookNow && onBookNow(provider)}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;
