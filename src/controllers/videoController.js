import Video from "../models/Video.js";
import {
  VIDEO_PLATFORM,
  VIDEO_PLATFORM_VALUES,
  VIDEO_PLATFORM_LABELS,
  isValidPlatform,
  getYouTubeId,
  getYouTubeThumbnail,
} from "../constants/videoPlatform.js";

/**
 * Get all videos (public)
 */
export const getAll = async (req, res, next) => {
  try {
    const { page, limit, platform } = req.query;

    const result = await Video.getAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      platform: platform || null,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single video by ID (public)
 * Increments view count
 */
export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const video = await Video.getById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video tidak ditemukan",
      });
    }

    // Increment view count
    await Video.incrementViews(id);
    video.views += 1;

    res.json({
      success: true,
      data: video,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get video platforms enum
 */
export const getPlatforms = async (req, res, next) => {
  try {
    const platforms = VIDEO_PLATFORM_VALUES.map((value) => ({
      value,
      label: VIDEO_PLATFORM_LABELS[value],
    }));

    res.json({
      success: true,
      data: platforms,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new video (admin)
 */
export const create = async (req, res, next) => {
  try {
    const { title, description, video_url, thumbnail_url, platform, duration } =
      req.body;

    // Validation
    if (!title || !video_url) {
      return res.status(400).json({
        success: false,
        message: "Title dan video URL harus diisi",
      });
    }

    if (platform && !isValidPlatform(platform)) {
      return res.status(400).json({
        success: false,
        message: "Platform tidak valid",
      });
    }

    // Auto-generate thumbnail for YouTube if not provided
    let finalThumbnail = thumbnail_url;
    const detectedPlatform = platform || VIDEO_PLATFORM.YOUTUBE;

    if (!finalThumbnail && detectedPlatform === VIDEO_PLATFORM.YOUTUBE) {
      const videoId = getYouTubeId(video_url);
      if (videoId) {
        finalThumbnail = getYouTubeThumbnail(videoId);
      }
    }

    const videoId = await Video.create({
      title,
      description,
      video_url,
      thumbnail_url: finalThumbnail,
      platform: detectedPlatform,
      duration,
    });

    const video = await Video.getById(videoId);

    res.status(201).json({
      success: true,
      message: "Video berhasil ditambahkan",
      data: video,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update video (admin)
 */
export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, video_url, thumbnail_url, platform, duration } =
      req.body;

    const existing = await Video.getById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Video tidak ditemukan",
      });
    }

    // Validation
    if (platform && !isValidPlatform(platform)) {
      return res.status(400).json({
        success: false,
        message: "Platform tidak valid",
      });
    }

    // Auto-generate thumbnail for YouTube if URL changed
    let finalThumbnail = thumbnail_url;
    if (
      video_url &&
      video_url !== existing.video_url &&
      !thumbnail_url &&
      (platform === VIDEO_PLATFORM.YOUTUBE ||
        existing.platform === VIDEO_PLATFORM.YOUTUBE)
    ) {
      const videoId = getYouTubeId(video_url);
      if (videoId) {
        finalThumbnail = getYouTubeThumbnail(videoId);
      }
    }

    await Video.update(id, {
      title,
      description,
      video_url,
      thumbnail_url: finalThumbnail,
      platform,
      duration,
    });

    const updated = await Video.getById(id);

    res.json({
      success: true,
      message: "Video berhasil diupdate",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete video (admin)
 */
export const deleteVideo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const video = await Video.getById(id);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video tidak ditemukan",
      });
    }

    await Video.delete(id);

    res.json({
      success: true,
      message: "Video berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};
