require("dotenv").config({ path: "./configs/.env" });
require("colors");

const path = require("path");
const fs = require("fs");

const mongoose = require("mongoose");

// connect db
mongoose.connect(process.env.MONGO);

const User = require("./models/User");
const Product = require("./models/Product");
const Review = require("./models/Review");

const userData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "users.json"))
);
const productData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "products.json"))
);
const reviewData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "reviews.json"))
);

const importData = async () => {
  try {
    await User.create(userData);
    await Product.create(productData);
    await Review.create(reviewData);
    console.log("Data Imported".bgGreen);
  } catch (error) {
    console.error(`${error}`.bgRed);
  }
  process.exit(0);
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();
    console.log("Data deleted".bgYellow);
  } catch (error) {
    console.error(`${error}`.bgRed);
  }
  process.exit(0);
};

if (process.argv[2] == "-i") {
  importData();
} else if (process.argv[2] == "-d") {
  deleteData();
}
