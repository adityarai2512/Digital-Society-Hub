import express from "express";
import {
  createComplaint, getMyComplaints, getAllComplaints, updateComplaintStatus, addComment,
} from "../controllers/complaintController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", protect, authorize("resident"), upload.single("photo"), createComplaint);
router.get("/mine", protect, authorize("resident"), getMyComplaints);
router.get("/", protect, authorize("admin"), getAllComplaints);
router.patch("/:id/status", protect, authorize("admin"), updateComplaintStatus);
router.post("/:id/comments", protect, authorize("resident", "admin"), addComment);

export default router;
