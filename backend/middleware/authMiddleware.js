import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token = req.cookies.token;

  if (!token && req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Login required. Token nahi mila." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User nahi mila." });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid ya expired token." });
  }
};

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. '${req.user.role}' ko ye permission nahi hai.`,
      });
    }
    next();
  };
};
