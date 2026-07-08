import { Router } from "express";
import {
  getAll,
  create,
  update,
  updateStatus,
  remove,
  getStats,
} from "../controllers/applicationController.js";
import { authenticate } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import {
  createApplicationSchema,
  updateApplicationSchema,
  updateStatusSchema,
} from "../validators/applicationValidator.js";

const router = Router();

router.use(authenticate);

router.get("/stats", getStats);

router.get("/", getAll);
router.post("/", validate(createApplicationSchema), create);
router.put("/:id", validate(updateApplicationSchema), update);
router.patch("/:id/status", validate(updateStatusSchema), updateStatus);
router.delete("/:id", remove);

export default router;
