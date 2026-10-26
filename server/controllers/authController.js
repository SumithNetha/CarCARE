const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Provider = require('../models/Provider');
const { getHyderabadArea, isWithinHyderabad } = require('../utils/geoUtils');

const getJwtSecret = () => {
  if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be configured in production');
  }
  return process.env.JWT_SECRET || 'local-development-only-carcare-secret';
};

// Helper to sign JWT token
const sendTokenResponse = async (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );

  let providerData = null;
  if (user.role === 'provider') {
    providerData = await Provider.findOne({ userId: user._id });
  }

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address,
      city: user.city,
      area: user.area,
      pincode: user.pincode,
      isActive: user.isActive,
      provider: providerData,
    },
  });
};

// @desc    Register a new customer or service provider
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role = 'customer',
      address,
      area = 'HITEC City',
      // Provider-specific fields
      businessName,
      ownerName,
      businessDescription,
      latitude,
      longitude,
      services,
      startingPrice,
    } = req.body;

    // Check if user already exists
    if (!['customer', 'provider'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Only customer and provider accounts can register' });
    }

    const selectedArea = getHyderabadArea(area);
    if (!selectedArea) {
      return res.status(400).json({ success: false, message: 'Choose a valid Hyderabad area' });
    }

    const existingUser = await User.findOne({ email: String(email || '').trim().toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role,
      address: `${String(address || '').trim()}${address ? ', ' : ''}${selectedArea.name}, Hyderabad`,
      city: 'Hyderabad',
      area: selectedArea.name,
      pincode: selectedArea.pincode,
    });

    // If role is provider, create Provider profile
    if (user.role === 'provider') {
      const lat = latitude === undefined ? selectedArea.lat : Number(latitude);
      const lng = longitude === undefined ? selectedArea.lng : Number(longitude);
      if (!isWithinHyderabad(lat, lng)) {
        await User.deleteOne({ _id: user._id });
        return res.status(400).json({ success: false, message: 'Provider location must be within Hyderabad' });
      }

      try {
        await Provider.create({
          userId: user._id,
          businessName: businessName || name + ' Auto Services',
          ownerName: ownerName || name,
          description: businessDescription || 'Professional car care, repair and rental services.',
          phone: phone || '',
          address: `${String(address || '').trim()}${address ? ', ' : ''}${selectedArea.name}, Hyderabad`,
          city: 'Hyderabad',
          area: selectedArea.name,
          pincode: selectedArea.pincode,
          latitude: lat,
          longitude: lng,
          services: Array.isArray(services) && services.length > 0 ? services : ['Car Mechanic', 'Car Washing'],
          startingPrice: startingPrice ? Number(startingPrice) : 499,
          verified: 'pending',
        });
      } catch (providerError) {
        await User.deleteOne({ _id: user._id });
        throw providerError;
      }
    }

    await sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login user (Customer, Provider, Admin)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact support.' });
    }

    await sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user & profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let providerData = null;
    if (user.role === 'provider') {
      providerData = await Provider.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        city: user.city,
        area: user.area,
        pincode: user.pincode,
        isActive: user.isActive,
        createdAt: user.createdAt,
        provider: providerData,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      area: req.body.area,
      pincode: req.body.pincode,
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach((key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]);

    if (fieldsToUpdate.city && fieldsToUpdate.city !== 'Hyderabad') {
      return res.status(400).json({ success: false, message: 'CarCare Connect currently serves Hyderabad only' });
    }
    fieldsToUpdate.city = 'Hyderabad';
    const selectedArea = getHyderabadArea(fieldsToUpdate.area || req.user.area || 'HITEC City');
    if (!selectedArea) return res.status(400).json({ success: false, message: 'Choose a valid Hyderabad area' });
    fieldsToUpdate.area = selectedArea.name;
    fieldsToUpdate.pincode = selectedArea.pincode;
    if (fieldsToUpdate.address !== undefined && !fieldsToUpdate.address.toLowerCase().includes(selectedArea.name.toLowerCase())) {
      fieldsToUpdate.address = `${fieldsToUpdate.address}, ${selectedArea.name}, Hyderabad`;
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
