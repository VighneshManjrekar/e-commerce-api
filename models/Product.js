const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  title: {
    type: String,
    unique: [true, "Title already exsitst"],
    trim: true,
    maxlength: [50, "Title length cannot be more than 50 characters"],
    required: [true, "Please enter title"],
  },
  description: {
    type: String,
    required: [true, "Please enter description"],
    maxlength: [500, "Description cannot be more than 500 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please enter price"],
  },
  stock: {
    type: String,
    enum: ["InStock", "OutOfStock"],
    default: "InStock",
  },
  rating: {
    type: Number,
    min: [1, "Rating must be between 1-5"],
    max: [5, "Rating must be between 1-5"],
  },
  thumbnail: {
    type: String,
    default: "no-photo.jpg",
  },
  images: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
