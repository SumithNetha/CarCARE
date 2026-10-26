import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user } = useAuth();

  return (
    <div className="d-flex flex-column min-vh-100 bg-page">
      <Navbar />
      <div className="container py-4 flex-grow-1">
        {/* Top Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <span className="badge bg-danger-subtle text-danger fw-semibold px-2 py-1 mb-1">
              Platform Administration
            </span>
            <h3 className="fw-bold mb-0">System Control Center</h3>
            <span className="text-muted small">Supervisor: {user?.name} ({user?.email})</span>
          </div>
        </div>

        <div className="row g-4">
          {/* Admin Sidebar */}
          <div className="col-lg-3 col-md-4">
            <div className="modern-card p-3 sticky-top" style={{ top: '90px' }}>
              <div className="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom">
                <div
                  className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5"
                  style={{ width: '48px', height: '48px' }}
                >
                  <i className="bi bi-shield-lock-fill"></i>
                </div>
                <div className="overflow-hidden">
                  <h6 className="fw-bold mb-0 text-truncate">Admin Root</h6>
                  <span className="badge bg-danger text-white small">Super Admin</span>
                </div>
              </div>

              <div className="d-flex flex-column gap-1">
                <NavLink
                  to="/admin/dashboard"
                  end
                  className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-graph-up-arrow"></i> System Analytics
                </NavLink>
                <NavLink
                  to="/admin/providers"
                  className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-patch-check-fill text-primary"></i> Provider Approvals
                </NavLink>
                <NavLink
                  to="/admin/customers"
                  className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-people-fill"></i> Manage Customers
                </NavLink>
                <NavLink
                  to="/admin/services"
                  className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-grid-3x3-gap-fill"></i> Global Services
                </NavLink>
                <NavLink
                  to="/admin/bookings"
                  className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-receipt"></i> Platform Bookings
                </NavLink>
                <NavLink
                  to="/admin/reviews"
                  className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-chat-heart-fill text-warning"></i> Moderate Reviews
                </NavLink>
              </div>
            </div>
          </div>

          {/* Main Admin Outlet */}
          <div className="col-lg-9 col-md-8">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
