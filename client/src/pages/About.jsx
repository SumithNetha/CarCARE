import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="container py-5">
      {/* Hero */}
      <div className="text-center max-w-700 mx-auto mb-5">
        <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-1 mb-2 rounded-pill">
          ABOUT CARCARE CONNECT
        </span>
        <h1 className="display-5 fw-bold mb-3">Re-imagining Automobile Care in India</h1>
        <p className="lead text-muted fs-5">
          Connecting vehicle owners directly with audited workshops, certified mechanics, and clean self-drive rentals.
        </p>
      </div>

      <div className="row g-5 align-items-center mb-5">
        <div className="col-lg-6">
          <h3 className="fw-bold mb-3">Our Core Mission</h3>
          <p className="text-secondary">
            Car owners historically suffered through opaque repair estimates, fake spare parts, long turnaround times, 
            and confusing rental contracts. CarCare Connect was founded to establish transparency, upfront pricing, 
            and high reliability.
          </p>
          <p className="text-secondary mb-4">
            Through our automated GPS geolocation platform, customers find nearest verified mechanics and car wash studios 
            in seconds, schedule repair bays, track status milestones digitally, and leave authentic feedback.
          </p>

          <div className="row g-3">
            <div className="col-6">
              <div className="p-3 bg-light rounded-3">
                <h4 className="fw-bold text-primary mb-0">10,000+</h4>
                <span className="text-muted small">Registered Vehicles</span>
              </div>
            </div>
            <div className="col-6">
              <div className="p-3 bg-light rounded-3">
                <h4 className="fw-bold text-success mb-0">500+</h4>
                <span className="text-muted small">Verified Partners</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80"
            alt="About CarCare"
            className="img-fluid rounded-4 shadow-lg"
          />
        </div>
      </div>

      {/* Safety & Quality Pledge */}
      <div className="card modern-card p-4 p-md-5 bg-dark text-white border-0 rounded-4 mb-5">
        <div className="row g-4 align-items-center">
          <div className="col-lg-8">
            <h3 className="fw-bold text-white mb-2">Our 100% Quality & Verification Pledge</h3>
            <p className="text-white-50 mb-0">
              Every provider on CarCare Connect undergoes physical workshop audits, equipment checklists, 
              and GST validations by our engineering team before being approved.
            </p>
          </div>
          <div className="col-lg-4 text-lg-end">
            <Link to="/providers" className="btn btn-primary-modern px-4 py-2">
              Browse Verified Garages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
