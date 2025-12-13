const express = require("express");
const Sweet = require("../models/Sweet");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

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


router.post("/:id/restock", authMiddleware, adminMiddleware, async (req, res) => {
  const { quantity } = req.body;

  const sweet = await Sweet.findById(req.params.id);
  if (!sweet) {
    return res.status(404).json({ message: "sweet not found" });
  }

  sweet.quantity += quantity;
  await sweet.save();

  res.status(200).json(sweet);
});


router.get("/search", async (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;

  let query = {};

  if (name) {
    query.name = new RegExp(name, "i");
  }

  if (category) {
    query.category = category;
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) {
      query.price.$gte = Number(minPrice);
    }
    if (maxPrice) {
      query.price.$lte = Number(maxPrice);
    }
  }

  const sweets = await Sweet.find(query);
  res.status(200).json(sweets);
});

router.put("/:id", authMiddleware, async (req, res) => {
  const { name, category, price, quantity } = req.body;

  const sweet = await Sweet.findById(req.params.id);
  if (!sweet) {
    return res.status(404).json({ message: "sweet not found" });
  }

  sweet.name = name || sweet.name;
  sweet.category = category || sweet.category;
  sweet.price = price !== undefined ? price : sweet.price;
  sweet.quantity = quantity !== undefined ? quantity : sweet.quantity;

  await sweet.save();

  res.status(200).json(sweet);
});

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const sweet = await Sweet.findById(req.params.id);
  if (!sweet) {
    return res.status(404).json({ message: "sweet not found" });
  }

  await Sweet.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "sweet deleted" });
});

module.exports = router;
