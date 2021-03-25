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

router.get("/", getCodecamps);

router.get("/:id", getCodecamp);

router.get("/radius/:zipcode/:distance", getCodecampsInRadius);

router.post("/", createCodecamp);

router.put("/:id", updateCodecamp);

router.delete("/:id", deleteCodecamp);

module.exports = router;
