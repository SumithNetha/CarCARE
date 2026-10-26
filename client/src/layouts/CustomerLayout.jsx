import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const CustomerLayout = () => {
  const { user } = useAuth();

  return (
    <div className="d-flex flex-column min-vh-100 bg-page">
      <Navbar />
      <div className="container py-4 flex-grow-1">
        {/* Breadcrumb / Top Bar */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <span className="badge bg-primary-subtle text-primary fw-semibold px-2 py-1 mb-1">
              Customer Portal
            </span>
            <h3 className="fw-bold mb-0">Welcome back, {user?.name || 'Customer'}</h3>
          </div>
          <div className="d-flex gap-2">
            <Link to="/providers" className="btn btn-outline-primary btn-sm rounded-pill px-3">
              <i className="bi bi-search me-1"></i> Find Services
            </Link>
            <Link to="/customer/vehicles/add" className="btn btn-primary-modern btn-sm rounded-pill px-3">
              <i className="bi bi-plus-circle me-1"></i> Add Vehicle
            </Link>
          </div>
        </div>

        <div className="row g-4">
          {/* Customer Sidebar */}
          <div className="col-lg-3 col-md-4">
            <div className="modern-card p-3 dashboard-sidebar">
              <div className="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom">
                <div
                  className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5"
                  style={{ width: '48px', height: '48px' }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <h6 className="fw-bold mb-0 text-truncate">{user?.name}</h6>
                  <span className="text-muted small text-truncate d-block">{user?.email}</span>
                </div>
              </div>

              <div className="d-flex flex-column gap-1">
                <NavLink
                  to="/customer/dashboard"
                  end
                  className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-speedometer2"></i> Dashboard
                </NavLink>
                <NavLink
                  to="/customer/vehicles"
                  className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-car-front-fill"></i> My Vehicles
                </NavLink>
                <NavLink
                  to="/customer/bookings"
                  className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-calendar-check-fill"></i> My Bookings
                </NavLink>
                <NavLink
                  to="/customer/reviews"
                  className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-star-fill text-warning"></i> My Reviews
                </NavLink>
                <NavLink
                  to="/customer/profile"
                  className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-person-fill"></i> Profile & Address
                </NavLink>
              </div>

              <div className="mt-4 pt-3 border-top">
                <div className="p-3 bg-light rounded-3 text-center">
                  <i className="bi bi-headset fs-3 text-primary mb-1 d-block"></i>
                  <h6 className="fw-bold mb-1 small">Need Roadside Help?</h6>
                  <p className="text-muted small mb-2" style={{ fontSize: '0.75rem' }}>
                    24/7 Breakdown & Towing Assistance
                  </p>
                  <a href="tel:18002008888" className="btn btn-outline-danger btn-sm w-100 rounded-pill fw-semibold">
                    <i className="bi bi-telephone-fill me-1"></i> Call Emergency
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Outlet */}
          <div className="col-lg-9 col-md-8">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
