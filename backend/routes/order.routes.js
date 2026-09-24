import express from "express"
import {createOrderController, getUserOrdersController} from "../controllers/order.controller.js"
import authMiddleware from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/", authMiddleware, createOrderController)
router.get("/", authMiddleware, getUserOrdersController)

export default router;