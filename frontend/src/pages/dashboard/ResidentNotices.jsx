import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { HiOutlineSpeakerWave, HiOutlineExclamationTriangle } from "react-icons/hi2";

// ============================================
// RESIDENT NOTICES PAGE
// Ye page Resident ko sirf DEKHNE (read-only) ke liye hai.
// Notice post/delete karna sirf Admin kar sakta hai (AdminNotices.jsx).
// ============================================

// Har category ka apna alag color — UI me visually differentiate karne ke liye
const categoryColors = {
  General: "bg-hub-line/50 text-hub-ink-soft",
  "Water Shutdown": "bg-blue-100 text-blue-700",
  Electricity: "bg-hub-gold-light/40 text-hub-gold",
  Meeting: "bg-hub-sage-light text-hub-sage",
  Festival: "bg-purple-100 text-purple-700",
  Emergency: "bg-hub-alert/10 text-hub-alert",
};

export default function ResidentNotices() {
  // notices = backend se aayi hui saari notices ki list
  const [notices, setNotices] = useState([]);
  // loading = jab tak data fetch ho raha hai, "Loading..." dikhane ke liye
  const [loading, setLoading] = useState(true);

  // Backend se saare notices laane ka function
  const fetchNotices = async () => {
    try {
      const { data } = await api.get("/notices");
      setNotices(data);
    } catch (error) {
      toast.error("Notices load nahi ho paaye.");
    } finally {
      setLoading(false);
    }
  };

  // Component jab pehli baar screen pe aaye, tabhi ek baar notices fetch karo
  useEffect(() => {
    fetchNotices();
  }, []);

  if (loading) return <p className="text-hub-ink-soft font-mono text-sm">Loading...</p>;

  return (
    <div className="space-y-6">
      {/* ===== PAGE HEADING ===== */}
      <div>
        <h2 className="font-display text-xl font-bold text-hub-navy">Notice Board</h2>
        <p className="text-sm text-hub-ink-soft">Society ke saare updates aur announcements ek jagah.</p>
      </div>

      {/* ===== EMPTY STATE — agar koi notice nahi hai ===== */}
      {notices.length === 0 ? (
        <div className="bg-white border border-hub-line rounded-xl p-10 text-center">
          <p className="text-hub-ink-soft text-sm">Abhi tak koi notice nahi hai.</p>
        </div>
      ) : (
        // ===== NOTICES LIST — feed style, sabse naya/urgent upar =====
        <div className="space-y-3">
          {notices.map((n) => (
            <div
              key={n._id}
              // Agar notice urgent hai to red border, warna normal border
              className={`bg-white border rounded-xl p-5 ${n.isUrgent ? "border-hub-alert/40" : "border-hub-line"}`}
            >
              <div className="flex items-start gap-3">
                {/* Icon box — urgent ho to warning icon, warna speaker icon */}
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${n.isUrgent ? "bg-hub-alert/10" : "bg-hub-gold-light/30"}`}>
                  {n.isUrgent ? (
                    <HiOutlineExclamationTriangle className="w-5 h-5 text-hub-alert" />
                  ) : (
                    <HiOutlineSpeakerWave className="w-5 h-5 text-hub-gold" />
                  )}
                </div>

                <div className="flex-1">
                  {/* Title + category badge + URGENT tag (agar applicable ho) */}
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-semibold text-hub-ink">{n.title}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[n.category]}`}>
                      {n.category}
                    </span>
                    {n.isUrgent && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-hub-alert text-white">
                        URGENT
                      </span>
                    )}
                  </div>

                  {/* Notice ki puri message/description */}
                  <p className="text-sm text-hub-ink-soft">{n.message}</p>

                  {/* Kisne aur kab post kiya */}
                  <p className="text-xs text-hub-ink-soft mt-2">
                    Posted by {n.postedBy?.name} •{" "}
                    {new Date(n.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
