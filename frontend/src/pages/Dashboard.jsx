import { useState } from "react";
import { useNavigate } from "react-router-dom";

const stats = [
  { label: "Total Itineraries", value: "1,284", change: "+12%", up: true, icon: "🗺️", color: "from-sky-500 to-cyan-400" },
  { label: "Active Tours", value: "342", change: "+8%", up: true, icon: "✈️", color: "from-emerald-500 to-teal-400" },
  { label: "Pending Approvals", value: "57", change: "-3%", up: false, icon: "⏳", color: "from-amber-500 to-yellow-400" },
  { label: "Total Revenue", value: "₹48.6L", change: "+21%", up: true, icon: "💰", color: "from-violet-500 to-purple-400" },
];

const itineraries = [
  { id: "IT-001", title: "Golden Triangle Tour", destination: "Delhi → Agra → Jaipur", duration: "7D", customers: 18, status: "Active", price: "₹32,000", departure: "Mar 05, 2026" },
  { id: "IT-002", title: "Kerala Backwaters", destination: "Kochi → Alleppey → Munnar", duration: "5D", customers: 12, status: "Confirmed", price: "₹22,500", departure: "Mar 12, 2026" },
  { id: "IT-003", title: "Himalayan Adventure", destination: "Manali → Leh → Spiti", duration: "10D", customers: 8, status: "Pending", price: "₹58,000", departure: "Apr 01, 2026" },
  { id: "IT-004", title: "Goa Beach Escape", destination: "North Goa → South Goa", duration: "4D", customers: 24, status: "Active", price: "₹15,000", departure: "Mar 08, 2026" },
  { id: "IT-005", title: "Rajasthan Royale", destination: "Jodhpur → Udaipur → Jaisalmer", duration: "8D", customers: 15, status: "Completed", price: "₹45,000", departure: "Feb 18, 2026" },
  { id: "IT-006", title: "Northeast Explorer", destination: "Guwahati → Shillong → Cherrapunji", duration: "6D", customers: 10, status: "Cancelled", price: "₹28,000", departure: "Mar 20, 2026" },
];

const topDestinations = [
  { name: "Rajasthan", pct: 88 },
  { name: "Kerala", pct: 75 },
  { name: "Goa", pct: 62 },
  { name: "Himachal", pct: 50 },
  { name: "Uttarakhand", pct: 42 },
];

const monthlyData = [
  { month: "Sep", tours: 42 },
  { month: "Oct", tours: 68 },
  { month: "Nov", tours: 55 },
  { month: "Dec", tours: 90 },
  { month: "Jan", tours: 74 },
  { month: "Feb", tours: 88 },
];

const StatusBadge = ({ status }) => {
  const map = {
    Active:    "bg-emerald-100 text-emerald-700",
    Confirmed: "bg-sky-100 text-sky-700",
    Pending:   "bg-amber-100 text-amber-700",
    Completed: "bg-slate-100 text-slate-600",
    Cancelled: "bg-red-100 text-red-600",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[status] || "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("All");
  const tabs = ["All", "Active", "Confirmed", "Pending", "Completed", "Cancelled"];
  const filtered = itineraries.filter((it) => activeTab === "All" || it.status === activeTab);
  const maxTours = Math.max(...monthlyData.map((d) => d.tours));
  const navigate = useNavigate()

  return (
    <div className="p-4 md:p-6 bg-[#f1f5f9] min-h-screen space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800" style={{ fontFamily: "Georgia, serif" }}>
            Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Itinerary Management Overview</p>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={()=>navigate('add-plan')} className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm">
            <span>+</span> New Plans
          </button>
          <button className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm">
            <span>+</span> New Organization
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl bg-linear-to-br ${s.color} flex items-center justify-center text-lg`}>
                {s.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                {s.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Chart + Top Destinations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Bar Chart */}
        <div className="md:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h2 className="text-sm font-bold text-slate-800 mb-1">Monthly Tours</h2>
          <p className="text-xs text-slate-400 mb-4">Last 6 months</p>
          <div className="flex items-end gap-3 h-28">
            {monthlyData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-slate-400 font-semibold">{d.tours}</span>
                <div
                  className="w-full rounded-t-lg bg-linear-to-t from-sky-500 to-cyan-400"
                  style={{ height: `${(d.tours / maxTours) * 100}%`, minHeight: "6px" }}
                />
                <span className="text-[10px] text-slate-400">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Destinations */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h2 className="text-sm font-bold text-slate-800 mb-4">Top Destinations</h2>
          <div className="space-y-3">
            {topDestinations.map((d, i) => (
              <div key={d.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-slate-600 font-medium">#{i + 1} {d.name}</span>
                  <span className="text-xs text-slate-400">{d.pct}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-sky-400 to-cyan-400"
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Itineraries Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 border-b border-slate-100">
          <div className="flex-1">
            <h2 className="text-sm font-bold text-slate-800">Itineraries</h2>
            <p className="text-xs text-slate-400">{filtered.length} records</p>
          </div>
          <div className="flex gap-1 overflow-x-auto pb-0.5">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all
                  ${activeTab === tab ? "bg-sky-500 text-white" : "text-slate-500 hover:bg-slate-100"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {["ID", "Tour Title", "Destination", "Dur.", "Pax", "Departure", "Price", "Status", ""].map((h) => (
                  <th key={h} className="text-left text-[11px] font-semibold text-slate-400 px-4 py-3 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400 text-xs">No itineraries found.</td>
                </tr>
              ) : filtered.map((it) => (
                <tr key={it.id} className="border-b border-slate-50 hover:bg-sky-50/40 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-slate-400">{it.id}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-slate-800 whitespace-nowrap">{it.title}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{it.destination}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{it.duration}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-slate-600">{it.customers}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{it.departure}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-slate-700">{it.price}</td>
                  <td className="px-4 py-3"><StatusBadge status={it.status} /></td>
                  <td className="px-4 py-3">
                    <button className="text-slate-300 hover:text-sky-500 transition-colors text-lg leading-none">⋯</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}