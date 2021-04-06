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

const router = express.Router();

// Include other resource routers
const courseRouter = require("./courses");

// Reroute into other resource routers
router.use("/:codecampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getCodecampsInRadius);

router.route("/:id/photo").put(codecampPhotoUpload);

router.route("/").get(getCodecamps).post(createCodecamp);

router
  .route("/:id")
  .get(getCodecamp)
  .put(updateCodecamp)
  .delete(deleteCodecamp);

module.exports = router;
