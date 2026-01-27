/**
 * Alumni Registration Status Enums
 * Maps to database ENUM('pending', 'approved', 'rejected')
 */

export const ALUMNI_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const ALUMNI_STATUS_VALUES = Object.values(ALUMNI_STATUS);

export const ALUMNI_STATUS_LABELS = {
  [ALUMNI_STATUS.PENDING]: "Menunggu Persetujuan",
  [ALUMNI_STATUS.APPROVED]: "Disetujui",
  [ALUMNI_STATUS.REJECTED]: "Ditolak",
};

/**
 * Validate if status is valid
 * @param {string} status
 * @returns {boolean}
 */
export const isValidAlumniStatus = (status) => {
  return ALUMNI_STATUS_VALUES.includes(status);
};
