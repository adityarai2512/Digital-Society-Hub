import QRCode from "qrcode";
import Visitor from "../models/Visitor.js";

export const createVisitorInvite = async (req, res) => {
  try {
    const { visitorName, visitorPhone, purpose, validTill } = req.body;

    const visitor = await Visitor.create({
      invitedBy: req.user._id,
      flatNumber: req.user.flatNumber,
      visitorName, visitorPhone, purpose,
      validTill: validTill || new Date(new Date().setHours(23, 59, 59)),
    });

    const qrCodeImage = await QRCode.toDataURL(visitor.passCode);
    res.status(201).json({ visitor, qrCodeImage });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMyVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find({ invitedBy: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(visitors);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getTodayVisitors = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const visitors = await Visitor.find({ createdAt: { $gte: startOfDay } })
      .populate("invitedBy", "name flatNumber phone")
      .sort({ createdAt: -1 });

    res.status(200).json(visitors);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const verifyVisitorEntry = async (req, res) => {
  try {
    const { passCode } = req.body;
    const visitor = await Visitor.findOne({ passCode: passCode.toUpperCase() }).populate(
      "invitedBy", "name flatNumber phone"
    );

    if (!visitor) {
      return res.status(404).json({ message: "❌ Invalid pass code. Visitor nahi mila." });
    }
    if (visitor.status === "blacklisted") {
      return res.status(403).json({ message: "🚫 Ye visitor blacklisted hai. Entry allowed nahi." });
    }
    if (visitor.status === "checked-in") {
      return res.status(400).json({ message: "⚠️ Ye visitor pehle se hi society ke andar hai." });
    }
    if (new Date() > new Date(visitor.validTill)) {
      visitor.status = "expired";
      await visitor.save();
      return res.status(400).json({ message: "⏰ Ye pass expire ho chuka hai." });
    }

    visitor.status = "checked-in";
    visitor.checkInTime = new Date();
    visitor.verifiedBy = req.user._id;
    await visitor.save();

    res.status(200).json({ message: "✅ Entry allowed!", visitor });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const checkoutVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({ message: "Visitor nahi mila." });
    }
    visitor.status = "checked-out";
    visitor.checkOutTime = new Date();
    await visitor.save();
    res.status(200).json({ message: "Checkout successful.", visitor });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
