import express from "express";
import {
  createVisitorInvite, getMyVisitors, getTodayVisitors, verifyVisitorEntry, checkoutVisitor,
} from "../controllers/visitorController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("resident"), createVisitorInvite);
router.get("/mine", protect, authorize("resident"), getMyVisitors);
router.get("/today", protect, authorize("guard", "admin"), getTodayVisitors);
router.post("/verify", protect, authorize("guard"), verifyVisitorEntry);
router.post("/:id/checkout", protect, authorize("guard"), checkoutVisitor);

export default router;
