require("dotenv").config(); // Keep this for local development
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // Import the DB connection
const app = express();

const swapRoutes = require("./routes/swap");
const uploadRoutes = require("./routes/upload");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Remove this line for production. Files will be served from Cloudinary.
// app.use("/uploads", express.static("uploads"));

app.use("/api", swapRoutes);
app.use("/api", uploadRoutes); // This will handle the /upload-proof endpoint
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));