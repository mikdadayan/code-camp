const express = require("express");

const router = express.Router({ mergeParams: true });

const Course = require("../models/Course");
const advacncedResults = require("../middlewares/advacncedResults");
const { protect, authorize } = require("../middlewares/auth");

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
  .post(protect, authorize("publisher", "admin"), addCourse);

router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorize("publisher", "admin"), updateCourse)
  .delete(protect, authorize("publisher", "admin"), deleteCourse);

module.exports = router;
