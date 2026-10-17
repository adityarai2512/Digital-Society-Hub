import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { HiOutlineBanknotes, HiOutlineUsers } from "react-icons/hi2";

const statusStyles = {
  unpaid: "bg-hub-gold-light/40 text-hub-gold border-hub-gold/30",
  paid: "bg-hub-sage-light text-hub-sage border-hub-sage/30",
};

export default function AdminBilling() {
  const [bills, setBills] = useState([]);
  const [residents, setResidents] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [mode, setMode] = useState("single");
  const [formData, setFormData] = useState({ residentId: "", month: "", amount: "", dueDate: "" });
  const [loading, setLoading] = useState(false);

  const fetchBills = async () => {
    try {
      const { data } = await api.get("/bills", { params: filterStatus ? { status: filterStatus } : {} });
      setBills(data);
    } catch (error) {
      toast.error("Bills load nahi ho paaye.");
    }
  };

  const fetchResidents = async () => {
    try {
      const { data } = await api.get("/admin/users");
      setResidents(data.filter((u) => u.role === "resident"));
    } catch (error) {
      toast.error("Residents list load nahi ho paayi.");
    }
  };

  useEffect(() => { fetchResidents(); }, []);
  useEffect(() => { fetchBills(); }, [filterStatus]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "single") {
        await api.post("/bills", formData);
        toast.success("Bill generate ho gaya!");
      } else {
        const { data } = await api.post("/bills/bulk", { month: formData.month, amount: formData.amount, dueDate: formData.dueDate });
        toast.success(data.message);
      }
      setFormData({ residentId: "", month: "", amount: "", dueDate: "" });
      fetchBills();
    } catch (error) {
      toast.error(error.response?.data?.message || "Kuch galat hua.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-hub-line rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineBanknotes className="w-5 h-5 text-hub-gold" />
          <h2 className="font-display font-bold text-hub-navy">Generate Maintenance Bill</h2>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={() => setMode("single")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${mode === "single" ? "bg-hub-navy text-white border-hub-navy" : "border-hub-line text-hub-ink-soft"}`}>
            Single Resident
          </button>
          <button onClick={() => setMode("bulk")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${mode === "bulk" ? "bg-hub-navy text-white border-hub-navy" : "border-hub-line text-hub-ink-soft"}`}>
            <HiOutlineUsers className="w-4 h-4" /> All Residents
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "single" && (
            <div>
              <label className="block text-sm font-medium text-hub-ink mb-1.5">Resident</label>
              <select name="residentId" required value={formData.residentId} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none">
                <option value="">Select resident...</option>
                {residents.map((r) => <option key={r._id} value={r._id}>{r.name} — Flat {r.flatNumber}</option>)}
              </select>
            </div>
          )}

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-hub-ink mb-1.5">Month</label>
              <input type="text" name="month" required value={formData.month} onChange={handleChange} placeholder="August 2026"
                className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-hub-ink mb-1.5">Amount (₹)</label>
              <input type="number" name="amount" required min="1" value={formData.amount} onChange={handleChange} placeholder="2500"
                className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-hub-ink mb-1.5">Due Date</label>
              <input type="date" name="dueDate" required value={formData.dueDate} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="px-5 py-2.5 bg-hub-gold text-hub-navy font-semibold rounded-lg hover:bg-hub-gold-light transition-colors disabled:opacity-60">
            {loading ? "Generating..." : mode === "bulk" ? "Generate for All Residents" : "Generate Bill"}
          </button>
        </form>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-hub-navy">All Bills</h2>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 rounded-lg border border-hub-line text-sm focus:border-hub-navy focus:outline-none">
          <option value="">All Status</option>
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      <div className="bg-white border border-hub-line rounded-xl overflow-hidden">
        {bills.length === 0 ? (
          <p className="text-center py-10 text-hub-ink-soft text-sm">Koi bill nahi mila.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-hub-paper text-hub-ink-soft text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Resident</th>
                <th className="text-left px-5 py-3 font-medium">Month</th>
                <th className="text-left px-5 py-3 font-medium">Amount</th>
                <th className="text-left px-5 py-3 font-medium">Due Date</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hub-line">
              {bills.map((b) => (
                <tr key={b._id}>
                  <td className="px-5 py-3">
                    <p className="font-medium text-hub-ink">{b.resident?.name}</p>
                    <p className="text-xs text-hub-ink-soft">Flat {b.flatNumber}</p>
                  </td>
                  <td className="px-5 py-3 text-hub-ink-soft">{b.month}</td>
                  <td className="px-5 py-3 font-mono font-semibold text-hub-navy">₹{b.amount.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-3 text-hub-ink-soft">{new Date(b.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="px-5 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${statusStyles[b.status]}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
