const router = require("express").Router();

const {
  createProduct,
  updateProduct,
  deleteProduct,
  updateUser,
  deleteUser,
  getUsers,
  getUser,
} = require("../controllers/admin");

// Auth middleware
const { protect, authorization } = require("../middlewares/auth");

router.use(protect, authorization);

router.post("/products", createProduct);
router.route("/products/:id").put(updateProduct).delete(deleteProduct);

router.get("/users", getUsers);
router.route("/users/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
