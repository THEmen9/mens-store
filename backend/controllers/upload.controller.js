import { uploadMedia } from "../services/media/cloudinary.service.js"

// Upload media
async function uploadMediaController(req, res, next) {
    try {
        if (!req.file) {
            const error = new Error("File is required")
            error.statusCode = 400

            throw error
        }

        const uploadedMedia = await uploadMedia(
            req.file.buffer,
            {
                folder: "mens-store/return-exchange",
            }
        )

        res.status(201).json({
            success: true,
            message: "Media uploaded successfully",
            data: uploadedMedia,
        })
    } catch (error) {
        // Pass upload/service errors to the centralized error handler.
        next(error)
    }
}

export { uploadMediaController }