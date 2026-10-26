import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { HYDERABAD_AREAS } from '../context/LocationContext';

const ProviderProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form fields
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('HITEC City');
  const pincode = HYDERABAD_AREAS.find((item) => item.name === area)?.pincode || '';
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get('/providers/me/profile');
        if (res.data.success) {
          const p = res.data.data;
          setProfile(p);
          setBusinessName(p.businessName || '');
          setOwnerName(p.ownerName || '');
          setPhone(p.phone || '');
          setAddress(p.address || '');
          setArea(p.area || 'HITEC City');
          setLatitude(p.latitude ? String(p.latitude) : '');
          setLongitude(p.longitude ? String(p.longitude) : '');
          setDescription(p.description || '');
          setImageUrl(p.imageUrl || '');
        }
      } catch (err) {
        setErrorMsg('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const detectGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude.toFixed(6));
          setLongitude(pos.coords.longitude.toFixed(6));
        },
        (err) => alert('Geolocation error: ' + err.message)
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.put('/providers/me/profile', {
        businessName,
        ownerName,
        phone,
        address: `${address}, ${area}, Hyderabad`,
        city: 'Hyderabad',
        area,
        pincode,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        description,
        imageUrl,
      });

      if (res.data.success) {
        setSuccessMsg('Business profile updated successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="card modern-card p-5 text-center bg-white border-0 shadow-sm rounded-4">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="card modern-card p-4 p-md-5 border-0 shadow-sm rounded-4 bg-white max-w-700">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h4 className="fw-bold mb-1">Business Profile & Geo Coordinates</h4>
          <p className="text-muted small mb-0">Update workshop information shown on public search cards.</p>
        </div>
        <span className={`badge ${profile?.verified === 'approved' ? 'bg-success' : 'bg-warning text-dark'} px-3 py-1`}>
          {profile?.verified?.toUpperCase()}
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
            <label className="form-label small fw-semibold text-muted">Business / Garage Name</label>
            <input
              type="text"
              className="form-control"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-semibold text-muted">Owner / Contact Person</label>
            <input
              type="text"
              className="form-control"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-semibold text-muted">Contact Phone</label>
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
            <select className="form-select" value={area} onChange={(e) => setArea(e.target.value)}>
              {HYDERABAD_AREAS.map((item) => (
                <option key={item.name} value={item.name}>{item.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-8">
            <label className="form-label small fw-semibold text-muted">Physical Workshop Address</label>
            <input
              type="text"
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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

          {/* GPS Coordinates */}
          <div className="col-md-6">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label small fw-semibold text-muted mb-0">GPS Latitude</label>
              <button type="button" className="btn btn-link p-0 small text-decoration-none" onClick={detectGPS}>
                <i className="bi bi-crosshair"></i> Auto-Detect
              </button>
            </div>
            <input
              type="number"
              step="any"
              className="form-control"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-semibold text-muted">GPS Longitude</label>
            <input
              type="number"
              step="any"
              className="form-control"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
            />
          </div>

          <div className="col-12">
            <label className="form-label small fw-semibold text-muted">Business Photo / Image URL</label>
            <input
              type="url"
              className="form-control"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="col-12">
            <label className="form-label small fw-semibold text-muted">Business Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your garage equipment, technician certifications, warranties..."
            ></textarea>
          </div>

          <div className="col-12 mt-4">
            <button type="submit" className="btn btn-primary-modern w-100 py-2 fw-semibold" disabled={saving}>
              {saving ? 'Updating...' : 'Save Business Profile'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProviderProfile;
