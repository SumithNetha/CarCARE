import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import BookingModal from '../components/BookingModal';

const PROBLEM_CATEGORIES = [
  { id: 'general', name: 'General Service & Oil Change', icon: 'bi-droplet-half' },
  { id: 'brakes', name: 'Brake Pads & Noise Inspection', icon: 'bi-disc' },
  { id: 'diagnostics', name: 'Engine Check Light & OBD Scan', icon: 'bi-cpu' },
  { id: 'ac', name: 'Car AC Cooling & Gas Recharge', icon: 'bi-snow' },
  { id: 'battery', name: 'Battery Health & Jumpstart', icon: 'bi-battery-charging' },
  { id: 'suspension', name: 'Suspension & Steering Alignment', icon: 'bi-wrench' },
];

const PROBLEM_TERMS = {
  'General Service & Oil Change': ['general', 'service', 'oil', 'periodic', 'maintenance'],
  'Brake Pads & Noise Inspection': ['brake', 'pad', 'noise'],
  'Engine Check Light & OBD Scan': ['engine', 'diagnostic', 'obd', 'check'],
  'Car AC Cooling & Gas Recharge': ['ac', 'air conditioning', 'cooling', 'gas'],
  'Battery Health & Jumpstart': ['battery', 'jumpstart'],
  'Suspension & Steering Alignment': ['suspension', 'steering', 'alignment'],
};

const MechanicService = () => {
  const { user, isAuthenticated } = useAuth();
  const { city, coordinates } = useLocation();

  const [services, setServices] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);

  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter((service) => {
        const text = `${service.serviceName} ${service.description} ${(service.features || []).join(' ')}`.toLowerCase();
        return PROBLEM_TERMS[selectedCategory]?.some((term) => text.includes(term));
      });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/services?category=Car Mechanic');
        if (res.data.success) {
          setServices(res.data.data);
        }

        if (isAuthenticated && user?.role === 'customer') {
          const vRes = await api.get('/vehicles');
          if (vRes.data.success && vRes.data.data.length > 0) {
            setVehicles(vRes.data.data);
            setSelectedVehicleId(vRes.data.data[0]._id);
          }
        }
      } catch (err) {
        console.error('Error fetching mechanic services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="mb-4">
        <span className="badge bg-warning bg-opacity-25 text-warning-emphasis fw-bold px-3 py-1 mb-2 rounded-pill">
          OEM CERTIFIED REPAIRS
        </span>
        <h1 className="display-6 fw-bold mb-2">Car Mechanic & Repair Services</h1>
        <p className="text-muted">
          Diagnose vehicle symptoms, pick verified local workshops, and book guaranteed repairs.
        </p>
      </div>

      {/* Problem Quick Selector */}
      <div className="card modern-card p-4 mb-4 border-0 shadow-sm rounded-4 bg-white">
        <h6 className="fw-bold mb-3 text-dark">
          <i className="bi bi-exclamation-circle text-warning me-2"></i> What's wrong with your vehicle?
        </h6>
        <div className="row g-2 mb-3">
          {PROBLEM_CATEGORIES.map((cat) => (
            <div key={cat.id} className="col-md-4 col-sm-6">
              <button
                type="button"
                className={`btn btn-sm w-100 text-start p-3 rounded-3 border d-flex align-items-center gap-2 ${
                  selectedCategory === cat.name ? 'btn-primary text-white shadow-sm' : 'btn-light text-dark'
                }`}
                onClick={() => setSelectedCategory(selectedCategory === cat.name ? 'All' : cat.name)}
              >
                <i className={`bi ${cat.icon} fs-5`}></i>
                <span className="small fw-semibold">{cat.name}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Customer Registered Car Selector Banner */}
        {isAuthenticated && user?.role === 'customer' && vehicles.length > 0 && (
          <div className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-car-front text-primary fs-4"></i>
              <div>
                <span className="small text-muted d-block">Booking for registered car:</span>
                <span className="fw-bold text-dark">
                  {vehicles.find((v) => v._id === selectedVehicleId)?.brand}{' '}
                  {vehicles.find((v) => v._id === selectedVehicleId)?.model} (
                  {vehicles.find((v) => v._id === selectedVehicleId)?.registrationNumber})
                </span>
              </div>
            </div>
            <select
              className="form-select form-select-sm"
              style={{ width: 'auto' }}
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
            >
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.brand} {v.model} ({v.registrationNumber})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Services List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-2">Loading mechanic packages...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4">
          <h5>No services match this problem yet</h5>
        </div>
      ) : (
        <div className="row g-4">
          {filteredServices.map((svc) => (
            <div key={svc._id} className="col-lg-4 col-md-6">
              <div className="card modern-card h-100 d-flex flex-column">
                <div className="p-4 flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-warning-subtle text-warning-emphasis fw-semibold px-2 py-1">
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
                        <i className="bi bi-shield-check text-success me-1"></i> {f}
                      </span>
                    ))}
                  </div>

                  <div className="small text-muted mb-2">
                    <i className="bi bi-hourglass-split me-1 text-primary"></i> Duration: {svc.duration}
                  </div>
                </div>

                <div className="p-4 bg-light border-top mt-auto d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-muted small d-block">Fixed Price:</span>
                    <span className="fs-4 fw-bold text-dark">₹{svc.price.toLocaleString()}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary-modern btn-sm px-3"
                    onClick={() => setSelectedServiceForBooking(svc)}
                  >
                    <i className="bi bi-wrench me-1"></i> Book Mechanic
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
          initialVehicleId={selectedVehicleId}
          onClose={() => setSelectedServiceForBooking(null)}
        />
      )}
    </div>
  );
};

export default MechanicService;
