import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import ProviderCard from '../components/ProviderCard';
import BookingModal from '../components/BookingModal';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { city, coordinates } = useLocation();

  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [nearbyProviders, setNearbyProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProviderForBooking, setSelectedProviderForBooking] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [vRes, bRes, pRes] = await Promise.all([
          api.get('/vehicles'),
          api.get('/bookings'),
          api.get(`/providers?sortBy=distance&sortOrder=asc&city=${encodeURIComponent(city || 'Hyderabad')}`),
        ]);

        if (vRes.data.success) setVehicles(vRes.data.data);
        if (bRes.data.success) setBookings(bRes.data.data);
        if (pRes.data.success) setNearbyProviders(pRes.data.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [city]);

  const upcomingBookings = bookings.filter((b) => ['PENDING', 'ACCEPTED', 'IN_PROGRESS'].includes(b.status));
  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED');

  return (
    <div className="d-flex flex-column gap-4">
      {/* KPI Stat Cards */}
      <div className="row g-3">
        <div className="col-md-3 col-6">
          <div className="card modern-card p-3 border-0 shadow-sm rounded-4 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold">My Vehicles</span>
              <div className="bg-primary text-white rounded-circle p-2 d-flex">
                <i className="bi bi-car-front-fill"></i>
              </div>
            </div>
            <h3 className="fw-bold mb-0 text-dark">{vehicles.length}</h3>
            <Link to="/customer/vehicles" className="small text-primary text-decoration-none mt-2 d-inline-block">
              View Fleet →
            </Link>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="card modern-card p-3 border-0 shadow-sm rounded-4 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold">Active Bookings</span>
              <div className="bg-warning text-dark rounded-circle p-2 d-flex">
                <i className="bi bi-calendar-check-fill"></i>
              </div>
            </div>
            <h3 className="fw-bold mb-0 text-dark">{upcomingBookings.length}</h3>
            <Link to="/customer/bookings" className="small text-primary text-decoration-none mt-2 d-inline-block">
              Track Status →
            </Link>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="card modern-card p-3 border-0 shadow-sm rounded-4 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold">Completed</span>
              <div className="bg-success text-white rounded-circle p-2 d-flex">
                <i className="bi bi-check-all"></i>
              </div>
            </div>
            <h3 className="fw-bold mb-0 text-dark">{completedBookings.length}</h3>
            <Link to="/customer/bookings" className="small text-primary text-decoration-none mt-2 d-inline-block">
              History →
            </Link>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="card modern-card p-3 border-0 shadow-sm rounded-4 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold">Services Available</span>
              <div className="bg-info text-white rounded-circle p-2 d-flex">
                <i className="bi bi-grid-fill"></i>
              </div>
            </div>
            <h3 className="fw-bold mb-0 text-dark">3 Pillars</h3>
            <Link to="/services" className="small text-primary text-decoration-none mt-2 d-inline-block">
              Explore →
            </Link>
          </div>
        </div>
      </div>

      {/* Upcoming / Active Bookings Section */}
      <div className="card modern-card p-4 border-0 shadow-sm rounded-4 bg-white">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">
            <i className="bi bi-clock-history text-primary me-2"></i> Upcoming & Active Bookings
          </h5>
          <Link to="/customer/bookings" className="small text-primary text-decoration-none fw-semibold">
            View All ({bookings.length})
          </Link>
        </div>

        {upcomingBookings.length === 0 ? (
          <div className="p-4 bg-light text-center rounded-3">
            <i className="bi bi-calendar2-x fs-2 text-muted mb-2 d-block"></i>
            <h6 className="fw-semibold text-muted">No active bookings right now</h6>
            <p className="text-muted small mb-3">Schedule your periodic maintenance or car rental today.</p>
            <Link to="/providers" className="btn btn-primary-modern btn-sm">
              Book a Service
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small">
                <tr>
                  <th>Booking ID</th>
                  <th>Service</th>
                  <th>Provider</th>
                  <th>Date & Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {upcomingBookings.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <span className="badge bg-light text-dark border fw-bold">{b.bookingId}</span>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{b.serviceId?.serviceName || 'Service'}</div>
                      <span className="text-muted small">{b.serviceId?.category}</span>
                    </td>
                    <td>
                      <div className="fw-semibold">{b.providerId?.businessName}</div>
                      <span className="text-muted small">{b.providerId?.city}</span>
                    </td>
                    <td className="small">
                      {new Date(b.bookingDate).toLocaleDateString()} at {b.bookingTime}
                    </td>
                    <td className="fw-bold text-dark">₹{b.amount}</td>
                    <td>
                      <span className={`status-badge status-${b.status}`}>{b.status}</span>
                    </td>
                    <td>
                      <Link to={`/customer/bookings/${b._id}`} className="btn btn-outline-primary btn-sm py-1 px-3">
                        Track
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* My Registered Vehicles Snapshot */}
      <div className="card modern-card p-4 border-0 shadow-sm rounded-4 bg-white">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">
            <i className="bi bi-car-front text-primary me-2"></i> My Garage Fleet
          </h5>
          <Link to="/customer/vehicles/add" className="btn btn-outline-primary btn-sm rounded-pill px-3">
            + Register Car
          </Link>
        </div>

        {vehicles.length === 0 ? (
          <div className="p-4 bg-light text-center rounded-3">
            <i className="bi bi-car-front fs-2 text-muted mb-2 d-block"></i>
            <h6 className="fw-semibold text-muted">No vehicles registered yet</h6>
            <p className="text-muted small mb-3">Add your car to easily book mechanics and tailored wash packages.</p>
            <Link to="/customer/vehicles/add" className="btn btn-primary-modern btn-sm">
              Add My First Vehicle
            </Link>
          </div>
        ) : (
          <div className="row g-3">
            {vehicles.map((v) => (
              <div key={v._id} className="col-md-6">
                <div className="p-3 border rounded-3 bg-light d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-primary text-white rounded-3 p-2 d-flex">
                      <i className="bi bi-car-front-fill fs-5"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0 text-dark">{v.brand} {v.model}</h6>
                      <span className="badge bg-secondary-subtle text-dark border small me-1">
                        {v.registrationNumber}
                      </span>
                      <span className="small text-muted">{v.fuelType} • {v.color} ({v.year})</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Nearby Providers */}
      <div className="card modern-card p-4 border-0 shadow-sm rounded-4 bg-white">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">
            <i className="bi bi-geo-alt-fill text-danger me-2"></i> Recommended Near You in {city}
          </h5>
          <Link to="/providers" className="small text-primary text-decoration-none fw-semibold">
            Search All →
          </Link>
        </div>

        <div className="row g-3">
          {nearbyProviders.map((p) => (
            <div key={p._id} className="col-md-4">
              <ProviderCard
                provider={p}
                onBookNow={(selected) => setSelectedProviderForBooking(selected)}
              />
            </div>
          ))}
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

export default CustomerDashboard;
