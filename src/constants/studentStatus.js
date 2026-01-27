/**
 * Student Status Enums
 * Maps to database ENUM('active', 'inactive', 'graduated', 'transferred')
 */

export const STUDENT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  GRADUATED: "graduated",
  TRANSFERRED: "transferred",
};

export const STUDENT_STATUS_VALUES = Object.values(STUDENT_STATUS);

export const STUDENT_STATUS_LABELS = {
  [STUDENT_STATUS.ACTIVE]: "Aktif",
  [STUDENT_STATUS.INACTIVE]: "Tidak Aktif",
  [STUDENT_STATUS.GRADUATED]: "Lulus",
  [STUDENT_STATUS.TRANSFERRED]: "Pindah",
};

/**
 * Validate if status is valid
 * @param {string} status
 * @returns {boolean}
 */
export const isValidStudentStatus = (status) => {
  return STUDENT_STATUS_VALUES.includes(status);
};
