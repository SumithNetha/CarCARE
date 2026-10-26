import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await api.get('/admin/services');
        if (res.data.success) {
          setServices(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load global services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = services.filter((s) => {
    if (categoryFilter === 'ALL') return true;
    return s.category === categoryFilter;
  });

  return (
    <div className="card modern-card p-4 border-0 shadow-sm rounded-4 bg-white">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-1">Global Services Catalog ({services.length})</h4>
          <p className="text-muted small mb-0">Overview of all services and packages listed across all providers.</p>
        </div>

        <div className="btn-group p-1 bg-light rounded-pill border" role="group">
          {['ALL', 'Car Rental', 'Car Mechanic', 'Car Washing'].map((cat) => (
            <button
              key={cat}
              type="button"
              className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                categoryFilter === cat ? 'btn-primary text-white shadow-sm' : 'btn-light text-muted'
              }`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-2">Loading platform services...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4">
          <h5>No services in this category</h5>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small">
              <tr>
                <th>Service Name</th>
                <th>Category</th>
                <th>Provider / Workshop</th>
                <th>City</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((s) => (
                <tr key={s._id}>
                  <td>
                    <div className="fw-bold text-dark">{s.serviceName}</div>
                    <span className="text-muted small text-truncate d-block" style={{ maxWidth: '280px' }}>
                      {s.description}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-secondary-subtle text-dark border">
                      {s.category}
                    </span>
                  </td>
                  <td className="fw-semibold">
                    {s.providerId?.businessName || 'Provider'}
                  </td>
                  <td className="small">{s.providerId?.city}</td>
                  <td className="fw-bold text-primary">₹{s.price}</td>
                  <td className="small text-muted">{s.duration}</td>
                  <td>
                    <span className={`badge ${s.availability ? 'bg-success' : 'bg-secondary'}`}>
                      {s.availability ? 'Available' : 'Paused'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
