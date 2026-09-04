import Product from "../models/Product.js";

const getProducts = async () => {
  return Product.find();
};

export default {
  getProducts,
};