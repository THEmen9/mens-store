import express from "express"

import authMiddleware from "../middleware/auth.middleware.js"
import uploadMedia from "../middleware/upload.middleware.js"
import { uploadMediaController } from "../controllers/upload.controller.js"

const router = express.Router()

// Return/Exchange proof upload
router.post(
    "/return-exchange-proof",
    authMiddleware,
    uploadMedia.single("file"),
    uploadMediaController
)

export default router