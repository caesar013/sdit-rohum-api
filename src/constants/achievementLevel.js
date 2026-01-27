/**
 * Achievement Level Enums
 * Maps to database ENUM('school', 'district', 'city', 'province', 'national', 'international')
 */

export const ACHIEVEMENT_LEVEL = {
  SCHOOL: "school",
  DISTRICT: "district",
  CITY: "city",
  PROVINCE: "province",
  NATIONAL: "national",
  INTERNATIONAL: "international",
};

export const ACHIEVEMENT_LEVEL_VALUES = Object.values(ACHIEVEMENT_LEVEL);

export const ACHIEVEMENT_LEVEL_LABELS = {
  [ACHIEVEMENT_LEVEL.SCHOOL]: "Sekolah",
  [ACHIEVEMENT_LEVEL.DISTRICT]: "Kecamatan",
  [ACHIEVEMENT_LEVEL.CITY]: "Kota/Kabupaten",
  [ACHIEVEMENT_LEVEL.PROVINCE]: "Provinsi",
  [ACHIEVEMENT_LEVEL.NATIONAL]: "Nasional",
  [ACHIEVEMENT_LEVEL.INTERNATIONAL]: "Internasional",
};

/**
 * Validate if level is valid
 * @param {string} level
 * @returns {boolean}
 */
export const isValidAchievementLevel = (level) => {
  return ACHIEVEMENT_LEVEL_VALUES.includes(level);
};
