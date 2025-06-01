// routes/admin.js
const express = require("express");
const router = express.Router();
const Upload = require("../models/Upload"); // Import your Mongoose Upload model

// Get all uploads
router.get("/uploads", async (req, res) => {
  try {
    // Fetch all uploads from MongoDB, sorted by creation date (descending)
    const uploads = await Upload.find({}).sort({ createdAt: -1 });
    res.status(200).json(uploads);
  } catch (err) {
    console.error("Error fetching all uploads:", err);
    res.status(500).json({ error: "Failed to retrieve uploads.", details: err.message });
  }
});

// Update status
router.post("/uploads/:id/status", async (req, res) => {
  const { status } = req.body;
  const id = req.params.id; // Mongoose IDs are strings, no need for parseInt

  try {
    // Prepare update object
    const updateFields = { status };

    // If marked as 'received', also set conversionStatus
    if (status === "received") {
      updateFields.conversionStatus = "in_progress";
      // Optionally, set conversionStart to current time if it's being marked received
      // updateFields.conversionStart = Date.now();
    }

    // Find the upload by ID and update its fields
    // { new: true } returns the updated document
    const updatedUpload = await Upload.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedUpload) {
      // If no document was found with that ID
      return res.status(404).json({ error: "Upload not found." });
    }

    // Send back the updated document (or just a success message)
    res.status(200).json({ success: true, upload: updatedUpload });

  } catch (err) {
    console.error(`Error updating upload status for ID ${id}:`, err);
    // Handle potential Mongoose CastError if ID format is wrong
    if (err.name === 'CastError') {
      return res.status(400).json({ error: "Invalid upload ID format." });
    }
    res.status(500).json({ error: "Failed to update upload status.", details: err.message });
  }
});

module.exports = router;