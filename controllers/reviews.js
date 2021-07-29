const asyncHandler = require("../middlewares/async");
const CodeCamp = require("../models/CodeCamp");
const Review = require("../models/Review");
const ErrorResponse = require("../utils/errorResponse");

// @desc  Get all reviews
// @route GET /api/v1/reviews
// @route GET /api/v1/codecamps/:codecampId/reviews
// @access Public
const getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.codecampId) {
    const reviews = await Review.find({ codecamp: req.params.codecampId });
    return res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  } else {
    console.log(res.advacedResults);
    res.status(200).json(res.advancedResults);
  }
});

module.exports = { getReviews };
