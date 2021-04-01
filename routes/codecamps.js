const express = require("express");

const {
  getCodecamp,
  getCodecamps,
  updateCodecamp,
  createCodecamp,
  deleteCodecamp,
  getCodecampsInRadius,
} = require("../controllers/codecamp");

const router = express.Router();

// Include other resource routers
const courseRouter = require("./courses");

// Reroute into other resource routers
router.use("/:codecampId/courses", courseRouter);

router.get("/", getCodecamps);

router.get("/:id", getCodecamp);

router.get("/radius/:zipcode/:distance", getCodecampsInRadius);

router.post("/", createCodecamp);

router.put("/:id", updateCodecamp);

router.delete("/:id", deleteCodecamp);

module.exports = router;
