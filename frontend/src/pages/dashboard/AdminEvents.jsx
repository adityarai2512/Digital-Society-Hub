import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { HiOutlineCalendarDays, HiOutlineMapPin, HiOutlineUserGroup, HiOutlineTrash, HiOutlinePlus } from "react-icons/hi2";

// ============================================
// ADMIN EVENTS PAGE
// Admin yahan naya event bana sakta hai,
// registered participants dekh sakta hai, aur event delete kar sakta hai.
// ============================================

const categories = ["Festival", "Sports", "Fitness", "Meeting", "Cultural", "Other"];

const categoryColors = {
  Festival: "bg-purple-100 text-purple-700",
  Sports: "bg-hub-sage-light text-hub-sage",
  Fitness: "bg-blue-100 text-blue-700",
  Meeting: "bg-hub-line/50 text-hub-ink-soft",
  Cultural: "bg-hub-gold-light/40 text-hub-gold",
  Other: "bg-hub-line/50 text-hub-ink-soft",
};

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null); // Kaunsa event ka participant list expand hai

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Festival",
    eventDate: "",
    venue: "",
    maxParticipants: "",
  });

  const fetchEvents = async () => {
    try {
      const { data } = await api.get("/events");
      setEvents(data);
    } catch (error) {
      toast.error("Events load nahi ho paaye.");
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // maxParticipants empty ho to backend ko 0 (unlimited) bhejo
      await api.post("/events", {
        ...formData,
        maxParticipants: formData.maxParticipants ? Number(formData.maxParticipants) : 0,
      });
      toast.success("Event ban gaya!");
      setFormData({ title: "", description: "", category: "Festival", eventDate: "", venue: "", maxParticipants: "" });
      setShowForm(false);
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Kuch galat hua.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Kya tum ye event delete karna chahte ho? Saare registrations bhi hat jayenge.")) return;
    try {
      await api.delete(`/events/${id}`);
      toast.success("Event delete ho gaya.");
      fetchEvents();
    } catch (error) {
      toast.error("Delete nahi ho paaya.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-hub-navy">Events</h2>
          <p className="text-sm text-hub-ink-soft">Society activities banao aur manage karo.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-hub-navy text-white text-sm font-semibold rounded-lg hover:bg-hub-navy-light transition-colors"
        >
          <HiOutlinePlus className="w-4 h-4" /> New Event
        </button>
      </div>

      {/* ===== CREATE EVENT FORM ===== */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-hub-line rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-hub-ink mb-1.5">Title</label>
            <input
              type="text" name="title" required value={formData.title} onChange={handleChange}
              placeholder="e.g. Holi Celebration 2026"
              className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-hub-ink mb-1.5">Description</label>
            <textarea
              required rows={2} name="description" value={formData.description} onChange={handleChange}
              placeholder="Event ke baare me batao..."
              className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none resize-none"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-hub-ink mb-1.5">Category</label>
              <select name="category" value={formData.category} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none">
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-hub-ink mb-1.5">Event Date</label>
              <input
                type="date" name="eventDate" required value={formData.eventDate} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-hub-ink mb-1.5">Venue</label>
              <input
                type="text" name="venue" required value={formData.venue} onChange={handleChange} placeholder="Clubhouse"
                className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-hub-ink mb-1.5">Max Participants (optional)</label>
              <input
                type="number" name="maxParticipants" min="1" value={formData.maxParticipants} onChange={handleChange}
                placeholder="Leave blank for unlimited"
                className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit" disabled={loading}
            className="px-5 py-2.5 bg-hub-gold text-hub-navy font-semibold rounded-lg hover:bg-hub-gold-light transition-colors disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      )}

      {/* ===== EVENTS LIST ===== */}
      {events.length === 0 ? (
        <div className="bg-white border border-hub-line rounded-xl p-10 text-center">
          <p className="text-hub-ink-soft text-sm">Abhi tak koi event nahi hai.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((e) => (
            <div key={e._id} className="bg-white border border-hub-line rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-semibold text-hub-ink">{e.title}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[e.category]}`}>{e.category}</span>
                  </div>
                  <p className="text-sm text-hub-ink-soft mb-2">{e.description}</p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <p className="flex items-center gap-1.5 text-xs text-hub-ink-soft">
                      <HiOutlineCalendarDays className="w-4 h-4" />
                      {new Date(e.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-hub-ink-soft">
                      <HiOutlineMapPin className="w-4 h-4" /> {e.venue}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(e._id)}
                  className="p-2 text-hub-ink-soft hover:text-hub-alert hover:bg-hub-alert/10 rounded-lg transition-colors shrink-0"
                >
                  <HiOutlineTrash className="w-5 h-5" />
                </button>
              </div>

              {/* Participants toggle button */}
              <button
                onClick={() => setExpandedId(expandedId === e._id ? null : e._id)}
                className="flex items-center gap-1.5 mt-3 px-3 py-1.5 text-sm font-medium text-hub-ink-soft hover:text-hub-navy transition-colors"
              >
                <HiOutlineUserGroup className="w-4 h-4" />
                {e.participants.length} Registered{e.maxParticipants > 0 && ` / ${e.maxParticipants}`}
              </button>

              {/* Expanded: registered residents ki list */}
              {expandedId === e._id && (
                <div className="mt-3 pt-3 border-t border-hub-line">
                  {e.participants.length === 0 ? (
                    <p className="text-xs text-hub-ink-soft">Abhi tak koi register nahi hua.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {e.participants.map((p, i) => (
                        <div key={i} className="flex items-center justify-between text-sm bg-hub-paper rounded-lg px-3 py-2">
                          <span className="text-hub-ink font-medium">{p.name}</span>
                          <span className="text-hub-ink-soft text-xs">Flat {p.flatNumber}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
