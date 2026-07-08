import jwt from "jsonwebtoken";
import config from "../config/index.js";
import pool from "../db/pool.js";
import ApiError from "../utils/ApiError.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw ApiError.unauthorized("Access token is missing");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.jwtSecret);

    const { rows } = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [decoded.userId],
    );

    if (rows.length === 0) {
      throw ApiError.unauthorized("User no longer exists");
    }

    req.user = rows[0];
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(ApiError.unauthorized("Invalid or expired token"));
    }
    next(error);
  }
};
