const router = require("express").Router();

const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword
} = require("../controllers/auth");

// Auth middleware
const { protect } = require("../middlewares/auth");

router.get("/me", protect, getMe);
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
