import Bill from "../models/Bill.js";
import User from "../models/User.js";

export const generateBill = async (req, res) => {
  try {
    const { residentId, month, amount, dueDate } = req.body;

    const resident = await User.findById(residentId);
    if (!resident || resident.role !== "resident") {
      return res.status(404).json({ message: "Resident nahi mila." });
    }

    const bill = await Bill.create({
      resident: resident._id, flatNumber: resident.flatNumber,
      month, amount, dueDate,
    });

    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const generateBulkBills = async (req, res) => {
  try {
    const { month, amount, dueDate } = req.body;
    const residents = await User.find({ role: "resident", isApproved: true });

    if (residents.length === 0) {
      return res.status(400).json({ message: "Koi approved resident nahi mila." });
    }

    const bills = await Promise.all(
      residents.map((r) =>
        Bill.create({ resident: r._id, flatNumber: r.flatNumber, month, amount, dueDate })
      )
    );

    res.status(201).json({ message: `${bills.length} residents ke liye bill generate hue.`, bills });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMyBills = async (req, res) => {
  try {
    const bills = await Bill.find({ resident: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllBills = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const bills = await Bill.find(filter)
      .populate("resident", "name flatNumber phone")
      .sort({ createdAt: -1 });

    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const payBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: "Bill nahi mila." });

    if (bill.resident.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Ye tumhara bill nahi hai." });
    }
    if (bill.status === "paid") {
      return res.status(400).json({ message: "Ye bill pehle se hi paid hai." });
    }

    bill.status = "paid";
    bill.paidOn = new Date();
    bill.paymentMethod = "Online (Simulated)";
    await bill.save();

    res.status(200).json({ message: "✅ Payment successful!", bill });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
