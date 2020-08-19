const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;
productSchame = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'users'},
  title: { type: String, required: true },
  file: { type: String, required: true },
  poster: String,
  size: String,
  description: { type: String, required: true },
  price: { type: String, required: true, unique: true },
  rate: { type: Number },
  category: String,
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const validateProduct = function(product) {
  const schema = {
    user: Joi.string(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    file: Joi.string(),
    poster: Joi.string(),
    price: Joi.number().required(),
    rate: Joi.number(),
    featured: Joi.boolean(),
    _csrf: Joi.string()
  };
  return Joi.validate(product, schema);
};

exports.Product = mongoose.model("Product", productSchame);
exports.validateProduct = validateProduct;
