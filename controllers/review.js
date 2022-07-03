const mongoose = require("mongoose");
const Review = require("../models/Review");
const Product = require("../models/Product");
const asyncHandler = require("../utils/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc   Get all reviews
// @route  GET api/v1/reviews
// @route  GET api/v1/products/:productId/reviews
// @access Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.productId) {
    query = Review.find({ product: req.params.productId });
  } else {
    query = Review.find();
  }
  query = query
    .populate({
      path: "product",
      select: "title",
    })
    .populate({
      path: "user",
      select: "name",
    });
  const reviews = await query;
  res.status(200).json({ success: true, count: reviews.length, data: reviews });
});

// @desc   Get single review
// @route  GET api/v1/reviews/:reviewId
// @access Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId)
    .populate({
      path: "product",
      select: "title",
    })
    .populate({
      path: "user",
      select: "name",
    });
  if (!review) {
    return next(
      new ErrorResponse(`No review with id ${req.params.reviewId} found`, 404)
    );
  }

  res.status(200).json({ success: true, data: review });
});

// @desc   Post review
// @route  POST api/v1/products/:productId/reviews
// @access Private
exports.postReview = asyncHandler(async (req, res, next) => {
  const { title, text, rating } = req.body;
  const product = req.params.productId;
  const user = req.user.id;
  const isProduct = await Product.findById(product);
  if (!isProduct) {
    return next(new ErrorResponse(`No product found with id ${product}`, 404));
  }
  const review = await Review.create({ title, text, rating, product, user });
  res.status(200).json({ success: true, data: review });
});

// @desc   Update review
// @route  PUT api/v1/products/:productId/reviews/:reviewId
// @access Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  const reviewId = req.params.reviewId;
  let review = await Review.findById(reviewId);

  // remove product and user from req.body if exists
  const removeFields = ["user", "product"];
  removeFields.forEach((field) => delete req.body[field]);

  if (!review) {
    return next(new ErrorResponse(`No review found with id ${reviewId}`));
  }
  if (review.user.toString() != req.user.id && req.user.role != "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update review ${review.id}`
      )
    );
  }
  review = await Review.findByIdAndUpdate(reviewId, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: review });
});

// @desc   Delete review
// @route  DELETE api/v1/products/:productId/reviews/:reviewId
// @access Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const reviewId = req.params.reviewId;
  const review = await Review.findById(reviewId);
  if (!review) {
    return next(new ErrorResponse(`No review found with id ${reviewId}`));
  }
  if (review.user.toString() != req.user.id && req.user.role != "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update review ${review._id}`
      )
    );
  }
  await review.remove();
  res.status(200).json({ success: true, data: {} });
});
