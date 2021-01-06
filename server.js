const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
require("dotenv").config({
  path: "./config/index.env",
});

// MongoDB
const connectDB = require("./config/db");

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  res.send("test route => home page");
});

app.use("/api/user/", require("./routes/auth.route"));

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
