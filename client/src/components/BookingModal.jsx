import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

const toLocalDateInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const BookingModal = ({ provider, initialService = null, initialVehicleId = '', initialBookingDate = '', initialReturnDate = '', initialLocation = '', onClose, onBookingSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [bookingDate, setBookingDate] = useState(initialBookingDate);
  const [bookingTime, setBookingTime] = useState('');
  const [returnDate, setReturnDate] = useState(initialReturnDate);
  const [serviceLocation, setServiceLocation] = useState(initialLocation || user?.address || provider?.address || '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  // Set default minimum date to today
  const todayStr = toLocalDateInput(new Date());

  useEffect(() => {
    if (!provider) return;

    // Fetch services for this provider
    const fetchServices = async () => {
      try {
        const res = await api.get(`/services?providerId=${provider._id}`);
        if (res.data.success && res.data.data.length > 0) {
          setServices(res.data.data);
          if (initialService) {
            setSelectedServiceId(initialService._id);
          } else {
            setSelectedServiceId(res.data.data[0]._id);
          }
        }
      } catch (err) {
        console.error('Error fetching provider services:', err);
      }
    };

    fetchServices();

    // If customer logged in, fetch their vehicles
    if (isAuthenticated && user?.role === 'customer') {
      const fetchVehicles = async () => {
        try {
          const res = await api.get('/vehicles');
          if (res.data.success && res.data.data.length > 0) {
            setVehicles(res.data.data);
            setSelectedVehicleId(initialVehicleId || res.data.data[0]._id);
          }
        } catch (err) {
          console.error('Error fetching customer vehicles:', err);
        }
      };
      fetchVehicles();
    }

    // Set default date to tomorrow and default time slot
    if (initialBookingDate) {
      setBookingDate(initialBookingDate);
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setBookingDate(toLocalDateInput(tomorrow));
    }
    if (initialReturnDate) setReturnDate(initialReturnDate);
    if (initialLocation) setServiceLocation(initialLocation);
    if (initialVehicleId) setSelectedVehicleId(initialVehicleId);

    if (provider.availableTimeSlots && provider.availableTimeSlots.length > 0) {
      setBookingTime(provider.availableTimeSlots[0]);
    } else {
      setBookingTime('10:00 AM');
    }
  }, [provider, initialService, initialVehicleId, initialBookingDate, initialReturnDate, initialLocation, isAuthenticated, user]);

  const activeService = services.find((s) => s._id === selectedServiceId);
  const isRentalService = activeService?.category === 'Car Rental';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (user.role !== 'customer') {
      setError('Only customers can book services. Please log in as a customer.');
      return;
    }

    if (!selectedServiceId) {
      setError('Please select a service');
      return;
    }

    if (!bookingDate || !bookingTime) {
      setError('Please select a valid date and time slot');
      return;
    }

    if (!serviceLocation.trim()) {
      setError('Please provide service / pickup address');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        providerId: provider._id,
        serviceId: selectedServiceId,
        vehicleId: selectedVehicleId || null,
        bookingDate,
        bookingTime,
        returnDate: isRentalService ? returnDate : null,
        location: serviceLocation,
        notes,
      };

      const res = await api.post('/bookings', payload);
      if (res.data.success) {
        setCreatedBooking(res.data.data);
        setIsSuccess(true);
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        if (onBookingSuccess) onBookingSuccess(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!provider) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content rounded-4 border-0 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-dark text-white p-4 border-0">
            <div>
              <span className="badge bg-primary-subtle text-primary fw-semibold px-2 py-1 mb-1">
                Direct Booking
              </span>
              <h4 className="modal-title fw-bold mb-0 text-white">{provider.businessName}</h4>
              <p className="text-secondary-subtle small mb-0 mt-1">
                <i className="bi bi-geo-alt me-1 text-primary"></i> {provider.address}, {provider.city}
              </p>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          {/* Success State */}
          {isSuccess ? (
            <div className="modal-body p-4 p-md-5 text-center">
              <div
                className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '70px', height: '70px' }}
              >
                <i className="bi bi-check-lg fs-1"></i>
              </div>
              <h3 className="fw-bold text-dark mb-2">Booking Confirmed!</h3>
              <p className="text-muted mb-4">
                Your service request has been transmitted to <strong>{provider.businessName}</strong>. 
                Booking ID: <span className="badge bg-light text-dark border fs-6">{createdBooking?.bookingId}</span>
              </p>

              <div className="card bg-light border-0 p-3 mb-4 text-start rounded-3 mx-auto" style={{ maxWidth: '420px' }}>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Service:</span>
                  <span className="fw-semibold">{activeService?.serviceName}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Date & Time:</span>
                  <span className="fw-semibold">{bookingDate} at {bookingTime}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Estimated Amount:</span>
                  <span className="fw-bold text-primary">₹{activeService?.price}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted small">Status:</span>
                  <span className="status-badge status-PENDING">PENDING ACCEPTANCE</span>
                </div>
              </div>

              <div className="d-flex justify-content-center gap-3">
                <button
                  type="button"
                  className="btn btn-outline-modern"
                  onClick={onClose}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary-modern"
                  onClick={() => {
                    onClose();
                    navigate(`/customer/bookings/${createdBooking?._id}`);
                  }}
                >
                  View Booking Details →
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit}>
              <div className="modal-body p-4">
                {error && (
                  <div className="alert alert-danger d-flex align-items-center py-2 px-3 mb-3 small" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                    <div>{error}</div>
                  </div>
                )}

                <div className="row g-3">
                  {/* Select Service */}
                  <div className="col-md-12">
                    <label className="form-label fw-semibold small text-muted">Select Service</label>
                    <div className="row g-2">
                      {services.map((svc) => (
                        <div key={svc._id} className="col-md-6">
                          <div
                            className={`p-3 border rounded-3 h-100 cursor-pointer transition ${
                              selectedServiceId === svc._id
                                ? 'border-primary bg-primary-light text-dark shadow-sm'
                                : 'border-light-subtle bg-white text-dark hover-surface'
                            }`}
                            onClick={() => setSelectedServiceId(svc._id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="d-flex justify-content-between align-items-start">
                              <span className="badge bg-secondary-subtle text-dark small mb-1">{svc.category}</span>
                              <span className="fw-bold text-primary">₹{svc.price}</span>
                            </div>
                            <h6 className="fw-bold mb-1 mt-1">{svc.serviceName}</h6>
                            <p className="small text-muted mb-0 text-truncate">{svc.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Vehicle selection (if not a rental car provided by hub) */}
                  {!isRentalService && (
                    <div className="col-md-6">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <label className="form-label fw-semibold small text-muted mb-0">Select Vehicle</label>
                        {isAuthenticated && (
                          <button
                            type="button"
                            className="btn btn-link p-0 small text-decoration-none"
                            onClick={() => navigate('/customer/vehicles/add')}
                          >
                            + Add New Car
                          </button>
                        )}
                      </div>
                      {vehicles.length > 0 ? (
                        <select
                          className="form-select"
                          value={selectedVehicleId}
                          onChange={(e) => setSelectedVehicleId(e.target.value)}
                        >
                          {vehicles.map((v) => (
                            <option key={v._id} value={v._id}>
                              {v.brand} {v.model} ({v.registrationNumber}) - {v.fuelType}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="p-2 border rounded bg-light small text-muted">
                          {isAuthenticated ? (
                            <span>No vehicles found. <button type="button" className="btn btn-link p-0 small" onClick={() => navigate('/customer/vehicles/add')}>Add one here</button></span>
                          ) : (
                            <span>Log in to select your registered car</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Booking Date */}
                  <div className={isRentalService ? "col-md-6" : "col-md-6"}>
                    <label className="form-label fw-semibold small text-muted">
                      {isRentalService ? 'Pickup Date' : 'Service Date'}
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      min={todayStr}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                    />
                  </div>

                  {/* Return date for rentals */}
                  {isRentalService && (
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-muted">Return Date</label>
                      <input
                        type="date"
                        className="form-control"
                        min={bookingDate || todayStr}
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  {/* Time slot */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-muted">Available Time Slot</label>
                    <select
                      className="form-select"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      required
                    >
                      {(provider.availableTimeSlots && provider.availableTimeSlots.length > 0
                        ? provider.availableTimeSlots
                        : ['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '03:30 PM', '05:00 PM']
                      ).map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div className="col-md-12">
                    <label className="form-label fw-semibold small text-muted">
                      {isRentalService ? 'Pickup / Delivery Location' : 'Service / Garage Location'}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Street, building, and Hyderabad area"
                      value={serviceLocation}
                      onChange={(e) => setServiceLocation(e.target.value)}
                      required
                    />
                  </div>

                  {/* Notes */}
                  <div className="col-md-12">
                    <label className="form-label fw-semibold small text-muted">Additional Notes (Optional)</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Specific car problems, noise symptoms, special requests..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                {/* Price Summary Banner */}
                {activeService && (
                  <div className="mt-3 p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                    <div>
                      <span className="text-muted small d-block">Estimated Total:</span>
                      <span className="fs-4 fw-bold text-primary">₹{activeService.price.toLocaleString()}</span>
                      <span className="text-muted small ms-2">({activeService.duration})</span>
                    </div>
                    <div className="text-end text-muted small">
                      <i className="bi bi-shield-check text-success me-1"></i> Pay after service completion
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="modal-footer bg-light p-3 border-0">
                <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary-modern"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Confirming...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle"></i> Confirm Booking
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
