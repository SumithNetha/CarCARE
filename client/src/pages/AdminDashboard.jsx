import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await api.get('/admin/stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="card modern-card p-5 text-center bg-white border-0 shadow-sm rounded-4">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="text-muted mt-2">Aggregating platform metrics...</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4">
      {/* Pending Approvals Warning Banner */}
      {stats?.pendingProviders > 0 && (
        <div className="card modern-card p-4 border-0 shadow-sm rounded-4 bg-warning bg-opacity-10 border-start border-4 border-warning">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="d-flex align-items-center gap-3">
              <i className="bi bi-shield-exclamation fs-2 text-warning"></i>
              <div>
                <h5 className="fw-bold mb-0 text-dark">
                  {stats.pendingProviders} Service Partner {stats.pendingProviders === 1 ? 'Application' : 'Applications'} Pending Verification
                </h5>
                <p className="text-muted small mb-0">
                  Review business documentation and approve or reject access.
                </p>
              </div>
            </div>
            <Link to="/admin/providers?verified=pending" className="btn btn-warning btn-sm fw-bold text-dark px-3 rounded-pill">
              Review Applications →
            </Link>
          </div>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="row g-3">
        <div className="col-lg-3 col-6">
          <div className="card modern-card p-3 border-0 shadow-sm rounded-4 bg-white">
            <span className="text-muted small fw-semibold">Platform Volume (GMV)</span>
            <h3 className="fw-bold mb-0 text-success mt-1">₹{stats?.totalRevenue?.toLocaleString()}</h3>
            <span className="text-muted small">Total completed revenue</span>
          </div>
        </div>

        <div className="col-lg-3 col-6">
          <div className="card modern-card p-3 border-0 shadow-sm rounded-4 bg-white">
            <span className="text-muted small fw-semibold">Total Customers</span>
            <h3 className="fw-bold mb-0 text-dark mt-1">{stats?.totalCustomers}</h3>
            <Link to="/admin/customers" className="small text-primary text-decoration-none">
              Manage accounts →
            </Link>
          </div>
        </div>

        <div className="col-lg-3 col-6">
          <div className="card modern-card p-3 border-0 shadow-sm rounded-4 bg-white">
            <span className="text-muted small fw-semibold">Active Providers</span>
            <h3 className="fw-bold mb-0 text-primary mt-1">{stats?.approvedProviders} / {stats?.totalProviders}</h3>
            <Link to="/admin/providers" className="small text-primary text-decoration-none">
              Verification portal →
            </Link>
          </div>
        </div>

        <div className="col-lg-3 col-6">
          <div className="card modern-card p-3 border-0 shadow-sm rounded-4 bg-white">
            <span className="text-muted small fw-semibold">Total Bookings</span>
            <h3 className="fw-bold mb-0 text-dark mt-1">{stats?.totalBookings}</h3>
            <span className="text-muted small">
              {stats?.completedBookings} Completed • {stats?.cancelledBookings} Cancelled
            </span>
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card modern-card p-3 border-0 shadow-sm rounded-4 bg-light">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small">Customer Vehicles</span>
                <h4 className="fw-bold mb-0 text-dark">{stats?.totalVehicles}</h4>
              </div>
              <i className="bi bi-car-front fs-2 text-primary"></i>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card modern-card p-3 border-0 shadow-sm rounded-4 bg-light">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small">Listed Services</span>
                <h4 className="fw-bold mb-0 text-dark">{stats?.totalServices}</h4>
              </div>
              <i className="bi bi-tools fs-2 text-warning"></i>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card modern-card p-3 border-0 shadow-sm rounded-4 bg-light">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small">Customer Reviews</span>
                <h4 className="fw-bold mb-0 text-dark">{stats?.totalReviews}</h4>
              </div>
              <i className="bi bi-star-fill fs-2 text-warning"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Platform Bookings Ledger */}
      <div className="card modern-card p-4 border-0 shadow-sm rounded-4 bg-white">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Recent Platform Transactions</h5>
          <Link to="/admin/bookings" className="small text-primary text-decoration-none fw-semibold">
            View All Ledger →
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small">
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Provider</th>
                <th>Service</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentBookings?.map((b) => (
                <tr key={b._id}>
                  <td>
                    <span className="badge bg-light text-dark border fw-bold">{b.bookingId}</span>
                  </td>
                  <td>
                    <div className="fw-semibold">{b.customerId?.name}</div>
                    <span className="text-muted small">{b.customerId?.email}</span>
                  </td>
                  <td>
                    <div className="fw-semibold">{b.providerId?.businessName}</div>
                  </td>
                  <td>{b.serviceId?.serviceName}</td>
                  <td className="small">{new Date(b.bookingDate).toLocaleDateString()}</td>
                  <td className="fw-bold">₹{b.amount}</td>
                  <td>
                    <span className={`status-badge status-${b.status}`}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
