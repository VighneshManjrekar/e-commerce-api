const User = require("../models/User");
const Product = require("../models/Product");
const asyncHandler = require("../utils/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc   Get cart
// @route  GET api/v1/users/cart
// @access Private
exports.getCart = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate({
    path: "cart.items.productId",
    select: "title price stock rating thumbnail",
  });
  res.status(200).json({ success: true, data: user });
});

// @desc   Add to cart
// @route  POST api/v1/users/cart/:id
// @access Private
exports.addToCart = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  const user = await req.user.addToCart(product);
  res.status(201).json({ success: true, data: user });
});

// @desc   Delete from cart
// @route  DELETE api/v1/users/cart/:id
// @access Private
exports.removeFromCart = asyncHandler(async (req, res, next) => {
  const productId = req.user.cart.items.findIndex(
    (product) => product.productId == req.params.id
  );
  if (productId < 0) {
    return next(
      new ErrorResponse(`Product ${req.params.id} not found in cart.`, 404)
    );
  }

  console.log("before", req.user.cart);

  await req.user.removeCartItem(req.params.id);

  console.log("after", req.user.cart);

  // const user = await req.user.removeCartItem(product);

  res.status(200).json({ success: true, data: req.user });
});
