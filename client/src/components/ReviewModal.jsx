import React, { useState } from 'react';
import api from '../services/api';
import confetti from 'canvas-confetti';

const ReviewModal = ({ booking, onClose, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please write a brief comment describing your experience');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/reviews', {
        bookingId: booking._id,
        rating,
        comment: comment.trim(),
      });

      if (res.data.success) {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
        });
        if (onReviewSubmitted) onReviewSubmitted(res.data.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 border-0 shadow-xl overflow-hidden">
          <div className="modal-header bg-dark text-white p-4 border-0">
            <div>
              <span className="badge bg-warning text-dark fw-bold px-2 py-1 mb-1">
                Verified Experience
              </span>
              <h5 className="modal-title fw-bold text-white">Rate Your Service</h5>
              <p className="text-secondary-subtle small mb-0 mt-1">
                {booking?.providerId?.businessName || 'Service Provider'}
              </p>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {error && (
                <div className="alert alert-danger py-2 px-3 mb-3 small" role="alert">
                  {error}
                </div>
              )}

              {/* Star Rating Interactive */}
              <div className="text-center my-3">
                <label className="form-label text-muted small fw-semibold d-block">Overall Satisfaction</label>
                <div className="d-inline-flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="btn btn-link p-0 text-decoration-none border-0"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <i
                        className={`bi ${
                          (hoverRating || rating) >= star ? 'bi-star-fill text-warning' : 'bi-star text-muted'
                        }`}
                        style={{ fontSize: '2rem' }}
                      ></i>
                    </button>
                  ))}
                </div>
                <div className="fw-bold mt-1 text-dark">
                  {rating === 5 && 'Outstanding ⭐⭐⭐⭐⭐'}
                  {rating === 4 && 'Very Good ⭐⭐⭐⭐'}
                  {rating === 3 && 'Average ⭐⭐⭐'}
                  {rating === 2 && 'Below Expectations ⭐⭐'}
                  {rating === 1 && 'Poor Experience ⭐'}
                </div>
              </div>

              {/* Written review */}
              <div className="mb-3">
                <label className="form-label fw-semibold small text-muted">Your Written Review</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Share details about punctuality, repair quality, vehicle cleanliness, and overall staff behavior..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                ></textarea>
              </div>
            </div>

            <div className="modal-footer bg-light p-3 border-0">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary-modern" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
