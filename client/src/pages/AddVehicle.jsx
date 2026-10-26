import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const AddVehicle = () => {
  const navigate = useNavigate();

  const [brand, setBrand] = useState('Honda');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [fuelType, setFuelType] = useState('Petrol');
  const [color, setColor] = useState('Pearl White');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const POPULAR_BRANDS = [
    'Honda', 'Hyundai', 'Tata', 'Maruti Suzuki', 'Toyota',
    'Mahindra', 'Kia', 'Skoda', 'Volkswagen', 'MG', 'BMW', 'Mercedes-Benz', 'Audi'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!model.trim() || !registrationNumber.trim()) {
      setError('Please provide car model and registration number');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/vehicles', {
        brand,
        model: model.trim(),
        year: Number(year),
        registrationNumber: registrationNumber.toUpperCase().trim(),
        fuelType,
        color: color.trim(),
      });

      if (res.data.success) {
        navigate('/customer/vehicles');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add vehicle. Please verify information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card modern-card p-4 p-md-5 border-0 shadow-sm rounded-4 bg-white max-w-700">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h4 className="fw-bold mb-1">Add Vehicle to Garage</h4>
          <p className="text-muted small mb-0">Enter your car specifications for faster bookings.</p>
        </div>
        <Link to="/customer/vehicles" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
          Cancel
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger py-2 px-3 small d-flex align-items-center mb-3">
          <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
          <div>{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label small fw-semibold text-muted">Car Brand / Make</label>
            <select
              className="form-select"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            >
              {POPULAR_BRANDS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-semibold text-muted">Car Model & Variant</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. City ZX, Creta SX(O), Nexon EV"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-semibold text-muted">Registration Number</label>
            <input
              type="text"
              className="form-control text-uppercase"
              placeholder="e.g. MH-02-CB-1234"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-semibold text-muted">Manufacturing Year</label>
            <input
              type="number"
              className="form-control"
              min="1990"
              max={new Date().getFullYear() + 1}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-semibold text-muted">Fuel Type</label>
            <select
              className="form-select"
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              required
            >
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric (EV)</option>
              <option value="Hybrid">Hybrid</option>
              <option value="CNG">CNG</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-semibold text-muted">Vehicle Color</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Pearl White, Glacier Blue, Midnight Black"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              required
            />
          </div>

          <div className="col-12 mt-4">
            <button
              type="submit"
              className="btn btn-primary-modern w-100 py-2 fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Saving Vehicle...
                </>
              ) : (
                'Save Vehicle to Profile'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddVehicle;
