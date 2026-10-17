import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Naam zaroori hai"], trim: true },
    email: { type: String, required: [true, "Email zaroori hai"], unique: true, lowercase: true, trim: true },
    phone: { type: String, required: [true, "Phone number zaroori hai"] },
    password: { type: String, required: [true, "Password zaroori hai"], minlength: 6, select: false },
    role: { type: String, enum: ["resident", "guard", "admin"], default: "resident" },
    flatNumber: {
      type: String,
      required: function () {
        return this.role === "resident";
      },
    },
    block: { type: String },
    avatar: { type: String, default: "" },
    isApproved: { type: Boolean, default: false },
    reputationScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
