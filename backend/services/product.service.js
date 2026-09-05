import Product from "../models/Product.js";

// Fetch all products
const getProducts = async () => {
  return Product.find();
};

// Fetch a product by ID
const getProductById = async (id) => {
  return Product.findById(id);
};

export default {
  getProducts,
  getProductById,
};