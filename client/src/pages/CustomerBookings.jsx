import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ReviewModal from '../components/ReviewModal';

const CustomerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('ALL');
  const [reviewBooking, setReviewBooking] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings');
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching customer bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const res = await api.put(`/bookings/${bookingId}/status`, {
        status: 'CANCELLED',
        note: 'Cancelled by customer',
      });
      if (res.data.success) {
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterTab === 'ALL') return true;
    if (filterTab === 'ACTIVE') return ['PENDING', 'ACCEPTED', 'IN_PROGRESS'].includes(b.status);
    if (filterTab === 'COMPLETED') return b.status === 'COMPLETED';
    if (filterTab === 'CANCELLED') return ['CANCELLED', 'REJECTED'].includes(b.status);
    return true;
  });

  return (
    <div className="card modern-card p-4 border-0 shadow-sm rounded-4 bg-white">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-1">My Bookings & Service History</h4>
          <p className="text-muted small mb-0">Track real-time status and view invoices.</p>
        </div>
        <Link to="/providers" className="btn btn-primary-modern btn-sm rounded-pill px-4">
          + Book New Service
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="btn-group p-1 bg-light rounded-pill border mb-4" role="group">
        <button
          type="button"
          className={`btn btn-sm rounded-pill px-3 fw-semibold ${
            filterTab === 'ALL' ? 'btn-primary text-white shadow-sm' : 'btn-light text-muted'
          }`}
          onClick={() => setFilterTab('ALL')}
        >
          All ({bookings.length})
        </button>
        <button
          type="button"
          className={`btn btn-sm rounded-pill px-3 fw-semibold ${
            filterTab === 'ACTIVE' ? 'btn-primary text-white shadow-sm' : 'btn-light text-muted'
          }`}
          onClick={() => setFilterTab('ACTIVE')}
        >
          Active / In-Progress ({bookings.filter((b) => ['PENDING', 'ACCEPTED', 'IN_PROGRESS'].includes(b.status)).length})
        </button>
        <button
          type="button"
          className={`btn btn-sm rounded-pill px-3 fw-semibold ${
            filterTab === 'COMPLETED' ? 'btn-primary text-white shadow-sm' : 'btn-light text-muted'
          }`}
          onClick={() => setFilterTab('COMPLETED')}
        >
          Completed ({bookings.filter((b) => b.status === 'COMPLETED').length})
        </button>
        <button
          type="button"
          className={`btn btn-sm rounded-pill px-3 fw-semibold ${
            filterTab === 'CANCELLED' ? 'btn-primary text-white shadow-sm' : 'btn-light text-muted'
          }`}
          onClick={() => setFilterTab('CANCELLED')}
        >
          Cancelled / Rejected ({bookings.filter((b) => ['CANCELLED', 'REJECTED'].includes(b.status)).length})
        </button>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-2">Loading bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4">
          <i className="bi bi-calendar-x fs-1 text-muted mb-2 d-block"></i>
          <h5>No bookings in this category</h5>
          <p className="text-muted small">Choose from our verified partner network to book services.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filteredBookings.map((b) => (
            <div key={b._id} className="card border p-3 rounded-4 shadow-sm bg-white hover-surface">
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
                  <span className="text-muted small d-block">Total Amount</span>
                  <span className="fs-5 fw-bold text-dark">₹{b.amount}</span>
                </div>
              </div>

              <div className="row g-3 align-items-center">
                <div className="col-md-5">
                  <h5 className="fw-bold mb-1 text-dark">
                    {b.serviceId?.serviceName || 'Custom Service'}
                  </h5>
                  <p className="text-muted small mb-1">
                    <i className="bi bi-shop me-1 text-primary"></i>
                    <strong>{b.providerId?.businessName}</strong> ({b.providerId?.city})
                  </p>
                  {b.vehicleId && (
                    <span className="badge bg-secondary-subtle text-dark border small">
                      <i className="bi bi-car-front me-1"></i>
                      {b.vehicleId.brand} {b.vehicleId.model} ({b.vehicleId.registrationNumber})
                    </span>
                  )}
                </div>

                <div className="col-md-4">
                  <div className="small text-secondary">
                    <div>
                      <i className="bi bi-calendar-event me-1 text-primary"></i>
                      <strong>Date:</strong> {new Date(b.bookingDate).toLocaleDateString()}
                    </div>
                    <div>
                      <i className="bi bi-clock me-1 text-warning"></i>
                      <strong>Time Slot:</strong> {b.bookingTime}
                    </div>
                    <div>
                      <i className="bi bi-geo-alt me-1 text-danger"></i>
                      <strong>Location:</strong> {b.location}
                    </div>
                  </div>
                </div>

                <div className="col-md-3 d-flex flex-column gap-2 justify-content-center">
                  <Link
                    to={`/customer/bookings/${b._id}`}
                    className="btn btn-outline-primary btn-sm py-1 fw-semibold"
                  >
                    View Details & Track →
                  </Link>

                  {/* Cancel button if pending / accepted */}
                  {['PENDING', 'ACCEPTED'].includes(b.status) && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm py-1"
                      onClick={() => handleCancelBooking(b._id)}
                    >
                      Cancel Booking
                    </button>
                  )}

                  {/* Review button if completed and not reviewed */}
                  {b.status === 'COMPLETED' && !b.reviewed && (
                    <button
                      type="button"
                      className="btn btn-warning btn-sm py-1 fw-semibold text-dark"
                      onClick={() => setReviewBooking(b)}
                    >
                      ★ Rate & Review
                    </button>
                  )}

                  {b.status === 'COMPLETED' && b.reviewed && (
                    <span className="badge bg-success-subtle text-success border py-1 small">
                      <i className="bi bi-check-circle me-1"></i> Review Submitted
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
          onReviewSubmitted={() => {
            fetchBookings();
            setReviewBooking(null);
          }}
        />
      )}
    </div>
  );
};

export default CustomerBookings;
