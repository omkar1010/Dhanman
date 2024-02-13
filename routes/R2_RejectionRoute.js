import express from "express";
import {
  getRejections2,
  getRejectionById,
  createRejection2,
  updateRejectionById,
  deleteRejectionById
} from "../controllers/R2_Rejection.js";
import { verifyUser } from "../middleware/AuthUser.js";


const router = express.Router();

router.get("/R2Rejections",verifyUser, getRejections2);
router.get("/R2Rejections/:id",verifyUser, getRejectionById);
router.post("/R2Rejections",verifyUser, createRejection2);
router.put("/R2Rejections/:id",verifyUser, updateRejectionById);
router.delete("/R2Rejections/:id",verifyUser, deleteRejectionById);

export default router;
