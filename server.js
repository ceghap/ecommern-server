const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
require("dotenv").config({
  path: "./config/index.env",
});

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  res.send("test route => home page");
});

// Page Not Found
app.use((req, res) => {
  res.status(404).json({
    msg: "Page not found",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}...`);
});
