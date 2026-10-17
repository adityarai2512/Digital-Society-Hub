import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    resident: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    flatNumber: { type: String, required: true },
    month: { type: String, required: true },
    amount: { type: Number, required: [true, "Amount zaroori hai"] },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
    paidOn: { type: Date },
    paymentMethod: { type: String, default: "" },
  },
  { timestamps: true }
);

const Bill = mongoose.model("Bill", billSchema);
export default Bill;
