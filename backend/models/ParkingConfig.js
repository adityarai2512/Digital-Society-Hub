import mongoose from "mongoose";

// ============================================
// PARKING CONFIG MODEL
// Ye ek "singleton" model hai — matlab is collection
// me hamesha SIRF EK document hoga jisme society ke
// total parking slots ki settings store hoti hain.
// Isi se "Empty Slots" calculate hota hai:
// Empty = totalSlots - (kitni gaadiyon ko slot assign hua hai)
// ============================================

const parkingConfigSchema = new mongoose.Schema({
  totalSlots: {
    type: Number,
    default: 50, // Default assumption — Admin baad me change kar sakta hai
  },
});

const ParkingConfig = mongoose.model("ParkingConfig", parkingConfigSchema);
export default ParkingConfig;
