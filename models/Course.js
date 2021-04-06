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

  tuition: {
    type: Number,
    required: [true, "Please add a tuition cost."],
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

courseSchema.statics.getAverageCost = async function (codecampId) {
  const obj = await this.aggregate([
    { $match: { codecamp: codecampId } },
    { $group: { _id: "$codecamp", averageCost: { $avg: "$tuition" } } },
  ]);

  console.log(obj);
  try {
    await this.model("Codecamp").findByIdAndUpdate(codecampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (error) {
    console.log(error);
  }
};

// Call getaverageCost after save
courseSchema.post("save", function () {
  this.constructor.getAverageCost(this.codecamp);
});

// Call getaverageCost before remove
courseSchema.pre("remove", function () {
  this.constructor.getAverageCost(this.codecamp);
});

module.exports = mongoose.model("Course", courseSchema);
