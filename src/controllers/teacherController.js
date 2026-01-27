import Teacher from "../models/Teacher.js";
import {
  TEACHER_STATUS_VALUES,
  TEACHER_STATUS_LABELS,
} from "../constants/teacherStatus.js";
import { deleteFile } from "../utils/fileHelper.js";
import { handleImageUpdate } from "../utils/imageHelper.js";

/**
 * Get all teachers (public)
 */
export const getAllTeachers = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;

    // Validate status if provided
    if (status && !TEACHER_STATUS_VALUES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status tidak valid",
      });
    }

    const result = await Teacher.getAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      status,
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
 * Get teacher by ID (public)
 */
export const getTeacherById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.getById(id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Guru tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: teacher,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get teacher statuses (public)
 */
export const getStatuses = async (req, res, next) => {
  try {
    const statuses = TEACHER_STATUS_VALUES.map((value) => ({
      value,
      label: TEACHER_STATUS_LABELS[value],
    }));

    res.json({
      success: true,
      data: statuses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get status counts (admin)
 */
export const getStatusCounts = async (req, res, next) => {
  try {
    const counts = await Teacher.getStatusCounts();

    res.json({
      success: true,
      data: counts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new teacher (admin)
 */
export const createTeacher = async (req, res, next) => {
  try {
    const {
      nip,
      name,
      position,
      subject,
      status,
      education_level,
      phone,
      email,
      joined_date,
      bio,
    } = req.body;

    // Validation
    if (!name) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "Nama harus diisi",
      });
    }

    // Validate status if provided
    if (status && !TEACHER_STATUS_VALUES.includes(status)) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "Status tidak valid",
      });
    }

    // Get photo from upload if exists
    const photo_url = req.file ? `/uploads/photos/${req.file.filename}` : null;

    const teacherId = await Teacher.create({
      nip,
      name,
      photo_url,
      position,
      subject,
      status,
      education_level,
      phone,
      email,
      joined_date,
      bio,
    });

    const teacher = await Teacher.getById(teacherId);

    res.status(201).json({
      success: true,
      message: "Guru berhasil ditambahkan",
      data: teacher,
    });
  } catch (error) {
    if (req.file) {
      deleteFile(req.file.path);
    }
    next(error);
  }
};

/**
 * Update teacher (admin)
 */
export const updateTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      nip,
      name,
      position,
      subject,
      status,
      education_level,
      phone,
      email,
      joined_date,
      bio,
    } = req.body;

    const existing = await Teacher.getById(id);
    if (!existing) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(404).json({
        success: false,
        message: "Guru tidak ditemukan",
      });
    }

    // Validate status if provided
    if (status && !TEACHER_STATUS_VALUES.includes(status)) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "Status tidak valid",
      });
    }

    // Handle new photo with smart comparison
    let photo_url = existing.photo_url;
    if (req.file) {
      const newImagePath = req.file.path;
      const oldImagePath = existing.photo_url ? `.${existing.photo_url}` : null;

      const result = await handleImageUpdate({
        newImagePath,
        oldImagePath,
      });

      // Use the resolved image path (either old or new)
      photo_url = result.imagePath.startsWith("/uploads")
        ? result.imagePath
        : `/uploads/photos/${req.file.filename}`;

      console.log(`📸 Teacher photo update: ${result.message}`);
    }

    await Teacher.update(id, {
      nip,
      name,
      photo_url,
      position,
      subject,
      status,
      education_level,
      phone,
      email,
      joined_date,
      bio,
    });

    const updated = await Teacher.getById(id);

    res.json({
      success: true,
      message: "Data guru berhasil diupdate",
      data: updated,
    });
  } catch (error) {
    if (req.file) {
      deleteFile(req.file.path);
    }
    next(error);
  }
};

/**
 * Delete teacher (admin)
 */
export const deleteTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.getById(id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Guru tidak ditemukan",
      });
    }

    // Delete photo if exists
    if (teacher.photo_url) {
      deleteFile(`.${teacher.photo_url}`);
    }

    await Teacher.delete(id);

    res.json({
      success: true,
      message: "Guru berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};
