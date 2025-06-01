const mongoose = require('mongoose');

const uploadSchema = mongoose.Schema(
  {
    wallet: {
      type: String,
      required: [true, 'Please add a wallet address'],
    },
    method: {
      type: String,
      required: [true, 'Please add a method'],
    },
    filePath: { // This will now store the Cloudinary URL
      type: String,
      required: [true, 'Please add a file path'],
    },
    status: {
      type: String,
      enum: ['pending', 'received', 'processing', 'completed', 'failed'], // Example statuses
      default: 'pending',
    },
    conversionStatus: { // Added based on your uploads.json example
      type: String,
      enum: ['pending', 'in_progress', 'delayed', 'completed', 'failed'],
      default: 'pending',
    },
    conversionStart: { // Added based on your uploads.json example
      type: Number,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

module.exports = mongoose.model('Upload', uploadSchema);