import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { HiOutlineCreditCard, HiOutlineCheckCircle, HiOutlineExclamationCircle } from "react-icons/hi2";

export default function ResidentBilling() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  const fetchBills = async () => {
    try {
      const { data } = await api.get("/bills/mine");
      setBills(data);
    } catch (error) {
      toast.error("Bills load nahi ho paaye.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBills(); }, []);

  const handlePay = async (id) => {
    setPayingId(id);
    try {
      const { data } = await api.patch(`/bills/${id}/pay`);
      toast.success(data.message);
      fetchBills();
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment fail hua.");
    } finally {
      setPayingId(null);
    }
  };

  const isOverdue = (bill) => bill.status === "unpaid" && new Date(bill.dueDate) < new Date();
  const totalDue = bills.filter((b) => b.status === "unpaid").reduce((sum, b) => sum + b.amount, 0);

  if (loading) return <p className="text-hub-ink-soft font-mono text-sm">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="bg-hub-navy rounded-xl p-6 text-white">
        <p className="text-white/70 text-sm mb-1">Total Pending Amount</p>
        <p className="font-display text-3xl font-bold">₹{totalDue.toLocaleString("en-IN")}</p>
      </div>

      {bills.length === 0 ? (
        <div className="bg-white border border-hub-line rounded-xl p-10 text-center">
          <p className="text-hub-ink-soft text-sm">Abhi tak koi bill generate nahi hua.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bills.map((b) => (
            <div key={b._id} className={`bg-white border rounded-xl p-5 flex items-center justify-between ${isOverdue(b) ? "border-hub-alert/40" : "border-hub-line"}`}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-hub-ink">{b.month}</p>
                  {b.status === "paid" ? (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-hub-sage-light text-hub-sage border border-hub-sage/30">
                      <HiOutlineCheckCircle className="w-3.5 h-3.5" /> Paid
                    </span>
                  ) : isOverdue(b) ? (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-hub-alert/10 text-hub-alert border border-hub-alert/20">
                      <HiOutlineExclamationCircle className="w-3.5 h-3.5" /> Overdue
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-hub-gold-light/40 text-hub-gold border border-hub-gold/30">Unpaid</span>
                  )}
                </div>
                <p className="font-mono text-2xl font-bold text-hub-navy">₹{b.amount.toLocaleString("en-IN")}</p>
                <p className="text-xs text-hub-ink-soft mt-1">
                  Due: {new Date(b.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  {b.status === "paid" && b.paidOn && <> • Paid on {new Date(b.paidOn).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</>}
                </p>
              </div>
              {b.status === "unpaid" && (
                <button onClick={() => handlePay(b._id)} disabled={payingId === b._id}
                  className="flex items-center gap-2 px-5 py-2.5 bg-hub-gold text-hub-navy font-semibold rounded-lg hover:bg-hub-gold-light transition-colors disabled:opacity-60">
                  <HiOutlineCreditCard className="w-4 h-4" />
                  {payingId === b._id ? "Processing..." : "Pay Now"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
