import express from "express";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getMSCustomers
} from "../controllers/Customers.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/customers", verifyUser, getCustomers);
router.get("/mscustomers", verifyUser, getMSCustomers);
router.get("/customers/:id", verifyUser, getCustomerById);
router.post("/customers", verifyUser, createCustomer);
router.patch("/customers/:id", verifyUser, updateCustomer);
router.delete("/customers/:id", verifyUser, deleteCustomer);

export default router;
