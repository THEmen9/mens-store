import Product from "../models/Product.js";
import checkVariants from "../utils/checkVariants.js";
import calculateDiscount from "../utils/calculateDiscount.js";

// unique slug generation function
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Fetch all products
const getProducts = async () => {
  return Product.find();
};

// Fetch a product by slug
const getProductBySlug = async (slug) => {
  return Product.findOne({ "seo.slug": slug });
};

// Fetch a product by ID
const getProductById = async (id) => {
  return Product.findById(id);
};

// Create a new product
const createProduct = async (productData) => {

  const { name, images = [], variants = [] } = productData;
  const slug = generateSlug(name);

  const formattedImages = images.map((image, index) => ({
    ...image,
    position: index,
  }));

  checkVariants(variants);
  const product = new Product({
    ...productData,
    images: formattedImages,
    seo: {
      ...productData.seo,
      slug,
    },
  });

  const savedProduct = await product.save();

  const discount = calculateDiscount(
    savedProduct.price,
    savedProduct.compareAtPrice
  );
    return {
    product: savedProduct,
    discount,
  };

};

export default {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
};