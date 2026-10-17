import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const roles = [
  { value: "resident", label: "Resident" },
  { value: "guard", label: "Security Guard" },
  { value: "admin", label: "Admin / Management" },
];

export default function Register() {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", password: "", role: "resident", flatNumber: "", block: "",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await register(formData);
      if (data.isApproved) {
        navigate(`/dashboard/${data.role}`);
      } else {
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hub-paper flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 rounded-lg bg-hub-navy flex items-center justify-center">
            <span className="text-hub-gold font-display font-bold text-lg">D</span>
          </div>
          <span className="font-display font-bold text-hub-navy text-lg">Digital Society Hub</span>
        </Link>

        <div className="bg-white border border-hub-line rounded-2xl p-8 shadow-sm">
          <h1 className="font-display text-2xl font-bold text-hub-navy mb-1">Create account</h1>
          <p className="text-hub-ink-soft text-sm mb-6">Join your society's digital platform.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-hub-ink mb-1.5">I am a</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => (
                  <button type="button" key={r.value} onClick={() => setFormData({ ...formData, role: r.value })}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all ${
                      formData.role === r.value ? "bg-hub-navy text-white border-hub-navy" : "border-hub-line text-hub-ink-soft hover:border-hub-navy/40"
                    }`}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-hub-ink mb-1.5">Full name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Rohan Sharma"
                className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none focus:ring-2 focus:ring-hub-navy/10 transition-all" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-hub-ink mb-1.5">Email</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none focus:ring-2 focus:ring-hub-navy/10 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-hub-ink mb-1.5">Phone</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="9876543210"
                  className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none focus:ring-2 focus:ring-hub-navy/10 transition-all" />
              </div>
            </div>

            {formData.role === "resident" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-hub-ink mb-1.5">Flat number</label>
                  <input type="text" name="flatNumber" required={formData.role === "resident"} value={formData.flatNumber} onChange={handleChange} placeholder="A-204"
                    className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none focus:ring-2 focus:ring-hub-navy/10 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-hub-ink mb-1.5">Block / Wing</label>
                  <input type="text" name="block" value={formData.block} onChange={handleChange} placeholder="A Wing"
                    className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none focus:ring-2 focus:ring-hub-navy/10 transition-all" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-hub-ink mb-1.5">Password</label>
              <input type="password" name="password" required minLength={6} value={formData.password} onChange={handleChange} placeholder="Min. 6 characters"
                className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none focus:ring-2 focus:ring-hub-navy/10 transition-all" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-hub-navy text-white font-semibold rounded-lg hover:bg-hub-navy-light transition-colors disabled:opacity-60">
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-hub-ink-soft mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-hub-navy font-semibold hover:text-hub-gold">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
