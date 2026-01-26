import sharp from "sharp";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

/**
 * Generate a perceptual hash of an image
 * @param {string} filePath - Path to the image file
 * @returns {Promise<string>} - Hash string
 */
export const getImageHash = async (filePath) => {
  try {
    // Resize to 8x8, convert to grayscale, get raw pixel data
    const buffer = await sharp(filePath)
      .resize(8, 8, { fit: "fill" })
      .grayscale()
      .raw()
      .toBuffer();

    // Calculate average pixel value
    const avg = buffer.reduce((sum, val) => sum + val, 0) / buffer.length;

    // Create hash based on whether each pixel is above/below average
    let hash = "";
    for (let i = 0; i < buffer.length; i++) {
      hash += buffer[i] > avg ? "1" : "0";
    }

    return hash;
  } catch (error) {
    console.error("Error generating image hash:", error);
    return null;
  }
};

/**
 * Calculate file hash (MD5) for exact file comparison
 * @param {string} filePath - Path to the file
 * @returns {Promise<string>} - MD5 hash
 */
export const getFileHash = async (filePath) => {
  try {
    const buffer = await fs.readFile(filePath);
    return crypto.createHash("md5").update(buffer).digest("hex");
  } catch (error) {
    console.error("Error generating file hash:", error);
    return null;
  }
};

/**
 * Compare two images to check if they are the same
 * @param {string} path1 - Path to first image
 * @param {string} path2 - Path to second image
 * @returns {Promise<boolean>} - True if images are the same
 */
export const areImagesSame = async (path1, path2) => {
  try {
    // First quick check: file hash (exact match)
    const hash1 = await getFileHash(path1);
    const hash2 = await getFileHash(path2);

    if (hash1 === hash2) {
      return true; // Exact same file
    }

    // Perceptual hash comparison (visually similar)
    const imgHash1 = await getImageHash(path1);
    const imgHash2 = await getImageHash(path2);

    if (!imgHash1 || !imgHash2) {
      return false;
    }

    // Calculate Hamming distance (number of different bits)
    let distance = 0;
    for (let i = 0; i < imgHash1.length; i++) {
      if (imgHash1[i] !== imgHash2[i]) {
        distance++;
      }
    }

    // If less than 5% bits differ, consider images the same
    const threshold = imgHash1.length * 0.05;
    return distance <= threshold;
  } catch (error) {
    console.error("Error comparing images:", error);
    return false;
  }
};

/**
 * Get image metadata
 * @param {string} filePath - Path to the image
 * @returns {Promise<Object>} - Image metadata
 */
export const getImageMetadata = async (filePath) => {
  try {
    const metadata = await sharp(filePath).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: metadata.size,
    };
  } catch (error) {
    console.error("Error getting image metadata:", error);
    return null;
  }
};

/**
 * Delete file safely
 * @param {string} filePath - Path to the file
 * @returns {Promise<boolean>} - Success status
 */
export const deleteFileSafe = async (filePath) => {
  try {
    if (!filePath) return false;

    const fullPath = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), filePath);

    await fs.access(fullPath);
    await fs.unlink(fullPath);
    console.log(`✅ Deleted file: ${filePath}`);
    return true;
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error(`Error deleting file ${filePath}:`, error);
    }
    return false;
  }
};

/**
 * Handle image update with duplicate detection
 * @param {Object} options - Options object
 * @param {string} options.newImagePath - Path to newly uploaded image
 * @param {string} options.oldImagePath - Path to existing image (optional)
 * @returns {Promise<Object>} - Result object
 */
export const handleImageUpdate = async ({ newImagePath, oldImagePath }) => {
  try {
    // If no old image, just return the new one
    if (!oldImagePath) {
      return {
        updated: true,
        imagePath: newImagePath,
        message: "New image uploaded",
      };
    }

    const oldFullPath = path.join(process.cwd(), oldImagePath);

    // Check if old file exists
    try {
      await fs.access(oldFullPath);
    } catch {
      // Old file doesn't exist, use new one
      return {
        updated: true,
        imagePath: newImagePath,
        message: "Old image not found, using new image",
      };
    }

    // Compare images
    const isSame = await areImagesSame(newImagePath, oldFullPath);

    if (isSame) {
      // Images are the same, delete new upload and keep old
      await deleteFileSafe(newImagePath);
      return {
        updated: false,
        imagePath: oldImagePath,
        message: "Image is the same, keeping existing image",
      };
    } else {
      // Images are different, delete old and use new
      await deleteFileSafe(oldFullPath);
      return {
        updated: true,
        imagePath: newImagePath,
        message: "Image updated successfully",
      };
    }
  } catch (error) {
    console.error("Error handling image update:", error);
    // On error, keep the new image
    return {
      updated: true,
      imagePath: newImagePath,
      message: "Image updated (comparison failed)",
      error: error.message,
    };
  }
};
