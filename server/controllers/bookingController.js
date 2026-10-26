const Booking = require('../models/Booking');
const Provider = require('../models/Provider');
const Service = require('../models/Service');
const Vehicle = require('../models/Vehicle');
const { HYDERABAD_AREAS } = require('../utils/geoUtils');

// @desc    Get bookings (role-aware: customer gets own, provider gets assigned, admin gets all)
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res, next) => {
  try {
    let query = {};
    const { status, category } = req.query;

    if (req.user.role === 'customer') {
      query.customerId = req.user.id;
    } else if (req.user.role === 'provider') {
      const provider = await Provider.findOne({ userId: req.user.id });
      if (!provider) {
        return res.status(200).json({ success: true, count: 0, data: [] });
      }
      query.providerId = provider._id;
    }

    if (status && status !== 'ALL') {
      query.status = status;
    }

    if (category && category !== 'ALL') {
      const matchingServices = await Service.find({ category }).select('_id');
      query.serviceId = { $in: matchingServices.map((service) => service._id) };
    }

    const bookings = await Booking.find(query)
      .populate('customerId', 'name email phone')
      .populate('providerId', 'businessName phone address city rating')
      .populate('vehicleId', 'brand model year registrationNumber fuelType color')
      .populate('serviceId', 'serviceName category price duration')
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

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customerId', 'name email phone address city pincode')
      .populate('providerId', 'businessName ownerName phone address city pincode rating latitude longitude')
      .populate('vehicleId', 'brand model year registrationNumber fuelType color')
      .populate('serviceId', 'serviceName category price duration features description');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Role access check
    if (req.user.role === 'customer' && booking.customerId._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    if (req.user.role === 'provider') {
      const provider = await Provider.findOne({ userId: req.user.id });
      if (!provider || booking.providerId._id.toString() !== provider._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
      }
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Customer)
exports.createBooking = async (req, res, next) => {
  try {
    const {
      providerId,
      serviceId,
      vehicleId,
      bookingDate,
      bookingTime,
      returnDate,
      location,
      notes,
    } = req.body;

    if (!providerId || !serviceId || !bookingDate || !bookingTime || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide provider, service, date, time slot, and location',
      });
    }

    // Validate provider
    const provider = await Provider.findById(providerId);
    if (!provider || provider.city !== 'Hyderabad' || provider.verified !== 'approved' || !provider.isActive) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    const locationText = String(location).toLowerCase();
    if (!HYDERABAD_AREAS.some((area) => locationText.includes(area.name.toLowerCase()))) {
      return res.status(400).json({ success: false, message: 'Booking location must be within a supported Hyderabad area' });
    }

    // Validate service
    const service = await Service.findById(serviceId);
    if (!service || !service.availability || service.providerId.toString() !== provider._id.toString()) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const requestedDate = new Date(bookingDate);
    if (!Number.isFinite(requestedDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid booking date' });
    }
    const availableSlots = provider.availableTimeSlots?.length
      ? provider.availableTimeSlots
      : ['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '03:30 PM', '05:00 PM'];
    if (!availableSlots.includes(bookingTime)) {
      return res.status(400).json({ success: false, message: 'Selected time slot is not available' });
    }
    const requestedDay = requestedDate.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
    if (provider.workingDays?.length && !provider.workingDays.includes(requestedDay)) {
      return res.status(400).json({ success: false, message: 'Provider is closed on the selected date' });
    }

    // Validate vehicle if provided
    let verifiedVehicleId = null;
    if (vehicleId) {
      const vehicle = await Vehicle.findOne({ _id: vehicleId, customerId: req.user.id });
      if (!vehicle) return res.status(400).json({ success: false, message: 'Choose one of your registered vehicles' });
      verifiedVehicleId = vehicle._id;
    }

    const parsedReturnDate = returnDate ? new Date(returnDate) : null;
    if (service.category === 'Car Rental') {
      if (!parsedReturnDate || !Number.isFinite(parsedReturnDate.getTime()) || parsedReturnDate < requestedDate) {
        return res.status(400).json({ success: false, message: 'Rental return date must be on or after pickup date' });
      }
    } else if (returnDate) {
      return res.status(400).json({ success: false, message: 'Return date is only valid for rental bookings' });
    }

    const booking = await Booking.create({
      customerId: req.user.id,
      providerId: provider._id,
      serviceId: service._id,
      vehicleId: verifiedVehicleId,
      bookingDate: requestedDate,
      bookingTime,
      returnDate: parsedReturnDate,
      location: locationText.includes('hyderabad') ? location : `${location}, Hyderabad`,
      notes: notes || '',
      amount: service.price,
      status: 'PENDING',
      statusHistory: [
        {
          status: 'PENDING',
          changedAt: new Date(),
          note: 'Booking requested by customer',
        },
      ],
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('providerId', 'businessName phone address')
      .populate('serviceId', 'serviceName category price')
      .populate('vehicleId');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: populatedBooking,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update booking status (Accept, Reject, In-Progress, Complete, Cancel)
// @route   PUT /api/bookings/:id/status
// @access  Private
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['PENDING', 'ACCEPTED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status: ${status}` });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Authorization and lifecycle checks
    if (req.user.role === 'customer') {
      if (booking.customerId.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
      // Customer can only cancel
      if (status !== 'CANCELLED') {
        return res.status(403).json({ success: false, message: 'Customer can only cancel booking' });
      }
      if (!['PENDING', 'ACCEPTED'].includes(booking.status)) {
        return res.status(400).json({ success: false, message: 'This booking can no longer be cancelled' });
      }
    } else if (req.user.role === 'provider') {
      const provider = await Provider.findOne({ userId: req.user.id });
      if (!provider || booking.providerId.toString() !== provider._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized for this provider booking' });
      }
      const allowedTransitions = {
        PENDING: ['ACCEPTED', 'REJECTED'],
        ACCEPTED: ['IN_PROGRESS', 'CANCELLED'],
        IN_PROGRESS: ['COMPLETED'],
      };
      if (!allowedTransitions[booking.status]?.includes(status)) {
        return res.status(400).json({ success: false, message: `Cannot change booking from ${booking.status} to ${status}` });
      }
    } else if (req.user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Admins cannot change booking status through this route' });
    } else {
      return res.status(403).json({ success: false, message: 'Not authorized to change booking status' });
    }

    booking.status = status;
    booking.statusHistory.push({
      status,
      changedAt: new Date(),
      note: note || `Status updated to ${status} by ${req.user.role}`,
    });

    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete or cancel a booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (req.user.role !== 'admin' && (req.user.role !== 'customer' || booking.customerId.toString() !== req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (!['PENDING', 'ACCEPTED'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: 'This booking can no longer be cancelled' });
    }

    booking.status = 'CANCELLED';
    booking.statusHistory.push({
      status: 'CANCELLED',
      changedAt: new Date(),
      note: 'Booking cancelled by user',
    });
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
    });
  } catch (err) {
    next(err);
  }
};
