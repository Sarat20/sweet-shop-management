const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const authMiddleware = require("./middleware/auth.middleware");
const sweetRoutes = require("./routes/sweet.routes");


const app = express();

app.use(cors({
  origin: [
    'https://sweetshop-management.netlify.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);

app.get("/api/protected", authMiddleware, (req, res) => {
  res.status(200).json({ message: "access ok" });
});

const adminMiddleware = require("./middleware/admin.middleware");
app.get("/api/protected-admin", authMiddleware, adminMiddleware, (req, res) => {
  res.status(200).json({ message: "admin access ok" });
});

module.exports = app;
