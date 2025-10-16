// routes/userRouter.js
const express = require("express");
const userController = require("../controller/useControll");

const router = express.Router();

router.post("/register", userController.createUser);
router.post("/login", userController.userLogin);

module.exports = router;
