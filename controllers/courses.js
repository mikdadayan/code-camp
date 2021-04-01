const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/async");
const Course = require("../models/Course");

// @desc  Get all Courses
// @route GET /api/v1/courses
// @access Public
const getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.codecampId) {
    query = Course.find({ codecamp: req.params.codecampId });
  } else {
    query = Course.find().populate({
      path: "codecamp",
      select: "name description",
    });
  }

  const courses = await query;

  res.status(200).json({ success: true, count: courses.length, data: courses });
});

module.exports = { getCourses };
