// routes/upload.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const sendTelegramAlert = require("../utils/sendTelegramAlert");
const Upload = require("../models/Upload"); // Import your Mongoose model

// Configure Cloudinary (use environment variables for production)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Setup multer for Cloudinary uploads
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "proof_screenshots", // Folder name in your Cloudinary account
    format: async (req, file) => 'png', // supports promises as well
    public_id: (req, file) => `screenshot-${Date.now()}-${file.originalname.split('.')[0]}`,
  },
});

const upload = multer({ storage: storage });

// POST /api/upload-proof
router.post("/upload-proof", upload.single("screenshot"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No screenshot file uploaded." });
    }

    const wallet = req.body.wallet;
    const method = req.body.method;
    const cloudinaryUrl = req.file.path; // Cloudinary provides the URL in req.file.path

    // Basic validation
    if (!wallet || !method) {
        return res.status(400).json({ error: "Missing wallet or method." });
    }

    // Save upload info to MongoDB
    const entry = await Upload.create({
      wallet,
      method,
      filePath: cloudinaryUrl, // Save the Cloudinary URL
      status: "pending"
    });

    // Send Telegram alert
    await sendTelegramAlert(wallet, method, cloudinaryUrl); // Pass the Cloudinary URL

    console.log("Screenshot uploaded to Cloudinary:", cloudinaryUrl);
    res.status(200).json({ status: "ok", filePath: cloudinaryUrl, uploadId: entry._id });

  } catch (err) {
    console.error("Error during upload-proof:", err);
    res.status(500).json({ error: "Failed to process upload.", details: err.message });
  }
});

// Optional: Add a route to get all uploads from MongoDB (for testing/admin)
router.get("/uploads", async (req, res) => {
  try {
    const uploads = await Upload.find({}).sort({ createdAt: -1 });
    res.status(200).json(uploads);
  } catch (err) {
    console.error("Error fetching uploads:", err);
    res.status(500).json({ error: "Failed to fetch uploads.", details: err.message });
  }
});

module.exports = router;