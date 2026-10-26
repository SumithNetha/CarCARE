const express = require('express');
const router = express.Router();
const {
  getBookings,
  getBooking,
  createBooking,
  updateBookingStatus,
  deleteBooking,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getBookings)
  .post(authorize('customer'), createBooking);

router.route('/:id')
  .get(getBooking)
  .delete(deleteBooking);

router.put('/:id/status', updateBookingStatus);

module.exports = router;
