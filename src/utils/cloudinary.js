import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

console.log("\n" + "=".repeat(50));
console.log("CLOUDINARY INITIALIZATION");
console.log("=".repeat(50));

// Log config (but hide full secrets)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API key exists:", !!process.env.CLOUDINARY_API_KEY);
console.log(
  "API key first 5 chars:",
  process.env.CLOUDINARY_API_KEY?.substring(0, 5) + "..."
);
console.log("API secret exists:", !!process.env.CLOUDINARY_API_SECRET);
console.log(
  "API secret first 5 chars:",
  process.env.CLOUDINARY_API_SECRET?.substring(0, 5) + "..."
);

const uploadCloudinary = async (localFilePath) => {
  console.log("\n CLOUDINARY UPLOAD FUNCTION CALLED");
  console.log("Local file path:", localFilePath);

  try {
    if (!localFilePath) {
      console.log("No local file path provided");
      return null;
    }

    // Check if file exists
    if (!fs.existsSync(localFilePath)) {
      console.log("File does not exist:", localFilePath);
      return null;
    }

    const fileStats = fs.statSync(localFilePath);
    console.log("File exists");
    console.log("- File size:", fileStats.size, "bytes");
    console.log("- Is file?", fileStats.isFile());

    // Read first few bytes to check file content
    const buffer = fs.readFileSync(localFilePath);
    console.log(
      "- First 100 bytes (hex):",
      buffer.toString("hex").substring(0, 200)
    );

    console.log("🔄 Attempting Cloudinary upload...");

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("Cloudinary upload successful!");
    console.log("- Response received:", {
      url: response.url,
      public_id: response.public_id,
      format: response.format,
      bytes: response.bytes,
    });

    // Delete local file
    fs.unlinkSync(localFilePath);
    console.log("🗑️ Local file deleted");

    return response;
  } catch (error) {
    console.log("CLOUDINARY UPLOAD ERROR:");
    console.log("- Error name:", error.name);
    console.log("- Error message:", error.message);
    console.log("- Error code:", error.error?.http_code || "N/A");
    console.log("- Full error:", error);

    // Clean up local file
    if (localFilePath && fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
        console.log("🗑️ Removed local file after error");
      } catch (unlinkError) {
        console.log("⚠️ Could not remove local file:", unlinkError.message);
      }
    }

    return null;
  }
};

export { uploadCloudinary };
