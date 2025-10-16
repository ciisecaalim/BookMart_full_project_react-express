const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  prImg: { type: String, required: true },
  status: {
    type: String,
    enum: ["available", "out of stock"],
    default: "available"
  },
  category: { type: String, required: true }
});

// Middleware: save
productSchema.pre("save", function(next){
  this.status = this.quantity > 0 ? "available" : "out of stock";
  next();
});

// Middleware: updateOne
productSchema.pre("updateOne", function(next) {
  const update = this.getUpdate();
  const quantity = update.$set?.quantity;

  if (quantity !== undefined) {
    update.$set.status = quantity > 0 ? "available" : "out of stock";
    this.setUpdate(update);
  }

  next();
});

// **Magaca model waa "Product" (uppercase, singular) si ref uu u shaqeeyo**
module.exports = mongoose.model("Product", productSchema);
