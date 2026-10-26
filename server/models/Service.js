const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider',
      required: true,
    },
    category: {
      type: String,
      enum: ['Car Rental', 'Car Mechanic', 'Car Washing'],
      required: [true, 'Please specify service category'],
    },
    serviceName: {
      type: String,
      required: [true, 'Please provide service name'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Please provide service price'],
      min: 0,
    },
    duration: {
      type: String,
      default: '1-2 hours',
    },
    availability: {
      type: Boolean,
      default: true,
    },
    features: {
      type: [String],
      default: [],
    },
    vehicleType: {
      type: String,
      default: 'All Vehicles',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Service', ServiceSchema);
