import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import {
    createReturnExchangeController,
    getReturnExchangeEligibilityController,
    getReturnExchangeRequestsByOrderController,
    getUserReturnExchangeRequestsController
} from "../controllers/returnExchange.controller.js"

const router = express.Router();

// Customer creates a return or exchange request.
router.post( "/", authMiddleware, createReturnExchangeController );

// Customer fetches all return/exchange requests for the authenticated user.
router.get( "/my", authMiddleware, getUserReturnExchangeRequestsController );

// Customer fetches all return/exchange requests for a specific order.
router.get("/order/:orderId", authMiddleware, getReturnExchangeRequestsByOrderController );

// Checks Return/Exchange eligibility for every item in the order.
router.get( "/order/:orderId/eligibility", authMiddleware, getReturnExchangeEligibilityController );

export default router;