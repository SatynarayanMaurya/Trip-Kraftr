import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

export const connectCloudinary = () => {
  try {
    const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
      process.env;

    // Validate environment variables
    if (!CLOUDINARY_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      throw new Error("Missing Cloudinary environment variables");
    }

    cloudinary.config({
      cloud_name: CLOUDINARY_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });

    console.log("✅ Cloudinary Connected");
  } catch (error) {
    console.error("❌ Cloudinary Connection Failed:", error.message);
    process.exit(1); 
  }
};