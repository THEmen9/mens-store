import express from "express";
import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/me", authMiddleware, authController.getMe);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/addresses", authMiddleware, authController.addAddress);
router.get("/addresses", authMiddleware, authController.getAddresses);
router.patch('/addresses/:addressId/default',authMiddleware,authController.setDefaultAddress);
router.delete('/addresses/:addressId',authMiddleware,authController.deleteAddress);

export default router;