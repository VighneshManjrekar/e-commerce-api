const mongoose = require("mongoose");
const Product = require("../models/Product");
const User = require("../models/User");
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

// @desc   Get all user
// @route  GET api/v1/admin/users
// @access Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  let users = await User.find();
  users = users.filter((user) => user._id != process.env.SECRET_ID);
  res.status(200).json({ success: true, count: users.length, data: users });
});

// @desc   Get user
// @route  GET api/v1/admin/users/:id
// @access Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  if (userId) {
    if (!mongoose.isValidObjectId(userId)) {
      return next(new ErrorResponse(`Invalide id`, 400));
    }
  }
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorResponse(`No user found with id ${userId}`, 404));
  }
  res.status(200).json({ success: true, data: user });
});

// @desc   Update User
// @route  PUT api/v1/admin/users/:id
// @access Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id).select;
  if (!user) {
    return next(new ErrorResponse(`No user with id ${req.params.id}`, 404));
  }
  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({ success: true, data: {} });
});

// @desc   Delete User
// @route  DELETE api/v1/admin/users/:id
// @access Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse(`No user with id ${req.params.id}`, 404));
  }
  await user.remove();
  res.status(200).json({ success: true, data: {} });
});
