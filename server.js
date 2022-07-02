require("dotenv").config({ path: "./configs/.env" });
require("colors");

// Packages
const express = require("express");

// Import DB
const connectDB = require("./configs/db");

// Import erro handler
const errorHandler = require("./middleware/error");

// Import Routes
const product = require("./routes/product");
const admin = require("./routes/admin");

const PORT = process.env.PORT || 7000;

const app = express();

// Parse json
app.use(express.json());

// Mount routers
app.use("/api/v1/products", product);
app.use("/api/v1/admin/products", admin);
app.use(errorHandler);

// Create server
const server = app.listen(PORT, () => {
  console.log(
    `Server Running On ${PORT} in ${process.env.NODE_ENV} mode`.bgMagenta
  );
  connectDB();
});

// Handle promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Err: ${err.message}`.bgRed);
  server.close(() => process.exit(1));
});
