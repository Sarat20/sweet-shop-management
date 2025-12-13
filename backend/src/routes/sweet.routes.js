const express = require("express");
const Sweet = require("../models/Sweet");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();


router.post("/", authMiddleware, async (req, res) => {
  const { name, category, price, quantity } = req.body;

  const sweet = await Sweet.create({
    name,
    category,
    price,
    quantity,
  });

  res.status(201).json(sweet);
});

router.get("/", async (req, res) => {
  const sweets = await Sweet.find();
  res.status(200).json(sweets);
});


router.post("/:id/purchase", authMiddleware, async (req, res) => {
  const sweet = await Sweet.findById(req.params.id);

  if (!sweet || sweet.quantity <= 0) {
    return res.status(400).json({ message: "sweet not avilable" });
  }

  sweet.quantity -= 1;
  await sweet.save();

  res.status(200).json(sweet);
});


router.post("/:id/restock", authMiddleware, async (req, res) => {
  const { quantity } = req.body;

  const sweet = await Sweet.findById(req.params.id);
  if (!sweet) {
    return res.status(404).json({ message: "sweet not found" });
  }

  sweet.quantity += quantity;
  await sweet.save();

  res.status(200).json(sweet);
});


module.exports = router;
