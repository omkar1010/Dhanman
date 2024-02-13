import express from "express";
import {
  getDispatches,
  getDispatchById,
  createDispatch,
  updateDispatch,
  deleteDispatch
} from "../controllers/Dispatch.js";
import { verifyUser } from "../middleware/AuthUser.js";


const router = express.Router();

router.get("/Dispatches",verifyUser, getDispatches);
router.get("/Dispatches/:id",verifyUser, getDispatchById);
router.post("/Dispatches",verifyUser, createDispatch);
router.patch("/Dispatches/:id",verifyUser, updateDispatch);
router.delete("/Dispatches/:id",verifyUser, deleteDispatch);

export default router;
