// controllers/adminController.js
const AdminModel = require("../model/adminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role, avatar } = req.body;
    const exists = await AdminModel.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already registered" });

    const hashPassword = await bcrypt.hash(password, 10);
    const newAdmin = new AdminModel({ name, email, password: hashPassword, role, avatar });
    const savedAdmin = await newAdmin.save();

    res.status(201).json({
      id: savedAdmin._id,
      name: savedAdmin.name,
      email: savedAdmin.email,
      role: savedAdmin.role,
      avatar: savedAdmin.avatar,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await AdminModel.findOne({ email });
    if (!admin) return res.status(400).json({ error: "Invalid email" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: admin._id, name: admin.name, email: admin.email, role: admin.role, avatar: admin.avatar },
      process.env.JWT_SECRET,
   
    );

    res.json({
      message: "Login success",
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role, avatar: admin.avatar },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const admin = await AdminModel.findById(adminId).select("-password");
    if (!admin) return res.status(404).json({ error: "Admin not found" });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Ensure default admin
const ensureDefaultAdmin = async () => {
  try {
    const count = await AdminModel.countDocuments();
    if (count > 0) return;

    const name = process.env.DEFAULT_ADMIN_NAME || "Administrator";
    const email = process.env.DEFAULT_ADMIN_EMAIL || "admin@example.com";
    const passwordPlain = process.env.DEFAULT_ADMIN_PASSWORD || "admin1234";
    const hashPassword = await bcrypt.hash(passwordPlain, 10);

    await AdminModel.create({ name, email, password: hashPassword, role: "admin" });
    console.log("✅ Default admin ensured:", email);
  } catch (err) {
    console.error("ensureDefaultAdmin error:", err);
  }
};

module.exports = { createAdmin, adminLogin, getAdminProfile, ensureDefaultAdmin };
