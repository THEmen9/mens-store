    import multer from "multer"

    // Multer storage

    const storage = multer.memoryStorage()

    // Allowed media types
    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "video/mp4",
        "video/quicktime",
    ]

    //  File validation

    function fileFilter(req, file, callback) {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return callback(
                new Error("Unsupported file type"),
                false
            )
        }

        callback(null, true)
    }

    //  Upload middleware

    const uploadMedia = multer({
        storage,
        fileFilter,
        limits: {
            fileSize: 20 * 1024 * 1024, // 20 MB maximum
        },

    })

    // ==================== Feature-specific Size Validation ====================

    function validateReturnExchangeProofSize(req, res, next) {
        if (!req.file) {
            return next()
        }

        const fileSize = req.file.size

        // Return/exchange proof images are limited to 5 MB.
        if (req.file.mimetype.startsWith("image/")) {
            if (fileSize > 5 * 1024 * 1024) {
                const error = new Error(
                    "Image proof must be 5 MB or smaller"
                )
                error.statusCode = 400

                return next(error)
            }
        }

        // Return/exchange proof videos can be up to 20 MB.
        if (req.file.mimetype.startsWith("video/")) {
            if (fileSize > 20 * 1024 * 1024) {
                const error = new Error(
                    "Video proof must be 20 MB or smaller"
                )
                error.statusCode = 400

                return next(error)
            }
        }

        next()
    }

export { validateReturnExchangeProofSize };
export default uploadMedia;