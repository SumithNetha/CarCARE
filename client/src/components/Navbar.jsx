import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation, HYDERABAD_AREAS } from '../context/LocationContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { area, errorMsg, selectCity, detectLocation, isDetecting, isGpsActive } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'provider') return '/provider/dashboard';
    return '/customer/dashboard';
  };

  return (
    <nav className="navbar navbar-expand-lg glass-nav sticky-top py-3">
      <div className="container">
        {errorMsg && <div className="alert alert-warning position-fixed top-0 start-50 translate-middle-x mt-2 py-2 px-3 shadow" role="alert" style={{ zIndex: 1100 }}>{errorMsg}</div>}
        {/* Brand Logo */}
        <Link className="brand-logo" to="/">
          <div className="logo-icon">
            <i className="bi bi-car-front-fill fs-5"></i>
          </div>
          <span>CarCare <span className="highlight">Connect</span></span>
        </Link>

        {/* Location Selector Pill in Navbar */}
        <div className="d-none d-lg-flex align-items-center ms-4 me-auto bg-light border rounded-pill px-3 py-1">
          <i className={`bi ${isGpsActive ? 'bi-geo-alt-fill text-danger' : 'bi-geo-alt text-primary'} me-2`}></i>
          <select
            className="form-select form-select-sm border-0 bg-transparent py-0 fw-semibold text-dark shadow-none"
            style={{ width: '155px', cursor: 'pointer' }}
            value={area === 'Current location' ? 'HITEC City' : area}
            onChange={(e) => selectCity(e.target.value)}
          >
            {HYDERABAD_AREAS.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn-sm btn-link p-0 text-decoration-none text-muted ms-1"
            title="Detect GPS Location"
            onClick={detectLocation}
            disabled={isDetecting}
          >
            {isDetecting ? (
              <span className="spinner-border spinner-border-sm text-primary" role="status"></span>
            ) : (
              <i className="bi bi-crosshair text-primary fs-6"></i>
            )}
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list fs-2 text-dark"></i>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-1 gap-lg-2">
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 fw-medium ${isActive ? 'text-primary fw-bold' : 'text-dark'}`} to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 fw-medium ${isActive ? 'text-primary fw-bold' : 'text-dark'}`} to="/services">
                Services
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 fw-medium ${isActive ? 'text-primary fw-bold' : 'text-dark'}`} to="/providers">
                Find Providers
              </NavLink>
            </li>

            {isAuthenticated && user?.role === 'customer' && (
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link px-3 fw-medium ${isActive ? 'text-primary fw-bold' : 'text-dark'}`} to="/customer/bookings">
                  My Bookings
                </NavLink>
              </li>
            )}

            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 fw-medium ${isActive ? 'text-primary fw-bold' : 'text-dark'}`} to="/about">
                About
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 fw-medium ${isActive ? 'text-primary fw-bold' : 'text-dark'}`} to="/contact">
                Contact
              </NavLink>
            </li>

            {/* Auth Actions */}
            {isAuthenticated ? (
              <li className="nav-item dropdown ms-lg-3">
                <button
                  className="btn btn-outline-dark dropdown-toggle rounded-pill d-flex align-items-center gap-2 px-3 py-1 shadow-sm"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div
                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: '28px', height: '28px', fontSize: '0.8rem' }}
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="fw-semibold text-truncate" style={{ maxWidth: '120px' }}>
                    {user?.name}
                  </span>
                  <span className={`badge rounded-pill ${user?.role === 'admin' ? 'bg-danger' : user?.role === 'provider' ? 'bg-warning text-dark' : 'bg-primary'}`}>
                    {user?.role}
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 rounded-3 p-2">
                  <li>
                    <Link className="dropdown-item py-2 fw-medium rounded-2" to={getDashboardPath()}>
                      <i className="bi bi-speedometer2 text-primary me-2"></i> Dashboard
                    </Link>
                  </li>
                  {user?.role === 'customer' && (
                    <>
                      <li>
                        <Link className="dropdown-item py-2 fw-medium rounded-2" to="/customer/vehicles">
                          <i className="bi bi-car-front text-primary me-2"></i> My Vehicles
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2 fw-medium rounded-2" to="/customer/bookings">
                          <i className="bi bi-calendar-check text-primary me-2"></i> Bookings
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2 fw-medium rounded-2" to="/customer/profile">
                          <i className="bi bi-person text-primary me-2"></i> Profile
                        </Link>
                      </li>
                    </>
                  )}
                  {user?.role === 'provider' && (
                    <>
                      <li>
                        <Link className="dropdown-item py-2 fw-medium rounded-2" to="/provider/services">
                          <i className="bi bi-tools text-primary me-2"></i> Manage Services
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2 fw-medium rounded-2" to="/provider/bookings">
                          <i className="bi bi-inbox text-primary me-2"></i> Bookings
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2 fw-medium rounded-2" to="/provider/profile">
                          <i className="bi bi-building text-primary me-2"></i> Business Profile
                        </Link>
                      </li>
                    </>
                  )}
                  {user?.role === 'admin' && (
                    <>
                      <li>
                        <Link className="dropdown-item py-2 fw-medium rounded-2" to="/admin/providers">
                          <i className="bi bi-patch-check text-primary me-2"></i> Verify Providers
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2 fw-medium rounded-2" to="/admin/customers">
                          <i className="bi bi-people text-primary me-2"></i> Customers
                        </Link>
                      </li>
                    </>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item py-2 text-danger fw-semibold rounded-2" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item d-flex align-items-center gap-2 ms-lg-3 mt-2 mt-lg-0">
                <Link to="/login" className="btn btn-outline-modern btn-sm px-3 rounded-pill">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary-modern btn-sm px-3 rounded-pill">
                  Register
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
