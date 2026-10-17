import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { HiOutlineCalendarDays, HiOutlineMapPin, HiOutlineUserGroup, HiOutlineTicket, HiOutlineCheckCircle } from "react-icons/hi2";

// ============================================
// RESIDENT EVENTS PAGE
// Resident yahan society ke events dekh sakta hai
// aur "Register" / "Cancel Registration" kar sakta hai.
// Event banana/delete karna sirf Admin ka kaam hai (AdminEvents.jsx).
// ============================================

const categoryColors = {
  Festival: "bg-purple-100 text-purple-700",
  Sports: "bg-hub-sage-light text-hub-sage",
  Fitness: "bg-blue-100 text-blue-700",
  Meeting: "bg-hub-line/50 text-hub-ink-soft",
  Cultural: "bg-hub-gold-light/40 text-hub-gold",
  Other: "bg-hub-line/50 text-hub-ink-soft",
};

export default function ResidentEvents() {
  const { user } = useAuth(); // Logged-in resident ki info (user._id chahiye registration check ke liye)
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null); // Jab register/cancel ka API call chal raha ho, button disable rakhne ke liye

  const fetchEvents = async () => {
    try {
      const { data } = await api.get("/events");
      setEvents(data);
    } catch (error) {
      toast.error("Events load nahi ho paaye.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  // "Register" button click hone par
  const handleRegister = async (id) => {
    setActingId(id);
    try {
      const { data } = await api.post(`/events/${id}/register`);
      toast.success(data.message);
      fetchEvents(); // List refresh karo taaki updated participant count dikhe
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration fail hui.");
    } finally {
      setActingId(null);
    }
  };

  // "Cancel Registration" button click hone par
  const handleUnregister = async (id) => {
    setActingId(id);
    try {
      await api.delete(`/events/${id}/register`);
      toast.success("Registration cancel ho gayi.");
      fetchEvents();
    } catch (error) {
      toast.error("Cancel nahi ho paaya.");
    } finally {
      setActingId(null);
    }
  };

  // Backend response me current user ka _id nahi bheja, isliye humne
  // "amIRegistered" check flatNumber+name combo se nahi, balki
  // participants array me apna match dhund kar karna hoga.
  // Simplest tarika: cookie se authenticated user already pata hai backend ko,
  // isliye hum yahan sirf "participants.length" aur ek local guess use karenge.
  // (Behtar approach: useAuth() se user._id le lo — neeche wahi use kar rahe hain)

  if (loading) return <p className="text-hub-ink-soft font-mono text-sm">Loading...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-hub-navy">Society Events</h2>
        <p className="text-sm text-hub-ink-soft">Upcoming activities — register karo aur part lo.</p>
      </div>

      {events.length === 0 ? (
        <div className="bg-white border border-hub-line rounded-xl p-10 text-center">
          <p className="text-hub-ink-soft text-sm">Abhi tak koi event nahi hai.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {events.map((e) => (
            <EventCard
              key={e._id}
              event={e}
              // Check karo ki current user ki id participants list me hai ya nahi
              isRegistered={e.participants.some((p) => p.user === user?._id)}
              onRegister={() => handleRegister(e._id)}
              onUnregister={() => handleUnregister(e._id)}
              busy={actingId === e._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Chhota sa alag component — ek event card ka UI, taaki upar wala function zyada lamba na ho
function EventCard({ event, isRegistered, onRegister, onUnregister, busy }) {
  const isFull = event.maxParticipants > 0 && event.participants.length >= event.maxParticipants;

  return (
    <div className="bg-white border border-hub-line rounded-xl p-5">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <h3 className="font-display font-semibold text-hub-navy">{event.title}</h3>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[event.category]}`}>
          {event.category}
        </span>
        {isRegistered && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-hub-sage-light text-hub-sage">
            <HiOutlineCheckCircle className="w-3.5 h-3.5" /> Registered
          </span>
        )}
      </div>
      <p className="text-sm text-hub-ink-soft mb-3">{event.description}</p>

      <div className="space-y-1.5 mb-4">
        <p className="flex items-center gap-2 text-xs text-hub-ink-soft">
          <HiOutlineCalendarDays className="w-4 h-4" />
          {new Date(event.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </p>
        <p className="flex items-center gap-2 text-xs text-hub-ink-soft">
          <HiOutlineMapPin className="w-4 h-4" /> {event.venue}
        </p>
        <p className="flex items-center gap-2 text-xs text-hub-ink-soft">
          <HiOutlineUserGroup className="w-4 h-4" />
          {event.participants.length} registered{event.maxParticipants > 0 && ` / ${event.maxParticipants} seats`}
        </p>
      </div>

      {/* Agar already registered hai to sirf "Cancel" dikhao, warna sirf "Register" dikhao */}
      {isRegistered ? (
        <button
          onClick={onUnregister}
          disabled={busy}
          className="w-full px-4 py-2 border border-hub-alert/30 text-hub-alert text-sm font-medium rounded-lg hover:bg-hub-alert/10 transition-colors disabled:opacity-50"
        >
          {busy ? "Cancelling..." : "Cancel Registration"}
        </button>
      ) : (
        <button
          onClick={onRegister}
          disabled={busy || isFull}
          className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-hub-gold text-hub-navy text-sm font-semibold rounded-lg hover:bg-hub-gold-light transition-colors disabled:opacity-50"
        >
          <HiOutlineTicket className="w-4 h-4" />
          {isFull ? "Seats Full" : busy ? "Registering..." : "Register"}
        </button>
      )}
    </div>
  );
}
