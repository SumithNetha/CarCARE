const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Provider = require('../models/Provider');

// @desc    Get reviews for a specific provider
// @route   GET /api/reviews/provider/:providerId
// @access  Public
exports.getProviderReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ providerId: req.params.providerId })
      .populate('customerId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add review for a completed booking
// @route   POST /api/reviews
// @access  Private (Customer)
exports.addReview = async (req, res, next) => {
  try {
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide bookingId, rating, and comment' });
    }

    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    // Find booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Ensure user is the customer of this booking
    if (booking.customerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to review this booking' });
    }

    // Ensure booking is completed
    if (booking.status !== 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Only completed bookings can be reviewed and rated',
      });
    }

    // Ensure no existing review for this booking
    const existingReview = await Review.findOne({ bookingId: booking._id });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already submitted a review for this booking' });
    }

    const review = await Review.create({
      customerId: req.user.id,
      providerId: booking.providerId,
      bookingId: booking._id,
      rating: ratingNum,
      comment: comment.trim(),
    });

    // Mark booking as reviewed
    booking.reviewed = true;
    await booking.save();

    // Recalculate provider average rating
    await Review.getAverageRating(booking.providerId);

    const populatedReview = await Review.findById(review._id).populate('customerId', 'name');

    res.status(201).json({
      success: true,
      message: 'Thank you for your rating and review!',
      data: populatedReview,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged in customer's reviews
// @route   GET /api/reviews/my
// @access  Private (Customer)
exports.getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ customerId: req.user.id })
      .populate('providerId', 'businessName city address rating')
      .populate('bookingId', 'bookingId bookingDate serviceId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};
