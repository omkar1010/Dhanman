import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getmsproduct
} from "../controllers/Products.js";
import { verifyUser } from "../middleware/AuthUser.js";


const router = express.Router();

// GET all products with names
router.get("/products",verifyUser, getProducts);
router.get("/msproducts",verifyUser, getmsproduct);
// GET a single product by ID
router.get("/products/:id",verifyUser, getProductById);

// POST a new product
router.post("/products",verifyUser, createProduct);

// PATCH/UPDATE an existing product
router.patch("/products/:id",verifyUser, updateProduct);

// DELETE a product
router.delete("/products/:id",verifyUser, deleteProduct);

export default router;
