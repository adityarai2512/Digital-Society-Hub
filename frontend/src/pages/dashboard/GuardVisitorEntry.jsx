import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { HiOutlineQrCode, HiOutlineArrowPath, HiOutlineCheckCircle } from "react-icons/hi2";

const statusStyles = {
  pending: "bg-hub-gold-light/40 text-hub-gold border-hub-gold/30",
  "checked-in": "bg-hub-sage-light text-hub-sage border-hub-sage/30",
  "checked-out": "bg-gray-100 text-gray-500 border-gray-200",
  expired: "bg-hub-alert/10 text-hub-alert border-hub-alert/20",
  blacklisted: "bg-hub-alert/10 text-hub-alert border-hub-alert/20",
};

export default function GuardVisitorEntry() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [todayVisitors, setTodayVisitors] = useState([]);

  const fetchToday = async () => {
    try {
      const { data } = await api.get("/visitors/today");
      setTodayVisitors(data);
    } catch (error) {
      toast.error("List load nahi ho paayi.");
    }
  };

  useEffect(() => { fetchToday(); }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post("/visitors/verify", { passCode: code });
      toast.success(data.message);
      setCode("");
      fetchToday();
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (id) => {
    try {
      await api.post(`/visitors/${id}/checkout`);
      toast.success("Checkout ho gaya.");
      fetchToday();
    } catch (error) {
      toast.error("Checkout fail hua.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-hub-line rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineQrCode className="w-5 h-5 text-hub-gold" />
          <h2 className="font-display font-bold text-hub-navy">Verify Visitor Pass</h2>
        </div>
        <form onSubmit={handleVerify} className="flex gap-3">
          <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Enter pass code e.g. A1B2C3D4"
            className="flex-1 px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none focus:ring-2 focus:ring-hub-navy/10 font-mono tracking-wider" />
          <button type="submit" disabled={loading} className="px-6 py-2.5 bg-hub-navy text-white font-semibold rounded-lg hover:bg-hub-navy-light disabled:opacity-60">
            {loading ? "Checking..." : "Verify"}
          </button>
        </form>
        <p className="text-xs text-hub-ink-soft mt-2">Note: Camera-based QR scan future update me add hoga. Abhi visitor jo code dikhaega wo yahan type karo.</p>
      </div>

      <div className="bg-white border border-hub-line rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-hub-line">
          <h3 className="font-display font-semibold text-hub-navy">Today's Visitors</h3>
          <button onClick={fetchToday} className="text-hub-ink-soft hover:text-hub-navy"><HiOutlineArrowPath className="w-5 h-5" /></button>
        </div>
        {todayVisitors.length === 0 ? (
          <p className="text-center py-10 text-hub-ink-soft text-sm">Aaj tak koi visitor nahi aaya.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-hub-paper text-hub-ink-soft text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Visitor</th>
                <th className="text-left px-5 py-3 font-medium">Flat</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hub-line">
              {todayVisitors.map((v) => (
                <tr key={v._id}>
                  <td className="px-5 py-3">
                    <p className="font-medium text-hub-ink">{v.visitorName}</p>
                    <p className="text-xs text-hub-ink-soft">{v.purpose}</p>
                  </td>
                  <td className="px-5 py-3 text-hub-ink-soft">{v.flatNumber}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[v.status]}`}>{v.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    {v.status === "checked-in" && (
                      <button onClick={() => handleCheckout(v._id)} className="flex items-center gap-1 text-xs font-semibold text-hub-sage hover:text-hub-sage/70">
                        <HiOutlineCheckCircle className="w-4 h-4" /> Checkout
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
