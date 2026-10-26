const User = require('../models/User');
const Provider = require('../models/Provider');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Review = require('../models/Review');
const Vehicle = require('../models/Vehicle');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getStats = async (req, res, next) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProviders = await Provider.countDocuments();
    const pendingProviders = await Provider.countDocuments({ verified: 'pending' });
    const approvedProviders = await Provider.countDocuments({ verified: 'approved' });

    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: 'COMPLETED' });
    const cancelledBookings = await Booking.countDocuments({ status: 'CANCELLED' });
    const activeBookings = await Booking.countDocuments({ status: { $in: ['ACCEPTED', 'IN_PROGRESS'] } });

    // Calculate total platform revenue from completed bookings
    const revenueAgg = await Booking.aggregate([
      { $match: { status: 'COMPLETED' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    const totalVehicles = await Vehicle.countDocuments();
    const totalServices = await Service.countDocuments();
    const totalReviews = await Review.countDocuments();

    // Recent 5 bookings
    const recentBookings = await Booking.find()
      .populate('customerId', 'name email')
      .populate('providerId', 'businessName')
      .populate('serviceId', 'serviceName price')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        totalProviders,
        pendingProviders,
        approvedProviders,
        totalBookings,
        completedBookings,
        cancelledBookings,
        activeBookings,
        totalRevenue,
        totalVehicles,
        totalServices,
        totalReviews,
        recentBookings,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users / customers
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    let query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (search) {
      const regex = new RegExp(escapeRegex(search.trim()), 'i');
      query.$or = [{ name: regex }, { email: regex }, { phone: regex }, { city: regex }];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle user status (activate / deactivate suspicious accounts)
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    // If provider, also toggle provider status
    if (user.role === 'provider') {
      await Provider.findOneAndUpdate({ userId: user._id }, { isActive: user.isActive });
    }

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all providers for admin (with verification status filter)
// @route   GET /api/admin/providers
// @access  Private (Admin)
exports.getProviders = async (req, res, next) => {
  try {
    const { verified, search } = req.query;
    let query = {};

    if (verified && verified !== 'all') {
      query.verified = verified;
    }

    if (search) {
      const regex = new RegExp(escapeRegex(search.trim()), 'i');
      query.$or = [{ businessName: regex }, { ownerName: regex }, { city: regex }, { phone: regex }];
    }

    const providers = await Provider.find(query).populate('userId', 'email isActive').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: providers.length,
      data: providers,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Approve a service provider
// @route   PUT /api/admin/providers/:id/approve
// @access  Private (Admin)
exports.approveProvider = async (req, res, next) => {
  try {
    const provider = await Provider.findById(req.params.id);

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    provider.verified = 'approved';
    await provider.save();

    res.status(200).json({
      success: true,
      message: `Provider '${provider.businessName}' has been approved successfully`,
      data: provider,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reject a service provider
// @route   PUT /api/admin/providers/:id/reject
// @access  Private (Admin)
exports.rejectProvider = async (req, res, next) => {
  try {
    const provider = await Provider.findById(req.params.id);

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    provider.verified = 'rejected';
    await provider.save();

    res.status(200).json({
      success: true,
      message: `Provider '${provider.businessName}' has been marked as rejected`,
      data: provider,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all bookings for admin
// @route   GET /api/admin/bookings
// @access  Private (Admin)
exports.getBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('customerId', 'name email phone')
      .populate('providerId', 'businessName phone city')
      .populate('vehicleId', 'brand model registrationNumber')
      .populate('serviceId', 'serviceName category price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all services for admin
// @route   GET /api/admin/services
// @access  Private (Admin)
exports.getServices = async (req, res, next) => {
  try {
    const services = await Service.find().populate('providerId', 'businessName city verified').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all reviews for moderation
// @route   GET /api/admin/reviews
// @access  Private (Admin)
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('customerId', 'name email')
      .populate('providerId', 'businessName')
      .populate('bookingId', 'bookingId')
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

// @desc    Delete a review (Moderation)
// @route   DELETE /api/admin/reviews/:id
// @access  Private (Admin)
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    const providerId = review.providerId;
    await review.deleteOne();

    // Recalculate rating
    await Review.getAverageRating(providerId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
