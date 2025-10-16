// controllers/userController.js
const UserModel = require("../model/userModel");
const bcrypt = require("bcryptjs");

const createUser = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ userName, password: hashPassword });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await UserModel.findOne({ userName });
    if (!user) return res.status(400).json({ error: "Invalid username" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid password" });

    res.json({ message: "User login success", userId: user._id, userName: user.userName });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createUser, userLogin };
