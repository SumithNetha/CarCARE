const express = require('express');
const router = express.Router();
const {
  getStats,
  getUsers,
  toggleUserStatus,
  getProviders,
  approveProvider,
  rejectProvider,
  getBookings,
  getServices,
  getReviews,
  deleteReview,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/status', toggleUserStatus);

router.get('/providers', getProviders);
router.put('/providers/:id/approve', approveProvider);
router.put('/providers/:id/reject', rejectProvider);

router.get('/bookings', getBookings);
router.get('/services', getServices);
router.get('/reviews', getReviews);
router.delete('/reviews/:id', deleteReview);

module.exports = router;
