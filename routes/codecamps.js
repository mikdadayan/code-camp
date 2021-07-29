const express = require("express");

const {
  getCodecamp,
  getCodecamps,
  updateCodecamp,
  createCodecamp,
  deleteCodecamp,
  getCodecampsInRadius,
  codecampPhotoUpload,
} = require("../controllers/codecamp");

const advancedResults = require("../middlewares/advacncedResults");
const Codecamp = require("../models/CodeCamp");

const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

// Include other resource routers
const courseRouter = require("./courses");
const reviewRouter = require("./reviews");

// Reroute into other resource routers
router.use("/:codecampId/courses", courseRouter);
router.use("/:codecampId/reviews", reviewRouter);

router.route("/radius/:zipcode/:distance").get(getCodecampsInRadius);

router
  .route("/")
  .get(advancedResults(Codecamp, "courses"), getCodecamps)
  .post(protect, authorize("publisher", "admin"), createCodecamp);

router
  .route("/:id")
  .get(getCodecamp)
  .put(protect, authorize("publisher", "admin"), updateCodecamp)
  .delete(protect, authorize("publisher", "admin"), deleteCodecamp);

router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), codecampPhotoUpload);

module.exports = router;
