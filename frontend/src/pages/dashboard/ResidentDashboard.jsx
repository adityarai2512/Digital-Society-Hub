import { HiOutlineQrCode, HiOutlineClipboardDocumentList, HiOutlineCurrencyRupee, HiOutlineCalendarDays } from "react-icons/hi2";

const stats = [
  { icon: HiOutlineCurrencyRupee, label: "Pending Bills", value: "₹0" },
  { icon: HiOutlineClipboardDocumentList, label: "Open Complaints", value: "0" },
  { icon: HiOutlineQrCode, label: "Visitors Today", value: "0" },
  { icon: HiOutlineCalendarDays, label: "Upcoming Events", value: "0" },
];

export default function ResidentDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-hub-line rounded-xl p-5">
            <s.icon className="w-6 h-6 text-hub-gold mb-3" strokeWidth={1.5} />
            <p className="font-display text-2xl font-bold text-hub-navy">{s.value}</p>
            <p className="text-sm text-hub-ink-soft">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white border border-hub-line rounded-xl p-8 text-center">
        <p className="text-hub-ink-soft font-mono text-sm">🚧 Notices, Events, Marketplace — coming in next steps.</p>
      </div>
    </div>
  );
}
