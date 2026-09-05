import productService from "../services/product.service.js";
import isValidObjectId from "../utils/isValidObjectId.js";

// Fetch all products
const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getProducts();

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// Fetch a product by ID
const getProductById = async (req, res, next) => {
  try {
    // Validate the product ID
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }
    const product = await productService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getProducts,
  getProductById,
};