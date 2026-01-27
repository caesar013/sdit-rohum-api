import jwt from "jsonwebtoken";

/**
 * Optional authentication middleware
 * Allows both authenticated and unauthenticated requests
 * If token is valid, attaches user to req.user
 * If token is invalid or missing, continues without req.user
 */
export const optionalAuth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return next(); // Continue without authentication
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // Invalid token, continue without authentication
    next();
  }
};
