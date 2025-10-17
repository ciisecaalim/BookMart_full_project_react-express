const express = require("express");
const multer = require("multer");
const { createAdmin, adminLogin, getAdminProfile, updateAdminProfile } = require("../controller/adminController");

const router = express.Router();

// Multer setup for avatar
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.post("/register", createAdmin); // ✅ Halkan waa route register
router.post("/login", adminLogin);
router.get("/profile/public", getAdminProfile);
router.put("/profile/public", upload.single("avatar"), updateAdminProfile);

module.exports = router;
