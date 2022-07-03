const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  const authToken = req.headers.authorization;
  if (authToken && authToken.startsWith("Bearer")) {
    token = authToken.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse("Not Authorized", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
});

exports.authorization = (req, res, next) => {
  if (
    req.user.role != "admin" &&
    req.user._id.toString() != process.env.SECRET_ID
  ) {
    return next(
      new ErrorResponse("Access to this route for users is forbidden", 403)
    );
  }
  next();
};
