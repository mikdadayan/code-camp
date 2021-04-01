const Codecamp = require("../models/CodeCamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const geocoder = require("../utils/geocoder");
const CodeCamp = require("../models/CodeCamp");

// @desc  Get all Codecamps
// @route GET /api/v1/codecamps
// @access Public
exports.getCodecamps = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields, delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  //Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators($gt, $lte, ...)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource
  query = Codecamp.find(JSON.parse(queryStr)).populate("courses");

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Codecamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const codecamps = await query;

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: codecamps.length,
    pagination,
    data: codecamps,
  });
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
  const codecamp = await Codecamp.findById(req.params.id);

  if (!codecamp) {
    return next(
      new ErrorResponse(`CodeCamp not found with id ${req.params.id}`, 404)
    );
  }

  codecamp.remove();

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
