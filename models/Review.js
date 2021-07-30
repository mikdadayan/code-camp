const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title."],
    maxlength: 100,
  },

  text: {
    type: String,
    required: [true, "Please add some text"],
  },

  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Please add a rating between 1 and 10"],
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

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Prevent user from submitting more than one review per codecamp
reviewSchema.index({ codecamp: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
