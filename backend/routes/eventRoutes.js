import express from "express";
import {
  createEvent,
  getAllEvents,
  registerForEvent,
  unregisterFromEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

// ============================================
// EVENT ROUTES
// Ye file batati hai ki kaunsa URL hit hone par
// kaunsa controller function chalega, aur kaun access kar sakta hai.
// ============================================

const router = express.Router();

// GET /api/events — sab logged-in users dekh sakte hain (Resident/Guard/Admin)
router.get("/", protect, getAllEvents);

// POST /api/events — sirf Admin naya event bana sakta hai
router.post("/", protect, authorize("admin"), createEvent);

// POST /api/events/:id/register — sirf Resident register kar sakta hai
router.post("/:id/register", protect, authorize("resident"), registerForEvent);

// DELETE /api/events/:id/register — sirf Resident apna registration cancel kar sakta hai
router.delete("/:id/register", protect, authorize("resident"), unregisterFromEvent);

// DELETE /api/events/:id — sirf Admin event delete kar sakta hai
router.delete("/:id", protect, authorize("admin"), deleteEvent);

export default router;
