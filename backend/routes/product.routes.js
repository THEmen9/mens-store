import express from "express";
import productController from "../controllers/product.controller.js";

// Create product router
const router = express.Router();

// Fetch all products
router.get("/", productController.getProducts);

// Fetch a product by ID
router.get("/:id", productController.getProductById);

export default router;