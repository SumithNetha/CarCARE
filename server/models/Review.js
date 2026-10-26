const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider',
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Static method to recalculate average rating for a provider
ReviewSchema.statics.getAverageRating = async function (providerId) {
  const stats = await this.aggregate([
    {
      $match: { providerId: new mongoose.Types.ObjectId(providerId) },
    },
    {
      $group: {
        _id: '$providerId',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  try {
    if (stats.length > 0) {
      await mongoose.model('Provider').findByIdAndUpdate(providerId, {
        rating: Math.round(stats[0].averageRating * 10) / 10,
        reviewCount: stats[0].reviewCount,
      });
    } else {
      await mongoose.model('Provider').findByIdAndUpdate(providerId, {
        rating: 5.0,
        reviewCount: 0,
      });
    }
  } catch (err) {
    console.error('Error updating provider rating:', err);
  }
};

// Call getAverageRating after save
ReviewSchema.post('save', async function () {
  await this.constructor.getAverageRating(this.providerId);
});

// Call getAverageRating after remove / delete
ReviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.getAverageRating(doc.providerId);
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
