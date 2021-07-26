const path = require("path");
const Codecamp = require("../models/CodeCamp");
const Course = require("../models/Course");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const geocoder = require("../utils/geocoder");
const CodeCamp = require("../models/CodeCamp");

// @desc  Get all Codecamps
// @route GET /api/v1/codecamps
// @access Public
exports.getCodecamps = asyncHandler(async (req, res, next) => {
  // console;
  res.status(200).json(res.advancedResults);
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
  // Add user to req.body
  req.body.user = req.user.id;
  // Check for published codecamp by user
  const publishedCodecamp = await CodeCamp.findOne({ user: req.body.user });

  // If user is not admin then they can add only one codecamp
  console.log(req.user.role);
  if (publishedCodecamp && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `The user with id ${req.user.id} has already published codecamp`,
        400
      )
    );
  }

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

// @desc Upload photo for Codecamp
// @route PUT /api/v1/codecamps/:id/photo
// @access Private
exports.codecampPhotoUpload = asyncHandler(async (req, res, next) => {
  const codecamp = await Codecamp.findById(req.params.id);

  if (!codecamp) {
    return next(
      new ErrorResponse(`CodeCamp not found with id ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file.`, 400));
  }

  const file = req.files.file;

  // Make sure the file is photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image.`, 400));
  }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less then ${process.env.MAX_FILE_UPLOAD}.`,
        400
      )
    );
  }

  // Create custom file name
  file.name = `photo_${codecamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload.`, 500));
    }

    await Codecamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({ success: true, data: file.name });
  });
});
