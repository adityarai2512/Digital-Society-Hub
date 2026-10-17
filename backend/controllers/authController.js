import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role, flatNumber, block } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Ye email pehle se registered hai." });
    }

    const user = await User.create({
      name, email, phone, password,
      role: role || "resident",
      flatNumber, block,
      isApproved: role === "admin" ? true : false,
    });

    if (user) {
      generateToken(res, user._id, user.role);
      res.status(201).json({
        _id: user._id, name: user.name, email: user.email, role: user.role,
        flatNumber: user.flatNumber, isApproved: user.isApproved,
        message: user.isApproved ? "Registration successful!" : "Registration successful! Admin approval ka wait karo.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Email ya password galat hai." });
    }

    if (!user.isApproved) {
      return res.status(403).json({ message: "Aapka account abhi admin approval ka wait kar raha hai." });
    }

    generateToken(res, user._id, user.role);

    res.status(200).json({
      _id: user._id, name: user.name, email: user.email, role: user.role,
      flatNumber: user.flatNumber, avatar: user.avatar,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const logoutUser = (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "Logout successful." });
};

export const getMe = async (req, res) => {
  res.status(200).json(req.user);
};
