const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;
userSchame = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, min: 8, max: 25 },
  admin: { type: Boolean, default: false },
  avatar: { type: String, required: true },
  seller: { type: Boolean, default: false },
  roles: [String],
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

userSchame.methods.generateUser = function() {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    username: this.username,
    email: this.email,
    admin: this.admin,
    avatar: this.avatar,
    seller: this.seller,
    verified: this.verified,
    roles: this.roles,
    createdAt: this.createdAt
  };
};

const validateRegister = function(user) {
  const schema = {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string()
      .required()
      .email({ minDomainAtoms: 2 }),
    password: Joi.string()
      .required()
      .min(8)
      .max(25),
    password2: Joi.string(),
    admin: Joi.boolean(),
    avatar: Joi.string(),
    seller: Joi.boolean(),
    _csrf: Joi.string()
  };

  return Joi.validate(user, schema);
};

const validateLogin = function(user) {
  const schema = {
    email: Joi.string()
      .required()
      .email({ minDomainAtoms: 2 }),
    password: Joi.string().required(),
    _csrf: Joi.string()
  };

  return Joi.validate(user, schema);
};

exports.User = mongoose.model("User", userSchame);
exports.validateRegister = validateRegister;
exports.validateLogin = validateLogin;
