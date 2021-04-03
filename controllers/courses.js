const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/async");
const CodeCamp = require("../models/CodeCamp");
const Course = require("../models/Course");
const ErrorResponse = require("../utils/errorResponse");

// @desc  Get all Courses
// @route GET /api/v1/courses
// @route GET /api/v1/codecamps/:codecampId/courses
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

// @desc  Get a Single Courses
// @route GET /api/v1/courses/:id
// @access Public
const getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "codecamp",
    select: "name  description",
  });

  if (!course) {
    return next(
      new ErrorResponse(`No Course with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: course });
});

// @desc  Add course
// @route POST  /api/v1/codecamps/codecampsId/courses
// @access Private
const addCourse = asyncHandler(async (req, res, next) => {
  req.body.codecamp = req.params.codecampId;

  const codecamp = await CodeCamp.findById(req.params.codecampId);

  if (!codecamp) {
    return next(
      new ErrorResponse(
        `No Course with the id of ${req.params.codecampId}`,
        404
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({ success: true, data: course });
});

// @desc  Update course
// @route PUT  /api/v1/courses/:id
// @access Private
const updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No Course with the id of ${req.params.id}`, 404)
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: course });
});

// @desc  Delete course
// @route Delete /api/v1/courses/:id
// @access Private
const deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No Course with the id of ${req.params.id}`, 404)
    );
  }

  await course.remove();

  res.status(200).json({ success: true, data: {} });
});

module.exports = {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
};
