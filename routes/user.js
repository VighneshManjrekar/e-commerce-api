const router = require("express").Router();

const { addToCart, getCart, removeFromCart } = require("../controllers/user");

// Auth middleware
const { protect } = require("../middlewares/auth");

router.get("/cart", protect, getCart);
router
  .route("/cart/:id")
  .post(protect, addToCart)
  .delete(protect, removeFromCart);

module.exports = router;
