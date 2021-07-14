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

const { protect } = require("../middlewares/auth");

const router = express.Router();

// Include other resource routers
const courseRouter = require("./courses");

// Reroute into other resource routers
router.use("/:codecampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getCodecampsInRadius);

router
  .route("/")
  .get(advancedResults(Codecamp, "courses"), getCodecamps)
  .post(protect, createCodecamp);

router
  .route("/:id")
  .get(getCodecamp)
  .put(protect, updateCodecamp)
  .delete(protect, deleteCodecamp);

router.route("/:id/photo").put(protect, codecampPhotoUpload);

module.exports = router;
