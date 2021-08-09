const express = require("express");

const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  logout,
} = require("../controllers/auth");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", protect, logout);
router.get("/getMe", protect, getMe);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

module.exports = router;
