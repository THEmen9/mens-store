import express from "express";
import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/me", authMiddleware, authController.getMe);
router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;