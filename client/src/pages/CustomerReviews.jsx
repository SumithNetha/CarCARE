import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ReviewModal from '../components/ReviewModal';

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [completedUnreviewed, setCompletedUnreviewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rRes, bRes] = await Promise.all([
        api.get('/reviews/my'),
        api.get('/bookings?status=COMPLETED'),
      ]);

      if (rRes.data.success) {
        setReviews(rRes.data.data);
      }

      if (bRes.data.success) {
        // Filter bookings that have NOT been reviewed yet
        const unreviewed = bRes.data.data.filter((b) => !b.reviewed);
        setCompletedUnreviewed(unreviewed);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="d-flex flex-column gap-4">
      {/* Pending Reviews Notice Banner */}
      {completedUnreviewed.length > 0 && (
        <div className="card modern-card p-4 border-0 shadow-sm rounded-4 bg-warning bg-opacity-10 border-start border-4 border-warning">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h5 className="fw-bold mb-1 text-dark">
                <i className="bi bi-star-fill text-warning me-2"></i>
                You Have Completed Services Pending Review!
              </h5>
              <p className="text-muted small mb-0">
                Help other car owners by rating your recent experiences.
              </p>
            </div>
            <div className="d-flex gap-2">
              {completedUnreviewed.map((b) => (
                <button
                  key={b._id}
                  type="button"
                  className="btn btn-warning btn-sm fw-semibold text-dark shadow-sm"
                  onClick={() => setSelectedBookingForReview(b)}
                >
                  Rate {b.providerId?.businessName} ({b.bookingId})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Submitted Reviews List */}
      <div className="card modern-card p-4 border-0 shadow-sm rounded-4 bg-white">
        <h4 className="fw-bold mb-1">My Submitted Reviews</h4>
        <p className="text-muted small mb-4">Reviews you have posted for verified service bookings.</p>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-5 bg-light rounded-4">
            <i className="bi bi-chat-heart fs-1 text-muted mb-2 d-block"></i>
            <h5>No Reviews Submitted Yet</h5>
            <p className="text-muted small mb-0">
              Reviews can be submitted once any of your bookings are marked as COMPLETED by the provider.
            </p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {reviews.map((rev) => (
              <div key={rev._id} className="card border p-3 rounded-4 shadow-sm bg-light">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">
                      {rev.providerId?.businessName || 'Service Provider'}
                    </h6>
                    <span className="text-muted small">
                      {rev.providerId?.address}, {rev.providerId?.city}
                    </span>
                  </div>
                  <div className="text-end">
                    <span className="text-warning fw-bold fs-5">
                      {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                    </span>
                    <span className="text-muted small d-block">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <p className="text-secondary small mb-0 bg-white p-3 rounded-3 border">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedBookingForReview && (
        <ReviewModal
          booking={selectedBookingForReview}
          onClose={() => setSelectedBookingForReview(null)}
          onReviewSubmitted={() => {
            fetchData();
            setSelectedBookingForReview(null);
          }}
        />
      )}
    </div>
  );
};

export default CustomerReviews;
