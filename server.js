"use strict";
require("express-async-errors");
require("joi-objectid");
const db = require("./utils/database");
const express = require("express");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const sessionStorage = require("connect-mongodb-session")(session);
const config = require("config");
const csrf = require("csurf");
const helmet = require("helmet");
const compression = require("compression");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const morgan = require("morgan");
const { join } = require("path");
const { User } = require("./models/User");
const port = process.env.PORT || 5000;
const app = express();

if (!config.get("jwtPrivateKey")) {
  console.error("No secret key provided...................");
  process.exit(1);
}

const home = require("./routes");
const users = require("./routes/user");
const admin = require("./routes/admin/products");

const sessionStore = new sessionStorage({
  uri: db(),
  collection: "sessions"
});

const accessLogStream = fs.createWriteStream(join(__dirname, "access.log"), {
  flags: "a"
});

app.use(express.urlencoded({ extended: false }));
app.use(express.static(join(__dirname, "public")));
app.use(express.static(join(__dirname, "media")));
app.use("/media", express.static(join(__dirname, "media")));
app.set("view engine", "ejs");
app.use(
  morgan("combined", {
    stream: accessLogStream,
    skip: function(req, res) {
      return res.statusCode < 400;
    }
  })
);
app.use(
  fileUpload({
    limits: { fileSize: 1024 * 1024 * 1024 },
    useTempFiles: true,
    safeFileNames: true,
    preserveExtension: true
  })
);
app.use(
  session({
    name: "SID",
    secret: config.get("jwtPrivateKey"),
    saveUninitialized: false,
    resave: false,
    store: sessionStore
  })
);
app.use(csrf());
app.use(flash());
app.use(helmet());
app.use(compression());

app.use(async function(req, res, next) {
  if (!req.session.user) return next();
  if (req.session.cookie.expires) {
    req.session.destroy(function(ex) {
      if (ex) return req.flash("error", ex);
      res.redirect("/");
    });
  }
  try {
    const user = await User.findById(req.session.user.id);
    if (!user) return next();
    req.user = user;
    next();
  } catch (ex) {
    next(new Error(ex));
  }
});

app.use(function(req, res, next) {
  res.locals.isAuthenticated = req.session.isAuthenticated;
  res.locals.user = req.user;
  res.locals.csrfToken = req.csrfToken();
  res.locals.errMsg = req.flash("error");
  res.locals.successMsg = req.flash("success");
  res.locals.msg = req.flash("info");
  next();
});

app.use("/", home);
app.use("/users", users);
app.use("/admin", admin);
app.use(function(req, res, next) {
  const context = {
    title: "404 | Page Not Found.",
    path: "/"
  };
  res.render("404", context);
  next();
});

app.use(function(err, req, res, next) {
  if (err.code !== "EBADCSRFTOKEN") return next(err);
  res.status(403);
  res.send("form tampered with");
});

mongoose
  .connect(db(), { useCreateIndex: true, useNewUrlParser: true })
  .then(() => {
    console.log("Connected to mongodb database____________________");
    app.listen(port, () =>
      console.log(`Server started on port: ${port}_____________________`)
    );
  })
  .catch(ex => console.error("Database Connection Error! -", ex));
