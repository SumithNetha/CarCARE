import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ProviderServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [category, setCategory] = useState('Car Mechanic');
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('1-2 hours');
  const [featuresStr, setFeaturesStr] = useState('');
  const [vehicleType, setVehicleType] = useState('All Vehicles');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/providers/me/profile');
      if (res.data.success) {
        setServices(res.data.data.services || []);
      }
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setCategory('Car Mechanic');
    setServiceName('');
    setDescription('');
    setPrice('');
    setDuration('1-2 hours');
    setFeaturesStr('');
    setVehicleType('All Vehicles');
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (service) => {
    setIsEditing(true);
    setEditingId(service._id);
    setCategory(service.category);
    setServiceName(service.serviceName);
    setDescription(service.description || '');
    setPrice(service.price);
    setDuration(service.duration || '1-2 hours');
    setFeaturesStr(service.features?.join(', ') || '');
    setVehicleType(service.vehicleType || 'All Vehicles');
    setFormError('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!serviceName.trim() || !price) {
      setFormError('Please enter service name and price');
      return;
    }

    setSaving(true);

    const payload = {
      category,
      serviceName: serviceName.trim(),
      description: description.trim(),
      price: Number(price),
      duration: duration.trim(),
      features: featuresStr ? featuresStr.split(',').map((f) => f.trim()).filter(Boolean) : [],
      vehicleType,
    };

    try {
      if (isEditing) {
        const res = await api.put(`/services/${editingId}`, payload);
        if (res.data.success) {
          setShowModal(false);
          fetchServices();
        }
      } else {
        const res = await api.post('/services', payload);
        if (res.data.success) {
          setShowModal(false);
          fetchServices();
        }
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this service from your catalog?')) return;

    try {
      const res = await api.delete(`/services/${id}`);
      if (res.data.success) {
        setServices(services.filter((s) => s._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete service');
    }
  };

  return (
    <div className="card modern-card p-4 border-0 shadow-sm rounded-4 bg-white">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-1">Manage Services & Pricing</h4>
          <p className="text-muted small mb-0">Configure your workshop packages, hourly rates, and detailing bundles.</p>
        </div>
        <button type="button" className="btn btn-primary-modern btn-sm rounded-pill px-4" onClick={openAddModal}>
          <i className="bi bi-plus-circle me-1"></i> Add New Service
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-2">Loading service catalog...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4">
          <i className="bi bi-tools fs-1 text-muted mb-2 d-block"></i>
          <h5>No Services Added Yet</h5>
          <p className="text-muted small mb-3">Add services with pricing so car owners can view and book appointments.</p>
          <button type="button" className="btn btn-primary-modern" onClick={openAddModal}>
            Add First Service
          </button>
        </div>
      ) : (
        <div className="row g-3">
          {services.map((svc) => (
            <div key={svc._id} className="col-md-6">
              <div className="card border p-3 rounded-4 shadow-sm bg-light h-100 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="badge bg-primary-subtle text-primary fw-semibold px-2 py-1">
                    {svc.category}
                  </span>
                  <div className="d-flex gap-1">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm p-1 rounded-circle"
                      title="Edit Service"
                      onClick={() => openEditModal(svc)}
                    >
                      <i className="bi bi-pencil px-1"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm p-1 rounded-circle"
                      title="Delete Service"
                      onClick={() => handleDelete(svc._id)}
                    >
                      <i className="bi bi-trash px-1"></i>
                    </button>
                  </div>
                </div>

                <h5 className="fw-bold mb-1 text-dark">{svc.serviceName}</h5>
                <p className="text-muted small mb-2">{svc.description}</p>

                <div className="d-flex flex-wrap gap-1 mb-3">
                  {svc.features?.map((f, i) => (
                    <span key={i} className="badge bg-white text-secondary border small">
                      {f}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted small d-block">Price</span>
                    <span className="fs-5 fw-bold text-primary">₹{svc.price}</span>
                  </div>
                  <span className="text-muted small">
                    <i className="bi bi-clock me-1"></i> {svc.duration}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-xl overflow-hidden">
              <div className="modal-header bg-dark text-white p-3">
                <h5 className="modal-title fw-bold text-white">
                  {isEditing ? 'Edit Service' : 'Add New Service'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>

              <form onSubmit={handleSave}>
                <div className="modal-body p-4">
                  {formError && (
                    <div className="alert alert-danger py-2 px-3 small mb-3">
                      {formError}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Category</label>
                    <select
                      className="form-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <option value="Car Mechanic">Car Mechanic</option>
                      <option value="Car Rental">Car Rental</option>
                      <option value="Car Washing">Car Washing</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Service Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 40-Point Periodic Maintenance"
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-muted">Price (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="e.g. 1499"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-muted">Duration</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 2 hours / 24 Hours"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Description</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Service scope, deliverables, or vehicle features..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">
                      Features / Deliverables (comma separated)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Synthetic Oil, Free Wash, Genuine Filter"
                      value={featuresStr}
                      onChange={(e) => setFeaturesStr(e.target.value)}
                    />
                  </div>
                </div>

                <div className="modal-footer bg-light p-3 border-0">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary-modern" disabled={saving}>
                    {saving ? 'Saving...' : isEditing ? 'Update Service' : 'Add Service'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderServices;
