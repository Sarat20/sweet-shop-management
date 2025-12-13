const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "admin access required" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

module.exports = adminMiddleware;

