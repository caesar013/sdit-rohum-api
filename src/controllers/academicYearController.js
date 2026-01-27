import AcademicYear from "../models/AcademicYear.js";

/**
 * Get all academic years
 */
export const getAllAcademicYears = async (req, res) => {
  try {
    const academicYears = await AcademicYear.getAll();
    res.json({
      success: true,
      data: academicYears,
    });
  } catch (error) {
    console.error("Error fetching academic years:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching academic years",
    });
  }
};

/**
 * Get active academic year
 */
export const getActiveAcademicYear = async (req, res) => {
  try {
    const activeYear = await AcademicYear.getActive();
    if (!activeYear) {
      return res.status(404).json({
        success: false,
        message: "No active academic year found",
      });
    }

    res.json({
      success: true,
      data: activeYear,
    });
  } catch (error) {
    console.error("Error fetching active academic year:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching active academic year",
    });
  }
};

/**
 * Get academic year by ID
 */
export const getAcademicYearById = async (req, res) => {
  try {
    const { id } = req.params;
    const academicYear = await AcademicYear.getById(id);

    if (!academicYear) {
      return res.status(404).json({
        success: false,
        message: "Academic year not found",
      });
    }

    res.json({
      success: true,
      data: academicYear,
    });
  } catch (error) {
    console.error("Error fetching academic year:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching academic year",
    });
  }
};

/**
 * Create new academic year
 */
export const createAcademicYear = async (req, res) => {
  try {
    const { year, is_active } = req.body;

    // Validate required fields
    if (!year) {
      return res.status(400).json({
        success: false,
        message: "Year is required",
      });
    }

    // Check if year already exists
    const existingYear = await AcademicYear.getByYear(year);
    if (existingYear) {
      return res.status(409).json({
        success: false,
        message: "Academic year already exists",
      });
    }

    const yearId = await AcademicYear.create({ year, is_active });
    const newYear = await AcademicYear.getById(yearId);

    res.status(201).json({
      success: true,
      message: "Academic year created successfully",
      data: newYear,
    });
  } catch (error) {
    console.error("Error creating academic year:", error);
    res.status(500).json({
      success: false,
      message: "Error creating academic year",
    });
  }
};

/**
 * Set active academic year
 */
export const setActiveAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if academic year exists
    const academicYear = await AcademicYear.getById(id);
    if (!academicYear) {
      return res.status(404).json({
        success: false,
        message: "Academic year not found",
      });
    }

    await AcademicYear.setActive(id);
    const updatedYear = await AcademicYear.getById(id);

    res.json({
      success: true,
      message: "Active academic year updated successfully",
      data: updatedYear,
    });
  } catch (error) {
    console.error("Error setting active academic year:", error);
    res.status(500).json({
      success: false,
      message: "Error setting active academic year",
    });
  }
};

/**
 * Delete academic year
 */
export const deleteAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if academic year exists
    const academicYear = await AcademicYear.getById(id);
    if (!academicYear) {
      return res.status(404).json({
        success: false,
        message: "Academic year not found",
      });
    }

    // Prevent deletion of active year
    if (academicYear.is_active) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete active academic year",
      });
    }

    await AcademicYear.delete(id);

    res.json({
      success: true,
      message: "Academic year deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting academic year:", error);

    // Check for foreign key constraint
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete academic year that has associated classes",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error deleting academic year",
    });
  }
};
