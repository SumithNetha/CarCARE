import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import ReviewModal from '../components/ReviewModal';

const BookingDetail = () => {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);

  const fetchBooking = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/bookings/${id}`);
      if (res.data.success) {
        setBooking(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const res = await api.put(`/bookings/${id}/status`, {
        status: 'CANCELLED',
        note: 'Booking cancelled by customer',
      });
      if (res.data.success) {
        fetchBooking();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <div className="card modern-card p-5 text-center bg-white border-0 shadow-sm rounded-4">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Loading booking milestone tracking...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="card modern-card p-4 text-center bg-white border-0 shadow-sm rounded-4">
        <div className="alert alert-danger mb-3">{error || 'Booking not found'}</div>
        <Link to="/customer/bookings" className="btn btn-outline-primary btn-sm mx-auto">
          ← Back to Bookings
        </Link>
      </div>
    );
  }

  // Calculate timeline stepper state
  const statusSteps = ['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED'];
  const currentStepIndex = statusSteps.indexOf(booking.status);
  const isCancelledOrRejected = ['CANCELLED', 'REJECTED'].includes(booking.status);

  return (
    <div className="d-flex flex-column gap-4">
      {/* Top Header Card */}
      <div className="card modern-card p-4 border-0 shadow-sm rounded-4 bg-white">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <div>
            <span className="badge bg-light text-dark border me-2">ID: {booking.bookingId}</span>
            <span className={`status-badge status-${booking.status}`}>{booking.status}</span>
            <h4 className="fw-bold mt-2 mb-0">{booking.serviceId?.serviceName}</h4>
            <span className="text-muted small">
              Created on {new Date(booking.createdAt).toLocaleString()}
            </span>
          </div>

          <div className="text-end">
            <span className="text-muted small d-block">Total Due / Paid</span>
            <span className="fs-3 fw-bold text-primary">₹{booking.amount}</span>
          </div>
        </div>

        {/* Milestone Tracker (Timeline Stepper) */}
        {!isCancelledOrRejected ? (
          <div className="py-3 px-2">
            <div className="timeline-stepper">
              {statusSteps.map((step, idx) => {
                const isCompleted = currentStepIndex > idx;
                const isActive = currentStepIndex === idx;

                return (
                  <div
                    key={step}
                    className={`timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                  >
                    <div className="timeline-circle">
                      {isCompleted ? <i className="bi bi-check-lg"></i> : idx + 1}
                    </div>
                    <span className="timeline-label">
                      {step === 'PENDING' && 'Requested'}
                      {step === 'ACCEPTED' && 'Confirmed'}
                      {step === 'IN_PROGRESS' && 'Servicing'}
                      {step === 'COMPLETED' && 'Ready / Handed Over'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="alert alert-danger py-2 px-3 small my-2 rounded-3">
            <i className="bi bi-x-circle-fill me-2"></i>
            This booking was {booking.status.toLowerCase()}.
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div className="row g-4">
        {/* Service & Provider Details */}
        <div className="col-md-7">
          <div className="card modern-card p-4 border-0 shadow-sm rounded-4 bg-white h-100">
            <h5 className="fw-bold mb-3 border-bottom pb-2">Service & Workshop Details</h5>

            <div className="mb-3">
              <span className="text-muted small d-block">Service Provider</span>
              <h6 className="fw-bold mb-0 text-dark">{booking.providerId?.businessName}</h6>
              <p className="small text-muted mb-1">
                {booking.providerId?.address}, {booking.providerId?.city} - {booking.providerId?.pincode}
              </p>
              <div className="d-flex gap-3 small">
                <a href={`tel:${booking.providerId?.phone}`} className="text-primary text-decoration-none fw-semibold">
                  <i className="bi bi-telephone me-1"></i> {booking.providerId?.phone}
                </a>
                <Link to={`/providers/${booking.providerId?._id}`} className="text-secondary text-decoration-none">
                  <i className="bi bi-box-arrow-up-right me-1"></i> Provider Profile
                </Link>
              </div>
            </div>

            <div className="mb-3">
              <span className="text-muted small d-block">Service Package</span>
              <h6 className="fw-bold mb-1 text-dark">{booking.serviceId?.serviceName}</h6>
              <p className="small text-secondary mb-2">{booking.serviceId?.description}</p>
              <span className="badge bg-light text-dark border small">
                Category: {booking.serviceId?.category} • Est: {booking.serviceId?.duration}
              </span>
            </div>

            {booking.vehicleId && (
              <div className="mb-3">
                <span className="text-muted small d-block">Assigned Vehicle</span>
                <div className="p-2 border rounded bg-light d-flex align-items-center gap-2">
                  <i className="bi bi-car-front-fill text-primary fs-5"></i>
                  <div>
                    <strong className="text-dark small">
                      {booking.vehicleId.brand} {booking.vehicleId.model}
                    </strong>
                    <span className="text-muted small ms-2">
                      ({booking.vehicleId.registrationNumber} • {booking.vehicleId.fuelType})
                    </span>
                  </div>
                </div>
              </div>
            )}

            {booking.notes && (
              <div>
                <span className="text-muted small d-block">Customer Notes</span>
                <div className="p-2 bg-light rounded text-secondary small">
                  "{booking.notes}"
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Schedule, Address & Status History */}
        <div className="col-md-5">
          <div className="card modern-card p-4 border-0 shadow-sm rounded-4 bg-white h-100 d-flex flex-column">
            <h5 className="fw-bold mb-3 border-bottom pb-2">Schedule & Location</h5>

            <div className="mb-3 small">
              <div className="mb-2">
                <i className="bi bi-calendar-event text-primary me-2"></i>
                <strong>Service Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}
              </div>
              <div className="mb-2">
                <i className="bi bi-clock text-warning me-2"></i>
                <strong>Confirmed Slot:</strong> {booking.bookingTime}
              </div>
              <div>
                <i className="bi bi-geo-alt text-danger me-2"></i>
                <strong>Location:</strong> {booking.location}
              </div>
            </div>

            <h6 className="fw-bold mb-2 border-bottom pb-1 small text-dark">Activity Log</h6>
            <div className="d-flex flex-column gap-2 mb-4 overflow-auto" style={{ maxHeight: '150px' }}>
              {booking.statusHistory?.map((h, i) => (
                <div key={i} className="small border-start border-3 border-primary ps-2 py-1">
                  <strong className="text-dark">{h.status}</strong>
                  <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                    {' '}- {new Date(h.changedAt).toLocaleTimeString()}
                  </span>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>{h.note}</div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-auto pt-3 border-top d-flex flex-column gap-2">
              {['PENDING', 'ACCEPTED'].includes(booking.status) && (
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm w-100"
                  onClick={handleCancelBooking}
                >
                  Cancel Booking
                </button>
              )}

              {booking.status === 'COMPLETED' && !booking.reviewed && (
                <button
                  type="button"
                  className="btn btn-warning btn-sm w-100 fw-semibold text-dark"
                  onClick={() => setShowReviewModal(true)}
                >
                  ★ Leave Verified Rating & Review
                </button>
              )}

              {booking.status === 'COMPLETED' && booking.reviewed && (
                <div className="alert alert-success py-2 px-3 small text-center mb-0">
                  <i className="bi bi-check-circle me-1"></i> You have reviewed this service!
                </div>
              )}

              <Link to="/customer/bookings" className="btn btn-outline-secondary btn-sm w-100">
                Back to Bookings
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          booking={booking}
          onClose={() => setShowReviewModal(false)}
          onReviewSubmitted={() => {
            fetchBooking();
            setShowReviewModal(false);
          }}
        />
      )}
    </div>
  );
};

export default BookingDetail;
