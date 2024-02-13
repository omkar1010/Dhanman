import express from "express";
import {
  getRejections,
  // getRejectionById,
  createRejection,
  updateRejectionById,
  deleteRejectionById,
  getMsRejection,
getRejectionById

} from "../controllers/Rejection.js";
import { verifyUser } from "../middleware/AuthUser.js";


const router = express.Router();
router.get("/Rejections",verifyUser, getRejections);
router.get("/Rejectionsbyid/:id",verifyUser, getRejectionById);
router.get("/MSRejections",verifyUser, getMsRejection);
// router.get("/Rejections/:id",verifyUser, getRejectionById);
router.post("/Rejections",verifyUser, createRejection);
router.post("/Rejections/:id",verifyUser, updateRejectionById);
router.delete("/Rejections/:id",verifyUser, deleteRejectionById);

export default router;
