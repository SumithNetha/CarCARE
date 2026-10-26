const Service = require('../models/Service');
const Provider = require('../models/Provider');

// @desc    Get services (optional filter by providerId, category)
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res, next) => {
  try {
    const { providerId, category } = req.query;
    let query = { availability: true };

    if (providerId) {
      query.providerId = providerId;
    }

    if (category) {
      query.category = category;
    }

    const services = await Service.find(query)
      .populate({ path: 'providerId', match: { city: 'Hyderabad', verified: 'approved', isActive: true }, select: 'businessName rating address city area pincode startingPrice' });

    const publicServices = services.filter((service) => service.providerId);

    res.status(200).json({
      success: true,
      count: publicServices.length,
      data: publicServices,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Public
exports.getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id).populate('providerId');

    if (!service || !service.availability) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const provider = await Provider.findOne({ _id: service.providerId, city: 'Hyderabad', verified: 'approved', isActive: true });
    if (!provider) return res.status(404).json({ success: false, message: 'Service not found' });

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add a service to provider catalog
// @route   POST /api/services
// @access  Private (Provider)
exports.addService = async (req, res, next) => {
  try {
    const provider = await Provider.findOne({ userId: req.user.id });

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found for this account' });
    }

    const { category, serviceName, description, price, duration, features, vehicleType } = req.body;

    if (!category || !serviceName || price === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide category, service name, and price' });
    }

    const service = await Service.create({
      providerId: provider._id,
      category,
      serviceName,
      description: description || '',
      price: Number(price),
      duration: duration || '1-2 hours',
      features: Array.isArray(features) ? features : (features ? [features] : []),
      vehicleType: vehicleType || 'All Vehicles',
    });

    // Update provider's startingPrice if this service is cheaper
    if (service.price < provider.startingPrice) {
      provider.startingPrice = service.price;
      await provider.save();
    }

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private (Provider)
exports.updateService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // Verify ownership
    if (req.user.role !== 'admin') {
      const provider = await Provider.findOne({ userId: req.user.id });
      if (!provider || service.providerId.toString() !== provider._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this service' });
      }
    }

    const allowedFields = ['category', 'serviceName', 'description', 'price', 'duration', 'features', 'vehicleType', 'availability'];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowedFields.includes(key)));
    const updatedService = await Service.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: updatedService,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private (Provider)
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (req.user.role !== 'admin') {
      const provider = await Provider.findOne({ userId: req.user.id });
      if (!provider || service.providerId.toString() !== provider._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this service' });
      }
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Service removed successfully',
    });
  } catch (err) {
    next(err);
  }
};
