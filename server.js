const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const courses = require("./routes/courses");

// Load env vars
dotenv.config({ path: "./config/config.env" });

const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Mount routes
app.use("/api/v1/courses", courses);

const PORT = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT} ...`);
});
