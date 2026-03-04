import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useOrganizationHooks } from "../hooks/useOrganizationHooks";
import { toast } from "react-toastify";
import {  setAllOrganizations } from "../redux/slices/organizationSlice";
import { EmailIcon,PhoneIcon,LocationIcon } from "../components/Icons/Icons";


function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function daysLeft(endDate) {
  const diff = new Date(endDate) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function OrgCard({ org}) {
  const days = daysLeft(org.subscriptionEndDate);
  const isExpired = days < 0;
  const isExpiringSoon = days >= 0 && days <= 7;

  return (
    <div className="group rounded-2xl border border-[#1e2a3a] bg-[#0d1420] p-5 flex flex-col gap-4 hover:border-yellow-400/40 transition-all duration-200 hover:shadow-lg hover:shadow-yellow-400/5">

      {/* Top Row: Logo + Name + Status */}
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <img
            src={org.logo?.url || "https://tse4.mm.bing.net/th/id/OIP.xt2aXI1tO688W_ugEZGt6AHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"}
            alt={org.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(org.name)}&backgroundColor=facc15&textColor=000000`;
            }}
            className="h-14 w-14 rounded-xl object-cover border border-[#1e2a3a]"
          />
          <span className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-[#0d1420] ${org.is_active ? "bg-green-400" : "bg-slate-500"}`} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white leading-tight line-clamp-2 group-hover:text-yellow-400 transition-colors">
            {org?.name}
          </h3>
          <div className="mt-1.5 flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              org.planId?.name === "pro"
                ? "bg-yellow-400/15 text-yellow-400 border border-yellow-400/30"
                : "bg-slate-700/60 text-slate-400 border border-slate-600/40"
            }`}>
              {org.planId?.name || "—"}
            </span>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              org.is_active
                ? "bg-green-400/10 text-green-400 border border-green-400/25"
                : "bg-slate-700/60 text-slate-500 border border-slate-600/40"
            }`}>
              {org.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#1e2a3a]" />

      {/* Info Grid */}
      <div className="space-y-2.5">
        <InfoRow icon={<EmailIcon />} value={org.email} />
        <InfoRow icon={<PhoneIcon />} value={org.primaryPhone} label="Primary" />
        {org.secondaryPhone && <InfoRow icon={<PhoneIcon />} value={org.secondaryPhone} label="Secondary" />}
        <InfoRow icon={<LocationIcon />} value={org.address} truncate />
      </div>

      {/* Divider */}
      <div className="border-t border-[#1e2a3a]" />

      {/* Subscription */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Subscription Ends</p>
          <p className="text-xs font-semibold text-white">{formatDate(org.subscriptionEndDate)}</p>
        </div>
        <div className={`rounded-lg px-3 py-1.5 text-center ${
          isExpired
            ? "bg-red-500/10 border border-red-500/25"
            : isExpiringSoon
            ? "bg-orange-400/10 border border-orange-400/25"
            : "bg-green-400/10 border border-green-400/20"
        }`}>
          <p className={`text-xs font-bold ${
            isExpired ? "text-red-400" : isExpiringSoon ? "text-orange-400" : "text-green-400"
          }`}>
            {isExpired ? `Expired ${Math.abs(days)}d ago` : `${days}d left`}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 mt-auto">
        <button
          className="rounded-xl border border-[#1e2a3a] bg-transparent py-2 text-xs font-semibold text-slate-400 transition hover:border-slate-500 hover:text-white"
        >
          View Details
        </button>
        <button
          className="rounded-xl bg-yellow-400/10 border border-yellow-400/25 py-2 text-xs font-semibold text-yellow-400 transition hover:bg-yellow-400 hover:text-black"
        >
          Edit
        </button>
      </div>
    </div>
  );
}

function InfoRow({ icon, value, label, truncate }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0 text-slate-500">{icon}</span>
      <div className="min-w-0">
        {label && <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600 mr-1">{label}</span>}
        <span className={`text-xs text-slate-300 ${truncate ? "line-clamp-1" : ""}`}>{value || "—"}</span>
      </div>
    </div>
  );
}


export default function Organizations() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const {getAllOrganizationForSuperAdmin} = useOrganizationHooks()
  const isProduction = useSelector((state)=>state.user.isProduction)
  const dispatch = useDispatch()

  const allOrganizations = useSelector((state)=>state.organization.allOrganizations )

  const fetchAllOrganization = async()=>{
    try{
      if(allOrganizations && allOrganizations?.length > 0) return ;
      const response = await getAllOrganizationForSuperAdmin()
    }
    catch(error){
      if (!isProduction) {
        console.log("========= ERROR DEBUG START =========");
        console.log("Error:", error);
        console.log("Response:", error?.response);
        console.log("========= ERROR DEBUG END =========");
      } 
      toast.error(error?.response?.data?.message || error?.message || "Error in getting all organization")
    }
  }
  useEffect(()=>{
    fetchAllOrganization()
  },[])

  const filtered = allOrganizations?.filter((org) => {
    const q = search?.toLowerCase();

    const matchSearch =
      org?.name?.toLowerCase()?.includes(q) ||
      org?.email?.toLowerCase()?.includes(q) ||
      String(org?.primaryPhone || "")?.includes(q);
    const matchPlan = filterPlan === "All" || org?.planId?.name === filterPlan;
    const matchStatus =
      filterStatus === "All" ||
      (filterStatus === "Active" && org.is_active) ||
      (filterStatus === "Inactive" && !org.is_active);
    return matchSearch && matchPlan && matchStatus;
  });

  const totalActive = allOrganizations?.filter((o) => o.is_active)?.length || 0;
  const totalPro = allOrganizations?.filter((o) => o.planId?.name === "pro")?.length || 0;
  const totalInactive = (allOrganizations?.length - totalActive) || 0

  return (
    <div className="min-h-screen bg-[#0a0f1a] p-6 md:p-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* ── HEADER ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">Management</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Organizations</h1>
            <p className="text-sm text-slate-500 mt-1">
              {allOrganizations?.length || 0} total &middot; {totalActive} active &middot; {totalPro} on Pro
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <button
              onClick={()=>navigate("add-organization")}
              className="flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-black uppercase tracking-wider text-black shadow-lg shadow-yellow-400/20 transition hover:bg-yellow-300 active:scale-[0.98] whitespace-nowrap"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add Organization
            </button>
            <button
              onClick={()=>navigate("add-org-admin")}
              className="flex items-center gap-2 rounded-xl bg-green-400 px-5 py-2.5 text-sm font-black uppercase tracking-wider text-black shadow-lg shadow-yellow-400/20 transition hover:bg-green-300 active:scale-[0.98] whitespace-nowrap"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add Org Admin
            </button>
          </div>
        </div>
      </div>

      {/* ── STATS ROW ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", value: allOrganizations?.length || 0, color: "text-white" },
          { label: "Active", value: totalActive, color: "text-green-400" },
          { label: "Inactive", value:totalInactive, color: "text-slate-400" },
          { label: "Pro Plan", value: totalPro, color: "text-yellow-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl border border-[#1e2a3a] bg-[#0d1420] px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">{label}</p>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── SEARCH & FILTERS ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or phone..."
            className="w-full rounded-xl border border-[#1e2a3a] bg-[#0d1420] pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Plan Filter */}
        <select
          value={filterPlan}
          onChange={(e) => setFilterPlan(e.target.value)}
          className="rounded-xl border border-[#1e2a3a] bg-[#0d1420] px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          style={{ colorScheme: "dark" }}
        >
          <option value="All">All Plans</option>
          <option value="starter">Starter</option>
          <option value="pro">Pro</option>
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-xl border border-[#1e2a3a] bg-[#0d1420] px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          style={{ colorScheme: "dark" }}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* ── RESULTS COUNT ── */}
      <p className="text-xs text-slate-500 mb-4 font-medium">
        Showing <span className="text-white font-bold">{filtered?.length||0}</span> of {allOrganizations?.length||0} organizations
      </p>

      {/* ── CARDS GRID ── */}
      {allOrganizations?.length > 0 && filtered?.length >0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered?.map((org) => (
            <OrgCard
              key={org._id}
              org={org}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#1e2a3a] bg-[#0d1420] mb-4">
            <svg className="h-7 w-7 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-white font-semibold">No organizations found</p>
          <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
