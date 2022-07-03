const mongoose = require("mongoose");
const User = require("../models/User");
const asyncHandler = require("../utils/async");
const ErrorResponse = require("../utils/errorResponse");

const sendToken = (user, statusCode, res) => {
  const token = user.signToken();
  const secure = process.env.NODE_ENV == "production" ? true : false;
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure,
  };
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};

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

  sendToken(user, 200, res);
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

  sendToken(user, 200, res);
});

// @desc   Get me
// @route  GET api/v1/auth/me
// @access Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(201).json({ success: true, data: user });
});
