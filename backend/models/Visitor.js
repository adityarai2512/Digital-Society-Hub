import mongoose from "mongoose";
import crypto from "crypto";

const visitorSchema = new mongoose.Schema(
  {
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    flatNumber: { type: String, required: true },
    visitorName: { type: String, required: [true, "Visitor ka naam zaroori hai"] },
    visitorPhone: { type: String, required: [true, "Visitor ka phone number zaroori hai"] },
    purpose: {
      type: String,
      enum: ["Guest", "Delivery", "Cab/Auto", "Service Staff", "Other"],
      default: "Guest",
    },
    passCode: {
      type: String,
      unique: true,
      default: () => crypto.randomBytes(4).toString("hex").toUpperCase(),
    },
    validFrom: { type: Date, default: Date.now },
    validTill: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "checked-in", "checked-out", "expired", "blacklisted"],
      default: "pending",
    },
    checkInTime: Date,
    checkOutTime: Date,
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Visitor = mongoose.model("Visitor", visitorSchema);
export default Visitor;
