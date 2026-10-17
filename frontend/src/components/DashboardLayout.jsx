import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HiOutlineHome, HiOutlineQrCode, HiOutlineClipboardDocumentList,
  HiOutlineCurrencyRupee, HiOutlineSpeakerWave, HiOutlineCalendarDays,
  HiOutlineTruck, HiOutlineShoppingBag, HiOutlineUsers, HiOutlineArrowRightOnRectangle,
  HiOutlineRectangleGroup,
} from "react-icons/hi2";

const navByRole = {
  resident: [
    { to: "", icon: HiOutlineHome, label: "Overview", end: true },
    { to: "visitors", icon: HiOutlineQrCode, label: "Visitors" },
    { to: "complaints", icon: HiOutlineClipboardDocumentList, label: "Complaints" },
    { to: "billing", icon: HiOutlineCurrencyRupee, label: "Maintenance" },
    { to: "notices", icon: HiOutlineSpeakerWave, label: "Notices" },
    { to: "events", icon: HiOutlineCalendarDays, label: "Events" },
    { to: "parking", icon: HiOutlineRectangleGroup, label: "Parking" },
    { to: "marketplace", icon: HiOutlineShoppingBag, label: "Marketplace" },
  ],
  guard: [
    { to: "", icon: HiOutlineHome, label: "Overview", end: true },
    { to: "visitor-entry", icon: HiOutlineQrCode, label: "Visitor Entry" },
    { to: "deliveries", icon: HiOutlineTruck, label: "Deliveries" },
  ],
  admin: [
    { to: "", icon: HiOutlineHome, label: "Overview", end: true },
    { to: "residents", icon: HiOutlineUsers, label: "Residents" },
    { to: "complaints", icon: HiOutlineClipboardDocumentList, label: "Complaints" },
    { to: "billing", icon: HiOutlineCurrencyRupee, label: "Billing" },
    { to: "notices", icon: HiOutlineSpeakerWave, label: "Notices" },
    { to: "events", icon: HiOutlineCalendarDays, label: "Events" },
    { to: "parking", icon: HiOutlineRectangleGroup, label: "Parking" },
    { to: "marketplace", icon: HiOutlineShoppingBag, label: "Marketplace" },
  ],
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = navByRole[user?.role] || [];

  return (
    <div className="min-h-screen bg-hub-paper flex">
      <aside className="w-64 bg-hub-navy text-white flex flex-col shrink-0">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-hub-gold flex items-center justify-center">
            <span className="text-hub-navy font-display font-bold">D</span>
          </div>
          <span className="font-display font-bold text-sm">Society Hub</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-hub-gold text-hub-navy" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <item.icon className="w-5 h-5" strokeWidth={1.75} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white w-full transition-colors"
          >
            <HiOutlineArrowRightOnRectangle className="w-5 h-5" strokeWidth={1.75} />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-hub-line">
          <div>
            <p className="text-xs text-hub-ink-soft font-mono uppercase tracking-wide">
              {user?.role} dashboard
            </p>
            <h1 className="font-display font-bold text-hub-navy text-lg">
              Welcome, {user?.name?.split(" ")[0]}
            </h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-hub-sage-light flex items-center justify-center font-display font-bold text-hub-sage">
            {user?.name?.[0]?.toUpperCase()}
          </div>
        </header>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
