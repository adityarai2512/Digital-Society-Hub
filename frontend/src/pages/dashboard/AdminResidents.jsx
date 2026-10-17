import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { HiOutlineCheckCircle, HiOutlineXMark, HiOutlineUsers } from "react-icons/hi2";

export default function AdminResidents() {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        api.get("/admin/pending-users"),
        api.get("/admin/users"),
      ]);
      setPending(pendingRes.data);
      setApproved(approvedRes.data);
    } catch (error) {
      toast.error("Data load nahi ho paaya.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (id, name) => {
    try {
      await api.patch(`/admin/users/${id}/approve`);
      toast.success(`${name} approve ho gaya! ✅`);
      fetchData();
    } catch (error) {
      toast.error("Approve nahi ho paaya.");
    }
  };

  const handleReject = async (id, name) => {
    if (!confirm(`Kya tum ${name} ki request reject karna chahte ho?`)) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("Request reject ho gayi.");
      fetchData();
    } catch (error) {
      toast.error("Reject nahi ho paaya.");
    }
  };

  if (loading) return <p className="text-hub-ink-soft font-mono text-sm">Loading...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl font-bold text-hub-navy mb-1">Pending Approvals</h2>
        <p className="text-sm text-hub-ink-soft mb-4">Naye Resident/Guard registrations jo login se pehle approval maang rahe hain.</p>

        {pending.length === 0 ? (
          <div className="bg-white border border-hub-line rounded-xl p-8 text-center">
            <p className="text-hub-ink-soft text-sm">Koi pending request nahi hai. 🎉</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map((u) => (
              <div key={u._id} className="bg-white border border-hub-gold/30 rounded-xl p-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-hub-ink">{u.name}</p>
                    <span className="px-2 py-0.5 rounded-full bg-hub-gold-light/40 text-hub-gold text-xs font-medium capitalize">{u.role}</span>
                  </div>
                  <p className="text-sm text-hub-ink-soft">{u.email} • {u.phone}{u.flatNumber && ` • Flat ${u.flatNumber}`}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleApprove(u._id, u.name)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-hub-sage text-white text-sm font-semibold rounded-lg hover:bg-hub-sage/90 transition-colors">
                    <HiOutlineCheckCircle className="w-4 h-4" /> Approve
                  </button>
                  <button onClick={() => handleReject(u._id, u.name)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-hub-line text-hub-ink-soft text-sm font-semibold rounded-lg hover:border-hub-alert hover:text-hub-alert transition-colors">
                    <HiOutlineXMark className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <HiOutlineUsers className="w-5 h-5 text-hub-navy" />
          <h2 className="font-display text-xl font-bold text-hub-navy">Society Members</h2>
        </div>
        <p className="text-sm text-hub-ink-soft mb-4">Total {approved.length} approved residents & guards.</p>

        <div className="bg-white border border-hub-line rounded-xl overflow-hidden">
          {approved.length === 0 ? (
            <p className="text-center py-10 text-hub-ink-soft text-sm">Abhi koi approved member nahi hai.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-hub-paper text-hub-ink-soft text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Name</th>
                  <th className="text-left px-5 py-3 font-medium">Role</th>
                  <th className="text-left px-5 py-3 font-medium">Contact</th>
                  <th className="text-left px-5 py-3 font-medium">Flat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hub-line">
                {approved.map((u) => (
                  <tr key={u._id}>
                    <td className="px-5 py-3 font-medium text-hub-ink">{u.name}</td>
                    <td className="px-5 py-3 text-hub-ink-soft capitalize">{u.role}</td>
                    <td className="px-5 py-3 text-hub-ink-soft">{u.email}</td>
                    <td className="px-5 py-3 text-hub-ink-soft">{u.flatNumber || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
