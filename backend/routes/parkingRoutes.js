import express from "express";
import {
  getConfig,
  updateConfig,
  addVehicle,
  getMyVehicles,
  deleteVehicle,
  getAllVehicles,
  assignSlot,
} from "../controllers/parkingController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

// ============================================
// PARKING ROUTES
// Kaunsa URL hit hone par kaunsa controller function
// chalega, aur kaun access kar sakta hai — sab yahan define hai.
// ============================================

const router = express.Router();

// Config (total slots setting) — sab dekh sakte hain, sirf Admin change kar sakta hai
router.get("/config", protect, getConfig);
router.patch("/config", protect, authorize("admin"), updateConfig);

// Resident: apni gaadi add/list/delete kare
router.post("/", protect, authorize("resident"), addVehicle);
router.get("/mine", protect, authorize("resident"), getMyVehicles);
router.delete("/:id", protect, authorize("resident"), deleteVehicle);

// Admin: saari gaadiyan dekhe + slot assign kare
router.get("/", protect, authorize("admin"), getAllVehicles);
router.patch("/:id/slot", protect, authorize("admin"), assignSlot);

export default router;
