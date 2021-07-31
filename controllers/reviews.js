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

// @desc  Get single review
// @route GET /api/v1/reviews/:id
// @access Public
const getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "Codecamp",
    select: "name description",
  });

  if (!review) {
    return next(
      new ErrorResponse(`No review found with th id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: review });
});

// @desc  Creatae a review
// @route POST /api/v1/codecamps/:codecampId/reviews
// @access Private
const createReview = asyncHandler(async (req, res, next) => {
  req.body.codecamp = req.params.codecampId;
  req.body.user = req.user.id;
  const codecamp = await CodeCamp.findById(req.params.codecampId);

  if (!codecamp) {
    return next(
      new ErrorResponse(
        `Codecamp with the id of ${req.params.codecampId} not found.`,
        404
      )
    );
  }

  const review = await Review.create(req.body);
  res.status(201).json({ success: true, data: review });
});

module.exports = { getReviews, getReview, createReview };
