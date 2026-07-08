import asyncHandler from "../utils/asyncHandler.js";
import * as authService from "../services/authService.js";

export const register = asyncHandler(async (req, res) => {
  const { token, user } = await authService.registerUser(req.body);
  res.status(201).json({ success: true, data: { token, user } });
});

export const login = asyncHandler(async (req, res) => {
  const { token, user } = await authService.loginUser(req.body);
  res.status(200).json({ success: true, data: { token, user } });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: { user: req.user } });
});
