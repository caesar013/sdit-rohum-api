/**
 * Facility Category Enums
 * Maps to database ENUM('classroom', 'laboratory', 'library', 'sports', 'mosque', 'other')
 */

export const FACILITY_CATEGORY = {
  CLASSROOM: "classroom",
  LABORATORY: "laboratory",
  LIBRARY: "library",
  SPORTS: "sports",
  MOSQUE: "mosque",
  OTHER: "other",
};

export const FACILITY_CATEGORY_VALUES = Object.values(FACILITY_CATEGORY);

export const FACILITY_CATEGORY_LABELS = {
  [FACILITY_CATEGORY.CLASSROOM]: "Ruang Kelas",
  [FACILITY_CATEGORY.LABORATORY]: "Laboratorium",
  [FACILITY_CATEGORY.LIBRARY]: "Perpustakaan",
  [FACILITY_CATEGORY.SPORTS]: "Olahraga",
  [FACILITY_CATEGORY.MOSQUE]: "Musholla",
  [FACILITY_CATEGORY.OTHER]: "Lainnya",
};

/**
 * Validate if category is valid
 * @param {string} category
 * @returns {boolean}
 */
export const isValidFacilityCategory = (category) => {
  return FACILITY_CATEGORY_VALUES.includes(category);
};
