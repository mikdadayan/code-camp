const asyncHandler = require("../middlewares/async");
const CodeCamp = require("../models/CodeCamp");
const Course = require("../models/Course");
const ErrorResponse = require("../utils/errorResponse");

// @desc  Get all Courses
// @route GET /api/v1/courses
// @route GET /api/v1/codecamps/:codecampId/courses
// @access Public
const getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.codecampId) {
    const courses = await Course.find({ codecamp: req.params.codecampId });
    return res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  } else {
    res.status(200).json(res.advancedResults);
  }
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
// @route POST  /api/v1/codecamps/:codecampId/courses
// @access Private
const addCourse = asyncHandler(async (req, res, next) => {
  req.body.codecamp = req.params.codecampId;
  req.body.user = req.user.id;

  const codecamp = await CodeCamp.findById(req.params.codecampId);

  if (!codecamp) {
    return next(
      new ErrorResponse(
        `No Course with the id of ${req.params.codecampId}`,
        404
      )
    );
  }

  // Make sure that user is codecamp owner
  if (codecamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} is not authorized to add course codecamp ${codecamp.id}.`,
        401
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

  // Make sure that user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} is not authorized to update course ${course.id}.`,
        401
      )
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

  // Make sure that the user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} is not authorized to delete course ${course.id}.`,
        401
      )
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
