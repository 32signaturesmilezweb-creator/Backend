const express = require("express");
const router = express.Router();
const multer = require("multer");
const Review = require("../models/Review");
const { storage, cloudinary } = require("../config/cloudinary");

const upload = multer({ storage });

// Create a new review (Public)
router.post("/", upload.single("reviewerImage"), async (req, res) => {
  try {
    const { reviewerName, rating, text } = req.body;
    let reviewerImage = null;
    let publicId = null;

    if (req.file) {
      reviewerImage = req.file.path;
      publicId = req.file.filename;
    }

    const newReview = new Review({
      reviewerName,
      rating: Number(rating),
      text,
      reviewerImage,
      publicId,
      status: 'pending', // Implicitly set by default, but good to be explicit
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server error creating review" });
  }
});

// Get all approved reviews (Public)
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching approved reviews:", error);
    res.status(500).json({ message: "Server error fetching reviews" });
  }
});

// Get all reviews (Admin protected route in practice, but placed here for simplicity to integrate with frontend JWT if needed)
router.get("/admin", async (req, res) => {
  // Ideally this would have an auth middleware
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    res.status(500).json({ message: "Server error fetching reviews" });
  }
});

// Update review status (Admin)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (error) {
    console.error("Error updating review status:", error);
    res.status(500).json({ message: "Server error updating review" });
  }
});

// Delete a review (Admin)
router.delete("/:id", async (req, res) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Delete image from Cloudinary if publicId exists
    if (review.publicId) {
      await cloudinary.uploader.destroy(review.publicId);
    }

    // Delete from DB
    await Review.findByIdAndDelete(reviewId);

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error deleting review" });
  }
});

module.exports = router;
