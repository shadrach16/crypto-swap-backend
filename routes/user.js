// routes/status.js
const express = require("express");
const router = express.Router();
const Upload = require("../models/Upload"); // Import your Mongoose Upload model

router.get("/:wallet/status", async (req, res) => {
  const wallet = req.params.wallet;

  try {
    // Find the relevant upload in MongoDB
    // Assuming you want the most recent 'received' upload for the wallet
    const userUpload = await Upload.findOne({ wallet: wallet }).sort({ createdAt: -1 });

    if (!userUpload) {
      // If no matching upload is found, send an empty object
      return res.status(200).json({});
    }

    // Simulate 5-minute wait
    const delay = 5 * 60 * 1000; // 5 minutes in milliseconds
    const now = Date.now();

    // Use conversionStart from the database, or set it if it's the first check
    const conversionStart = userUpload.conversionStart || now;

    let conversionStatus = "in_progress";
    if (now - conversionStart > delay) {
      conversionStatus = "delayed";
    }

    // Update the document in MongoDB if conversionStart or conversionStatus changed
    if (userUpload.conversionStart !== conversionStart || userUpload.conversionStatus !== conversionStatus) {
      userUpload.conversionStart = conversionStart;
      userUpload.conversionStatus = conversionStatus;
      await userUpload.save(); // Save the updated document back to MongoDB
    }

    // Send the conversion status
    res.status(200).json({ conversionStatus });

  } catch (err) {
    console.error("Error fetching or updating upload status:", err);
    // Send a 500 Internal Server Error response if something goes wrong
    res.status(500).json({ error: "Failed to fetch or update conversion status.", details: err.message });
  }
});

module.exports = router;