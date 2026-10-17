import mongoose from "mongoose";

// ============================================
// ORDER MODEL
// Jab Resident cart checkout karta hai, ek Order document banta hai.
// Isme cart ke saare items (naam, price, quantity — snapshot ke roop me)
// store hote hain, taaki agar baad me product ka price change ho jaye,
// purane order ka amount wahi rahe jo order ke time tha.
// ============================================

const orderSchema = new mongoose.Schema(
  {
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    flatNumber: {
      type: String,
      required: true,
    },

    // Cart ke items — har item apne aap me ek "snapshot" hai
    // (product ka current price change hone se purane order pe asar nahi padta)
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number, // Order ke time ka price (per unit)
        unit: String,
        quantity: Number,
      },
    ],

    // Saare items ka total (server-side calculate hota hai, frontend se trust nahi karte)
    totalAmount: {
      type: Number,
      required: true,
    },

    // Kahan deliver karna hai — default resident ka flat number hota hai,
    // lekin resident chahe to alag address bhi likh sakta hai
    deliveryAddress: {
      type: String,
      required: true,
    },

    // Order kis stage me hai
    status: {
      type: String,
      enum: ["placed", "confirmed", "out-for-delivery", "delivered", "cancelled"],
      default: "placed",
    },

    // Payment "Pay Now" (simulated) — Billing module jaisa hi pattern
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    paidOn: Date,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
