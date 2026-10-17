import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { HiOutlineSquares2X2, HiOutlineCheckCircle, HiOutlineCog6Tooth, HiOutlineTruck } from "react-icons/hi2";

// ============================================
// ADMIN PARKING PAGE
// Admin yahan:
// 1. Total society parking slots set kar sakta hai
// 2. Saari registered gaadiyan dekh sakta hai
// 3. Har gaadi ko ek parking slot (jaise "A-12") assign kar sakta hai
// ============================================

export default function AdminParking() {
  const [vehicles, setVehicles] = useState([]);
  const [summary, setSummary] = useState({ totalSlots: 0, occupiedSlots: 0, emptySlots: 0 });
  const [slotInputs, setSlotInputs] = useState({}); // { vehicleId: "input me type ho raha slot number" }
  const [configInput, setConfigInput] = useState(""); // Total slots edit karne ke liye
  const [showConfigForm, setShowConfigForm] = useState(false);

  // Saari gaadiyan + summary (total/occupied/empty) backend se laao
  const fetchVehicles = async () => {
    try {
      const { data } = await api.get("/parking");
      setVehicles(data.vehicles);
      setSummary(data.summary);
      setConfigInput(data.summary.totalSlots);
    } catch (error) {
      toast.error("Vehicles load nahi ho paayi.");
    }
  };

  useEffect(() => { fetchVehicles(); }, []);

  // "Save" click hone par total slots update karo
  const handleUpdateConfig = async () => {
    try {
      await api.patch("/parking/config", { totalSlots: Number(configInput) });
      toast.success("Total slots update ho gaye.");
      setShowConfigForm(false);
      fetchVehicles(); // Summary recalculate karne ke liye refresh
    } catch (error) {
      toast.error("Update fail hua.");
    }
  };

  // Kisi gaadi ko slot assign karo
  const handleAssignSlot = async (id) => {
    const slotNumber = slotInputs[id];
    if (!slotNumber?.trim()) return;
    try {
      await api.patch(`/parking/${id}/slot`, { slotNumber });
      toast.success("Slot assign ho gaya.");
      setSlotInputs({ ...slotInputs, [id]: "" });
      fetchVehicles();
    } catch (error) {
      toast.error("Assign fail hua.");
    }
  };

  return (
    <div className="space-y-6">
      {/* ===== SUMMARY CARDS — Total / Occupied / Empty ===== */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white border border-hub-line rounded-xl p-5">
          <HiOutlineSquares2X2 className="w-6 h-6 text-hub-navy mb-3" strokeWidth={1.5} />
          <p className="font-display text-2xl font-bold text-hub-navy">{summary.totalSlots}</p>
          <p className="text-sm text-hub-ink-soft">Total Slots</p>
        </div>
        <div className="bg-white border border-hub-line rounded-xl p-5">
          <HiOutlineTruck className="w-6 h-6 text-hub-gold mb-3" strokeWidth={1.5} />
          <p className="font-display text-2xl font-bold text-hub-navy">{summary.occupiedSlots}</p>
          <p className="text-sm text-hub-ink-soft">Occupied Slots</p>
        </div>
        <div className="bg-white border border-hub-line rounded-xl p-5">
          <HiOutlineCheckCircle className="w-6 h-6 text-hub-sage mb-3" strokeWidth={1.5} />
          <p className="font-display text-2xl font-bold text-hub-navy">{summary.emptySlots}</p>
          <p className="text-sm text-hub-ink-soft">Empty Slots</p>
        </div>
      </div>

      {/* ===== TOTAL SLOTS SETTING (collapsible) ===== */}
      <div className="bg-white border border-hub-line rounded-xl p-5">
        <button
          onClick={() => setShowConfigForm(!showConfigForm)}
          className="flex items-center gap-2 text-sm font-semibold text-hub-navy"
        >
          <HiOutlineCog6Tooth className="w-4 h-4" /> Configure Total Parking Slots
        </button>
        {showConfigForm && (
          <div className="flex items-center gap-3 mt-4">
            <input
              type="number" min="1" value={configInput} onChange={(e) => setConfigInput(e.target.value)}
              className="px-4 py-2 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none w-32"
            />
            <button
              onClick={handleUpdateConfig}
              className="px-4 py-2 bg-hub-navy text-white text-sm font-semibold rounded-lg hover:bg-hub-navy-light"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* ===== ALL VEHICLES LIST ===== */}
      <div>
        <h2 className="font-display text-xl font-bold text-hub-navy mb-4">Registered Vehicles</h2>
        {vehicles.length === 0 ? (
          <div className="bg-white border border-hub-line rounded-xl p-10 text-center">
            <p className="text-hub-ink-soft text-sm">Abhi tak koi vehicle register nahi hui.</p>
          </div>
        ) : (
          <div className="bg-white border border-hub-line rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-hub-paper text-hub-ink-soft text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Resident</th>
                  <th className="text-left px-5 py-3 font-medium">Vehicle</th>
                  <th className="text-left px-5 py-3 font-medium">Type</th>
                  <th className="text-left px-5 py-3 font-medium">Slot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hub-line">
                {vehicles.map((v) => (
                  <tr key={v._id}>
                    <td className="px-5 py-3">
                      <p className="font-medium text-hub-ink">{v.resident?.name}</p>
                      <p className="text-xs text-hub-ink-soft">Flat {v.flatNumber}</p>
                    </td>
                    <td className="px-5 py-3 font-mono text-hub-ink">{v.vehicleNumber}</td>
                    <td className="px-5 py-3 text-hub-ink-soft">{v.vehicleType}</td>
                    <td className="px-5 py-3">
                      {/* Agar slot already assigned hai to badge dikhao,
                          warna ek chhota input + Assign button dikhao */}
                      {v.slotNumber ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-hub-sage-light text-hub-sage">
                          Slot {v.slotNumber}
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="e.g. A-12"
                            value={slotInputs[v._id] || ""}
                            onChange={(e) => setSlotInputs({ ...slotInputs, [v._id]: e.target.value })}
                            className="px-2 py-1 rounded-lg border border-hub-line text-xs focus:border-hub-navy focus:outline-none w-24"
                          />
                          <button
                            onClick={() => handleAssignSlot(v._id)}
                            className="px-3 py-1 bg-hub-navy text-white text-xs font-medium rounded-lg hover:bg-hub-navy-light"
                          >
                            Assign
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
