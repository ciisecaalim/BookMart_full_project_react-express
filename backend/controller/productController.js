const productModel = require("../model/productModel");

// CREATE
const createProduct = async (req, res) => {
  try {
    const newData = new productModel({
      name: req.body.name,
      quantity: req.body.quantity,
      price: req.body.price,
      category: req.body.category,
      prImg: req.file.filename,
    });
    const saveData = await newData.save();
    res.status(200).send(saveData);
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).send({ message: "Error creating product", error });
  }
};

// READ (Filter by category or return all)
const readProduct = async (req, res) => {
  try {
    const { category } = req.body || {};
    let filterData = {};

    if (category && category.trim() !== "") {
      filterData = { category };
    }

    const getData = await productModel.find(filterData);
    res.status(200).send(getData);
  } catch (error) {
    console.error("Read error:", error);
    res.status(500).send({ message: "Error reading products", error });
  }
};

// UPDATE
const updateProduct = async (req, res) => {
  try {
    const putPro = await productModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          quantity: req.body.quantity,
          price: req.body.price,
          category: req.body.category,
          prImg: req.file ? req.file.filename : undefined,
        },
      }
    );
    res.status(200).send(putPro);
  } catch (error) {
    res.status(500).send({ message: "Error updating product", error });
  }
};

// READ SINGLE
const readSingleData = async (req, res) => {
  try {
    const getdata = await productModel.findById(req.params.id);
    res.status(200).send(getdata);
  } catch (error) {
    res.status(500).send({ message: "Error reading single product", error });
  }
};

// DELETE
const deletedata = async (req, res) => {
  try {
    await productModel.deleteOne({ _id: req.params.id });
    res.status(200).send("Product deleted successfully");
  } catch (error) {
    res.status(500).send({ message: "Error deleting product", error });
  }
};

// READ ALL
const readAllDocu = async (req, res) => {
  try {
    const getData = await productModel.find();
    res.status(200).send(getData);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving documents", error });
  }
};



 
// READ DISTINCT CATEGORIES
const getCategories = async (req, res) => {
  try {
    const categories = await productModel.distinct("category");
    res.status(200).send(categories);
  } catch (error) {
    res.status(500).send({ message: "Error getting categories", error });
  }
};


module.exports = {
  createProduct,
  readProduct,
  updateProduct,
  readSingleData,
  deletedata,
  readAllDocu,
  getCategories
};
