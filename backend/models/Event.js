import mongoose from "mongoose";

// ============================================
// EVENT MODEL
// Ye "blueprint" hai ki ek Event document
// database (MongoDB) me kaise store hoga.
// Events Management module isi model par based hai.
// ============================================

const eventSchema = new mongoose.Schema(
  {
    // Event ka naam — jaise "Holi Celebration 2026"
    title: {
      type: String,
      required: [true, "Title zaroori hai"],
    },

    // Event ki detail — kya hoga, kya lana hai, etc.
    description: {
      type: String,
      required: [true, "Description zaroori hai"],
    },

    // Category se frontend me alag icon/color dikhaya jaata hai
    category: {
      type: String,
      enum: ["Festival", "Sports", "Fitness", "Meeting", "Cultural", "Other"],
      default: "Other",
    },

    // Event kab hoga
    eventDate: {
      type: Date,
      required: [true, "Event date zaroori hai"],
    },

    // Event kahan hoga — jaise "Clubhouse", "Society Garden"
    venue: {
      type: String,
      required: [true, "Venue zaroori hai"],
    },

    // Kitne log max register kar sakte hain (0 ya empty = unlimited)
    maxParticipants: {
      type: Number,
      default: 0,
    },

    // Kis admin ne ye event banaya
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Jo residents register karenge, unki list yahan store hogi
    // Har entry me user ka reference + kab register kiya, ye info hoti hai
    participants: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: String,
        flatNumber: String,
        registeredAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    // createdAt / updatedAt automatically add ho jaate hain
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
