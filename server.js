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

// Routes
import authRoutes from "./src/routes/auth.routes.js";
import schoolProfileRoutes from "./src/routes/schoolProfile.routes.js";
import newsRoutes from "./src/routes/news.routes.js";
import videoRoutes from "./src/routes/video.routes.js";
import galleryRoutes from "./src/routes/gallery.routes.js";
import contactRoutes from "./src/routes/contact.routes.js";
import teacherRoutes from "./src/routes/teacher.routes.js";
import facilityRoutes from "./src/routes/facility.routes.js";
import achievementRoutes from "./src/routes/achievement.routes.js";

app.use("/api/auth", authRoutes);
app.use("/api/school-profile", schoolProfileRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/facilities", facilityRoutes);
app.use("/api/achievements", achievementRoutes);

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
