import express from "express";
import {
  getSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../controllers/schedule.js";

const router = express.Router();
import { verifyUser } from "../middleware/AuthUser.js";

router.get("/schedules", verifyUser, getSchedules);
router.get("/schedules/:id", verifyUser, getScheduleById);
router.post("/schedules", verifyUser, createSchedule);
router.patch("/schedules/:id", verifyUser, updateSchedule);
router.delete("/schedules/:id", verifyUser, deleteSchedule);

export default router;
