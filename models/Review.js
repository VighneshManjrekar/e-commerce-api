const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter title"],
    maxLength: [50, "Title must be less than 50 characters"],
    trim: true,
  },
  text: {
    type: String,
    required: [true, "Please enter your review in detail"],
    maxLength: [500, "Review must be less than 500 characters"],
  },
  rating: {
    type: Number,
    max: [5, "Provide rating between 1-5"],
    min: [1, "Provide rating between 1-5"],
    required: [true, "Please enter rating"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Prevent user from submitting more than one review per product
// ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.getAvgRating = async function (productId) {
  const object = await this.aggregate([
    { $match: { product: productId } },
    { $group: { _id: "$product", averageRating: { $avg: "$rating" } } },
  ]);
  const averageRating = object[0]
    ? object[0].averageRating.toFixed(1)
    : undefined;
  try {
    await this.model("Product").findByIdAndUpdate(productId, { averageRating });
  } catch (err) {
    console.log(err);
  }
};

// update average rating after save
ReviewSchema.post("save", async (doc) => {
  await doc.constructor.getAvgRating(doc.product);
});

// update average rating after remove
ReviewSchema.post("remove", async (doc) => {
  await doc.constructor.getAvgRating(doc.product);
});

// update average rating after update
ReviewSchema.post("findOneAndUpdate", async function (doc) {
  if (this.rating != doc.rating) {
    await doc.constructor.getAvgRating(doc.product);
  }
});

module.exports = mongoose.model("Review", ReviewSchema);
