const express = require("express");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "./config/config.env" });

console.log(process.env.NODE_ENV);

const app = express();

const PORT = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT} ...`);
});
