const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");

const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

const codecamps = require("./routes/codecamps");

const app = express();

// Body Parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Mount routes
app.use("/api/v1/codecamps", codecamps);

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
