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

module.exports = router;
