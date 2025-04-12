import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from 'dotenv';

// Ensure this runs BEFORE config
dotenv.config({ path: '.env' }); 

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("No file path provided for upload");
      return null;
    }

    // Check if file exists
    if (!fs.existsSync(localFilePath)) {
      console.log("File does not exist at path:", localFilePath);
      return null;
    }

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, { 
      resource_type: "auto",
      folder: "user-uploads" // Optional: Organize files in a folder
    });

    // console.log("File uploaded successfully:", response.url);
    
    // Clean up local file after successful upload
    fs.unlinkSync(localFilePath);
    
    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    
    // Clean up local file if it exists
    if (localFilePath && fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
      } catch (cleanupError) {
        console.error("Error cleaning up local file:", cleanupError);
      }
    }
    
    return null;
  }
};

export { uploadOnCloudinary }