import productService from "../services/product.service.js";

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

export default {
  getProducts,
};