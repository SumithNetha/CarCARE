const Provider = require('../models/Provider');
const Service = require('../models/Service');
const Review = require('../models/Review');
const { calculateDistance, getCityCoordinates, getHyderabadArea, isWithinHyderabad } = require('../utils/geoUtils');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @desc    Get all providers with location, service, price, and rating filters
// @route   GET /api/providers
// @access  Public
exports.getProviders = async (req, res, next) => {
  try {
    const {
      service,
      minRating,
      maxPrice,
      city,
      area,
      pincode,
      lat,
      lng,
      maxDistance,
      search,
      sortBy = 'rating',
      sortOrder = 'desc',
    } = req.query;

    if (city && city.trim().toLowerCase() !== 'hyderabad') {
      return res.status(400).json({ success: false, message: 'CarCare Connect currently serves Hyderabad only' });
    }
    if (area && !getHyderabadArea(area)) {
      return res.status(400).json({ success: false, message: 'Choose a valid Hyderabad area' });
    }

    let filter = { city: 'Hyderabad', verified: 'approved', isActive: true };

    // Service category filter
    if (service && service !== 'All') {
      filter.services = { $in: [service] };
    }

    // Minimum rating filter
    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }

    // Maximum price filter
    if (maxPrice) {
      filter.startingPrice = { $lte: Number(maxPrice) };
    }

    // City filter
    if (city && city.trim() !== '') {
      filter.city = 'Hyderabad';
    }
    if (area) {
      filter.area = getHyderabadArea(area).name;
    }

    // Pincode filter
    if (pincode && pincode.trim() !== '') {
      filter.pincode = pincode.trim();
    }

    // Search query (name or address)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(escapeRegex(search.trim()), 'i');
      filter.$or = [
        { businessName: searchRegex },
        { address: searchRegex },
        { description: searchRegex },
      ];
    }

    let providers = await Provider.find(filter).lean();

    // Determine target coordinates for distance calculation:
    // Either from explicit lat/lng or fallback to searched city center
    let userLat = lat !== undefined ? Number(lat) : null;
    let userLng = lng !== undefined ? Number(lng) : null;

    if ((lat !== undefined || lng !== undefined) && !isWithinHyderabad(userLat, userLng)) {
      return res.status(400).json({ success: false, message: 'Search coordinates must be within Hyderabad' });
    }

    if ((userLat === null || userLng === null) && area) {
      const areaCoordinates = getHyderabadArea(area);
      userLat = areaCoordinates.lat;
      userLng = areaCoordinates.lng;
    } else if ((userLat === null || userLng === null) && city) {
      const cityCoords = getCityCoordinates(city);
      if (cityCoords) {
        userLat = cityCoords.lat;
        userLng = cityCoords.lng;
      }
    }

    // Calculate distance for each provider
    providers = providers.map((provider) => {
      let distance = null;
      if (userLat !== null && userLng !== null && Number.isFinite(provider.latitude) && Number.isFinite(provider.longitude)) {
        distance = calculateDistance(userLat, userLng, provider.latitude, provider.longitude);
      }
      return {
        ...provider,
        distance, // in kilometers
      };
    });

    // Distance filter if maxDistance specified and distance calculated
    if (maxDistance && userLat !== null && userLng !== null) {
      const maxDistNum = Number(maxDistance);
      if (!Number.isFinite(maxDistNum) || maxDistNum < 0) {
        return res.status(400).json({ success: false, message: 'maxDistance must be a non-negative number' });
      }
      providers = providers.filter((p) => p.distance !== null && p.distance <= maxDistNum);
    }

    // Sorting
    providers.sort((a, b) => {
      let order = sortOrder === 'asc' ? 1 : -1;

      if (sortBy === 'distance') {
        if (a.distance === null && b.distance === null) return 0;
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return (a.distance - b.distance) * (sortOrder === 'desc' ? -1 : 1);
      }

      if (sortBy === 'price') {
        return (a.startingPrice - b.startingPrice) * (sortOrder === 'desc' ? -1 : 1);
      }

      if (sortBy === 'rating') {
        return (a.rating - b.rating) * order;
      }

      return (b.rating - a.rating);
    });

    res.status(200).json({
      success: true,
      count: providers.length,
      userLocation: userLat !== null && userLng !== null ? { lat: userLat, lng: userLng } : null,
      data: providers,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single provider by ID with services and reviews
// @route   GET /api/providers/:id
// @access  Public
exports.getProvider = async (req, res, next) => {
  try {
    const provider = await Provider.findById(req.params.id);

    if (!provider || provider.city !== 'Hyderabad' || provider.verified !== 'approved' || !provider.isActive) {
      return res.status(404).json({ success: false, message: 'Service provider not found' });
    }

    // Get services offered by this provider
    const services = await Service.find({ providerId: provider._id, availability: true });

    // Get reviews for this provider with customer details
    const reviews = await Review.find({ providerId: provider._id })
      .populate('customerId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        ...provider.toObject(),
        services,
        reviews,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in provider's profile
// @route   GET /api/providers/me/profile
// @access  Private (Provider)
exports.getMyProviderProfile = async (req, res, next) => {
  try {
    const provider = await Provider.findOne({ userId: req.user.id });

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found for this account' });
    }

    const services = await Service.find({ providerId: provider._id });
    const reviews = await Review.find({ providerId: provider._id }).populate('customerId', 'name');

    res.status(200).json({
      success: true,
      data: {
        ...provider.toObject(),
        services,
        reviews,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update provider profile details
// @route   PUT /api/providers/me/profile
// @access  Private (Provider)
exports.updateMyProviderProfile = async (req, res, next) => {
  try {
    const provider = await Provider.findOne({ userId: req.user.id });

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }

    const allowedFields = [
      'businessName',
      'ownerName',
      'description',
      'phone',
      'address',
      'city',
      'latitude',
      'longitude',
      'services',
      'imageUrl',
      'startingPrice',
      'area',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        provider[field] = req.body[field];
      }
    });

    if (req.body.city !== undefined && req.body.city !== 'Hyderabad') {
      return res.status(400).json({ success: false, message: 'CarCare Connect currently serves Hyderabad only' });
    }
    provider.city = 'Hyderabad';
    if (req.body.area !== undefined) {
      const selectedArea = getHyderabadArea(req.body.area);
      if (!selectedArea) return res.status(400).json({ success: false, message: 'Choose a valid Hyderabad area' });
      provider.area = selectedArea.name;
      provider.pincode = selectedArea.pincode;
    }
    if (req.body.address !== undefined && !provider.address.toLowerCase().includes(provider.area.toLowerCase())) {
      provider.address = `${provider.address}, ${provider.area}, Hyderabad`;
    }
    if (!isWithinHyderabad(Number(provider.latitude), Number(provider.longitude))) {
      return res.status(400).json({ success: false, message: 'Provider location must be within Hyderabad' });
    }

    await provider.save();

    res.status(200).json({
      success: true,
      message: 'Provider profile updated successfully',
      data: provider,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update provider availability and working hours
// @route   PUT /api/providers/me/availability
// @access  Private (Provider)
exports.updateAvailability = async (req, res, next) => {
  try {
    const provider = await Provider.findOne({ userId: req.user.id });

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }

    const { workingDays, workingHours, availableTimeSlots } = req.body;

    if (workingDays) provider.workingDays = workingDays;
    if (workingHours) provider.workingHours = workingHours;
    if (availableTimeSlots) provider.availableTimeSlots = availableTimeSlots;

    await provider.save();

    res.status(200).json({
      success: true,
      message: 'Availability schedule updated successfully',
      data: provider,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin or provider update by ID
// @route   PUT /api/providers/:id
// @access  Private
exports.updateProviderById = async (req, res, next) => {
  try {
    let provider = await Provider.findById(req.params.id);

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    // Only admin or the owning provider can update
    if (req.user.role !== 'admin' && provider.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this provider' });
    }

    const allowedFields = ['businessName', 'ownerName', 'description', 'phone', 'address', 'city', 'area', 'latitude', 'longitude', 'services', 'imageUrl', 'startingPrice', 'workingDays', 'workingHours', 'availableTimeSlots'];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowedFields.includes(key)));
    if (updates.city !== undefined && updates.city !== 'Hyderabad') {
      return res.status(400).json({ success: false, message: 'CarCare Connect currently serves Hyderabad only' });
    }
    updates.city = 'Hyderabad';
    if (updates.area !== undefined) {
      const selectedArea = getHyderabadArea(updates.area);
      if (!selectedArea) return res.status(400).json({ success: false, message: 'Choose a valid Hyderabad area' });
      updates.area = selectedArea.name;
      updates.pincode = selectedArea.pincode;
    }
    if (updates.address !== undefined && !updates.address.toLowerCase().includes(String(updates.area || provider.area).toLowerCase())) {
      updates.address = `${updates.address}, ${updates.area || provider.area}, Hyderabad`;
    }
    const updatedLat = updates.latitude === undefined ? provider.latitude : Number(updates.latitude);
    const updatedLng = updates.longitude === undefined ? provider.longitude : Number(updates.longitude);
    if (!isWithinHyderabad(updatedLat, updatedLng)) {
      return res.status(400).json({ success: false, message: 'Provider location must be within Hyderabad' });
    }
    provider = await Provider.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

    res.status(200).json({
      success: true,
      message: 'Provider updated successfully',
      data: provider,
    });
  } catch (err) {
    next(err);
  }
};
