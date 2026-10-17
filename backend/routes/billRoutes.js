import express from "express";
import { generateBill, generateBulkBills, getMyBills, getAllBills, payBill } from "../controllers/billController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin"), generateBill);
router.post("/bulk", protect, authorize("admin"), generateBulkBills);
router.get("/", protect, authorize("admin"), getAllBills);
router.get("/mine", protect, authorize("resident"), getMyBills);
router.patch("/:id/pay", protect, authorize("resident"), payBill);

export default router;
