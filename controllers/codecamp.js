const Codecamp = require("../models/CodeCamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const geocoder = require("../utils/geocoder");
const CodeCamp = require("../models/CodeCamp");

// @desc  Get all Codecamps
// @route GET /api/v1/codecamps
// @access Public
exports.getCodecamps = asyncHandler(async (req, res, next) => {
  const reqQuery = { ...req.query };
  let queryStr = JSON.stringify(reqQuery);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  console.log(queryStr);
  const codecamps = await Codecamp.find(JSON.parse(queryStr));
  res
    .status(200)
    .json({ success: true, count: codecamps.length, data: codecamps });
});

// @desc  Get Single Codecamp
// @route GET /api/v1/codecamps/:id
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
// @route GET /api/v1/codecamps
// @access Private
exports.createCodecamp = asyncHandler(async (req, res, next) => {
  const newCodecamp = await Codecamp.create(req.body);
  res
    .status(201)
    .json({ success: true, msg: `Created Codecamp.`, data: newCodecamp });
});

// @desc  Update Codecamp
// @route GET /api/v1/codecamps/:id
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
// @route GET /api/v1/codecamps/:id
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

// @desc GET Get codecamps within a radius
// @route GET /api/v1/codecamps/:zipcode/:distance
// @access Private
exports.getCodecampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat & lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;
  console.log(lat, lng);
  // Calc radius using radians
  // Divide distance by radius of earth
  // Earth Radius = 6378 km
  const radius = distance / 3963;

  const codecamps = await CodeCamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res
    .status(200)
    .json({ success: true, count: codecamps.length, data: codecamps });
});
