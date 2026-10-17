import Complaint from "../models/Complaint.js";

// @desc   Resident: naya complaint create kare (photo optional)
// @route  POST /api/complaints
export const createComplaint = async (req, res) => {
  try {
    const { category, description } = req.body;

    const complaint = await Complaint.create({
      raisedBy: req.user._id,
      flatNumber: req.user.flatNumber,
      category,
      description,
      photo: req.file ? `/uploads/complaints/${req.file.filename}` : "",
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Resident: apni complaints dekhe
// @route  GET /api/complaints/mine
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ raisedBy: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Admin: saari complaints dekhe (status filter optional)
// @route  GET /api/complaints
export const getAllComplaints = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const complaints = await Complaint.find(filter)
      .populate("raisedBy", "name flatNumber phone")
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Admin: status update kare / staff assign kare
// @route  PATCH /api/complaints/:id/status
export const updateComplaintStatus = async (req, res) => {
  try {
    const { status, assignedStaff } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint nahi mili." });
    }

    if (status) complaint.status = status;
    if (assignedStaff !== undefined) complaint.assignedStaff = assignedStaff;

    await complaint.save();
    res.status(200).json({ message: "Status update ho gaya.", complaint });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Resident ya Admin — comment add kare
// @route  POST /api/complaints/:id/comments
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint nahi mili." });
    }

    complaint.comments.push({
      byName: req.user.name,
      byRole: req.user.role,
      text,
    });

    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
