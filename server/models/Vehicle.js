const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    brand: {
      type: String,
      required: [true, 'Please provide car brand'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Please provide car model'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Please provide manufacturing year'],
      min: 1980,
      max: new Date().getFullYear() + 1,
    },
    registrationNumber: {
      type: String,
      required: [true, 'Please provide registration number'],
      uppercase: true,
      trim: true,
    },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'],
      required: [true, 'Please specify fuel type'],
    },
    color: {
      type: String,
      required: [true, 'Please provide vehicle color'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Vehicle', VehicleSchema);
