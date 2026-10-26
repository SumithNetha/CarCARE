import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const ProviderLayout = () => {
  const { user } = useAuth();
  const provider = user?.provider;

  return (
    <div className="d-flex flex-column min-vh-100 bg-page">
      <Navbar />
      <div className="container py-4 flex-grow-1">
        {/* Verification Alert Banner if Pending */}
        {provider && provider.verified === 'pending' && (
          <div className="alert alert-warning border-0 shadow-sm d-flex align-items-center justify-content-between mb-4 rounded-3 p-3">
            <div className="d-flex align-items-center gap-3">
              <i className="bi bi-clock-history fs-3 text-warning"></i>
              <div>
                <h6 className="fw-bold mb-0">Partner Account Under Verification</h6>
                <p className="small mb-0 text-muted">
                  Your business profile is currently being reviewed by CarCare administrators. You can configure your services and operating schedule while approval is in progress.
                </p>
              </div>
            </div>
            <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">Pending Approval</span>
          </div>
        )}

        {/* Top Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <span className="badge bg-success-subtle text-success fw-semibold px-2 py-1 mb-1">
              Service Partner Hub
            </span>
            <h3 className="fw-bold mb-0">{provider?.businessName || user?.name}</h3>
            <span className="text-muted small">
              <i className="bi bi-geo-alt me-1"></i> {provider?.address || user?.address}, {provider?.city || user?.city}
            </span>
          </div>
          <div className="d-flex gap-2">
            <Link to="/provider/services" className="btn btn-primary-modern btn-sm rounded-pill px-3">
              <i className="bi bi-plus-circle me-1"></i> Add Service
            </Link>
          </div>
        </div>

        <div className="row g-4">
          {/* Provider Sidebar */}
          <div className="col-lg-3 col-md-4">
            <div className="modern-card p-3 sticky-top" style={{ top: '90px' }}>
              <div className="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom">
                <div
                  className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5"
                  style={{ width: '48px', height: '48px' }}
                >
                  <i className="bi bi-shop"></i>
                </div>
                <div className="overflow-hidden">
                  <h6 className="fw-bold mb-0 text-truncate">{provider?.businessName || 'Business Hub'}</h6>
                  <span className="text-muted small text-truncate d-block">
                    {provider?.verified === 'approved' ? (
                      <span className="text-success"><i className="bi bi-check-circle-fill me-1"></i> Verified</span>
                    ) : (
                      <span className="text-warning"><i className="bi bi-clock me-1"></i> Under Review</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="d-flex flex-column gap-1">
                <NavLink
                  to="/provider/dashboard"
                  end
                  className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-speedometer2"></i> Dashboard Overview
                </NavLink>
                <NavLink
                  to="/provider/bookings"
                  className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-calendar-event-fill"></i> Manage Bookings
                </NavLink>
                <NavLink
                  to="/provider/services"
                  className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-tools"></i> Service Catalog & Pricing
                </NavLink>
                <NavLink
                  to="/provider/availability"
                  className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-clock-fill"></i> Working Hours & Slots
                </NavLink>
                <NavLink
                  to="/provider/profile"
                  className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-building"></i> Business Details & GPS
                </NavLink>
              </div>

              {/* Quick Rating box */}
              <div className="mt-4 pt-3 border-top">
                <div className="p-3 bg-light rounded-3 text-center">
                  <div className="fs-3 fw-bold text-dark mb-0">
                    ★ {provider?.rating ? provider.rating.toFixed(1) : '5.0'}
                  </div>
                  <span className="text-muted small">
                    Based on {provider?.reviewCount || 0} reviews
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-lg-9 col-md-8">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProviderLayout;
