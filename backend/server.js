const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

const productRouter = require("./router/productRouter");
const customerRouter = require("./router/customerRouter");
const orderRouter = require("./router/orderRoutes");
const userRouter = require("./router/useRouter");
const adminRouter = require("./router/adminRouter");

const { ensureDefaultAdmin } = require("./controller/adminController");
const { ensureDefaultUser } = require("./controller/useControll");

const app = express();

// ✅ Create uploads folder if not exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("✅ Uploads folder created");
}



app.use(cors());
app.use(express.json());

// Routers
app.use("/api/products", productRouter);
app.use("/api/customers", customerRouter);
app.use("/api/orders", orderRouter);
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);

// Serve uploads statically
app.use("/uploads", express.static("uploads"));
app.use("/allImg", express.static("document"));

// Connect MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(async () => {
    console.log("✅ MongoDB connected");
    await ensureDefaultAdmin();
    await ensureDefaultUser();
  })
  .catch(err => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
