const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  version: { type: String, required: true },
  ranchs: [{ type: ObjectId, ref: "ranch" }],
});

userSchema.methods.generateAuthToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_PRIVATE_TOKEN, {
    expiresIn: "1d",
  });
  return token;
};

const User = mongoose.model("user", userSchema);

const validate = (data) => {
  const schema = joi.object({
    fullname: joi.string().required().label("Full Name"),
    username: joi.string().required().label("User Name"),
    email: joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
    version: joi.string().required().label("Version"),
  });
  return schema.validate(data);
};

module.exports = { User, validate };
