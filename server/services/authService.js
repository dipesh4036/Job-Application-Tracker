import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db/pool.js";
import config from "../config/index.js";
import ApiError from "../utils/ApiError.js";

export const registerUser = async ({ name, email, password }) => {
  // Check if email already exists
  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
    email,
  ]);
  if (existing.rows.length > 0) {
    throw ApiError.conflict("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, config.bcryptSaltRounds);

  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [name, email, hashedPassword],
  );

  const user = rows[0];
  const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });

  return { token, user };
};

export const loginUser = async ({ email, password }) => {
  const { rows } = await pool.query(
    "SELECT id, name, email, password, created_at FROM users WHERE email = $1",
    [email],
  );

  if (rows.length === 0) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });

  // Remove password from returned user object
  const { password: _, ...userWithoutPassword } = user;
  return { token, user: userWithoutPassword };
};

export const getUserById = async (userId) => {
  const { rows } = await pool.query(
    "SELECT id, name, email, created_at FROM users WHERE id = $1",
    [userId],
  );

  if (rows.length === 0) {
    throw ApiError.notFound("User not found");
  }

  return rows[0];
};
