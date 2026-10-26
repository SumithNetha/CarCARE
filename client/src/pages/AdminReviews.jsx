import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/reviews');
      if (res.data.success) {
        setReviews(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to moderate and remove this review?')) return;

    try {
      const res = await api.delete(`/admin/reviews/${id}`);
      if (res.data.success) {
        setReviews(reviews.filter((r) => r._id !== id));
      }
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  return (
    <div className="card modern-card p-4 border-0 shadow-sm rounded-4 bg-white">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-1">Customer Reviews Moderation ({reviews.length})</h4>
          <p className="text-muted small mb-0">Oversee customer feedback authenticity and remove inappropriate content.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-2">Loading platform reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4">
          <h5>No reviews found</h5>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {reviews.map((rev) => (
            <div key={rev._id} className="p-3 border rounded-3 bg-light d-flex justify-content-between align-items-start gap-3">
              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="fw-bold text-dark">{rev.customerId?.name || 'Customer'}</span>
                  <span className="text-muted small">({rev.customerId?.email})</span>
                  <span className="text-muted small">• Reviewed</span>
                  <strong className="text-primary">{rev.providerId?.businessName}</strong>
                </div>

                <div className="text-warning small mb-2">
                  {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                  <span className="text-muted ms-2" style={{ fontSize: '0.75rem' }}>
                    {new Date(rev.createdAt).toLocaleString()}
                  </span>
                </div>

                <p className="text-secondary small mb-0 bg-white p-2 rounded border">
                  "{rev.comment}"
                </p>
              </div>

              <button
                type="button"
                className="btn btn-outline-danger btn-sm text-nowrap"
                onClick={() => handleDelete(rev._id)}
              >
                <i className="bi bi-trash me-1"></i> Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
