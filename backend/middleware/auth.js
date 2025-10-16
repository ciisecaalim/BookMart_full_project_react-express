// middleware/auth.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.admin.role !== "admin") return res.status(403).json({ error: "Admin only" });
  next();
};

module.exports = { authMiddleware, isAdmin };
