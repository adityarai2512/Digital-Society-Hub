import express from "express";
import { createProduct, getAllProducts, updateProduct, deleteProduct } from "../controllers/productController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { uploadProduct } from "../middleware/upload.js";

// ============================================
// PRODUCT ROUTES
// ============================================

const router = express.Router();

// GET /api/products — sab logged-in users dekh sakte hain (shop page)
router.get("/", protect, getAllProducts);

// POST /api/products — sirf Admin, photo upload ke saath (uploadProduct.single("image"))
router.post("/", protect, authorize("admin"), uploadProduct.single("image"), createProduct);

// PATCH /api/products/:id — sirf Admin, photo update optional
router.patch("/:id", protect, authorize("admin"), uploadProduct.single("image"), updateProduct);

// DELETE /api/products/:id — sirf Admin
router.delete("/:id", protect, authorize("admin"), deleteProduct);

export default router;
