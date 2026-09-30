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

export default uploadMedia