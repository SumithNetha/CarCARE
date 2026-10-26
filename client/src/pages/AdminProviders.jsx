import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';

const AdminProviders = () => {
  const [searchParams] = useSearchParams();
  const initialVerified = searchParams.get('verified') || 'all';

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifiedFilter, setVerifiedFilter] = useState(initialVerified);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      let url = `/admin/providers?verified=${verifiedFilter}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

      const res = await api.get(url);
      if (res.data.success) {
        setProviders(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin providers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [verifiedFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProviders();
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      const res = await api.put(`/admin/providers/${id}/approve`);
      if (res.data.success) {
        fetchProviders();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve provider');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this provider application?')) return;
    setActionLoading(id);
    try {
      const res = await api.put(`/admin/providers/${id}/reject`);
      if (res.data.success) {
        fetchProviders();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject provider');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/status`);
      if (res.data.success) {
        fetchProviders();
      }
    } catch (err) {
      alert('Failed to update account status');
    }
  };

  return (
    <div className="card modern-card p-4 border-0 shadow-sm rounded-4 bg-white">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-1">Provider Verification & Supervision</h4>
          <p className="text-muted small mb-0">Review new garage applications, verify credentials, and manage active status.</p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="row g-2 align-items-center mb-4">
        <div className="col-md-7">
          <div className="btn-group p-1 bg-light rounded-pill border" role="group">
            {['all', 'pending', 'approved', 'rejected'].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`btn btn-sm rounded-pill px-3 fw-semibold text-capitalize ${
                  verifiedFilter === tab ? 'btn-primary text-white shadow-sm' : 'btn-light text-muted'
                }`}
                onClick={() => setVerifiedFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="col-md-5">
          <form onSubmit={handleSearchSubmit} className="d-flex gap-2">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search garage name, city or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm px-3">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Providers Table */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-2">Loading providers list...</p>
        </div>
      ) : providers.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4">
          <h5>No providers found in this category</h5>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small">
              <tr>
                <th>Business Info</th>
                <th>Owner & Contact</th>
                <th>Location</th>
                <th>Services</th>
                <th>Verification</th>
                <th>Account</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="fw-bold text-dark">{p.businessName}</div>
                    <span className="small text-muted">
                      ★ {p.rating?.toFixed(1)} ({p.reviewCount} reviews)
                    </span>
                  </td>
                  <td>
                    <div className="fw-semibold small">{p.ownerName}</div>
                    <div className="small text-muted">{p.phone}</div>
                    <div className="small text-muted">{p.userId?.email}</div>
                  </td>
                  <td className="small">
                    <div>{p.city}</div>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>{p.address}</span>
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      {p.services?.map((s) => (
                        <span key={s} className="badge bg-light text-dark border small">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge px-2 py-1 text-capitalize ${
                        p.verified === 'approved'
                          ? 'bg-success'
                          : p.verified === 'pending'
                          ? 'bg-warning text-dark'
                          : 'bg-danger'
                      }`}
                    >
                      {p.verified}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${p.isActive ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                      {p.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-1 flex-wrap">
                      {p.verified !== 'approved' && (
                        <button
                          type="button"
                          className="btn btn-success btn-sm py-0 px-2"
                          disabled={actionLoading === p._id}
                          onClick={() => handleApprove(p._id)}
                        >
                          Approve
                        </button>
                      )}

                      {p.verified !== 'rejected' && (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm py-0 px-2"
                          disabled={actionLoading === p._id}
                          onClick={() => handleReject(p._id)}
                        >
                          Reject
                        </button>
                      )}

                      {p.userId?._id && (
                        <button
                          type="button"
                          className={`btn btn-sm py-0 px-2 ${p.isActive ? 'btn-outline-warning text-dark' : 'btn-outline-success'}`}
                          title="Deactivate or activate account"
                          onClick={() => handleToggleStatus(p.userId._id)}
                        >
                          {p.isActive ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </div>
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

export default AdminProviders;
