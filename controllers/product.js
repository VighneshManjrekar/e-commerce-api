const mongoose = require("mongoose");
const Product = require("../models/Product");
const asyncHandler = require("../utils/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc   Get all products
// @route  GET api/v1/products
// @access Pubilc
exports.getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();
  res
    .status(200)
    .json({ success: true, count: products.length, data: products });
});

// @desc   Get single product
// @route  GET api/v1/products/:id
// @access Pubilc
exports.getProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;
  if (productId) {
    if (!mongoose.isValidObjectId(productId)) {
      return next(new ErrorResponse(`Invalide id`, 400));
    }
  }

  const product = await Product.findById(productId);

  if (!product) {
    return next(
      new ErrorResponse(`No product found with id ${productId}`, 404)
    );
  }

  res.status(200).json({ success: true, data: product });
});