const joi = require("joi");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const livestockSchema = new mongoose.Schema({
  name: { type: String, required: true },
  picture: { type: String, required: true },
  gender: { type: String, required: true },
  breed: { type: String, required: true },
  utp: { type: String, required: true },
  dateBirth: { type: Date, required: true },
  phase: { type: String, required: true },
  weight: { type: String, required: true },
  ranch: { type: ObjectId, ref: "ranch", required: true },
});

const Livestock = mongoose.model("livestock", livestockSchema);

const validate = (data) => {
  const schema = joi.object({
    name: joi.string().required().label("Name"),
    picture: joi.string().required().label("Picture"),
    gender: joi.string().required().label("Gender"),
    breed: joi.string().required().label("Breed"),
    utp: joi.string().required().label("Utp"),
    dateBirth: joi.date().required().label("DateBirth"),
    phase: joi.string().required().label("Phase"),
    weight: joi.string().required().label("Weight"),
    ranch: joi.string().required().label("Ranch Id"),
  });
  return schema.validate(data);
};

module.exports = { Livestock, validate };
