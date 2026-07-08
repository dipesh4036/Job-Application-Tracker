import { Router } from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validators/authValidator.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.get("/me", authenticate, getMe);

export default router;
