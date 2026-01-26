/**
 * Video Platform Enums
 * Maps to database ENUM('youtube', 'vimeo', 'other')
 */

export const VIDEO_PLATFORM = {
  YOUTUBE: 'youtube',
  VIMEO: 'vimeo',
  OTHER: 'other',
};

export const VIDEO_PLATFORM_VALUES = Object.values(VIDEO_PLATFORM);

export const VIDEO_PLATFORM_LABELS = {
  [VIDEO_PLATFORM.YOUTUBE]: 'YouTube',
  [VIDEO_PLATFORM.VIMEO]: 'Vimeo',
  [VIDEO_PLATFORM.OTHER]: 'Other',
};

/**
 * Validate if platform is valid
 * @param {string} platform
 * @returns {boolean}
 */
export const isValidPlatform = (platform) => {
  return VIDEO_PLATFORM_VALUES.includes(platform);
};

/**
 * Extract YouTube video ID from URL
 * @param {string} url
 * @returns {string|null}
 */
export const getYouTubeId = (url) => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

/**
 * Generate YouTube thumbnail URL
 * @param {string} videoId
 * @param {string} quality - default, hqdefault, mqdefault, sddefault, maxresdefault
 * @returns {string}
 */
export const getYouTubeThumbnail = (videoId, quality = 'hqdefault') => {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};

/**
 * Extract Vimeo video ID from URL
 * @param {string} url
 * @returns {string|null}
 */
export const getVimeoId = (url) => {
  const regex = /vimeo\.com\/(?:video\/)?(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};
