import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container py-5 my-5 text-center">
      <div className="py-5 max-w-600 mx-auto">
        <h1 className="display-1 fw-extrabold text-primary mb-2">404</h1>
        <h3 className="fw-bold mb-3">Page Not Found</h3>
        <p className="text-muted mb-4">
          The page or service link you are looking for may have been moved or does not exist.
        </p>
        <div className="d-flex gap-2 justify-content-center">
          <Link to="/" className="btn btn-primary-modern">
            <i className="bi bi-house me-1"></i> Back to Home
          </Link>
          <Link to="/providers" className="btn btn-outline-secondary">
            <i className="bi bi-search me-1"></i> Find Services
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
