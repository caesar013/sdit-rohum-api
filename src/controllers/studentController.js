import Student from "../models/Student.js";
import StudentEnrollment from "../models/StudentEnrollment.js";
import Class from "../models/Class.js";
import { handleImageUpdate } from "../utils/imageHelper.js";
import {
  STUDENT_STATUS_VALUES,
  STUDENT_STATUS_LABELS,
} from "../constants/studentStatus.js";
import {
  transformImageUrls,
  transformImageUrlsArray,
} from "../utils/urlHelper.js";

/**
 * Get all students with filters
 */
export const getAllStudents = async (req, res) => {
  try {
    const { page, limit, academic_year, grade, status, gender } = req.query;

    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      academic_year,
      grade: grade ? parseInt(grade) : null,
      status,
      gender,
    };

    const result = await Student.getAll(options);

    const transformedData = transformImageUrlsArray(result.data, ["photo"]);

    res.json({
      success: true,
      data: transformedData,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching students",
    });
  }
};

/**
 * Get student by ID with current enrollment
 */
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.getById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const transformedStudent = transformImageUrls(student, ["photo"]);
    res.json({
      success: true,
      data: transformedStudent,
    });
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching student",
    });
  }
};

/**
 * Get student enrollment history
 */
export const getStudentEnrollmentHistory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if student exists
    const student = await Student.getById(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const history = await Student.getEnrollmentHistory(id);

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("Error fetching enrollment history:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching enrollment history",
    });
  }
};

/**
 * Create new student
 */
export const createStudent = async (req, res) => {
  try {
    const {
      nisn,
      nis,
      name,
      gender,
      birth_place,
      birth_date,
      parent_name,
      parent_phone,
      parent_occupation,
      address,
      status,
      class_id,
    } = req.body;

    // Validate required fields
    if (
      !nisn ||
      !nis ||
      !name ||
      !gender ||
      !birth_date ||
      !parent_name ||
      !parent_phone
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Required fields: nisn, nis, name, gender, birth_date, parent_name, parent_phone",
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

    // Create student
    const studentData = {
      nisn,
      nis,
      name,
      photo_url,
      gender,
      birth_place,
      birth_date,
      parent_name,
      parent_phone,
      parent_occupation,
      address,
      status: status || "active",
    };

    const studentId = await Student.create(studentData);

    // Add enrollment if class_id provided
    if (class_id) {
      // Verify class exists
      const classData = await Class.getById(class_id);
      if (!classData) {
        return res.status(400).json({
          success: false,
          message: "Invalid class_id",
        });
      }

      await StudentEnrollment.create({
        student_id: studentId,
        class_id: parseInt(class_id),
      });
    }

    const newStudent = await Student.getById(studentId);
    const transformedStudent = transformImageUrls(newStudent, ["photo"]);

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: transformedStudent,
    });
  } catch (error) {
    console.error("Error creating student:", error);

    // Check for duplicate NISN/NIS
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Student with this NISN or NIS already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating student",
    });
  }
};

/**
 * Update student
 */
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if student exists
    const existingStudent = await Student.getById(id);
    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const updateData = { ...req.body };

    // Handle photo update
    if (req.file) {
      const result = await handleImageUpdate({
        newImagePath: req.file.path,
        oldImagePath: existingStudent.photo_url,
      });
      updateData.photo_url = result.finalPath;
    }

    const affectedRows = await Student.update(id, updateData);

    if (affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: "No changes made",
      });
    }

    const updatedStudent = await Student.getById(id);
    const transformedStudent = transformImageUrls(updatedStudent, ["photo"]);

    res.json({
      success: true,
      message: "Student updated successfully",
      data: transformedStudent,
    });
  } catch (error) {
    console.error("Error updating student:", error);

    // Check for duplicate NISN/NIS
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Student with this NISN or NIS already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating student",
    });
  }
};

/**
 * Delete student
 */
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if student exists
    const student = await Student.getById(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    await Student.delete(id);

    res.json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting student",
    });
  }
};

/**
 * Enroll student in class
 */
export const enrollStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { class_id } = req.body;

    if (!class_id) {
      return res.status(400).json({
        success: false,
        message: "class_id is required",
      });
    }

    // Check if student exists
    const student = await Student.getById(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check if class exists
    const classData = await Class.getById(class_id);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // Check if enrollment already exists
    const exists = await StudentEnrollment.exists(id, class_id);
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Student already enrolled in this class",
      });
    }

    await StudentEnrollment.create({
      student_id: id,
      class_id: parseInt(class_id),
    });

    const updatedStudent = await Student.getById(id);

    res.json({
      success: true,
      message: "Student enrolled successfully",
      data: updatedStudent,
    });
  } catch (error) {
    console.error("Error enrolling student:", error);
    res.status(500).json({
      success: false,
      message: "Error enrolling student",
    });
  }
};

/**
 * Unenroll student from class
 */
export const unenrollStudent = async (req, res) => {
  try {
    const { id, class_id } = req.params;

    // Check if student exists
    const student = await Student.getById(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const affectedRows = await StudentEnrollment.deleteByStudentAndClass(
      id,
      class_id,
    );

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    res.json({
      success: true,
      message: "Student unenrolled successfully",
    });
  } catch (error) {
    console.error("Error unenrolling student:", error);
    res.status(500).json({
      success: false,
      message: "Error unenrolling student",
    });
  }
};

/**
 * Get student statuses (for form dropdown)
 */
export const getStudentStatuses = async (req, res, next) => {
  try {
    const statuses = STUDENT_STATUS_VALUES.map((value) => ({
      value,
      label: STUDENT_STATUS_LABELS[value],
    }));

    res.json({
      success: true,
      data: statuses,
    });
  } catch (error) {
    next(error);
  }
};
