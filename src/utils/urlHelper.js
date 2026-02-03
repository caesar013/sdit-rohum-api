/**
 * Convert relative upload path to full URL
 * @param {string} relativePath - Relative path like "/uploads/photos/image.jpg"
 * @returns {string} - Full URL like "http://localhost:3000/uploads/photos/image.jpg"
 */
export const getImageUrl = (relativePath) => {
  if (!relativePath) return null;

  // If already a full URL, return as is
  if (
    relativePath.startsWith("http://") ||
    relativePath.startsWith("https://")
  ) {
    return relativePath;
  }

  const apiUrl =
    process.env.API_URL || `http://localhost:${process.env.PORT || 3000}`;

  // Remove leading slash if present to avoid double slashes
  const path = relativePath.startsWith("/")
    ? relativePath.slice(1)
    : relativePath;

  return `${apiUrl}/${path}`;
};

/**
 * Transform object with image fields to include full URLs
 * @param {Object} obj - Object with image paths
 * @param {Array} imageFields - Array of field names that contain image paths
 * @returns {Object} - Object with full image URLs
 */
export const transformImageUrls = (obj, imageFields = []) => {
  if (!obj) return obj;

  const transformed = { ...obj };

  imageFields.forEach((field) => {
    if (transformed[field]) {
      transformed[field] = getImageUrl(transformed[field]);
    }
  });

  return transformed;
};

/**
 * Transform array of objects with image fields
 * @param {Array} arr - Array of objects
 * @param {Array} imageFields - Array of field names that contain image paths
 * @returns {Array} - Array with transformed objects
 */
export const transformImageUrlsArray = (arr, imageFields = []) => {
  if (!Array.isArray(arr)) return arr;

  return arr.map((item) => transformImageUrls(item, imageFields));
};
