import express from "express";
import { createNotice, getAllNotices, deleteNotice } from "../controllers/noticeController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

// ============================================
// NOTICE ROUTES
// Ye file batati hai ki kaunsa URL (endpoint) hit hone par
// kaunsa controller function chalega, aur kaun access kar sakta hai.
// ============================================

const router = express.Router();

// GET /api/notices
// "protect" middleware pehle check karega login hai ya nahi.
// Koi "authorize" nahi lagaya hai — matlab Resident, Guard, Admin
// TEENO ise dekh sakte hain (jaisa real notice board hota hai).
router.get("/", protect, getAllNotices);

// POST /api/notices — naya notice banao
// "protect" (login check) + "authorize('admin')" (sirf admin allowed)
router.post("/", protect, authorize("admin"), createNotice);

// DELETE /api/notices/:id — notice delete karo
// Sirf Admin kar sakta hai
router.delete("/:id", protect, authorize("admin"), deleteNotice);

export default router;
