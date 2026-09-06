import Product from "../models/Product.js";

// unique slug generation function
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Check for duplicate color and size combinations in variants
const checkVariants = (variants) => {
  const combinations = new Set();

  for (const variant of variants) {
    const combination = `${variant.color.toLowerCase()}-${variant.size.toLowerCase()}`;

    if (combinations.has(combination)) {
      const error = new Error(
        "Duplicate color and size combination is not allowed"
      );

      error.statusCode = 400;
      error.errors = [
        {
          field: "variants",
          message: "Duplicate color and size combination is not allowed",
        },
      ];

      throw error;
    }

    combinations.add(combination);
  }
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

  return product.save();
};

export default {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
};