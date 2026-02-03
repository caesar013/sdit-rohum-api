import Alumni from "../models/Alumni.js";
import { handleImageUpdate } from "../utils/imageHelper.js";
import { ALUMNI_STATUS } from "../constants/index.js";
import {
  transformImageUrls,
  transformImageUrlsArray,
} from "../utils/urlHelper.js";

/**
 * Get all alumni
 * Public: only approved
 * Admin: all with filters
 */
export const getAllAlumni = async (req, res) => {
  try {
    const { page, limit, registration_status, graduation_year, gender } =
      req.query;
    const isAdmin = req.user?.role === "admin";

    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      // Public only sees approved alumni
      registration_status: isAdmin ? registration_status : "approved",
      graduation_year: graduation_year ? parseInt(graduation_year) : null,
      gender,
    };

    const result = await Alumni.getAll(options);
    const transformedData = transformImageUrlsArray(result.data, ["photo_url"]);

    res.json({
      success: true,
      data: transformedData,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching alumni:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching alumni",
    });
  }
};

/**
 * Get alumni by ID
 */
export const getAlumniById = async (req, res) => {
  try {
    const { id } = req.params;
    const alumni = await Alumni.getById(id);

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    // Public can only view approved alumni
    const isAdmin = req.user?.role === "admin";
    if (!isAdmin && alumni.registration_status !== "approved") {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    const transformedAlumni = transformImageUrls(alumni, ["photo_url"]);
    res.json({
      success: true,
      data: transformedAlumni,
    });
  } catch (error) {
    console.error("Error fetching alumni:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching alumni",
    });
  }
};

/**
 * Create new alumni (public self-registration)
 */
export const createAlumni = async (req, res) => {
  try {
    const {
      nisn,
      name,
      gender,
      graduation_year,
      current_school,
      current_occupation,
      phone,
      email,
      address,
    } = req.body;

    // Validate required fields
    if (!nisn || !name || !gender || !graduation_year || !phone) {
      return res.status(400).json({
        success: false,
        message: "Required fields: nisn, name, gender, graduation_year, phone",
      });
    }

    // Handle photo upload
    let photo_url = null;
    if (req.file) {
      const result = await handleImageUpdate({
        newImagePath: req.file.path,
        oldImagePath: null,
      });
      photo_url = result.finalPath;
    }

    // Create alumni with pending status
    const alumniData = {
      nisn,
      name,
      photo_url,
      gender,
      graduation_year: parseInt(graduation_year),
      current_school,
      current_occupation,
      phone,
      email,
      address,
      registration_status: "pending", // Always pending for public registration
    };

    const alumniId = await Alumni.create(alumniData);
    const newAlumni = await Alumni.getById(alumniId);
    const transformedAlumni = transformImageUrls(newAlumni, ["photo_url"]);

    res.status(201).json({
      success: true,
      message:
        "Alumni registration submitted successfully. Awaiting admin approval.",
      data: transformedAlumni,
    });
  } catch (error) {
    console.error("Error creating alumni:", error);

    // Check for duplicate NISN
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Alumni with this NISN already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating alumni",
    });
  }
};

/**
 * Update alumni (admin only for approval)
 */
export const updateAlumni = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if alumni exists
    const existingAlumni = await Alumni.getById(id);
    if (!existingAlumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    const updateData = { ...req.body };

    // Handle photo update
    if (req.file) {
      const result = await handleImageUpdate({
        newImagePath: req.file.path,
        oldImagePath: existingAlumni.photo_url,
      });
      updateData.photo_url = result.finalPath;
    }

    const affectedRows = await Alumni.update(id, updateData);

    if (affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: "No changes made",
      });
    }

    const updatedAlumni = await Alumni.getById(id);
    const transformedAlumni = transformImageUrls(updatedAlumni, ["photo_url"]);

    res.json({
      success: true,
      message: "Alumni updated successfully",
      data: transformedAlumni,
    });
  } catch (error) {
    console.error("Error updating alumni:", error);

    // Check for duplicate NISN
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Alumni with this NISN already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating alumni",
    });
  }
};

/**
 * Update alumni registration status (admin only)
 */
export const updateAlumniStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { registration_status } = req.body;

    if (!registration_status) {
      return res.status(400).json({
        success: false,
        message: "registration_status is required",
      });
    }

    // Validate status
    const validStatuses = Object.keys(ALUMNI_STATUS);
    if (!validStatuses.includes(registration_status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // Check if alumni exists
    const alumni = await Alumni.getById(id);
    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    await Alumni.update(id, { registration_status });
    const updatedAlumni = await Alumni.getById(id);
    const transformedAlumni = transformImageUrls(updatedAlumni, ["photo_url"]);

    res.json({
      success: true,
      message: "Alumni status updated successfully",
      data: transformedAlumni,
    });
  } catch (error) {
    console.error("Error updating alumni status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating alumni status",
    });
  }
};

/**
 * Delete alumni
 */
export const deleteAlumni = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if alumni exists
    const alumni = await Alumni.getById(id);
    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    await Alumni.delete(id);

    res.json({
      success: true,
      message: "Alumni deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting alumni:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting alumni",
    });
  }
};

/**
 * Get available graduation years
 */
export const getGraduationYears = async (req, res) => {
  try {
    const years = await Alumni.getAvailableYears();

    res.json({
      success: true,
      data: years,
    });
  } catch (error) {
    console.error("Error fetching graduation years:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching graduation years",
    });
  }
};

/**
 * Get registration status counts (admin only)
 */
export const getStatusCounts = async (req, res) => {
  try {
    const counts = await Alumni.getStatusCounts();

    res.json({
      success: true,
      data: counts,
    });
  } catch (error) {
    console.error("Error fetching status counts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching status counts",
    });
  }
};

/**
 * Get alumni statuses (for form dropdown)
 */
export const getAlumniStatuses = async (req, res) => {
  try {
    res.json({
      success: true,
      data: Object.values(ALUMNI_STATUS),
    });
  } catch (error) {
    console.error("Error fetching alumni statuses:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching alumni statuses",
    });
  }
};
