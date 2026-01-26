/**
 * Generate URL-friendly slug from text
 * @param {string} text - Text to slugify
 * @returns {string} URL-friendly slug
 */
export const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove non-word chars except -
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start
    .replace(/-+$/, ""); // Trim - from end
};

/**
 * Make slug unique by appending timestamp or counter
 * @param {string} baseSlug - Base slug
 * @param {number} counter - Optional counter for uniqueness
 * @returns {string} Unique slug
 */
export const makeUniqueSlug = (baseSlug, counter = null) => {
  if (counter) {
    return `${baseSlug}-${counter}`;
  }
  return `${baseSlug}-${Date.now()}`;
};

/**
 * Extract excerpt from HTML content
 * @param {string} content - HTML content
 * @param {number} length - Max length of excerpt (default 200)
 * @returns {string} Plain text excerpt
 */
export const generateExcerpt = (content, length = 200) => {
  if (!content) return "";

  // Remove HTML tags
  const plainText = content.replace(/<[^>]*>/g, " ");

  // Remove extra whitespace
  const cleaned = plainText.replace(/\s+/g, " ").trim();

  // Truncate to length
  if (cleaned.length <= length) {
    return cleaned;
  }

  // Cut at last space before length
  const truncated = cleaned.substring(0, length);
  const lastSpace = truncated.lastIndexOf(" ");

  return truncated.substring(0, lastSpace) + "...";
};
