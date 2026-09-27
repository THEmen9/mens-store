import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import {
    createOrderController,
    getUserOrdersController,
    getOrderByIdController,
    cancelOrderController
    } from "../controllers/order.controller.js"

const router = express.Router()
// create-order-route
router.post("/", authMiddleware, createOrderController);
// get-user-orders
router.get("/", authMiddleware, getUserOrdersController);
// order cancel
router.post("/:id/cancel", authMiddleware, cancelOrderController);
// get-order-details
router.get("/:id", authMiddleware, getOrderByIdController);

export default router;