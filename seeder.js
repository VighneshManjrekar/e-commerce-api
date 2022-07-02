require("dotenv").config({ path: "./configs/.env" });
require("colors");

const path = require("path");
const fs = require("fs");

const mongoose = require("mongoose");

// connect db
mongoose.connect(process.env.MONGO);

const Product = require("./models/Product");

const productData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "products.json"))
);

const importData = async () => {
  try {
    await Product.create(productData);
    console.log("Data Imported".bgGreen);
  } catch (error) {
    console.error(`${error}`.bgRed);
  }
  process.exit(0);
};

const deleteData = async () => {
  try {
    await Product.deleteMany();
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
