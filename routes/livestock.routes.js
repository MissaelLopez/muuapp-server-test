const router = require("express").Router();
const { Livestock, validate } = require("../models/livestock.model");
const { Ranch } = require("../models/ranch.model");
const methods = require("../methods");

// Get Livestocks
router.get("/", methods.ensureToken, async (req, res) => {
  const livestock = await Livestock.find();
  res.status(200).json(livestock);
});

// Get a Livestock
router.get("/:id", methods.ensureToken, async (req, res) => {
  const livestock = await Livestock.findById(req.params.id).populate("user");
  res.status(200).json(livestock);
});

// Create a new Livestock
router.post("/", methods.ensureToken, async (req, res) => {
  try {
    const { error } = validate(req.body);

    if (error) {
      return res.status(400).send({ msg: error.details[0].message });
    }

    const livestock = await new Livestock({ ...req.body }).save();

    const ranchId = req.body.ranch;
    const livestockId = livestock._id;

    const ranch = await Ranch.findById(ranchId);
    ranch.livestock.push(livestockId);
    await ranch.save();

    res.status(201).send({ msg: "Livestock created successfully" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});

router.delete("/:id", methods.ensureToken, async (req, res) => {
  try {
    await Livestock.findByIdAndDelete(req.params.id);
    res.status(200).send({ msg: "Livestock deleted successfully" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});

module.exports = router;
