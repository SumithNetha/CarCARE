import React from 'react';
import { Link } from 'react-router-dom';

const ServicesHub = () => {
  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center max-w-700 mx-auto mb-5">
        <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-1 mb-2 rounded-pill">
          SERVICE CATALOG
        </span>
        <h1 className="display-5 fw-bold">Explore Our Professional Services</h1>
        <p className="text-muted">
          From self-drive car rentals for weekend road trips to expert mechanical diagnostics and luxury spa washes.
        </p>
      </div>

      <div className="row g-4 mb-5">
        {/* Service 1: Rental */}
        <div className="col-lg-4">
          <div className="card modern-card h-100 p-4 border-top border-4 border-primary">
            <div
              className="bg-primary-light text-primary rounded-3 d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: '60px', height: '60px' }}
            >
              <i className="bi bi-key-fill fs-2"></i>
            </div>
            <h3 className="fw-bold mb-2">Car Rental</h3>
            <p className="text-muted mb-4">
              Premium self-drive hatchback, SUV, and EV rentals. Unlimited kilometers, comprehensive zero-dep insurance, and airport dropoffs.
            </p>
            <div className="bg-light p-3 rounded-3 mb-4">
              <span className="text-muted small d-block">Starting from</span>
              <span className="fs-4 fw-bold text-dark">₹1,799 <small className="text-muted fs-6 fw-normal">/ day</small></span>
            </div>
            <ul className="list-unstyled d-flex flex-column gap-2 small text-secondary mb-4 flex-grow-1">
              <li><i className="bi bi-check-circle-fill text-success me-2"></i> Verified sanitization before handover</li>
              <li><i className="bi bi-check-circle-fill text-success me-2"></i> Fastag pre-installed</li>
              <li><i className="bi bi-check-circle-fill text-success me-2"></i> 24/7 Roadside breakdown cover</li>
            </ul>
            <Link to="/services/rental" className="btn btn-primary-modern w-100">
              Browse Rental Cars
            </Link>
          </div>
        </div>

        {/* Service 2: Mechanic */}
        <div className="col-lg-4">
          <div className="card modern-card h-100 p-4 border-top border-4 border-warning">
            <div
              className="bg-warning bg-opacity-10 text-warning rounded-3 d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: '60px', height: '60px' }}
            >
              <i className="bi bi-tools fs-2"></i>
            </div>
            <h3 className="fw-bold mb-2">Car Mechanic</h3>
            <p className="text-muted mb-4">
              Computerized OBD engine scans, periodic scheduled maintenance, brake pad renewals, suspension repair, and battery jumpstarts.
            </p>
            <div className="bg-light p-3 rounded-3 mb-4">
              <span className="text-muted small d-block">Starting from</span>
              <span className="fs-4 fw-bold text-dark">₹499 <small className="text-muted fs-6 fw-normal">/ service</small></span>
            </div>
            <ul className="list-unstyled d-flex flex-column gap-2 small text-secondary mb-4 flex-grow-1">
              <li><i className="bi bi-check-circle-fill text-success me-2"></i> 40-Point digital health inspection</li>
              <li><i className="bi bi-check-circle-fill text-success me-2"></i> 100% Genuine OEM parts</li>
              <li><i className="bi bi-check-circle-fill text-success me-2"></i> 1,000 km / 30-day service warranty</li>
            </ul>
            <Link to="/services/mechanic" className="btn btn-primary-modern w-100">
              Find Expert Mechanics
            </Link>
          </div>
        </div>

        {/* Service 3: Wash */}
        <div className="col-lg-4">
          <div className="card modern-card h-100 p-4 border-top border-4 border-info">
            <div
              className="bg-info bg-opacity-10 text-info rounded-3 d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: '60px', height: '60px' }}
            >
              <i className="bi bi-droplet-half fs-2"></i>
            </div>
            <h3 className="fw-bold mb-2">Car Washing & Spa</h3>
            <p className="text-muted mb-4">
              High-pressure snow foam baths, underbody jet wash, interior cabin sanitization, 3M machine buffing, and hydrophobic ceramic shield.
            </p>
            <div className="bg-light p-3 rounded-3 mb-4">
              <span className="text-muted small d-block">Starting from</span>
              <span className="fs-4 fw-bold text-dark">₹399 <small className="text-muted fs-6 fw-normal">/ clean</small></span>
            </div>
            <ul className="list-unstyled d-flex flex-column gap-2 small text-secondary mb-4 flex-grow-1">
              <li><i className="bi bi-check-circle-fill text-success me-2"></i> pH-neutral snow foam</li>
              <li><i className="bi bi-check-circle-fill text-success me-2"></i> Deep interior upholstery extraction</li>
              <li><i className="bi bi-check-circle-fill text-success me-2"></i> Scratch-free microfiber drying</li>
            </ul>
            <Link to="/services/car-wash" className="btn btn-primary-modern w-100">
              Book Car Wash
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesHub;
