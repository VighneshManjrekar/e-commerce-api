const router = require("express").Router();

const {
  addToCart,
  getCart,
  removeFromCart,
  postOrder,
  getOrder,
} = require("../controllers/user");

// Auth middleware
const { protect } = require("../middlewares/auth");

router.get("/cart", protect, getCart);
router
  .route("/cart/:id")
  .post(protect, addToCart)
  .delete(protect, removeFromCart);

router.route("/order").get(protect, getOrder).post(protect, postOrder);

module.exports = router;
