import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { HiOutlineUserPlus } from "react-icons/hi2";

const statusStyles = {
  pending: "bg-hub-gold-light/40 text-hub-gold border-hub-gold/30",
  "checked-in": "bg-hub-sage-light text-hub-sage border-hub-sage/30",
  "checked-out": "bg-gray-100 text-gray-500 border-gray-200",
  expired: "bg-hub-alert/10 text-hub-alert border-hub-alert/20",
  blacklisted: "bg-hub-alert/10 text-hub-alert border-hub-alert/20",
};

export default function ResidentVisitors() {
  const [visitors, setVisitors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [qrModal, setQrModal] = useState(null);
  const [formData, setFormData] = useState({ visitorName: "", visitorPhone: "", purpose: "Guest" });
  const [loading, setLoading] = useState(false);

  const fetchVisitors = async () => {
    try {
      const { data } = await api.get("/visitors/mine");
      setVisitors(data);
    } catch (error) {
      toast.error("Visitors load nahi ho paaye.");
    }
  };

  useEffect(() => { fetchVisitors(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/visitors", formData);
      toast.success("Visitor invite ban gaya!");
      setQrModal(data);
      setFormData({ visitorName: "", visitorPhone: "", purpose: "Guest" });
      setShowForm(false);
      fetchVisitors();
    } catch (error) {
      toast.error(error.response?.data?.message || "Kuch galat hua.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-hub-navy">Visitor Invites</h2>
          <p className="text-sm text-hub-ink-soft">QR pass banao apne guests ke liye.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-hub-navy text-white text-sm font-semibold rounded-lg hover:bg-hub-navy-light transition-colors">
          <HiOutlineUserPlus className="w-4 h-4" /> New Invite
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-hub-line rounded-xl p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-hub-ink mb-1.5">Visitor Name</label>
              <input type="text" name="visitorName" required value={formData.visitorName} onChange={handleChange} placeholder="Ramesh Kumar"
                className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none focus:ring-2 focus:ring-hub-navy/10" />
            </div>
            <div>
              <label className="block text-sm font-medium text-hub-ink mb-1.5">Phone Number</label>
              <input type="tel" name="visitorPhone" required value={formData.visitorPhone} onChange={handleChange} placeholder="9876543210"
                className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none focus:ring-2 focus:ring-hub-navy/10" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-hub-ink mb-1.5">Purpose</label>
            <select name="purpose" value={formData.purpose} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none">
              <option>Guest</option><option>Delivery</option><option>Cab/Auto</option><option>Service Staff</option><option>Other</option>
            </select>
          </div>
          <button type="submit" disabled={loading}
            className="px-5 py-2.5 bg-hub-gold text-hub-navy font-semibold rounded-lg hover:bg-hub-gold-light transition-colors disabled:opacity-60">
            {loading ? "Generating..." : "Generate QR Pass"}
          </button>
        </form>
      )}

      <div className="bg-white border border-hub-line rounded-xl overflow-hidden">
        {visitors.length === 0 ? (
          <p className="text-center py-10 text-hub-ink-soft text-sm">Abhi tak koi visitor invite nahi kiya.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-hub-paper text-hub-ink-soft text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Visitor</th>
                <th className="text-left px-5 py-3 font-medium">Purpose</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hub-line">
              {visitors.map((v) => (
                <tr key={v._id}>
                  <td className="px-5 py-3">
                    <p className="font-medium text-hub-ink">{v.visitorName}</p>
                    <p className="text-xs text-hub-ink-soft">{v.visitorPhone}</p>
                  </td>
                  <td className="px-5 py-3 text-hub-ink-soft">{v.purpose}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[v.status]}`}>{v.status}</span>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-hub-ink-soft">{v.passCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {qrModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
            <h3 className="font-display font-bold text-hub-navy text-lg mb-1">{qrModal.visitor.visitorName}'s Pass</h3>
            <p className="text-sm text-hub-ink-soft mb-5">Ye QR guard ko dikhao entry ke liye.</p>
            <img src={qrModal.qrCodeImage} alt="Visitor QR Code" className="mx-auto w-48 h-48 mb-4" />
            <p className="font-mono text-lg font-bold text-hub-navy tracking-wider mb-6">{qrModal.visitor.passCode}</p>
            <button onClick={() => setQrModal(null)} className="w-full py-2.5 bg-hub-navy text-white font-semibold rounded-lg hover:bg-hub-navy-light">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
