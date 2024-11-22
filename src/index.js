const express = require("express");
const path = require("path");
const { sequelize } = require("./config/mysql");
const bodyParser = require("body-parser");
const morgan = require("morgan");
require("dotenv").config({
  path: path.join(
    __dirname,
    `../.env.${process.env.NODE_ENV || "development"}`
  ),
});
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));

app.get("/api", (req, res, next) =>
  res.status(200).send(`<h1>Welcome to the auth module </h1>`)
);

// Import Routes
app.use("/api", require("./routes"));

app.use((err, req, res, next) => {
  const sendErrors = {
    status: 500,
    success: false,
  };
  sendErrors.errors = Array.isArray(err.errors)
    ? err.errors.map((error) => error.message)
    : err;
  res.status(err?.statusCode || 500).json(sendErrors);
});

sequelize
  .authenticate()
  .then(() => {
    console.log("MySQL database connection has been established successfully.");
    app.listen(PORT, () => {
      console.log(
        `Server is start listing on port: ${PORT}. Visit http://localhost:${PORT}`
      );
    });
  })
  .catch((reason) =>
    console.log("Unable to connect to the MySQL database:", reason)
  );
