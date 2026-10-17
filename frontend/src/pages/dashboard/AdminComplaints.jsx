import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

const statusStyles = {
  pending: "bg-hub-gold-light/40 text-hub-gold border-hub-gold/30",
  assigned: "bg-blue-100 text-blue-700 border-blue-200",
  "in-progress": "bg-hub-sage-light text-hub-sage border-hub-sage/30",
  resolved: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [staffInputs, setStaffInputs] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [commentText, setCommentText] = useState("");

  const fetchComplaints = async () => {
    try {
      const { data } = await api.get("/complaints", { params: filterStatus ? { status: filterStatus } : {} });
      setComplaints(data);
    } catch (error) {
      toast.error("Complaints load nahi ho paayi.");
    }
  };

  useEffect(() => { fetchComplaints(); }, [filterStatus]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/complaints/${id}/status`, { status });
      toast.success("Status update ho gaya.");
      fetchComplaints();
    } catch (error) {
      toast.error("Status update fail hua.");
    }
  };

  const handleAssignStaff = async (id) => {
    const assignedStaff = staffInputs[id];
    if (!assignedStaff?.trim()) return;
    try {
      await api.patch(`/complaints/${id}/status`, { assignedStaff, status: "assigned" });
      toast.success("Staff assign ho gaya.");
      setStaffInputs({ ...staffInputs, [id]: "" });
      fetchComplaints();
    } catch (error) {
      toast.error("Assign fail hua.");
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
          <h2 className="font-display text-xl font-bold text-hub-navy">All Complaints</h2>
          <p className="text-sm text-hub-ink-soft">Society-wide complaints manage karo.</p>
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 rounded-lg border border-hub-line text-sm focus:border-hub-navy focus:outline-none">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="assigned">Assigned</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="space-y-3">
        {complaints.length === 0 ? (
          <div className="bg-white border border-hub-line rounded-xl p-10 text-center">
            <p className="text-hub-ink-soft text-sm">Koi complaint nahi mili.</p>
          </div>
        ) : (
          complaints.map((c) => (
            <div key={c._id} className="bg-white border border-hub-line rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-hub-ink">{c.category}</p>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${statusStyles[c.status]}`}>{c.status}</span>
                  </div>
                  <p className="text-sm text-hub-ink-soft">{c.description}</p>
                  <p className="text-xs text-hub-ink-soft mt-1">
                    Raised by <span className="font-medium">{c.raisedBy?.name}</span> • Flat {c.flatNumber} • {c.raisedBy?.phone}
                  </p>
                </div>
                {c.photo && (
                  <img src={`http://localhost:5000${c.photo}`} alt="complaint" className="w-16 h-16 rounded-lg object-cover border border-hub-line" />
                )}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <select value={c.status} onChange={(e) => handleStatusChange(c._id, e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-hub-line text-sm focus:border-hub-navy focus:outline-none">
                  <option value="pending">pending</option>
                  <option value="assigned">assigned</option>
                  <option value="in-progress">in-progress</option>
                  <option value="resolved">resolved</option>
                </select>

                <input type="text" placeholder={c.assignedStaff || "Assign staff/vendor..."} value={staffInputs[c._id] || ""}
                  onChange={(e) => setStaffInputs({ ...staffInputs, [c._id]: e.target.value })}
                  className="px-3 py-1.5 rounded-lg border border-hub-line text-sm focus:border-hub-navy focus:outline-none w-44" />
                <button onClick={() => handleAssignStaff(c._id)} className="px-3 py-1.5 bg-hub-navy text-white text-sm font-medium rounded-lg hover:bg-hub-navy-light">Assign</button>

                <button onClick={() => setExpandedId(expandedId === c._id ? null : c._id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-hub-ink-soft hover:text-hub-navy transition-colors">
                  <HiOutlineChatBubbleLeftRight className="w-4 h-4" />
                  Comments {c.comments?.length > 0 && `(${c.comments.length})`}
                </button>
              </div>

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
                    <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Resident ko reply likho..."
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
