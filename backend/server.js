const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const productRouter = require("./router/productRouter");
const customerRouter = require("./router/customerRouter");
const orderRouter = require("./router/orderRoutes");
const userRouter = require("./router/useRouter");
const adminRouter = require("./router/adminRouter");
const { ensureDefaultAdmin } = require("./controller/adminController");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", productRouter);
app.use("/api/customers", customerRouter);
app.use("/api/orders", orderRouter);
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);

// Serve images
app.use("/allImg", express.static("document"));

// Connect MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(async () => {
    console.log("✅ MongoDB connected");
    await ensureDefaultAdmin(); // create default admin if needed
  })
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));




// test admin

// MONGODB_URL=mongodb://127.0.0.1:27017/ebook
// PORT=3000
// JWT_SECRET=yourSecretKey
// DEFAULT_ADMIN_NAME=Admin
// DEFAULT_ADMIN_EMAIL=admin@example.com
// DEFAULT_ADMIN_PASSWORD=admin123
