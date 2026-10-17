import mongoose from "mongoose";

// ============================================
// VEHICLE MODEL
// Ye "blueprint" hai ki ek Vehicle (Car/Bike) document
// database me kaise store hoga. Parking Management
// module isi model par based hai.
// ============================================

const vehicleSchema = new mongoose.Schema(
  {
    // Kis resident ki gaadi hai
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    flatNumber: {
      type: String,
      required: true,
    },

    // Car ya Bike
    vehicleType: {
      type: String,
      enum: ["Car", "Bike"],
      required: true,
    },

    // Number plate — jaise "UP70 AB 1234"
    vehicleNumber: {
      type: String,
      required: [true, "Vehicle number zaroori hai"],
      uppercase: true, // Automatically UPPERCASE me save hoga (consistency ke liye)
      trim: true,
    },

    // Admin isko assign karta hai — jaise "A-12"
    // Khali string ka matlab hai "abhi slot assign nahi hua"
    slotNumber: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;
