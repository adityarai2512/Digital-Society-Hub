import Event from "../models/Event.js";

// ============================================
// EVENT CONTROLLER
// Ye file batata hai ki jab bhi koi Event-related
// API call aati hai, server ko exactly kya karna hai.
// ============================================

// @desc   Admin: naya event create kare
// @route  POST /api/events
// @access Sirf Admin
export const createEvent = async (req, res) => {
  try {
    const { title, description, category, eventDate, venue, maxParticipants } = req.body;

    const event = await Event.create({
      title,
      description,
      category,
      eventDate,
      venue,
      maxParticipants: maxParticipants || 0,
      createdBy: req.user._id, // req.user "protect" middleware se aata hai
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Sab logged-in users — saare events dekhein (upcoming pehle)
// @route  GET /api/events
// @access Koi bhi logged-in user (Resident/Guard/Admin)
export const getAllEvents = async (req, res) => {
  try {
    // sort({ eventDate: 1 }) = jo event pehle aane wala hai, wo list me pehle dikhega
    const events = await Event.find().sort({ eventDate: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Resident: kisi event ke liye register kare
// @route  POST /api/events/:id/register
// @access Sirf Resident
export const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event nahi mila." });
    }

    // Check karo — kya ye resident pehle se hi registered hai?
    const alreadyRegistered = event.participants.some(
      (p) => p.user.toString() === req.user._id.toString()
    );
    if (alreadyRegistered) {
      return res.status(400).json({ message: "Tum pehle se hi is event ke liye register ho." });
    }

    // Check karo — kya seats full ho chuki hain?
    // (maxParticipants 0 ka matlab hai "unlimited", isliye 0 ko check nahi karte)
    if (event.maxParticipants > 0 && event.participants.length >= event.maxParticipants) {
      return res.status(400).json({ message: "Sorry, is event ki seats full ho chuki hain." });
    }

    // Participants array me naya entry push karo
    event.participants.push({
      user: req.user._id,
      name: req.user.name,
      flatNumber: req.user.flatNumber,
    });

    await event.save();
    res.status(200).json({ message: "✅ Registration successful!", event });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Resident: apna registration cancel kare
// @route  DELETE /api/events/:id/register
// @access Sirf Resident
export const unregisterFromEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event nahi mila." });
    }

    // participants array se is resident ki entry hata do
    event.participants = event.participants.filter(
      (p) => p.user.toString() !== req.user._id.toString()
    );

    await event.save();
    res.status(200).json({ message: "Registration cancel ho gayi.", event });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Admin: event delete kare
// @route  DELETE /api/events/:id
// @access Sirf Admin
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event nahi mila." });
    }

    await event.deleteOne();
    res.status(200).json({ message: "Event delete ho gaya." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
