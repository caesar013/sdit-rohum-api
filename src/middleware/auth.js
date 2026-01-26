import jwt from "jsonwebtoken";

// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Access token required",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: "Invalid or expired token",
      });
    }

    req.user = user;
    next();
  });
};

// Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
  console.log("User role:", req.user ? req.user.role : "No user");
  if (
    req.user &&
    (req.user.role === "admin" || req.user.role === "super_admin")
  ) {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: "Admin access required",
    });
  }
};
