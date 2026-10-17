import { Link } from "react-router-dom";
import {
  HiOutlineQrCode, HiOutlineClipboardDocumentList, HiOutlineCurrencyRupee,
  HiOutlineSpeakerWave, HiOutlineCalendarDays, HiOutlineTruck,
} from "react-icons/hi2";

const modules = [
  { icon: HiOutlineQrCode, title: "Visitor Management", desc: "QR-based visitor passes, OTP verification, delivery entries — no more paper registers." },
  { icon: HiOutlineClipboardDocumentList, title: "Complaint Tracking", desc: "Raise, assign, and resolve issues with photo proof and live status updates." },
  { icon: HiOutlineCurrencyRupee, title: "Maintenance Billing", desc: "Auto-generated monthly bills, payment history, and due reminders." },
  { icon: HiOutlineSpeakerWave, title: "Notice Board", desc: "One place for shutdowns, meetings, and emergency alerts — instantly notified." },
  { icon: HiOutlineCalendarDays, title: "Events & Community", desc: "Register for Holi, Diwali, tournaments — with QR entry and photo galleries." },
  { icon: HiOutlineTruck, title: "Parking & Directory", desc: "Track vehicles, slots, and reach any neighbor in a searchable directory." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-hub-paper">
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-hub-line">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-hub-navy flex items-center justify-center">
            <span className="text-hub-gold font-display font-bold text-lg">D</span>
          </div>
          <span className="font-display font-bold text-hub-navy text-lg">Digital Society Hub</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="px-4 py-2 text-sm font-medium text-hub-navy hover:text-hub-gold transition-colors">Log in</Link>
          <Link to="/register" className="px-4 py-2 text-sm font-semibold bg-hub-navy text-white rounded-lg hover:bg-hub-navy-light transition-colors">Get Started</Link>
        </div>
      </nav>

      <section className="relative px-6 md:px-12 pt-16 pb-20 overflow-hidden">
        <div className="max-w-3xl">
          <span className="inline-block px-3 py-1 rounded-full bg-hub-sage-light text-hub-sage font-mono text-xs font-medium mb-6 tracking-wide">
            ONE GATE. EVERY MODULE.
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-hub-navy leading-tight mb-6">
            Your entire society,<br /><span className="text-hub-gold">on one platform.</span>
          </h1>
          <p className="text-lg text-hub-ink-soft max-w-xl mb-8 leading-relaxed">
            Visitors, complaints, maintenance, notices, and community — replacing scattered registers and WhatsApp groups with one connected system for residents, guards, and management.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/register" className="px-6 py-3 bg-hub-navy text-white font-semibold rounded-lg hover:bg-hub-navy-light transition-colors shadow-lg shadow-hub-navy/10">Register your Society</Link>
            <Link to="/login" className="px-6 py-3 border border-hub-navy/20 text-hub-navy font-semibold rounded-lg hover:border-hub-navy transition-colors">I already have an account</Link>
          </div>
        </div>
        <div className="hidden md:block absolute right-0 top-0 h-full w-1/3 opacity-[0.06]">
          <svg viewBox="0 0 200 400" className="h-full w-full">
            {Array.from({ length: 8 }).map((_, i) => (
              <rect key={i} x={i * 24} y="0" width="6" height="400" fill="#1B2A4A" />
            ))}
          </svg>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 bg-white border-t border-hub-line">
        <h2 className="font-display text-3xl font-bold text-hub-navy mb-2">Everything a society needs</h2>
        <p className="text-hub-ink-soft mb-12">Ten connected modules. One login for every role.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m) => (
            <div key={m.title} className="p-6 rounded-xl border border-hub-line hover:border-hub-gold hover:shadow-md transition-all duration-200 bg-hub-paper">
              <m.icon className="w-8 h-8 text-hub-gold mb-4" strokeWidth={1.5} />
              <h3 className="font-display font-semibold text-hub-navy text-lg mb-2">{m.title}</h3>
              <p className="text-sm text-hub-ink-soft leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-6 md:px-12 py-8 border-t border-hub-line text-center text-sm text-hub-ink-soft">
        Digital Society Hub — One Platform for Smart Community Living.
      </footer>
    </div>
  );
}
