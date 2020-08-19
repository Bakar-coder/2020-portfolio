const Router = require("express").Router();
const {
  getRegister,
  postRegister,
  postLogin,
  getLogin,
  postLogout
} = require("../controllers/user");

Router.route("/register")
  .get(getRegister)
  .post(postRegister);

Router.route("/login")
  .get(getLogin)
  .post(postLogin);

Router.route("/logout").post(postLogout);

module.exports = Router;
