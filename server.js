"use strict";
require("express-async-errors");
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const fs = require("fs");
const morgan = require("morgan");
const { join } = require("path");
const port = process.env.PORT || 5000;
const app = express();

const home = require("./routes");

const accessLogStream = fs.createWriteStream(join(__dirname, "access.log"), {
  flags: "a",
});

app.use(express.urlencoded({ extended: false }));
app.use(express.static(join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(
  morgan("combined", {
    stream: accessLogStream,
    skip: function (req, res) {
      return res.statusCode < 400;
    },
  })
);
app.use(helmet());
app.use(compression());

app.use("/", home);
app.use(function (req, res, next) {
  const context = {
    title: "404 | Page Not Found.",
    path: "/",
  };
  res.render("404", context);
  next();
});

app.listen(port, () =>
  console.log(`Server started on port: ${port}_____________________`)
);
