import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (
  file: string,
  folder: string = "products"
): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: `handcrafted-gifts/${folder}`,
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload image");
  }
};

export const uploadFromUrl = async (
  url: string,
  folder: string = "products"
): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(url, {
      folder: `handcrafted-gifts/${folder}`,
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading from URL to Cloudinary:", error);
    throw new Error("Failed to upload image from URL");
  }
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw new Error("Failed to delete image");
  }
};

export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;

    const pathAfterUpload = parts.slice(uploadIndex + 2).join("/");
    const publicId = pathAfterUpload.split(".")[0];

    return publicId;
  } catch (error) {
    console.error("Error extracting public ID from URL:", error);
    return null;
  }
};

export const deleteImageByUrl = async (url: string): Promise<void> => {
  try {
    const publicId = extractPublicIdFromUrl(url);
    if (publicId) {
      await deleteFromCloudinary(publicId);
    }
  } catch (error) {
    console.error("Error deleting image by URL:", error);
  }
};

export default cloudinary;
