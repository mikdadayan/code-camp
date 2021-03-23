const express = require("express");

const {
  getCodecamp,
  getCodecamps,
  updateCodecamp,
  createCodecamp,
  deleteCodecamp,
} = require("../controllers/codecamp");

const router = express.Router();

router.get("/", getCodecamps);

router.get("/:id", getCodecamp);

router.post("/", createCodecamp);

router.put("/:id", updateCodecamp);

router.delete("/:id", deleteCodecamp);

module.exports = router;
