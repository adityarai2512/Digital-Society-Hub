import mongoose from "mongoose";

// ============================================
// NOTICE MODEL
// Ye "blueprint" hai ki ek Notice document
// database (MongoDB) me kaise store hoga.
// Notice Board module isi model par based hai.
// ============================================

const noticeSchema = new mongoose.Schema(
  {
    // Notice ka heading — jaise "Water Supply Shutdown Tomorrow"
    title: {
      type: String,
      required: [true, "Title zaroori hai"],
    },

    // Notice ki puri detail/description
    message: {
      type: String,
      required: [true, "Message zaroori hai"],
    },

    // Category batati hai ki notice kis type ka hai
    // Frontend me isi field se alag-alag color/badge dikhaya jaata hai
    category: {
      type: String,
      enum: ["General", "Water Shutdown", "Electricity", "Meeting", "Festival", "Emergency"],
      default: "General",
    },

    // Agar true hai to ye notice "URGENT" tag ke saath
    // sabse upar dikhega (jaise fire/security emergency)
    isUrgent: {
      type: Boolean,
      default: false,
    },

    // Kis admin ne ye notice post kiya — User model se link (reference)
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    // timestamps: true likhne se Mongoose automatically
    // "createdAt" aur "updatedAt" fields add kar deta hai
    timestamps: true,
  }
);

const Notice = mongoose.model("Notice", noticeSchema);
export default Notice;
