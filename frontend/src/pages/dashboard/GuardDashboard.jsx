import { HiOutlineQrCode, HiOutlineTruck, HiOutlineExclamationTriangle } from "react-icons/hi2";

const stats = [
  { icon: HiOutlineQrCode, label: "Visitors In Today", value: "0" },
  { icon: HiOutlineTruck, label: "Deliveries Today", value: "0" },
  { icon: HiOutlineExclamationTriangle, label: "Active Alerts", value: "0" },
];

export default function GuardDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-hub-line rounded-xl p-5">
            <s.icon className="w-6 h-6 text-hub-gold mb-3" strokeWidth={1.5} />
            <p className="font-display text-2xl font-bold text-hub-navy">{s.value}</p>
            <p className="text-sm text-hub-ink-soft">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white border border-hub-line rounded-xl p-8 text-center">
        <p className="text-hub-ink-soft font-mono text-sm">🚧 Deliveries module — coming in next steps.</p>
      </div>
    </div>
  );
}
