// routes/adminRouter.js
const express = require("express");
const adminController = require("../controller/adminController");
const { authMiddleware, isAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/create", authMiddleware, isAdmin, adminController.createAdmin); // only admin can create
router.post("/login", adminController.adminLogin);
router.get("/profile", authMiddleware, adminController.getAdminProfile);

module.exports = router;
