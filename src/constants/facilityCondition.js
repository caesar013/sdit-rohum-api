/**
 * Facility Condition Status Enums
 * Maps to database ENUM('good', 'fair', 'needs_repair')
 */

export const FACILITY_CONDITION = {
  GOOD: "good",
  FAIR: "fair",
  NEEDS_REPAIR: "needs_repair",
};

export const FACILITY_CONDITION_VALUES = Object.values(FACILITY_CONDITION);

export const FACILITY_CONDITION_LABELS = {
  [FACILITY_CONDITION.GOOD]: "Baik",
  [FACILITY_CONDITION.FAIR]: "Cukup",
  [FACILITY_CONDITION.NEEDS_REPAIR]: "Perlu Perbaikan",
};

/**
 * Validate if condition status is valid
 * @param {string} condition
 * @returns {boolean}
 */
export const isValidFacilityCondition = (condition) => {
  return FACILITY_CONDITION_VALUES.includes(condition);
};
