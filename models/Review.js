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

// Static method to get average rating and save
reviewSchema.statics.getAverageRating = async function (codecampId) {
  const obj = await this.aggregate([
    { $match: { codecamp: codecampId } },
    { $group: { _id: "$codecamp", averageRating: { $avg: "$rating" } } },
  ]);

  try {
    await this.model("Codecamp").findByIdAndUpdate(codecampId, {
      averageRating: obj[0].averageRating,
    });
  } catch (error) {
    console.log(error);
  }
};

// Call getAverageRating after save
reviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.codecamp);
});

// Call getAverageRating before remove
reviewSchema.pre("remove", function () {
  this.constructor.getAverageRating(this.codecamp);
});
module.exports = mongoose.model("Review", reviewSchema);
