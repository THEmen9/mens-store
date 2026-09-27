import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import {
    createReturnExchangeController,
} from "../controllers/returnExchange.controller.js"

const router = express.Router();

// Customer creates a return or exchange request.
router.post( "/", authMiddleware, createReturnExchangeController );

export default router;