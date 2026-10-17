import mongoose from "mongoose";

// ============================================
// PRODUCT MODEL
// Ye "blueprint" hai society store ke ek item ka —
// jaise "Tomato", "Apple", "Aata (5kg)", etc.
// Admin (ya society ka store manager) inhe add/manage karta hai.
// Resident inhi products ko dekh kar shopping karta hai.
// ============================================

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product ka naam zaroori hai"],
      trim: true,
    },

    // Alag categories se Resident ko shop browse karna aasan hota hai
    category: {
      type: String,
      enum: ["Vegetables", "Fruits", "Groceries", "Dairy", "Other"],
      required: true,
    },

    // Per-unit price — jaise ₹40 per kg
    price: {
      type: Number,
      required: [true, "Price zaroori hai"],
      min: 0,
    },

    // Unit batata hai price kis quantity ke liye hai — kg, dozen, packet, litre, piece
    unit: {
      type: String,
      enum: ["kg", "dozen", "packet", "litre", "piece"],
      default: "kg",
    },

    // Product ki photo ka path — jaise /uploads/products/xxxx.jpg
    image: {
      type: String,
      default: "",
    },

    // Stock — kitni quantity available hai. 0 hone par "Out of Stock" dikhega.
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Admin chahe to product ko temporarily hide bhi kar sakta hai (bina delete kiye)
    isAvailable: {
      type: Boolean,
      default: true,
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
