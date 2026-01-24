// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Multer errors
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File size too large",
      });
    }
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  // MySQL errors
  if (err.code && err.code.startsWith("ER_")) {
    return res.status(500).json({
      success: false,
      error: "Database error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "Token expired",
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal server error",
    details: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

// Not found handler
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
};
