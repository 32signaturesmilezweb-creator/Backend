const express = require("express");
const router = express.Router();
const multer = require("multer");
const Gallery = require("../models/Gallery");
const { storage, cloudinary } = require("../config/cloudinary");

const upload = multer({ storage });

// Get all gallery images (Public)
router.get("/", async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching gallery" });
  }
});

// Upload a new gallery image (Admin)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image provided" });
    }

    // req.file.path is the secure_url from cloudinary
    // req.file.filename is the public_id from cloudinary
    const newImage = new Gallery({
      imageUrl: req.file.path,
      publicId: req.file.filename,
    });

    const savedImage = await newImage.save();
    res.status(201).json(savedImage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error uploading image" });
  }
});

// Delete a gallery image (Admin)
router.delete("/:id", async (req, res) => {
  try {
    const imageId = req.params.id;
    const image = await Gallery.findById(imageId);
    
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete image from Cloudinary if publicId exists
    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId);
    }

    // Delete from DB
    await Gallery.findByIdAndDelete(imageId);

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error deleting image" });
  }
});

module.exports = router;
