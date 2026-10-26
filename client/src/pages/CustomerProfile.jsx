import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { HYDERABAD_AREAS } from '../context/LocationContext';

const CustomerProfile = () => {
  const { user, updateCurrentUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [area, setArea] = useState(user?.area || 'HITEC City');
  const pincode = HYDERABAD_AREAS.find((item) => item.name === area)?.pincode || '';

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await api.put('/auth/profile', {
        name,
        phone,
        address: `${address}, ${area}, Hyderabad`,
        city: 'Hyderabad',
        area,
        pincode,
      });

      if (res.data.success) {
        updateCurrentUser(res.data.data);
        setSuccessMsg('Your profile has been updated successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card modern-card p-4 p-md-5 border-0 shadow-sm rounded-4 bg-white max-w-700">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h4 className="fw-bold mb-1">Customer Profile & Contact</h4>
          <p className="text-muted small mb-0">Update your primary service address and phone details.</p>
        </div>
        <span className="badge bg-primary-subtle text-primary fw-semibold px-3 py-1">
          {user?.role?.toUpperCase()}
        </span>
      </div>

      {successMsg && (
        <div className="alert alert-success py-2 px-3 small d-flex align-items-center mb-3">
          <i className="bi bi-check-circle-fill me-2"></i> {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-danger py-2 px-3 small d-flex align-items-center mb-3">
          <i className="bi bi-exclamation-triangle-fill me-2"></i> {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label small fw-semibold text-muted">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-semibold text-muted">Email Address (Fixed)</label>
            <input
              type="email"
              className="form-control bg-light"
              value={user?.email || ''}
              disabled
              readOnly
            />
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-semibold text-muted">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-semibold text-muted">Hyderabad Area</label>
            <select
              className="form-select"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
            >
              {HYDERABAD_AREAS.map((item) => (
                <option key={item.name} value={item.name}>{item.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-8">
            <label className="form-label small fw-semibold text-muted">Home / Service Address</label>
            <input
              type="text"
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Apartment, Street or Landmark"
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label small fw-semibold text-muted">Pincode</label>
            <input
              type="text"
              className="form-control"
              value={pincode}
              readOnly
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
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CustomerProfile;
