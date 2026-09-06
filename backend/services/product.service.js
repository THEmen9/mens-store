import Product from "../models/Product.js";

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
  const { name, images = [] } = productData;

  const slug = generateSlug(name);

  const formattedImages = images.map((image, index) => ({
    ...image,
    position: index,
  }));

  const product = new Product({
    ...productData,
    images: formattedImages,
    seo: {
      ...productData.seo,
      slug,
    },
  });

  return product.save();
};

export default {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
};