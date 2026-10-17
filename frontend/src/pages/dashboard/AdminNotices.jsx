import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { HiOutlineMegaphone, HiOutlineTrash, HiOutlineExclamationTriangle } from "react-icons/hi2";

// ============================================
// ADMIN NOTICES PAGE
// Admin yahan se naya notice post kar sakta hai
// aur purane/galat notices delete kar sakta hai.
// ============================================

// Dropdown me dikhane wali saari categories
const categories = ["General", "Water Shutdown", "Electricity", "Meeting", "Festival", "Emergency"];

// Har category ka apna color (Resident page jaisa hi, consistency ke liye)
const categoryColors = {
  General: "bg-hub-line/50 text-hub-ink-soft",
  "Water Shutdown": "bg-blue-100 text-blue-700",
  Electricity: "bg-hub-gold-light/40 text-hub-gold",
  Meeting: "bg-hub-sage-light text-hub-sage",
  Festival: "bg-purple-100 text-purple-700",
  Emergency: "bg-hub-alert/10 text-hub-alert",
};

export default function AdminNotices() {
  const [notices, setNotices] = useState([]);       // Saari existing notices
  const [showForm, setShowForm] = useState(false);   // "New Notice" form dikhana hai ya nahi
  const [loading, setLoading] = useState(false);     // Form submit hote waqt button disable karne ke liye

  // Form ke saare input fields ek hi object me track karte hain
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    category: "General",
    isUrgent: false,
  });

  // Backend se saare notices laao
  const fetchNotices = async () => {
    try {
      const { data } = await api.get("/notices");
      setNotices(data);
    } catch (error) {
      toast.error("Notices load nahi ho paaye.");
    }
  };

  // Page load hote hi ek baar notices fetch karo
  useEffect(() => {
    fetchNotices();
  }, []);

  // Form ke kisi bhi input field ka value change hone par formData update karo
  // (checkbox ke liye "checked" use hota hai, baaki sabke liye "value")
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  // "Post Notice" button click hone par ye chalega
  const handleSubmit = async (e) => {
    e.preventDefault(); // Page reload hone se roko (default form behavior)
    setLoading(true);
    try {
      await api.post("/notices", formData);
      toast.success("Notice post ho gaya!");
      // Form reset karo taaki agla notice fresh se likha ja sake
      setFormData({ title: "", message: "", category: "General", isUrgent: false });
      setShowForm(false);
      fetchNotices(); // List ko refresh karo taaki naya notice turant dikhe
    } catch (error) {
      toast.error(error.response?.data?.message || "Kuch galat hua.");
    } finally {
      setLoading(false);
    }
  };

  // Trash icon click hone par notice delete karo (confirm ke baad)
  const handleDelete = async (id) => {
    if (!confirm("Kya tum ye notice delete karna chahte ho?")) return; // Accidental delete se bachne ke liye
    try {
      await api.delete(`/notices/${id}`);
      toast.success("Notice delete ho gaya.");
      fetchNotices();
    } catch (error) {
      toast.error("Delete nahi ho paaya.");
    }
  };

  return (
    <div className="space-y-6">
      {/* ===== HEADER: Title + "New Notice" toggle button ===== */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-hub-navy">Notice Board</h2>
          <p className="text-sm text-hub-ink-soft">Society-wide announcements post karo.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-hub-navy text-white text-sm font-semibold rounded-lg hover:bg-hub-navy-light transition-colors"
        >
          <HiOutlineMegaphone className="w-4 h-4" /> New Notice
        </button>
      </div>

      {/* ===== CREATE NOTICE FORM — sirf tab dikhta hai jab showForm true ho ===== */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-hub-line rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-hub-ink mb-1.5">Title</label>
            <input
              type="text" name="title" required value={formData.title} onChange={handleChange}
              placeholder="e.g. Water Supply Shutdown Tomorrow"
              className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-hub-ink mb-1.5">Message</label>
            <textarea
              required rows={3} name="message" value={formData.message} onChange={handleChange}
              placeholder="Detail me batao..."
              className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none resize-none"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-hub-ink mb-1.5">Category</label>
              <select
                name="category" value={formData.category} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none"
              >
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            {/* Urgent checkbox — check karne par notice "URGENT" tag ke saath upar pin hoga */}
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-hub-line cursor-pointer">
              <input type="checkbox" name="isUrgent" checked={formData.isUrgent} onChange={handleChange} className="w-4 h-4" />
              <span className="text-sm text-hub-ink flex items-center gap-1.5">
                <HiOutlineExclamationTriangle className="w-4 h-4 text-hub-alert" /> Mark as Urgent
              </span>
            </label>
          </div>
          <button
            type="submit" disabled={loading}
            className="px-5 py-2.5 bg-hub-gold text-hub-navy font-semibold rounded-lg hover:bg-hub-gold-light transition-colors disabled:opacity-60"
          >
            {loading ? "Posting..." : "Post Notice"}
          </button>
        </form>
      )}

      {/* ===== EXISTING NOTICES LIST (delete option ke saath) ===== */}
      {notices.length === 0 ? (
        <div className="bg-white border border-hub-line rounded-xl p-10 text-center">
          <p className="text-hub-ink-soft text-sm">Abhi tak koi notice nahi hai.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notices.map((n) => (
            <div
              key={n._id}
              className={`bg-white border rounded-xl p-5 flex items-start justify-between gap-4 ${n.isUrgent ? "border-hub-alert/40" : "border-hub-line"}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="font-semibold text-hub-ink">{n.title}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[n.category]}`}>{n.category}</span>
                  {n.isUrgent && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-hub-alert text-white">URGENT</span>}
                </div>
                <p className="text-sm text-hub-ink-soft">{n.message}</p>
                <p className="text-xs text-hub-ink-soft mt-2">
                  {new Date(n.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              {/* Delete button — sirf Admin page pe hai (Resident page pe nahi) */}
              <button
                onClick={() => handleDelete(n._id)}
                className="p-2 text-hub-ink-soft hover:text-hub-alert hover:bg-hub-alert/10 rounded-lg transition-colors shrink-0"
              >
                <HiOutlineTrash className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
