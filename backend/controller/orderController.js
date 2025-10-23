const orderModel = require("../model/ordermodel");
const productModel = require("../model/productModel");

// CREATE ORDER
const createOrder = async (req, res) => { /* your existing code */ };

// READ ALL ORDERS
const readOrder = async (req, res) => {
  try {
    const orders = await orderModel.find().populate("products.productId", "name price").sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching orders" });
  }
};

// TOTAL INCOME
const getTotalIncome = async (req, res) => {
  try {
    const income = await orderModel.aggregate([{ $group: { _id: null, totalIncome: { $sum: "$totalAmount" } } }]);
    res.status(200).json(income[0] || { totalIncome: 0 });
  } catch (err) {
    res.status(500).json({ message: "Error getting total income" });
  }
};

// TOP CUSTOMERS
const getTopCustomer = async (req, res) => {
  try {
    const top = await orderModel.aggregate([
      { $group: { _id: "$customer", totalSpent: { $sum: "$totalAmount" }, orderCount: { $sum: 1 } } },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 }
    ]);
    res.status(200).json(top.map(i => ({ customer: i._id, totalSpent: i.totalSpent, orderCount: i.orderCount })));
  } catch (err) {
    res.status(500).json({ message: "Error getting top customers" });
  }
};

module.exports = { createOrder, readOrder, getTotalIncome, getTopCustomer };
