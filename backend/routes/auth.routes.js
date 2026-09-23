import express from "express";
import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/me", authMiddleware, authController.getMe);
router.get("/addresses", authMiddleware, authController.getAddresses);

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/addresses", authMiddleware, authController.addAddress);

router.patch('/addresses/:addressId/default',authMiddleware,authController.setDefaultAddress);
router.patch('/addresses/:addressId',authMiddleware,authController.updateAddress);

router.delete('/addresses/:addressId',authMiddleware,authController.deleteAddress);

export default router;