import express from "express";
import {
  getHeats,
  getHeatById,
  createHeat,
  updateHeat,
  deleteHeat,
} from "../controllers/Heats.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/Heats", verifyUser, getHeats);
router.get("/Heats/:id", verifyUser, getHeatById);
router.post("/Heats", verifyUser, createHeat);
router.patch("/Heats/:id", verifyUser, updateHeat);
router.delete("/Heats/:id", verifyUser, deleteHeat);

export default router;
