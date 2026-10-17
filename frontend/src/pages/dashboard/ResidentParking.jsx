import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { HiOutlineTruck, HiOutlinePlus, HiOutlineTrash, HiOutlineRectangleGroup } from "react-icons/hi2";

// ============================================
// RESIDENT PARKING PAGE
// Resident yahan apni gaadi (Car/Bike) register kar sakta hai,
// apna assigned parking slot dekh sakta hai, aur gaadi remove kar sakta hai
// (jaise gaadi bech di ho ya society chhod di ho).
// Slot assign karna sirf Admin ka kaam hai (AdminParking.jsx).
// ============================================

export default function ResidentParking() {
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ vehicleType: "Car", vehicleNumber: "" });

  // Apni saari gaadiyan backend se laao
  const fetchVehicles = async () => {
    try {
      const { data } = await api.get("/parking/mine");
      setVehicles(data);
    } catch (error) {
      toast.error("Vehicles load nahi ho paayi.");
    }
  };

  useEffect(() => { fetchVehicles(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // "Add Vehicle" form submit hone par
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/parking", formData);
      toast.success("Vehicle register ho gayi!");
      setFormData({ vehicleType: "Car", vehicleNumber: "" });
      setShowForm(false);
      fetchVehicles(); // List refresh karo taaki nayi gaadi turant dikhe
    } catch (error) {
      toast.error(error.response?.data?.message || "Kuch galat hua.");
    } finally {
      setLoading(false);
    }
  };

  // Gaadi remove karne ka function
  const handleDelete = async (id) => {
    if (!confirm("Kya tum ye vehicle remove karna chahte ho?")) return;
    try {
      await api.delete(`/parking/${id}`);
      toast.success("Vehicle remove ho gayi.");
      fetchVehicles();
    } catch (error) {
      toast.error("Remove nahi ho paaya.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-hub-navy">My Vehicles</h2>
          <p className="text-sm text-hub-ink-soft">Apni gaadiyan register karo aur parking slot dekho.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-hub-navy text-white text-sm font-semibold rounded-lg hover:bg-hub-navy-light transition-colors"
        >
          <HiOutlinePlus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      {/* ===== ADD VEHICLE FORM ===== */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-hub-line rounded-xl p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-hub-ink mb-1.5">Vehicle Type</label>
              <select
                name="vehicleType" value={formData.vehicleType} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none"
              >
                <option>Car</option>
                <option>Bike</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-hub-ink mb-1.5">Vehicle Number</label>
              <input
                type="text" name="vehicleNumber" required value={formData.vehicleNumber} onChange={handleChange}
                placeholder="UP70 AB 1234"
                className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit" disabled={loading}
            className="px-5 py-2.5 bg-hub-gold text-hub-navy font-semibold rounded-lg hover:bg-hub-gold-light transition-colors disabled:opacity-60"
          >
            {loading ? "Adding..." : "Register Vehicle"}
          </button>
        </form>
      )}

      {/* ===== MY VEHICLES LIST ===== */}
      {vehicles.length === 0 ? (
        <div className="bg-white border border-hub-line rounded-xl p-10 text-center">
          <p className="text-hub-ink-soft text-sm">Abhi tak koi vehicle register nahi ki.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {vehicles.map((v) => (
            <div key={v._id} className="bg-white border border-hub-line rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-hub-gold-light/30 flex items-center justify-center">
                  <HiOutlineTruck className="w-5 h-5 text-hub-gold" />
                </div>
                <div>
                  <p className="font-mono font-semibold text-hub-navy tracking-wide">{v.vehicleNumber}</p>
                  <p className="text-xs text-hub-ink-soft">{v.vehicleType}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Agar slot assign ho chuka hai to green badge dikhao, warna "Pending" */}
                {v.slotNumber ? (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-hub-sage-light text-hub-sage">
                    <HiOutlineRectangleGroup className="w-4 h-4" /> Slot {v.slotNumber}
                  </span>
                ) : (
                  <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-hub-gold-light/40 text-hub-gold">
                    Slot Pending
                  </span>
                )}
                <button
                  onClick={() => handleDelete(v._id)}
                  className="p-2 text-hub-ink-soft hover:text-hub-alert hover:bg-hub-alert/10 rounded-lg transition-colors"
                >
                  <HiOutlineTrash className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
