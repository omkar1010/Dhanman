import express from "express";
import {
  // getRejections2,
   getAllR3ejections,
  createR3Rejection,
  updateR3ejectionById,
  deleteR3ejectionById
} from "../controllers/R3_Rejection.js";
import { verifyUser } from "../middleware/AuthUser.js";


const router = express.Router();

router.get("/R3Rejections",verifyUser, getAllR3ejections);
// router.get("/R2Rejections/:id",verifyUser, getRejectionById);
router.post("/R3Rejections",verifyUser, createR3Rejection);
router.patch("/updateR3ejectionById/:id",verifyUser, updateR3ejectionById);
router.delete("/R3Rejections/:id",verifyUser, deleteR3ejectionById);

export default router;
