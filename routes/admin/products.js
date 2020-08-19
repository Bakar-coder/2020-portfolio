const Router = require("express").Router();
const admin = require('../../middleware/admin');
const auth = require('../../middleware/auth');
const {
  getAddProduct,
  postAddProduct
} = require("../../controllers/admin/products");

Router.route("/add-product")
  .get(auth,admin, getAddProduct)
  .post(auth, admin, postAddProduct);

Router.route("/products")
  .get()
  .post();

module.exports = Router;
