const router = require("express").Router();

const {
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/admin");

router.route("/").post(createProduct);
router.route("/:id").put(updateProduct).delete(deleteProduct);

module.exports = router;
