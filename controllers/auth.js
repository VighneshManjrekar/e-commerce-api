const crypto = require("crypto");
const User = require("../models/User");
const asyncHandler = require("../utils/async");
const ErrorResponse = require("../utils/errorResponse");
const sendResetToken = require("../utils/mail");

// helper function
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

// @desc   Forgot password
// @route  POST api/v1/auth/forgot-password
// @access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorResponse(`No user found with ${email} email`, 404));
  }

  const resetToken = user.createHashToken();

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/auth/reset-password/${resetToken}`;
  const text = `
  Hi ${user.name},
  You recently requested to reset the password for your DevCamper account. Follow this link to proceed:
  ${resetUrl}.

  Thanks, Team rocket 🚀
  `;
  const options = {
    to: email,
    subject: "Reset password",
    text,
  };

  // send mail
  try {
    await sendResetToken(options);
    await user.save({ validateBeforeSave: true });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordDate = undefined;
    await user.save();
    return next(new ErrorResponse("Email not sent", 500));
  }
  res.status(201).json({ success: true, data: "Email sent" });
});

// @desc   Reset password
// @route  POST api/v1/auth/reset-password/:token
// @access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { password } = req.body;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  let user = await User.findOne({
    resetPasswordToken,
    resetPasswordDate: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordDate = undefined;

  user = await user.save();

  sendToken(user, 200, res);
});
