import express from "express";
import {
  getGrades,
  getGradeById,
  createGrade,
  updateGrade,
  deleteGrade,
} from "../controllers/Grades.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/grades", verifyUser, getGrades);
router.get("/grades/:id", verifyUser, getGradeById);
router.post("/grades", verifyUser, createGrade);
router.patch("/grades/:id", verifyUser, updateGrade);
router.delete("/grades/:id", verifyUser, deleteGrade);

export default router;
