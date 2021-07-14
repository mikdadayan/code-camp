const express = require("express");

const router = express.Router({ mergeParams: true });

const Course = require("../models/Course");
const advacncedResults = require("../middlewares/advacncedResults");
const { protect } = require("../middlewares/auth");

const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");

router
  .route("/")
  .get(
    advacncedResults(Course, {
      path: "codecamp",
      select: "name description",
    }),
    getCourses
  )
  .post(protect, addCourse);

router
  .route("/:id")
  .get(getCourse)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse);

module.exports = router;
