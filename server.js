const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

const codecamps = require("./routes/codecamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");

const app = express();

// Prevent from xss attacks

// Set security headers
app.use(helmet());

// Cookie parser middleware
app.use(cookieParser());

// Body Parser
app.use(express.json());

// Sanitize Data
app.use(mongoSanitize());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// file uploading
app.use(fileUpload());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routes
app.use("/api/v1/codecamps", codecamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} on port ${PORT} ...`.yellow.bold
  );
});

// Hande unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
