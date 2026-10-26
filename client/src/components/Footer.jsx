import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto border-top border-secondary">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center"
                style={{ width: '36px', height: '36px' }}
              >
                <i className="bi bi-car-front-fill fs-5"></i>
              </div>
              <span className="fs-4 fw-bold text-white">CarCare <span className="text-primary">Connect</span></span>
            </div>
            <p className="text-secondary-subtle small mb-4 pe-lg-3">
              India's premier connected marketplace for car owners and certified service centers. 
              Find top-rated mechanics, car washes, and self-drive rentals with transparent pricing 
              and verified quality.
            </p>
            <div className="d-flex gap-3 text-secondary-subtle">
              <a href="#twitter" className="text-secondary-subtle fs-5 text-decoration-none hover-primary"><i className="bi bi-twitter-x"></i></a>
              <a href="#facebook" className="text-secondary-subtle fs-5 text-decoration-none hover-primary"><i className="bi bi-facebook"></i></a>
              <a href="#instagram" className="text-secondary-subtle fs-5 text-decoration-none hover-primary"><i className="bi bi-instagram"></i></a>
              <a href="#linkedin" className="text-secondary-subtle fs-5 text-decoration-none hover-primary"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

          {/* Services Column */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-uppercase fw-bold text-light mb-3 letter-spacing-1">Services</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <Link to="/services/rental" className="text-secondary-subtle text-decoration-none">
                  Car Rental
                </Link>
              </li>
              <li>
                <Link to="/services/mechanic" className="text-secondary-subtle text-decoration-none">
                  Car Mechanic & Repair
                </Link>
              </li>
              <li>
                <Link to="/services/car-wash" className="text-secondary-subtle text-decoration-none">
                  Car Washing & Detailing
                </Link>
              </li>
              <li>
                <Link to="/providers" className="text-secondary-subtle text-decoration-none">
                  Find Nearby Providers
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-secondary-subtle text-decoration-none">
                  All Service Packages
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase fw-bold text-light mb-3 letter-spacing-1">Customer Support</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <Link to="/contact" className="text-secondary-subtle text-decoration-none">
                  24/7 Roadside Assistance
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-secondary-subtle text-decoration-none">
                  Safety & Verification
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-secondary-subtle text-decoration-none">
                  Help Center & FAQs
                </Link>
              </li>
              <li>
                <a href="tel:+9118002008888" className="text-primary text-decoration-none fw-semibold">
                  <i className="bi bi-telephone-fill me-1"></i> 1800-200-8888 (Toll Free)
                </a>
              </li>
              <li className="text-secondary-subtle">
                <i className="bi bi-envelope-fill me-1"></i> support@carcareconnect.com
              </li>
            </ul>
          </div>

          {/* Provider Portal & Partner */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase fw-bold text-light mb-3 letter-spacing-1">Partner With Us</h6>
            <p className="text-secondary-subtle small mb-3">
              Are you a garage owner, detailing studio, or rental fleet operator? Expand your customer reach.
            </p>
            <Link
              to="/register?role=provider"
              className="btn btn-outline-light btn-sm rounded-pill px-3 py-2 w-100 fw-semibold d-flex align-items-center justify-content-center gap-2 mb-2"
            >
              <i className="bi bi-briefcase-fill text-primary"></i> Provider Registration
            </Link>
            <Link
              to="/login"
              className="text-secondary-subtle small text-decoration-none text-center d-block"
            >
              Already registered? Partner Login →
            </Link>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="row align-items-center small text-secondary-subtle">
          <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
            © {new Date().getFullYear()} CarCare Connect. All rights reserved. Built with modern React & Node.js.
          </div>
          <div className="col-md-6 text-center text-md-end d-flex justify-content-center justify-content-md-end gap-3">
            <Link to="/about" className="text-secondary-subtle text-decoration-none">Terms of Service</Link>
            <span>•</span>
            <Link to="/about" className="text-secondary-subtle text-decoration-none">Privacy Policy</Link>
            <span>•</span>
            <Link to="/contact" className="text-secondary-subtle text-decoration-none">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
