const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    id: user._id,
    email: user.email,
  });
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({ token });
});

module.exports = router;
