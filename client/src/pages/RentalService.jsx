import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useLocation, HYDERABAD_AREAS } from '../context/LocationContext';
import BookingModal from '../components/BookingModal';

const toLocalDateInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const RentalService = () => {
  const { area } = useLocation();

  const [rentalServices, setRentalServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('All');
  const [pickupDate, setPickupDate] = useState(toLocalDateInput(new Date()));
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return toLocalDateInput(d);
  });
  const [pickupArea, setPickupArea] = useState(area);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);

  useEffect(() => {
    const fetchRentals = async () => {
      setLoading(true);
      try {
        const res = await api.get('/services?category=Car Rental');
        if (res.data.success) {
          setRentalServices(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching rentals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  const filteredRentals = rentalServices.filter((s) => {
    if (vehicleTypeFilter === 'All') return true;
    return s.vehicleType?.toLowerCase().includes(vehicleTypeFilter.toLowerCase());
  });

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="mb-4">
        <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-1 mb-2 rounded-pill">
          SELF-DRIVE & CHAUFFEUR
        </span>
        <h1 className="display-6 fw-bold mb-2">Car Rental Fleet</h1>
        <p className="text-muted">
          Browse sanitized, fully insured rental cars with unlimited KMs and doorstep delivery.
        </p>
      </div>

      {/* Date & Location Selector Filter Bar */}
      <div className="card modern-card p-4 mb-4 border-0 shadow-sm rounded-4 bg-white">
        <h6 className="fw-bold mb-3 text-dark">
          <i className="bi bi-sliders text-primary me-2"></i> Customize Rental Journey
        </h6>
        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label small fw-semibold text-muted">Pickup Location / City</label>
            <select className="form-select" value={pickupArea} onChange={(e) => setPickupArea(e.target.value)}>
              {HYDERABAD_AREAS.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label small fw-semibold text-muted">Pickup Date</label>
            <input
              type="date"
              className="form-control"
              value={pickupDate}
              min={toLocalDateInput(new Date())}
              onChange={(e) => {
                const nextDate = e.target.value;
                setPickupDate(nextDate);
                if (returnDate < nextDate) setReturnDate(nextDate);
              }}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label small fw-semibold text-muted">Return Date</label>
            <input
              type="date"
              className="form-control"
              value={returnDate}
              min={pickupDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label small fw-semibold text-muted">Vehicle Type</label>
            <select
              className="form-select"
              value={vehicleTypeFilter}
              onChange={(e) => setVehicleTypeFilter(e.target.value)}
            >
              <option value="All">All Vehicle Types</option>
              <option value="SUV">SUVs</option>
              <option value="Hatchback">Hatchbacks</option>
              <option value="Electric">Electric / EVs</option>
              <option value="Luxury">Luxury Sedans</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-2">Loading available rental cars...</p>
        </div>
      ) : filteredRentals.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4">
          <h5>No rental vehicles matching this filter</h5>
          <p className="text-muted small">Try selecting "All Vehicle Types" above.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredRentals.map((service) => (
            <div key={service._id} className="col-lg-4 col-md-6">
              <div className="card modern-card h-100 d-flex flex-column">
                <div className="p-4 flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-primary-subtle text-primary fw-semibold px-2 py-1">
                      {service.vehicleType || 'Car Rental'}
                    </span>
                    <span className="badge bg-light text-dark border">
                      ★ {service.providerId?.rating || 4.8}
                    </span>
                  </div>

                  <h4 className="fw-bold mb-1 text-dark">{service.serviceName}</h4>
                  <p className="text-muted small mb-3">
                    Operated by <strong>{service.providerId?.businessName}</strong> ({service.providerId?.city})
                  </p>
                  <p className="text-secondary small mb-3">{service.description}</p>

                  <div className="d-flex flex-wrap gap-1 mb-4">
                    {service.features?.map((f, i) => (
                      <span key={i} className="badge bg-light text-secondary border small">
                        <i className="bi bi-check me-1 text-success"></i> {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-light border-top mt-auto d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-muted small d-block">Daily Rate:</span>
                    <span className="fs-4 fw-bold text-dark">₹{service.price.toLocaleString()}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary-modern btn-sm px-3"
                    onClick={() => setSelectedServiceForBooking(service)}
                  >
                    <i className="bi bi-key-fill me-1"></i> Book Rental
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
          initialBookingDate={pickupDate}
          initialReturnDate={returnDate}
          initialLocation={pickupArea}
          onClose={() => setSelectedServiceForBooking(null)}
        />
      )}
    </div>
  );
};

export default RentalService;
