const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

dotenv.config({ path: `${__dirname}/config/config.env` });

// Load models
const CodeCamp = require("./models/CodeCamp");

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

// Import to DB
// Import to DB
const importData = async () => {
  try {
    await CodeCamp.create(codecamps);
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
    console.log("Deleted Data from DB ...".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
