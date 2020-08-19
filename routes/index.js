const Router = require("express").Router();
const { getIndex, getAbout, getBlog, getContact, getPortfolio, postContact } = require('../controllers/pages')

Router.route("/").get(getIndex);
Router.route('/about').get(getAbout);
Router.route('/portfolio').get(getPortfolio);
Router.route('/contact').get(getContact).post(postContact);
Router.route('/blog').get(getBlog);

module.exports = Router;
