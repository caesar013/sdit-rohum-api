/**
 * News Status Enums
 * Maps to database ENUM('draft', 'published', 'archived')
 */

export const NEWS_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
};

export const NEWS_STATUS_VALUES = Object.values(NEWS_STATUS);

export const NEWS_STATUS_LABELS = {
  [NEWS_STATUS.DRAFT]: "Draft",
  [NEWS_STATUS.PUBLISHED]: "Dipublikasikan",
  [NEWS_STATUS.ARCHIVED]: "Diarsipkan",
};

/**
 * Validate if status is valid
 * @param {string} status
 * @returns {boolean}
 */
export const isValidNewsStatus = (status) => {
  return NEWS_STATUS_VALUES.includes(status);
};
