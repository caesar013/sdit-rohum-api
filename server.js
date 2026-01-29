import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "SD IT Rohmatul Ummah API is running",
    timestamp: new Date().toISOString(),
  });
});

// Public Routes
import authRoutes from "./src/routes/auth.routes.js";
import schoolProfileRoutes from "./src/routes/schoolProfile.routes.js";
import newsRoutes from "./src/routes/news.routes.js";
import videoRoutes from "./src/routes/video.routes.js";
import galleryRoutes from "./src/routes/gallery.routes.js";
import contactRoutes from "./src/routes/contact.routes.js";
import teacherRoutes from "./src/routes/teacher.routes.js";
import facilityRoutes from "./src/routes/facility.routes.js";
import achievementRoutes from "./src/routes/achievement.routes.js";
import academicYearRoutes from "./src/routes/academicYears.routes.js";
import studentRoutes from "./src/routes/students.routes.js";
import alumniRoutes from "./src/routes/alumni.routes.js";

// Admin Routes
import adminSchoolProfileRoutes from "./src/routes/admin/schoolProfile.routes.js";
import adminNewsRoutes from "./src/routes/admin/news.routes.js";
import adminVideoRoutes from "./src/routes/admin/video.routes.js";
import adminGalleryRoutes from "./src/routes/admin/gallery.routes.js";
import adminContactRoutes from "./src/routes/admin/contact.routes.js";
import adminTeacherRoutes from "./src/routes/admin/teacher.routes.js";
import adminFacilityRoutes from "./src/routes/admin/facility.routes.js";
import adminAchievementRoutes from "./src/routes/admin/achievement.routes.js";
import adminAcademicYearRoutes from "./src/routes/admin/academicYears.routes.js";
import adminStudentRoutes from "./src/routes/admin/students.routes.js";
import adminAlumniRoutes from "./src/routes/admin/alumni.routes.js";
import adminCommentRoutes from "./src/routes/admin/comments.routes.js";

// Public API Routes
app.use("/api/auth", authRoutes);
app.use("/api/school-profile", schoolProfileRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/facilities", facilityRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/academic-years", academicYearRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/alumni", alumniRoutes);

// Admin API Routes
app.use("/api/admin/school-profile", adminSchoolProfileRoutes);
app.use("/api/admin/news", adminNewsRoutes);
app.use("/api/admin/videos", adminVideoRoutes);
app.use("/api/admin/gallery", adminGalleryRoutes);
app.use("/api/admin/contact", adminContactRoutes);
app.use("/api/admin/teachers", adminTeacherRoutes);
app.use("/api/admin/facilities", adminFacilityRoutes);
app.use("/api/admin/achievements", adminAchievementRoutes);
app.use("/api/admin/academic-years", adminAcademicYearRoutes);
app.use("/api/admin/students", adminStudentRoutes);
app.use("/api/admin/alumni", adminAlumniRoutes);
app.use("/api/admin/comments", adminCommentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
});

export default app;
