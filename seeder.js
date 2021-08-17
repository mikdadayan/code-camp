const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

dotenv.config({ path: `${__dirname}/config/config.env` });

// Load models
const CodeCamp = require("./models/CodeCamp");
const Course = require("./models/Course");
const User = require("./models/User");
const Review = require("./models/Review");

// Set up connection with mongodb
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});

// Read JSON files
const codecamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/codecamps.json`, "utf-8")
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, "utf-8")
);

// Import to DB
// Import to DB
const importData = async () => {
  try {
    await CodeCamp.create(codecamps);
    await Course.create(courses);
    await User.create(users);
    await Review.create(reviews);
    console.log("Imported Data to DB ...".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete from  DB
const deleteData = async () => {
  try {
    await CodeCamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Deleted Data from DB ...".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// import all data to database
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  // delete all data from database
  deleteData();
}
