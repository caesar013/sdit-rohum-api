/**
 * Contact Message Status Enums
 * Maps to database ENUM('unread', 'read', 'replied')
 */

export const CONTACT_STATUS = {
  UNREAD: "unread",
  READ: "read",
  REPLIED: "replied",
};

export const CONTACT_STATUS_VALUES = Object.values(CONTACT_STATUS);

export const CONTACT_STATUS_LABELS = {
  [CONTACT_STATUS.UNREAD]: "Belum Dibaca",
  [CONTACT_STATUS.READ]: "Sudah Dibaca",
  [CONTACT_STATUS.REPLIED]: "Sudah Dibalas",
};

/**
 * Validate if status is valid
 * @param {string} status
 * @returns {boolean}
 */
export const isValidContactStatus = (status) => {
  return CONTACT_STATUS_VALUES.includes(status);
};
