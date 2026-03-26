
import { v2 as cloudinary } from "cloudinary";

/**
 * Uploads a file to Cloudinary
 * @param {Object} file - file object from req.files
 * @param {string} folder - folder path on Cloudinary (e.g., "TRIPKRAFTR_STAGING/ORGANIZATION_LOGO")
 * @returns {Promise<Object>} - resolves with { url, public_id, secure_url, format, size }
 */
export const uploadImageToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error("No file provided"));

    // Options for upload
    const options = {
      folder: folder,
      resource_type: "image", // ensure only images
      use_filename: true,     // keep original file name
      unique_filename: true,  // make unique if same name exists
      overwrite: false,       // don't overwrite existing files
    };

    // Use the mv function buffer if file.tempFilePath exists
    // Otherwise, use file.data as buffer
    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.url,
          secure_url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          size: result.bytes,
        });
      })
      .end(file.data); // send the buffer
  });
};


export const deleteImageFromCloudinary = (publicId) => {
  return new Promise((resolve, reject) => {
    if (!publicId) {
      return reject(new Error("Public ID is required"));
    }

    cloudinary.uploader.destroy(
      publicId,
      { resource_type: "image" }, // important if not default
      (error, result) => {
        if (error) return reject(error);

        resolve({
          result: result.result, // "ok" or "not found"
        });
      }
    );
  });
};