import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminCustomers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let url = '/admin/users?role=customer';
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const res = await api.get(url);
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/status`);
      if (res.data.success) {
        fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  return (
    <div className="card modern-card p-4 border-0 shadow-sm rounded-4 bg-white">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-1">Customer Accounts Management</h4>
          <p className="text-muted small mb-0">Oversee customer accounts, cities, and account standing.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); fetchUsers(); }} className="d-flex gap-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search customer name, email or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-sm px-3">
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-2">Loading customer accounts...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4">
          <h5>No customers found</h5>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small">
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                        style={{ width: '32px', height: '32px' }}
                      >
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="fw-bold text-dark">{u.name}</div>
                        <span className="text-muted small">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="small">
                    <div>{u.phone}</div>
                  </td>
                  <td className="small">
                    <div>{u.city}</div>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>{u.address}</span>
                  </td>
                  <td className="small text-muted">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <span className={`badge ${u.isActive ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                      {u.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`btn btn-sm py-0 px-2 ${u.isActive ? 'btn-outline-danger' : 'btn-outline-success'}`}
                      onClick={() => handleToggleStatus(u._id)}
                    >
                      {u.isActive ? 'Deactivate' : 'Reactivate'}
                    </button>
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

export default AdminCustomers;
