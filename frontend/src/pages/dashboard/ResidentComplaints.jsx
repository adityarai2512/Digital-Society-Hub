import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { HiOutlinePlus, HiOutlineChatBubbleLeftRight, HiOutlinePhoto } from "react-icons/hi2";

const categories = ["Water Leakage", "Lift Issue", "Electricity", "Parking", "Security", "Cleanliness", "Other"];

const statusStyles = {
  pending: "bg-hub-gold-light/40 text-hub-gold border-hub-gold/30",
  assigned: "bg-blue-100 text-blue-700 border-blue-200",
  "in-progress": "bg-hub-sage-light text-hub-sage border-hub-sage/30",
  resolved: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function ResidentComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [commentText, setCommentText] = useState("");

  const fetchComplaints = async () => {
    try {
      const { data } = await api.get("/complaints/mine");
      setComplaints(data);
    } catch (error) {
      toast.error("Complaints load nahi ho paayi.");
    }
  };

  useEffect(() => { fetchComplaints(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();
      form.append("category", category);
      form.append("description", description);
      if (photo) form.append("photo", photo);

      await api.post("/complaints", form, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Complaint register ho gayi!");
      setDescription("");
      setPhoto(null);
      setShowForm(false);
      fetchComplaints();
    } catch (error) {
      toast.error(error.response?.data?.message || "Kuch galat hua.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (id) => {
    if (!commentText.trim()) return;
    try {
      await api.post(`/complaints/${id}/comments`, { text: commentText });
      setCommentText("");
      fetchComplaints();
    } catch (error) {
      toast.error("Comment add nahi hua.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-hub-navy">My Complaints</h2>
          <p className="text-sm text-hub-ink-soft">Issues raise karo aur status track karo.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-hub-navy text-white text-sm font-semibold rounded-lg hover:bg-hub-navy-light transition-colors">
          <HiOutlinePlus className="w-4 h-4" /> New Complaint
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-hub-line rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-hub-ink mb-1.5">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none">
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-hub-ink mb-1.5">Description</label>
            <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Problem ko detail me batao..."
              className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-hub-ink mb-1.5">Photo (optional)</label>
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-hub-line cursor-pointer hover:border-hub-navy transition-colors w-fit">
              <HiOutlinePhoto className="w-5 h-5 text-hub-ink-soft" />
              <span className="text-sm text-hub-ink-soft">{photo ? photo.name : "Choose image"}</span>
              <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} className="hidden" />
            </label>
          </div>
          <button type="submit" disabled={loading}
            className="px-5 py-2.5 bg-hub-gold text-hub-navy font-semibold rounded-lg hover:bg-hub-gold-light transition-colors disabled:opacity-60">
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {complaints.length === 0 ? (
          <div className="bg-white border border-hub-line rounded-xl p-10 text-center">
            <p className="text-hub-ink-soft text-sm">Abhi tak koi complaint nahi ki.</p>
          </div>
        ) : (
          complaints.map((c) => (
            <div key={c._id} className="bg-white border border-hub-line rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-hub-ink">{c.category}</p>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${statusStyles[c.status]}`}>{c.status}</span>
                  </div>
                  <p className="text-sm text-hub-ink-soft">{c.description}</p>
                  {c.assignedStaff && <p className="text-xs text-hub-ink-soft mt-1">Assigned to: <span className="font-medium">{c.assignedStaff}</span></p>}
                </div>
                {c.photo && (
                  <img src={`http://localhost:5000${c.photo}`} alt="complaint" className="w-16 h-16 rounded-lg object-cover border border-hub-line" />
                )}
              </div>

              <button onClick={() => setExpandedId(expandedId === c._id ? null : c._id)}
                className="flex items-center gap-1.5 mt-3 px-3 py-1.5 text-sm font-medium text-hub-ink-soft hover:text-hub-navy transition-colors">
                <HiOutlineChatBubbleLeftRight className="w-4 h-4" />
                Comments {c.comments?.length > 0 && `(${c.comments.length})`}
              </button>

              {expandedId === c._id && (
                <div className="mt-3 pt-3 border-t border-hub-line space-y-3">
                  {(!c.comments || c.comments.length === 0) ? (
                    <p className="text-xs text-hub-ink-soft">Koi comment nahi hai abhi.</p>
                  ) : (
                    c.comments.map((cm, i) => (
                      <div key={i} className="text-sm bg-hub-paper rounded-lg p-3 border border-hub-line">
                        <p className="text-xs font-semibold text-hub-navy capitalize">{cm.byName} ({cm.byRole})</p>
                        <p className="text-hub-ink">{cm.text}</p>
                      </div>
                    ))
                  )}
                  <div className="flex gap-2">
                    <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Comment likho..."
                      className="flex-1 px-3 py-2 rounded-lg border border-hub-line text-sm focus:border-hub-navy focus:outline-none" />
                    <button onClick={() => handleAddComment(c._id)} className="px-4 py-2 bg-hub-navy text-white text-sm font-semibold rounded-lg hover:bg-hub-navy-light">Send</button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
