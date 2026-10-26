import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ProviderBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings');
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load provider bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setActionLoading(bookingId);
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, {
        status: newStatus,
        note: `Status updated to ${newStatus} by workshop manager`,
      });
      if (res.data.success) {
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'ALL') return true;
    return b.status === statusFilter;
  });

  return (
    <div className="card modern-card p-4 border-0 shadow-sm rounded-4 bg-white">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-1">Customer Booking Requests</h4>
          <p className="text-muted small mb-0">Accept appointments, update repair progress, and hand over vehicles.</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="btn-group p-1 bg-light rounded-pill border mb-4 flex-wrap" role="group">
        {['ALL', 'PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED'].map((st) => (
          <button
            key={st}
            type="button"
            className={`btn btn-sm rounded-pill px-3 fw-semibold ${
              statusFilter === st ? 'btn-primary text-white shadow-sm' : 'btn-light text-muted'
            }`}
            onClick={() => setStatusFilter(st)}
          >
            {st} ({st === 'ALL' ? bookings.length : bookings.filter((b) => b.status === st).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-2">Loading appointments...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4">
          <i className="bi bi-calendar2-check fs-1 text-muted mb-2 d-block"></i>
          <h5>No bookings in this status</h5>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filteredBookings.map((b) => (
            <div key={b._id} className="card border p-3 rounded-4 shadow-sm bg-light">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-light text-dark border fs-6 fw-bold">
                    {b.bookingId}
                  </span>
                  <span className={`status-badge status-${b.status}`}>
                    {b.status}
                  </span>
                </div>
                <div className="text-end">
                  <span className="text-muted small d-block">Service Bill</span>
                  <span className="fs-5 fw-bold text-dark">₹{b.amount}</span>
                </div>
              </div>

              <div className="row g-3 align-items-center">
                <div className="col-md-4">
                  <h6 className="fw-bold mb-1 text-dark">{b.serviceId?.serviceName}</h6>
                  <div className="small text-muted mb-1">
                    <i className="bi bi-person me-1"></i>
                    <strong>{b.customerId?.name}</strong> ({b.customerId?.phone})
                  </div>
                  {b.vehicleId && (
                    <span className="badge bg-white text-secondary border small">
                      {b.vehicleId.brand} {b.vehicleId.model} ({b.vehicleId.registrationNumber})
                    </span>
                  )}
                </div>

                <div className="col-md-4 small text-secondary">
                  <div>
                    <i className="bi bi-calendar-event me-1 text-primary"></i>
                    <strong>Scheduled:</strong> {new Date(b.bookingDate).toLocaleDateString()} at {b.bookingTime}
                  </div>
                  <div>
                    <i className="bi bi-geo-alt me-1 text-danger"></i>
                    <strong>Location:</strong> {b.location}
                  </div>
                  {b.notes && (
                    <div className="text-muted text-truncate mt-1">
                      <em>"{b.notes}"</em>
                    </div>
                  )}
                </div>

                <div className="col-md-4 d-flex justify-content-md-end gap-2 flex-wrap">
                  {b.status === 'PENDING' && (
                    <>
                      <button
                        type="button"
                        className="btn btn-success btn-sm px-3 fw-semibold"
                        disabled={actionLoading === b._id}
                        onClick={() => handleUpdateStatus(b._id, 'ACCEPTED')}
                      >
                        <i className="bi bi-check2"></i> Accept
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm px-3"
                        disabled={actionLoading === b._id}
                        onClick={() => handleUpdateStatus(b._id, 'REJECTED')}
                      >
                        <i className="bi bi-x"></i> Reject
                      </button>
                    </>
                  )}

                  {b.status === 'ACCEPTED' && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm px-3 fw-semibold"
                      disabled={actionLoading === b._id}
                      onClick={() => handleUpdateStatus(b._id, 'IN_PROGRESS')}
                    >
                      <i className="bi bi-play-fill"></i> Mark In-Progress
                    </button>
                  )}

                  {b.status === 'IN_PROGRESS' && (
                    <button
                      type="button"
                      className="btn btn-success btn-sm px-3 fw-semibold"
                      disabled={actionLoading === b._id}
                      onClick={() => handleUpdateStatus(b._id, 'COMPLETED')}
                    >
                      <i className="bi bi-check-all"></i> Mark Completed
                    </button>
                  )}

                  {['COMPLETED', 'REJECTED', 'CANCELLED'].includes(b.status) && (
                    <span className="badge bg-secondary-subtle text-secondary py-2 px-3">
                      Order Finalized
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderBookings;
