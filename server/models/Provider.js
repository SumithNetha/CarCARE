const mongoose = require('mongoose');
const { HYDERABAD_AREAS } = require('../utils/geoUtils');

const ProviderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    businessName: {
      type: String,
      required: [true, 'Please provide business name'],
      trim: true,
    },
    ownerName: {
      type: String,
      required: [true, 'Please provide owner name'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      required: [true, 'Please provide contact phone'],
    },
    address: {
      type: String,
      required: [true, 'Please provide business address'],
    },
    city: {
      type: String,
      enum: ['Hyderabad'],
      default: 'Hyderabad',
      required: [true, 'Please provide city'],
      trim: true,
    },
    area: {
      type: String,
      enum: HYDERABAD_AREAS.map((area) => area.name),
      required: [true, 'Please provide a Hyderabad area'],
      default: 'HITEC City',
    },
    pincode: {
      type: String,
      required: [true, 'Please provide pincode'],
      trim: true,
    },
    latitude: {
      type: Number,
      required: [true, 'Please provide latitude'],
    },
    longitude: {
      type: Number,
      required: [true, 'Please provide longitude'],
    },
    services: {
      type: [String],
      enum: ['Car Rental', 'Car Mechanic', 'Car Washing'],
      default: ['Car Mechanic'],
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    verified: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    },
    startingPrice: {
      type: Number,
      default: 499,
    },
    workingDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    workingHours: {
      open: { type: String, default: '09:00 AM' },
      close: { type: String, default: '07:00 PM' },
    },
    availableTimeSlots: {
      type: [String],
      default: ['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '03:30 PM', '05:00 PM'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Provider', ProviderSchema);
