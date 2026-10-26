import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      let url = '/admin/bookings';
      if (statusFilter && statusFilter !== 'all') url += `?status=${statusFilter}`;

      const res = await api.get(url);
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  return (
    <div className="card modern-card p-4 border-0 shadow-sm rounded-4 bg-white">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-1">Platform Bookings Ledger ({bookings.length})</h4>
          <p className="text-muted small mb-0">Auditing all customer service appointments and rental transactions.</p>
        </div>

        <div className="btn-group p-1 bg-light rounded-pill border flex-wrap" role="group">
          {['all', 'PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              type="button"
              className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                statusFilter === st ? 'btn-primary text-white shadow-sm' : 'btn-light text-muted'
              }`}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-2">Loading platform transactions...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4">
          <h5>No bookings in this category</h5>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small">
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Provider</th>
                <th>Service</th>
                <th>Scheduled</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>
                    <span className="badge bg-light text-dark border fw-bold">{b.bookingId}</span>
                  </td>
                  <td>
                    <div className="fw-semibold text-dark">{b.customerId?.name}</div>
                    <span className="text-muted small">{b.customerId?.phone}</span>
                  </td>
                  <td>
                    <div className="fw-semibold">{b.providerId?.businessName}</div>
                    <span className="text-muted small">{b.providerId?.city}</span>
                  </td>
                  <td>
                    <div className="fw-semibold">{b.serviceId?.serviceName}</div>
                    <span className="badge bg-light text-secondary border small">{b.serviceId?.category}</span>
                  </td>
                  <td className="small">
                    {new Date(b.bookingDate).toLocaleDateString()}<br />
                    <span className="text-muted">{b.bookingTime}</span>
                  </td>
                  <td className="fw-bold text-dark">₹{b.amount}</td>
                  <td>
                    <span className={`status-badge status-${b.status}`}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
