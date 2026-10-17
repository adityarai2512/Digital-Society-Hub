import User from "../models/User.js";

export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ isApproved: false }).select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isApproved: true, role: { $ne: "admin" } })
      .select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User nahi mila." });
    user.isApproved = true;
    await user.save();
    res.status(200).json({ message: `${user.name} approve ho gaya.`, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User nahi mila." });
    await user.deleteOne();
    res.status(200).json({ message: "Request reject/remove ho gayi." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
