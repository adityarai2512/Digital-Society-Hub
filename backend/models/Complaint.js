import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    flatNumber: { type: String, required: true },
    category: {
      type: String,
      enum: ["Water Leakage", "Lift Issue", "Electricity", "Parking", "Security", "Cleanliness", "Other"],
      required: true,
    },
    description: { type: String, required: [true, "Complaint ki description zaroori hai"] },
    // Photo ka path (agar upload kiya ho) — /uploads/complaints/xxxx.jpg
    photo: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "assigned", "in-progress", "resolved"],
      default: "pending",
    },
    assignedStaff: { type: String, default: "" },
    comments: [
      {
        byName: String,
        byRole: String,
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;
