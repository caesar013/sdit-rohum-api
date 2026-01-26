/**
 * News Category Enums
 * Maps to database ENUM('announcement', 'event', 'achievement', 'general')
 */

export const NEWS_CATEGORY = {
  ANNOUNCEMENT: "announcement",
  EVENT: "event",
  ACHIEVEMENT: "achievement",
  GENERAL: "general",
};

export const NEWS_CATEGORY_VALUES = Object.values(NEWS_CATEGORY);

export const NEWS_CATEGORY_LABELS = {
  [NEWS_CATEGORY.ANNOUNCEMENT]: "Pengumuman",
  [NEWS_CATEGORY.EVENT]: "Acara",
  [NEWS_CATEGORY.ACHIEVEMENT]: "Prestasi",
  [NEWS_CATEGORY.GENERAL]: "Umum",
};

/**
 * Validate if category is valid
 * @param {string} category
 * @returns {boolean}
 */
export const isValidNewsCategory = (category) => {
  return NEWS_CATEGORY_VALUES.includes(category);
};
