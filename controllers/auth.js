const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const User = require("../models/User");

// @desc   Register User
// @route  Post /api/v1/auth/register
// @access Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create User
  const user = await User.create({ name, email, password, role });

  //Create token
  const token = user.getSignedJwtToken();
  console.log(token);

  res.status(200).json({ success: true, token });
});
