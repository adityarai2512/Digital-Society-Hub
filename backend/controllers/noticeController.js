import Notice from "../models/Notice.js";

// ============================================
// NOTICE CONTROLLER
// Ye file batata hai ki jab koi API call aati hai
// (jaise "naya notice banao" ya "sab notices dikhao"),
// to server ko exactly kya karna hai.
// ============================================

// @desc   Admin: naya notice post kare
// @route  POST /api/notices
// @access Sirf Admin (authorize("admin") middleware route file me lagaya gaya hai)
export const createNotice = async (req, res) => {
  try {
    // Frontend se aaya hua data (form fields) nikal rahe hain
    const { title, message, category, isUrgent } = req.body;

    // Naya Notice document database me create kar rahe hain
    const notice = await Notice.create({
      title,
      message,
      category,
      isUrgent: isUrgent || false, // agar undefined ho to default false
      postedBy: req.user._id, // req.user "protect" middleware se aata hai (logged-in admin)
    });

    // 201 = "Created" — success status code
    res.status(201).json(notice);
  } catch (error) {
    // Agar kuch galat hua (jaise required field missing), to error bhejo
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Sab logged-in users (Resident/Guard/Admin) — saare notices dekhein
// @route  GET /api/notices
// @access Koi bhi logged-in user (sirf "protect" middleware, koi role restriction nahi)
export const getAllNotices = async (req, res) => {
  try {
    // Notice.find() = saare notices laao database se
    // .populate("postedBy", "name") = postedBy ki jagah sirf admin ka "name" bhi attach kar do
    // .sort({ isUrgent: -1, createdAt: -1 }) = pehle URGENT notices, phir sabse naye notices upar
    const notices = await Notice.find()
      .populate("postedBy", "name")
      .sort({ isUrgent: -1, createdAt: -1 });

    res.status(200).json(notices);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Admin: koi notice delete kare (jaise expired ya galat notice hata na ho)
// @route  DELETE /api/notices/:id
// @access Sirf Admin
export const deleteNotice = async (req, res) => {
  try {
    // URL se aayi hui id (:id) se notice dhundo
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      // Agar wo id exist hi nahi karti database me
      return res.status(404).json({ message: "Notice nahi mila." });
    }

    // Database se permanently delete kar do
    await notice.deleteOne();

    res.status(200).json({ message: "Notice delete ho gaya." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
