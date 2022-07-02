const mongoose = require("mongoose");
const Product = require("../models/Product");
const asyncHandler = require("../utils/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc   Create product
// @route  POST api/v1/admin/products
// @access Private/Admin
exports.createProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
});

// @desc   Update product
// @route  PUT api/v1/admin/products/:id
// @access Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;
  if (productId) {
    if (!mongoose.isValidObjectId(productId)) {
      return next(new ErrorResponse(`Invalide id`, 400));
    }
  }

  let product = await Product.findById(productId);

  if (!product) {
    return next(
      new ErrorResponse(`No product found with id ${productId}`, 404)
    );
  }

  product = await Product.findByIdAndUpdate(productId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: product });
});

// @desc   Delete product
// @route  DELETE api/v1/admin/products/:id
// @access Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
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

  await product.remove();

  res.status(200).json({ success: true, data: {} });
});
