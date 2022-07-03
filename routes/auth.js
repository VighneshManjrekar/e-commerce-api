const router = require("express").Router();

const { register, login, getMe } = require("../controllers/auth");

// Auth middleware
const { protect } = require("../middlewares/auth");

router.get("/me", protect, getMe);
router.post("/register", register);
router.post("/login", login);

module.exports = router;
