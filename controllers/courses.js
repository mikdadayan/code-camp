// @desc  Get all courses
// @route GET /api/v1/courses
// @access Public
exports.getCourses = (req, res, next) => {
  res.status(200).json({ success: "true", msg: "Get all courses." });
};

// @desc  Get Single Course
// @route GET /api/v1/courses/:id
// @access Public
exports.getCourse = (req, res, next) => {
  res
    .status(200)
    .json({ success: "true", msg: `Show coure ${req.params.id} ` });
};

// @desc  Create Course
// @route GET /api/v1/courses
// @access Private
exports.createCourse = (req, res, next) => {
  res.status(200).json({ success: "true", msg: `Createde Course` });
};

// @desc  Update Course
// @route GET /api/v1/courses/:id
// @access Private
exports.updateCourse = (req, res, next) => {
  res
    .status(200)
    .json({ success: "true", msg: `Update the course ${req.params.id}.` });
};

// @desc Delete Course
// @route GET /api/v1/courses/:id
// @access Private
exports.deleteCourse = (req, res, next) => {
  res
    .status(200)
    .json({ success: "true", msg: `Delete the course ${req.params.id}.` });
};
