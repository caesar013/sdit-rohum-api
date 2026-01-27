/**
 * Achievement Category Enums
 * Maps to database ENUM('academic', 'sport', 'art', 'other')
 */

export const ACHIEVEMENT_CATEGORY = {
  ACADEMIC: "academic",
  SPORT: "sport",
  ART: "art",
  OTHER: "other",
};

export const ACHIEVEMENT_CATEGORY_VALUES = Object.values(ACHIEVEMENT_CATEGORY);

export const ACHIEVEMENT_CATEGORY_LABELS = {
  [ACHIEVEMENT_CATEGORY.ACADEMIC]: "Akademik",
  [ACHIEVEMENT_CATEGORY.SPORT]: "Olahraga",
  [ACHIEVEMENT_CATEGORY.ART]: "Seni",
  [ACHIEVEMENT_CATEGORY.OTHER]: "Lainnya",
};

/**
 * Validate if category is valid
 * @param {string} category
 * @returns {boolean}
 */
export const isValidAchievementCategory = (category) => {
  return ACHIEVEMENT_CATEGORY_VALUES.includes(category);
};
