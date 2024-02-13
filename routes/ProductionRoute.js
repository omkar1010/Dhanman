import express from "express";
import {
  getProductions,
  getProductionById,
  createProduction,
  updateProduction,
  deleteProduction,
} from "../controllers/Productions.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/Productions", verifyUser, getProductions);
router.get("/Productions/:id", verifyUser, getProductionById);
router.post("/Productions", verifyUser, createProduction);
router.patch("/Productions/:id", verifyUser, updateProduction);
router.delete("/Productions/:id", verifyUser, deleteProduction);

export default router;
