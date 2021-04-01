const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title."],
  },

  description: {
    type: String,
    required: [true, "Please add a description"],
  },

  weeks: {
    type: String,
    required: [true, "Please add a number of weeks"],
  },

  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skill"],
    enum: ["beginner", "intermediate", "advanced"],
  },

  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  codecamp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Codecamp",
    required: true,
  },
});

module.exports = mongoose.model("Course", courseSchema);
