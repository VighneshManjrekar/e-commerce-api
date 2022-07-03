const router = require("express").Router();

const { getProducts, getProduct } = require("../controllers/product");

const reviewRoutes = require("./review");

router.use("/:productId/reviews", reviewRoutes);

router.route("/").get(getProducts);
router.route("/:id").get(getProduct);

module.exports = router;
