import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import BookingModal from '../components/BookingModal';

const WASH_TIERS = [
  {
    tier: 'Express Wash',
    price: '₹399 - ₹499',
    duration: '30 mins',
    desc: 'Quick exterior pressure foam bath, tire dressing, and floor mat shaking.',
  },
  {
    tier: 'Complete Interior & Exterior Spa',
    price: '₹999 - ₹1,499',
    duration: '2 hours',
    desc: '3M buff wax, deep seat vacuum, dashboard polish, and AC vent sanitization.',
  },
  {
    tier: '9H Nano Ceramic Coating',
    price: '₹7,999 - ₹12,000',
    duration: '6-8 hours',
    desc: 'Multi-stage paint correction, swirl elimination, and hydrophobic 2-year warranty ceramic layer.',
  },
];

const CarWashService = () => {
  const { user, isAuthenticated } = useAuth();
  const { city } = useLocation();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);

  useEffect(() => {
    const fetchWashServices = async () => {
      setLoading(true);
      try {
        const res = await api.get('/services?category=Car Washing');
        if (res.data.success) {
          setServices(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching car wash services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWashServices();
  }, []);

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="mb-4">
        <span className="badge bg-info bg-opacity-25 text-info-emphasis fw-bold px-3 py-1 mb-2 rounded-pill">
          SHOWROOM FINISH & HYGIENE
        </span>
        <h1 className="display-6 fw-bold mb-2">Car Washing & Detailing Studio</h1>
        <p className="text-muted">
          pH-neutral snow foam, deep interior upholstery shampooing, and certified paint protection.
        </p>
      </div>

      {/* Package Tier Highlights */}
      <div className="row g-3 mb-5">
        {WASH_TIERS.map((tier, idx) => (
          <div key={idx} className="col-md-4">
            <div className="card modern-card p-3 h-100 border-0 shadow-sm bg-white">
              <span className="badge bg-info-subtle text-info fw-bold w-fit mb-2">Tier {idx + 1}</span>
              <h5 className="fw-bold mb-1">{tier.tier}</h5>
              <span className="text-primary fw-bold fs-5 mb-2 d-block">{tier.price}</span>
              <p className="text-muted small mb-2">{tier.desc}</p>
              <span className="text-secondary small mt-auto">
                <i className="bi bi-clock me-1"></i> Time: {tier.duration}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Available Car Wash Packages */}
      <h4 className="fw-bold mb-3 text-dark">Available Studio Packages</h4>
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-2">Loading car wash packages...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4">
          <h5>No car wash services available</h5>
        </div>
      ) : (
        <div className="row g-4">
          {services.map((svc) => (
            <div key={svc._id} className="col-lg-4 col-md-6">
              <div className="card modern-card h-100 d-flex flex-column">
                <div className="p-4 flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-info-subtle text-info fw-semibold px-2 py-1">
                      {svc.category}
                    </span>
                    <span className="rating-pill">
                      ★ {svc.providerId?.rating || 4.9}
                    </span>
                  </div>

                  <h5 className="fw-bold mb-1 text-dark">{svc.serviceName}</h5>
                  <p className="text-muted small mb-2">
                    <i className="bi bi-building me-1"></i> {svc.providerId?.businessName}
                  </p>
                  <p className="text-muted small mb-3">
                    <i className="bi bi-geo-alt me-1 text-danger"></i> {svc.providerId?.address}, {svc.providerId?.city}
                  </p>
                  <p className="text-secondary small mb-3">{svc.description}</p>

                  <div className="d-flex flex-wrap gap-1 mb-3">
                    {svc.features?.map((f, i) => (
                      <span key={i} className="badge bg-light text-secondary border small">
                        <i className="bi bi-droplet-fill text-info me-1"></i> {f}
                      </span>
                    ))}
                  </div>

                  <div className="small text-muted mb-2">
                    <i className="bi bi-stopwatch me-1 text-primary"></i> Est: {svc.duration}
                  </div>
                </div>

                <div className="p-4 bg-light border-top mt-auto d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-muted small d-block">Package Price:</span>
                    <span className="fs-4 fw-bold text-dark">₹{svc.price.toLocaleString()}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary-modern btn-sm px-3"
                    onClick={() => setSelectedServiceForBooking(svc)}
                  >
                    <i className="bi bi-droplet-half me-1"></i> Book Wash
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedServiceForBooking && (
        <BookingModal
          provider={selectedServiceForBooking.providerId}
          initialService={selectedServiceForBooking}
          onClose={() => setSelectedServiceForBooking(null)}
        />
      )}
    </div>
  );
};

export default CarWashService;
