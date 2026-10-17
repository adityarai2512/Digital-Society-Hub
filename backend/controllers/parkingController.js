import Vehicle from "../models/Vehicle.js";
import ParkingConfig from "../models/ParkingConfig.js";

// ============================================
// PARKING CONTROLLER
// Ye file batata hai ki Parking Management ke
// har API call par server ko exactly kya karna hai.
// ============================================

// -------- Helper function --------
// ParkingConfig collection me hamesha 1 hi document hona chahiye (singleton pattern).
// Ye function ya to existing config dhundta hai, ya agar pehli baar hai to naya bana deta hai.
const getOrCreateConfig = async () => {
  let config = await ParkingConfig.findOne();
  if (!config) {
    config = await ParkingConfig.create({ totalSlots: 50 });
  }
  return config;
};

// @desc   Sab logged-in users — total slots ki setting dekhein
// @route  GET /api/parking/config
// @access Koi bhi logged-in user
export const getConfig = async (req, res) => {
  try {
    const config = await getOrCreateConfig();
    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Admin: total parking slots ki count update kare
// @route  PATCH /api/parking/config
// @access Sirf Admin
export const updateConfig = async (req, res) => {
  try {
    const { totalSlots } = req.body;
    const config = await getOrCreateConfig();
    config.totalSlots = totalSlots;
    await config.save();
    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Resident: apni gaadi register kare
// @route  POST /api/parking
// @access Sirf Resident
export const addVehicle = async (req, res) => {
  try {
    const { vehicleType, vehicleNumber } = req.body;

    const vehicle = await Vehicle.create({
      resident: req.user._id,
      flatNumber: req.user.flatNumber,
      vehicleType,
      vehicleNumber,
      // slotNumber yahan nahi diya — default "" (khali) rahega,
      // jab tak Admin manually assign na kare
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Resident: apni saari gaadiyan dekhe
// @route  GET /api/parking/mine
// @access Sirf Resident
export const getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ resident: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Resident: apni gaadi remove kare (jaise gaadi bech di ho)
// @route  DELETE /api/parking/:id
// @access Sirf Resident (aur sirf apni hi gaadi)
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle nahi mila." });
    }

    // Security check — koi doosre ki gaadi delete na kar sake
    if (vehicle.resident.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Ye tumhari gaadi nahi hai." });
    }

    await vehicle.deleteOne();
    res.status(200).json({ message: "Vehicle remove ho gayi." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Admin: saari society ki gaadiyan dekhe + parking summary
// @route  GET /api/parking
// @access Sirf Admin
export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find()
      .populate("resident", "name flatNumber phone")
      .sort({ createdAt: -1 });

    const config = await getOrCreateConfig();

    // Kitni gaadiyon ko slot assign ho chuka hai (khali string wali count nahi hongi)
    const occupiedSlots = vehicles.filter((v) => v.slotNumber && v.slotNumber.trim() !== "").length;

    res.status(200).json({
      vehicles,
      summary: {
        totalSlots: config.totalSlots,
        occupiedSlots,
        emptySlots: Math.max(config.totalSlots - occupiedSlots, 0),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Admin: kisi gaadi ko parking slot assign kare
// @route  PATCH /api/parking/:id/slot
// @access Sirf Admin
export const assignSlot = async (req, res) => {
  try {
    const { slotNumber } = req.body;
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle nahi mila." });
    }

    vehicle.slotNumber = slotNumber;
    await vehicle.save();

    res.status(200).json({ message: "Slot assign ho gaya.", vehicle });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
