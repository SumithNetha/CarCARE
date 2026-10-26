import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import BookingModal from '../components/BookingModal';
import ProviderMap from '../components/ProviderMap';

const ProviderDetail = () => {
  const { id } = useParams();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const fetchProvider = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/providers/${id}`);
        if (res.data.success) {
          setProvider(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load provider details');
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 my-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Loading provider profile...</p>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger mx-auto" style={{ maxWidth: '500px' }}>
          {error || 'Provider not found'}
        </div>
        <Link to="/providers" className="btn btn-primary-modern">
          ← Back to Provider Search
        </Link>
      </div>
    );
  }

  const {
    businessName,
    ownerName,
    description,
    phone,
    address,
    city,
    pincode,
    rating = 5.0,
    reviewCount = 0,
    verified,
    services = [],
    reviews = [],
    workingHours = { open: '09:00 AM', close: '07:00 PM' },
    workingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    imageUrl,
  } = provider;

  return (
    <div className="container py-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/providers" className="text-decoration-none">Providers</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{businessName}</li>
        </ol>
      </nav>

      {/* Hero Header Card */}
      <div className="card modern-card overflow-hidden border-0 shadow-lg rounded-4 mb-4">
        <div className="row g-0">
          <div className="col-lg-5" style={{ minHeight: '300px' }}>
            <img
              src={imageUrl || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80'}
              alt={businessName}
              className="w-100 h-100 object-fit-cover"
            />
          </div>

          <div className="col-lg-7 p-4 p-md-5 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                {verified === 'approved' ? (
                  <span className="badge-verified shadow-sm">
                    <i className="bi bi-patch-check-fill me-1"></i> Verified CarCare Partner
                  </span>
                ) : (
                  <span className="badge bg-warning text-dark">Under Review</span>
                )}
                <span className="rating-pill">
                  ★ {rating.toFixed(1)} <span className="text-muted fw-normal">({reviewCount} reviews)</span>
                </span>
              </div>

              <h2 className="display-6 fw-bold text-dark mb-2">{businessName}</h2>
              <p className="text-muted mb-3">{description}</p>

              <div className="d-flex flex-column gap-2 text-secondary small mb-4">
                <div>
                  <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                  <strong>Address:</strong> {address}, {city} - {pincode}
                </div>
                <div>
                  <i className="bi bi-person-badge text-primary me-2"></i>
                  <strong>Owner / Lead Tech:</strong> {ownerName}
                </div>
                <div>
                  <i className="bi bi-telephone-fill text-success me-2"></i>
                  <strong>Phone:</strong> {phone}
                </div>
                <div>
                  <i className="bi bi-clock-fill text-warning me-2"></i>
                  <strong>Working Hours:</strong> {workingHours?.open} - {workingHours?.close} ({workingDays?.join(', ')})
                </div>
              </div>
            </div>

            <div className="d-flex gap-3 align-items-center pt-3 border-top flex-wrap">
              <button
                type="button"
                className="btn btn-primary-modern px-4 py-2"
                onClick={() => {
                  setSelectedServiceForBooking(services[0] || null);
                  setShowBookingModal(true);
                }}
              >
                <i className="bi bi-calendar-check me-2"></i> Book Service Now
              </button>
              <a
                href={`tel:${phone}`}
                className="btn btn-outline-secondary px-3 py-2 rounded-3 text-decoration-none"
              >
                <i className="bi bi-telephone me-1"></i> Call Workshop
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Services Catalog */}
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold mb-0">Services Offered ({services.length})</h4>
            <span className="text-muted small">Upfront, itemized pricing</span>
          </div>

          {services.length === 0 ? (
            <div className="card modern-card p-4 text-center bg-light">
              <p className="text-muted mb-0">No specific packages listed yet for this provider.</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3 mb-5">
              {services.map((svc) => (
                <div key={svc._id} className="card modern-card p-4 border-0 shadow-sm rounded-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className="badge bg-primary-subtle text-primary fw-semibold px-2 py-1 mb-1">
                        {svc.category}
                      </span>
                      <h5 className="fw-bold text-dark mb-1">{svc.serviceName}</h5>
                    </div>
                    <div className="text-end">
                      <span className="fs-4 fw-bold text-primary">₹{svc.price.toLocaleString()}</span>
                      <span className="text-muted small d-block">({svc.duration})</span>
                    </div>
                  </div>

                  <p className="text-secondary small mb-3">{svc.description}</p>

                  {svc.features && svc.features.length > 0 && (
                    <div className="d-flex flex-wrap gap-1 mb-3">
                      {svc.features.map((f, i) => (
                        <span key={i} className="badge bg-light text-secondary border small">
                          <i className="bi bi-check2 text-success me-1"></i> {f}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm px-4 rounded-pill fw-semibold"
                      onClick={() => {
                        setSelectedServiceForBooking(svc);
                        setShowBookingModal(true);
                      }}
                    >
                      Book This Service
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Customer Reviews Section */}
          <div className="card modern-card p-4 border-0 shadow-sm rounded-4">
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
              <div>
                <h4 className="fw-bold mb-0">Customer Reviews & Ratings</h4>
                <span className="text-muted small">Only customers with completed service bookings can submit reviews</span>
              </div>
              <div className="text-end">
                <span className="fs-4 fw-bold text-dark">★ {rating.toFixed(1)}</span>
                <span className="text-muted small d-block">{reviews.length} ratings</span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-4 bg-light rounded-3">
                <i className="bi bi-chat-square-quote fs-2 text-muted mb-2 d-block"></i>
                <h6 className="fw-semibold text-muted">No reviews posted yet</h6>
                <p className="text-muted small mb-0">Be the first customer to book and rate this provider!</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {reviews.map((rev) => (
                  <div key={rev._id} className="p-3 bg-light rounded-3 border-0">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                          style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}
                        >
                          {rev.customerId?.name?.charAt(0).toUpperCase() || 'C'}
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0 small">{rev.customerId?.name || 'Verified Customer'}</h6>
                          <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-warning small fw-bold">
                        {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                      </div>
                    </div>
                    <p className="small text-secondary mb-0">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Workshop Map Location & Quick Info */}
        <div className="col-lg-4">
          <div className="card modern-card p-4 border-0 shadow-sm rounded-4 sticky-top" style={{ top: '90px' }}>
            <h5 className="fw-bold mb-3">Workshop Location</h5>
            <div className="mb-3" style={{ height: '240px' }}>
              <ProviderMap
                providers={[provider]}
                userLocation={null}
              />
            </div>
            <p className="text-muted small mb-3">
              <i className="bi bi-geo-alt me-1 text-primary"></i>
              {address}, {city} - {pincode}
            </p>

            <div className="p-3 bg-light rounded-3 mb-3">
              <h6 className="fw-bold small text-dark mb-2">Available Time Slots Today:</h6>
              <div className="d-flex flex-wrap gap-1">
                {(provider.availableTimeSlots || ['09:00 AM', '10:30 AM', '02:00 PM', '04:00 PM']).map((slot) => (
                  <span key={slot} className="badge bg-white text-dark border small">
                    {slot}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary-modern w-100"
              onClick={() => {
                setSelectedServiceForBooking(services[0] || null);
                setShowBookingModal(true);
              }}
            >
              Book Service
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          provider={provider}
          initialService={selectedServiceForBooking}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
};

export default ProviderDetail;
