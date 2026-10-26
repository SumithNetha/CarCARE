const Vehicle = require('../models/Vehicle');

// @desc    Get all vehicles for current customer (or all if admin)
// @route   GET /api/vehicles
// @access  Private
exports.getVehicles = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'customer') {
      query.customerId = req.user.id;
    }

    const vehicles = await Vehicle.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Private
exports.getVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Check ownership
    if (req.user.role === 'customer' && vehicle.customerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this vehicle' });
    }

    res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add a new vehicle
// @route   POST /api/vehicles
// @access  Private (Customer)
exports.addVehicle = async (req, res, next) => {
  try {
    const { brand, model, year, registrationNumber, fuelType, color } = req.body;

    if (!brand || !model || !year || typeof registrationNumber !== 'string' || !registrationNumber.trim() || !fuelType || !color) {
      return res.status(400).json({ success: false, message: 'Please provide all required vehicle fields' });
    }

    const vehicle = await Vehicle.create({
      customerId: req.user.id,
      brand,
      model,
      year: Number(year),
      registrationNumber: registrationNumber.toUpperCase().trim(),
      fuelType,
      color,
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle added successfully',
      data: vehicle,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Private
exports.updateVehicle = async (req, res, next) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    if (req.user.role === 'customer' && vehicle.customerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this vehicle' });
    }

    const allowedFields = ['brand', 'model', 'year', 'registrationNumber', 'fuelType', 'color'];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowedFields.includes(key)));
    if (updates.registrationNumber !== undefined) {
      if (typeof updates.registrationNumber !== 'string') {
        return res.status(400).json({ success: false, message: 'Registration number must be text' });
      }
      updates.registrationNumber = updates.registrationNumber.toUpperCase().trim();
    }
    vehicle = await Vehicle.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      data: vehicle,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private
exports.deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    if (req.user.role === 'customer' && vehicle.customerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this vehicle' });
    }

    await vehicle.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Vehicle removed successfully',
    });
  } catch (err) {
    next(err);
  }
};
