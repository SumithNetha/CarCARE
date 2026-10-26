import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const CustomerVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await api.get('/vehicles');
      if (res.data.success) {
        setVehicles(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDelete = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to remove this vehicle from your account?')) {
      return;
    }

    setDeleteLoading(vehicleId);
    try {
      const res = await api.delete(`/vehicles/${vehicleId}`);
      if (res.data.success) {
        setSuccessMsg('Vehicle removed successfully');
        setVehicles(vehicles.filter((v) => v._id !== vehicleId));
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove vehicle');
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="card modern-card p-4 border-0 shadow-sm rounded-4 bg-white">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-1">My Registered Vehicles</h4>
          <p className="text-muted small mb-0">Manage your cars for quick service selection and booking.</p>
        </div>
        <Link to="/customer/vehicles/add" className="btn btn-primary-modern btn-sm rounded-pill px-4">
          <i className="bi bi-plus-circle me-1"></i> Add New Vehicle
        </Link>
      </div>

      {successMsg && (
        <div className="alert alert-success py-2 px-3 small d-flex align-items-center mb-3">
          <i className="bi bi-check-circle-fill me-2"></i> {successMsg}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-2">Loading your vehicle fleet...</p>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4">
          <div
            className="bg-primary-light text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: '60px', height: '60px' }}
          >
            <i className="bi bi-car-front-fill fs-2"></i>
          </div>
          <h5 className="fw-bold">No Vehicles Registered</h5>
          <p className="text-muted small mb-3">
            Add your car details once and book mechanics and washes effortlessly without re-typing.
          </p>
          <Link to="/customer/vehicles/add" className="btn btn-primary-modern">
            Add Your Car Now
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {vehicles.map((v) => (
            <div key={v._id} className="col-md-6">
              <div className="card border p-3 rounded-4 h-100 bg-white shadow-sm position-relative">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-primary text-white rounded-3 p-3 d-flex align-items-center justify-content-center">
                      <i className="bi bi-car-front-fill fs-3"></i>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-0 text-dark">{v.brand} {v.model}</h5>
                      <span className="badge bg-dark text-white fw-bold px-2 py-1 small">
                        {v.registrationNumber}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm rounded-circle p-2"
                    title="Remove vehicle"
                    disabled={deleteLoading === v._id}
                    onClick={() => handleDelete(v._id)}
                  >
                    {deleteLoading === v._id ? (
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                    ) : (
                      <i className="bi bi-trash"></i>
                    )}
                  </button>
                </div>

                <div className="row g-2 small text-secondary pt-2 border-top">
                  <div className="col-6">
                    <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Manufacturing Year</span>
                    <strong className="text-dark">{v.year}</strong>
                  </div>
                  <div className="col-6">
                    <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Fuel Type</span>
                    <strong className="text-dark">{v.fuelType}</strong>
                  </div>
                  <div className="col-6">
                    <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Vehicle Color</span>
                    <strong className="text-dark">{v.color}</strong>
                  </div>
                  <div className="col-6">
                    <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Added Date</span>
                    <strong className="text-dark">{new Date(v.createdAt).toLocaleDateString()}</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerVehicles;
