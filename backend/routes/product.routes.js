import express from "express";
import productController from "../controllers/product.controller.js";

const app = express();

// Create a router for product-related routes
const router = express.Router();

// Fetch all products
router.get("/", productController.getProducts);
// Fetch a product by slug
router.get("/slug/:slug", productController.getProductBySlug);
// Fetch a product by ID
router.get("/:id", productController.getProductById);

// Create a new product
router.post("/", productController.createProduct);

export default router;