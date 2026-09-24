import express from "express"
import { createOrderController } from "../controllers/order.controller.js"
import authMiddleware from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/", authMiddleware, createOrderController)

export default router;