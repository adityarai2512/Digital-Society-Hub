import express from "express";
import {
  placeOrder,
  getMyOrders,
  payOrder,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

// ============================================
// ORDER ROUTES
// ============================================

const router = express.Router();

// Resident: order place kare, apne orders dekhe, pay kare
router.post("/", protect, authorize("resident"), placeOrder);
router.get("/mine", protect, authorize("resident"), getMyOrders);
router.patch("/:id/pay", protect, authorize("resident"), payOrder);

// Admin: saare orders dekhe, status update kare
router.get("/", protect, authorize("admin"), getAllOrders);
router.patch("/:id/status", protect, authorize("admin"), updateOrderStatus);

export default router;
