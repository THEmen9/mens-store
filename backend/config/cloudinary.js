import { v2 as cloudinary } from "cloudinary"

// ====================
// Cloudinary configuration
// ====================
// Credentials backend environment variables se aate hain.
// API secret kabhi frontend/client-side code mein expose nahi hona chahiye.
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary