import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import {
    createOrderController,
    getUserOrdersController,
    getOrderByIdController
    } from "../controllers/order.controller.js"

const router = express.Router()
// create-order-route
router.post("/", authMiddleware, createOrderController);
// get-user-orders
router.get("/", authMiddleware, getUserOrdersController);
// get-order-details
router.get("/:id", authMiddleware, getOrderByIdController);

export default router;