const { User, validateRegister, validateLogin } = require("../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

exports.getRegister = function(req, res) {
  const context = {
    title: "Bassline Entertainment"
  };
  res.render("register", context);
};

exports.postRegister = async function(req, res) {
  const { error } = validateRegister(req.body);
  if (error) {
    req.flash("error", error.details[0].message);
    return res.redirect("/users/register");
  }
  const errors = [];
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    password2,
    roles
  } = req.body;
  if (password !== password2) {
    req.flash("error", "Passwords don't match.");
    return res.redirect("/users/register");
  }
  const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
  let user = await User.findOne({ email });
  if (user) {
    req.flash("error", "User with the same email Already exists");
    return res.redirect("/users/register");
  }
  user = await User.findOne({ username });
  if (user) {
    req.flash("error", "Username already taken");
    return res.redirect("/users/register");
  }

  let duties;
  if (roles) duties = roles.split(",");
  else duties = [];
  user = new User({
    firstName,
    lastName,
    username,
    email,
    avatar,
    password,
    roles: duties
  });

  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  req.flash("success", "Registration successful, You can login.");
  return res.redirect("/users/login");
};

exports.getLogin = function(req, res) {
  const context = {
    title: "User Login",
    errorMsg: req.flash("error")
  };
  res.render("login", context);
};

exports.postLogin = async function(req, res) {
  const { error } = validateLogin(req.body);
  if (error) {
    req.flash("error", error.details[0].message);
    return res.redirect("/users/login");
  }
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    req.flash("error", "Invalid Email or password");
    return res.redirect("/users/login");
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    req.flash("error", "Invalid Email or password");
    return res.redirect("/users/login");
  }
  user = user.generateUser();
  req.session.user = user;
  req.session.isAuthenticated = true;
  req.flash("success", "Login successful");
  return res.redirect("/");
};

exports.postLogout = async function(req, res) {
  req.session.destroy(function(ex) {
    if (ex) return req.flash("error", ex);
    res.redirect("/users/login");
  });
};
