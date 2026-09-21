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
const getProducts = async ({
  page = 1,
  limit = 12,
  sort = "newest",
  search = "",
  category = "",
  subcategory = "",
  minPrice,
  maxPrice,
  color,
  size,
  }) => {
  const skip = (page - 1) * limit;

  const sortOptions = {
    newest: { createdAt: -1 },
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
  };

  const sortValue = sortOptions[sort];
  const filter = {
    status: "active",
  };

// Search
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { subcategory: { $regex: search, $options: "i" } },
    ];
  }
// category
  if (category) {
    filter.category = {
      $regex: `^${category}$`,
      $options: "i",
    };
  }
// subcategory
  if (subcategory) {
    filter.subcategory = {
      $regex: `^${subcategory}$`,
      $options: "i",
    };
  }
  // price query
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};

    if (minPrice !== undefined) {
      filter.price.$gte = minPrice;
    }

    if (maxPrice !== undefined) {
      filter.price.$lte = maxPrice;
    }
  }
  //size/color query
  if (color || size) {
    const variantFilter = {};

    if (color) {
      variantFilter.color = {
        $regex: `^${color}$`,
        $options: "i",
      };
    }

    if (size) {
      variantFilter.size = {
        $regex: `^${size}$`,
        $options: "i",
      };
    }

    filter.variants = {
      $elemMatch: variantFilter,
    };
  }

  const [products, totalProducts] = await Promise.all([
    Product.find(filter)
      .sort(sortValue)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
    },
  };
};

// Fetch a product by slug
const getProductBySlug = async (slug) => {
  return Product.findOne({
     "seo.slug": slug,
      status: "active",
    });
};

// Fetch a product by ID
const getProductById = async (id) => {
  return Product.findOne({
    _id: id,
    status: "active",
  });
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