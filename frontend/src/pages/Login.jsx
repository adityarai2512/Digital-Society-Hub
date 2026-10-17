import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(formData.email, formData.password);
      navigate(`/dashboard/${data.role}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hub-paper flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 rounded-lg bg-hub-navy flex items-center justify-center">
            <span className="text-hub-gold font-display font-bold text-lg">D</span>
          </div>
          <span className="font-display font-bold text-hub-navy text-lg">Digital Society Hub</span>
        </Link>

        <div className="bg-white border border-hub-line rounded-2xl p-8 shadow-sm">
          <h1 className="font-display text-2xl font-bold text-hub-navy mb-1">Welcome back</h1>
          <p className="text-hub-ink-soft text-sm mb-6">Log in to your society account.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-hub-ink mb-1.5">Email</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none focus:ring-2 focus:ring-hub-navy/10 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-hub-ink mb-1.5">Password</label>
              <input type="password" name="password" required minLength={6} value={formData.password} onChange={handleChange} placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-hub-line focus:border-hub-navy focus:outline-none focus:ring-2 focus:ring-hub-navy/10 transition-all" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-hub-navy text-white font-semibold rounded-lg hover:bg-hub-navy-light transition-colors disabled:opacity-60">
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="text-center text-sm text-hub-ink-soft mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-hub-navy font-semibold hover:text-hub-gold">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
