const Codecamp = require("../models/CodeCamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");

// @desc  Get all Codecamps
// @route GET /api/v1/codecamp
// @access Public
exports.getCodecamps = asyncHandler(async (req, res, next) => {
  const codecamps = await Codecamp.find();
  res.status(200).json({ success: true, data: codecamps });
});

// @desc  Get Single Codecamp
// @route GET /api/v1/codecamp/:id
// @access Public
exports.getCodecamp = asyncHandler(async (req, res, next) => {
  const codecamp = await Codecamp.findById(req.params.id);
  if (!codecamp) {
    let error = new ErrorResponse(
      `CodeCamp not found with id ${req.params.id}`,
      404
    );
    // error.name = "CastError";
    // error.value = req.params.id;
    return next(error);
  }
  res.status(200).json({ success: true, data: codecamp });
});

// @desc  Create Codecamp
// @route GET /api/v1/codecamp
// @access Private
exports.createCodecamp = asyncHandler(async (req, res, next) => {
  const newCodecamp = await Codecamp.create(req.body);
  res
    .status(201)
    .json({ success: true, msg: `Created Codecamp.`, data: newCodecamp });
});

// @desc  Update Codecamp
// @route GET /api/v1/codecamp/:id
// @access Private
exports.updateCodecamp = asyncHandler(async (req, res, next) => {
  const codecamp = await Codecamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!codecamp) {
    return next(
      new ErrorResponse(`CodeCamp not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: "true",
    msg: `Update the Codecamp ${req.params.id}.`,
    data: codecamp,
  });
});

// @desc Delete Codecamp
// @route GET /api/v1/codecamp/:id
// @access Private
exports.deleteCodecamp = asyncHandler(async (req, res, next) => {
  const codecamp = await Codecamp.findByIdAndDelete(req.params.id);

  if (!codecamp) {
    return next(
      new ErrorResponse(`CodeCamp not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: "true",
    msg: `Deleted the Codecamp .`,
    data: {},
  });
});
