import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProviderDashboard = () => {
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProviderData = async () => {
    setLoading(true);
    try {
      const [bRes, pRes] = await Promise.all([
        api.get('/bookings'),
        api.get('/providers/me/profile'),
      ]);

      if (bRes.data.success) setBookings(bRes.data.data);
      if (pRes.data.success) setServices(pRes.data.data.services || []);
    } catch (err) {
      console.error('Failed to load provider metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderData();
  }, []);

  const pendingBookings = bookings.filter((b) => b.status === 'PENDING');
  const acceptedBookings = bookings.filter((b) => b.status === 'ACCEPTED');
  const inProgressBookings = bookings.filter((b) => b.status === 'IN_PROGRESS');
  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED');

  // Revenue calculation from completed bookings
  const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.amount || 0), 0);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, {
        status: newStatus,
        note: `Status updated to ${newStatus} by workshop manager`,
      });
      if (res.data.success) {
        fetchProviderData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Metrics Row */}
      <div className="row g-3">
        <div className="col-lg-3 col-6">
          <div className="card modern-card p-3 border-0 shadow-sm rounded-4 bg-white">
            <span className="text-muted small fw-semibold">Total Revenue</span>
            <h3 className="fw-bold mb-0 text-success mt-1">₹{totalRevenue.toLocaleString()}</h3>
            <span className="text-muted small">From {completedBookings.length} completed jobs</span>
          </div>
        </div>

        <div className="col-lg-3 col-6">
          <div className="card modern-card p-3 border-0 shadow-sm rounded-4 bg-white">
            <span className="text-muted small fw-semibold">Pending Requests</span>
            <h3 className="fw-bold mb-0 text-warning mt-1">{pendingBookings.length}</h3>
            <Link to="/provider/bookings" className="small text-primary text-decoration-none">
              Review requests →
            </Link>
          </div>
        </div>

        <div className="col-lg-3 col-6">
          <div className="card modern-card p-3 border-0 shadow-sm rounded-4 bg-white">
            <span className="text-muted small fw-semibold">In Progress</span>
            <h3 className="fw-bold mb-0 text-primary mt-1">{acceptedBookings.length + inProgressBookings.length}</h3>
            <span className="text-muted small">Active in bay</span>
          </div>
        </div>

        <div className="col-lg-3 col-6">
          <div className="card modern-card p-3 border-0 shadow-sm rounded-4 bg-white">
            <span className="text-muted small fw-semibold">Total Bookings</span>
            <h3 className="fw-bold mb-0 text-dark mt-1">{bookings.length}</h3>
            <span className="text-muted small">Lifetime appointments</span>
          </div>
        </div>
      </div>

      {/* Incoming Requests Action Table */}
      <div className="card modern-card p-4 border-0 shadow-sm rounded-4 bg-white">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">
            <i className="bi bi-bell text-warning me-2"></i> Recent Booking Requests
          </h5>
          <Link to="/provider/bookings" className="small text-primary text-decoration-none fw-semibold">
            Manage All Bookings ({bookings.length}) →
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-5 bg-light rounded-3">
            <i className="bi bi-inbox fs-2 text-muted mb-2 d-block"></i>
            <h6>No booking requests yet</h6>
            <p className="text-muted small mb-0">Your catalog is live for nearby car owners to discover.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small">
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Date & Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Quick Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b._id}>
                    <td>
                      <span className="badge bg-light text-dark border fw-bold">{b.bookingId}</span>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{b.customerId?.name || 'Customer'}</div>
                      <span className="text-muted small">{b.customerId?.phone}</span>
                    </td>
                    <td>
                      <div className="fw-semibold">{b.serviceId?.serviceName}</div>
                      {b.vehicleId && (
                        <span className="badge bg-light text-secondary border small">
                          {b.vehicleId.brand} {b.vehicleId.model}
                        </span>
                      )}
                    </td>
                    <td className="small">
                      {new Date(b.bookingDate).toLocaleDateString()}<br />
                      <span className="text-muted">{b.bookingTime}</span>
                    </td>
                    <td className="fw-bold">₹{b.amount}</td>
                    <td>
                      <span className={`status-badge status-${b.status}`}>{b.status}</span>
                    </td>
                    <td>
                      {b.status === 'PENDING' && (
                        <div className="d-flex gap-1">
                          <button
                            type="button"
                            className="btn btn-success btn-sm py-0 px-2"
                            onClick={() => handleUpdateStatus(b._id, 'ACCEPTED')}
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm py-0 px-2"
                            onClick={() => handleUpdateStatus(b._id, 'REJECTED')}
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {b.status === 'ACCEPTED' && (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm py-0 px-2"
                          onClick={() => handleUpdateStatus(b._id, 'IN_PROGRESS')}
                        >
                          Start Work
                        </button>
                      )}

                      {b.status === 'IN_PROGRESS' && (
                        <button
                          type="button"
                          className="btn btn-success btn-sm py-0 px-2"
                          onClick={() => handleUpdateStatus(b._id, 'COMPLETED')}
                        >
                          Complete
                        </button>
                      )}

                      {['COMPLETED', 'REJECTED', 'CANCELLED'].includes(b.status) && (
                        <span className="text-muted small">No action</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Active Catalog Shortcuts */}
      <div className="card modern-card p-4 border-0 shadow-sm rounded-4 bg-white">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Active Catalog ({services.length})</h5>
          <Link to="/provider/services" className="btn btn-outline-primary btn-sm rounded-pill px-3">
            Manage Catalog
          </Link>
        </div>

        <div className="row g-3">
          {services.slice(0, 3).map((s) => (
            <div key={s._id} className="col-md-4">
              <div className="p-3 border rounded-3 bg-light">
                <span className="badge bg-secondary-subtle text-dark small mb-1">{s.category}</span>
                <h6 className="fw-bold mb-1 text-truncate">{s.serviceName}</h6>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fs-5 fw-bold text-primary">₹{s.price}</span>
                  <span className="small text-muted">{s.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
