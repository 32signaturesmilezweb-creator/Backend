const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  reviewerName: {
    type: String,
    required: true,
  },
  reviewerImage: {
    type: String, 
  },
  publicId: {
    type: String,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  text: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Review", reviewSchema);
