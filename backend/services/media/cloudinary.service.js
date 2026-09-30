import cloudinary from "../../config/cloudinary.js"

// ====================
// Upload media to Cloudinary
// ====================
// Receives a file buffer and uploads it directly to Cloudinary.
// Keeping this generic allows the same service to support
// return/exchange proofs and future product media.
async function uploadMedia(fileBuffer, options = {}) {
    if (!fileBuffer) {
        throw new Error("File buffer is required")
    }

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                // Cloudinary automatically determines whether the asset
                // should be treated as an image or video.
                resource_type: "auto",

                // Automatically optimize the delivered asset format
                // and quality while preserving practical visual quality.
                fetch_format: "auto",
                quality: "auto",

                ...options,
            },
            (error, result) => {
                if (error) {
                    reject(error)
                    return
                }

                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                    resourceType: result.resource_type,
                })
            }
        )

        uploadStream.end(fileBuffer)
    })
}

export { uploadMedia }