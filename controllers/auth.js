const mongoose = require("mongoose");
const User = require("../models/User");
const asyncHandler = require("../utils/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc   Register user
// @route  POST api/v1/auth/rgister
// @access Pubilc
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  res.status(201).json({ success: true, data: user });
});

// @desc   Login user
// @route  POST api/v1/auth/login
// @access Pubilc
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse(`Please provide email and password`, 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    return next(new ErrorResponse(`Invalid credentials`, 401));
  }

  res.status(200).json({ success: true, data: user });
});
