const express = require("express");

const router = express.Router({ mergeParams: true });

const Review = require("../models/Review");
const advacncedResults = require("../middlewares/advacncedResults");
const { protect, authorize } = require("../middlewares/auth");

const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviews");

router
  .route("/")
  .get(
    advacncedResults(Review, {
      path: "codecamp",
      select: "name description",
    }),
    getReviews
  )
  .post(protect, authorize("user", "admin"), createReview);

router
  .route("/:id")
  .get(getReview)
  .delete(protect, authorize("admin", "user"), deleteReview)
  .put(protect, authorize("admin", "user"), updateReview);

module.exports = router;
