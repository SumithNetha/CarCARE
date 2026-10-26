const express = require('express');
const router = express.Router();
const {
  getProviderReviews,
  addReview,
  getMyReviews,
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

router.get('/provider/:providerId', getProviderReviews);
router.post('/', protect, authorize('customer'), addReview);
router.get('/my', protect, authorize('customer'), getMyReviews);

module.exports = router;
