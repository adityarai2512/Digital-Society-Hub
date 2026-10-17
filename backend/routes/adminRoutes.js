import express from "express";
import { getPendingUsers, getAllUsers, approveUser, rejectUser } from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect, authorize("admin"));

router.get("/pending-users", getPendingUsers);
router.get("/users", getAllUsers);
router.patch("/users/:id/approve", approveUser);
router.delete("/users/:id", rejectUser);

export default router;
