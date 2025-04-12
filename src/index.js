import connectDB from "./db/index.js"
import dotenv from "dotenv"
import app from "./app.js"

dotenv.config({
    path: ".env"
})

// Log configuration for debugging
// console.log("Cloudinary Configuration:");
// console.log("cloud_name:", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("api_key:", process.env.CLOUDINARY_API_KEY);
// console.log("api_secret:", process.env.CLOUDINARY_API_SECRET ? "***" : "not set");

connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`)
    })  
})
.catch((error) => {
    console.log("MongoDB connection failed", error)
    process.exit(1)
})