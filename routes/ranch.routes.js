const router = require("express").Router();
const { Ranch, validate } = require("../models/ranch.model");
const { User } = require("../models/user.model");
const methods = require("../methods");

// Get ranchs
router.get("/", methods.ensureToken, async (req, res) => {
  const ranchs = await Ranch.find();
  res.status(200).json(ranchs);
});

// Get a ranch
router.get("/:id", methods.ensureToken, async (req, res) => {
  const ranch = await Ranch.findById(req.params.id).populate("cows");
  res.status(200).json(ranch);
});

// Create a new Ranch
router.post("/", methods.ensureToken, async (req, res) => {
  try {
    const { error } = validate(req.body);

    if (error) {
      return res.status(400).send({ msg: error.details[0].message });
    }

    const ranch = await new Ranch({ ...req.body }).save();
    const userId = req.body.user;
    const ranchId = ranch._id;

    const user = await User.findById(userId);
    user.ranchs.push(ranchId);
    await user.save();

    res.status(201).send({ msg: "Ranch created successfully" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});

// Update a Ranch
router.put("/:id", async (req, res) => {
  try {
    const { error } = validate(req.body);
    
    if (error) {
      return res.status(400).send({ msg: error.details[0].message });
    }

    await Ranch.findByIdAndUpdate(req.params.id, { ...req.body });
    res.status(200).send({ msg: "Ranch updated successfully" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
})

// Delete a ranch
router.delete("/:user/:id", methods.ensureToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.user);
    const index = user.ranchs.indexOf(req.params.id);
    user.ranchs.splice(index, 1);
    await user.save();
    await Ranch.findByIdAndDelete(req.params.id);
    res.status(200).send({ msg: "Ranch deleted successfully" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});

module.exports = router;
