const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Gallery", gallerySchema);
