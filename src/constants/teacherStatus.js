/**
 * Teacher Status Enums
 * Maps to database ENUM('active', 'inactive', 'retired')
 */

export const TEACHER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  RETIRED: "retired",
};

export const TEACHER_STATUS_VALUES = Object.values(TEACHER_STATUS);

export const TEACHER_STATUS_LABELS = {
  [TEACHER_STATUS.ACTIVE]: "Aktif",
  [TEACHER_STATUS.INACTIVE]: "Tidak Aktif",
  [TEACHER_STATUS.RETIRED]: "Pensiun",
};

/**
 * Validate if status is valid
 * @param {string} status
 * @returns {boolean}
 */
export const isValidTeacherStatus = (status) => {
  return TEACHER_STATUS_VALUES.includes(status);
};
