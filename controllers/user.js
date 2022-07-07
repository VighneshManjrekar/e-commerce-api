const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
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
  await req.user.removeCartItem(req.params.id);
  res.status(200).json({ success: true, data: req.user });
});

// @desc   Post order
// @route  POST api/v1/users/order
// @access Private
exports.postOrder = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: "cart.items.productId",
    select: "price",
  });
  let total = 0;
  const items = user.cart.items.map((item) => {
    total += item.productId.price * item.quantity;
    return {
      product: {
        productId: item.productId._id,
        price: item.productId.price,
      },
      quantity: item.quantity,
    };
  });

  const order = await Order.create({ user: req.user.id, items, total });

  if (!order) {
    return next(new ErrorResponse(`Order not placed`, 500));
  }
  await user.clearCartItems();
  res.status(200).json({ success: true, data: order });
});

// @desc   Get orders
// @route  GET api/v1/users/order
// @access Private
exports.getOrder = asyncHandler(async (req, res, next) => {
  const user = await Order.find({ user: req.user.id })
    .populate({
      path: "items.product.productId",
      select: "title description averageRating thumbnail",
    })
    .populate({ path: "user", select: "name email profile" });

  res.status(200).json({ success: true, count: user.length, data: user });
});
