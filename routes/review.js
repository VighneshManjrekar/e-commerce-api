const router = require("express").Router({ mergeParams: true });

const {
  getReviews,
  getReview,
  postReview,
  updateReview,
  deleteReview,
} = require("../controllers/review");

const { protect } = require("../middlewares/auth");

router.route("/").get(getReviews).post(protect, postReview);

router
  .route("/:reviewId")
  .get(getReview)
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
