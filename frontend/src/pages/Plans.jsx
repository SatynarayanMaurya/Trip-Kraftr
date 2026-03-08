import React from 'react'
import { useNavigate } from 'react-router-dom'

const dummyPlans = [
  {
    _id: '69a293c0cbd07a7ee65c4edc',
    name: 'starter',
    max_users: 1,
    max_departure: 10,
    max_templates: 2,
    ai_credits_monthly: 0,
    price_monthly: 2500,
    price_yearly: 26000,
    has_ai_builder: false,
    b2b_trip: false,
    has_hotel_management: false,
    has_vehicle_management: false,
    private_trip: false,
    group_trip: true,
    createdAt: '2026-02-28T07:04:39.435+00:00',
    updatedAt: '2026-02-28T07:04:39.435+00:00',
  },
  {
    _id: '69a29cbef1525b9297397fd6',
    name: 'pro',
    max_users: 3,
    max_departure: 50,
    max_templates: 5,
    ai_credits_monthly: 200,
    price_monthly: 3500,
    price_yearly: 36500,
    has_ai_builder: true,
    b2b_trip: true,
    has_hotel_management: true,
    has_vehicle_management: true,
    private_trip: true,
    group_trip: true,
    createdAt: '2026-02-28T07:31:12.055+00:00',
    updatedAt: '2026-02-28T07:31:12.055+00:00',
  },
]

const CheckIcon = ({ active }) => (
  active ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
)

const FeatureRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-white/5">
    <span className="text-sm text-slate-400">{label}</span>
    <span className="text-sm font-semibold text-slate-200">
      {typeof value === 'boolean' ? <CheckIcon active={value} /> : value}
    </span>
  </div>
)

const StatBadge = ({ label, value, color = 'yellow' }) => {
  const colorMap = {
    yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    green: 'bg-green-500/10 border-green-500/20 text-green-400',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  }
  return (
    <div className={`flex flex-col items-center justify-center rounded-xl border px-4 py-3 ${colorMap[color]}`}>
      <span className="text-lg font-bold">{value ?? '—'}</span>
      <span className="text-[10px] mt-0.5 opacity-70 tracking-wide uppercase">{label}</span>
    </div>
  )
}

function PlanCard({ plan }) {
  const isPro = plan?.name?.toLowerCase() === 'pro'

  return (
    <div
      className="relative rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"
      style={{
        background: isPro
          ? 'linear-gradient(160deg, #1e2a3a, #1a2030)'
          : 'linear-gradient(160deg, #1e2535, #1a2030)',
        border: isPro
          ? '1px solid rgba(234,179,8,0.25)'
          : '1px solid rgba(255,255,255,0.07)',
        boxShadow: isPro ? '0 0 40px rgba(234,179,8,0.06)' : 'none',
      }}
    >
      {/* Pro glow top bar */}
      {isPro && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
      )}

      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-slate-500">Plan</span>
            <h2 className="text-2xl font-extrabold text-slate-100 capitalize mt-0.5">
              {plan?.name ?? '—'}
            </h2>
          </div>
          <div
            className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{
              background: isPro ? 'rgba(234,179,8,0.15)' : 'rgba(148,163,184,0.1)',
              color: isPro ? '#eab308' : '#94a3b8',
              border: isPro ? '1px solid rgba(234,179,8,0.3)' : '1px solid rgba(148,163,184,0.15)',
            }}
          >
            {plan?.name ?? '—'}
          </div>
        </div>

        {/* Pricing */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1 rounded-xl bg-white/[0.04] border border-white/[0.06] p-3 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Monthly</p>
            <p className="text-xl font-extrabold text-slate-100">
              ₹{plan?.price_monthly?.toLocaleString('en-IN') ?? '—'}
            </p>
          </div>
          <div className="flex-1 rounded-xl bg-white/[0.04] border border-white/[0.06] p-3 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Yearly</p>
            <p className="text-xl font-extrabold text-slate-100">
              ₹{plan?.price_yearly?.toLocaleString('en-IN') ?? '—'}
            </p>
          </div>
        </div>

        {/* Stat badges */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <StatBadge label="Users" value={plan?.max_users ?? '—'} color="yellow" />
          <StatBadge label="Departures" value={plan?.max_departure ?? '—'} color="green" />
          <StatBadge label="Templates" value={plan?.max_templates ?? '—'} color="blue" />
        </div>

        {/* AI Credits */}
        <div
          className="flex items-center justify-between rounded-xl px-4 py-3 mb-2"
          style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}
        >
          <div className="flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
              <path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 6v6l4 2" />
            </svg>
            <span className="text-sm text-slate-400">AI Credits / Month</span>
          </div>
          <span className="text-sm font-bold text-indigo-400">
            {plan?.ai_credits_monthly ?? '—'}
          </span>
        </div>
      </div>

      {/* Features */}
      <div className="px-6 pb-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">Features</p>
        <FeatureRow label="AI Builder" value={plan?.has_ai_builder ?? false} />
        <FeatureRow label="Hotel Management" value={plan?.has_hotel_management ?? false} />
        <FeatureRow label="Vehicle Management" value={plan?.has_vehicle_management ?? false} />
        <FeatureRow label="Group Trips" value={plan?.group_trip ?? false} />
        <FeatureRow label="Private Trips" value={plan?.private_trip ?? false} />
        <FeatureRow label="B2B Trips" value={plan?.b2b_trip ?? false} />
      </div>

      {/* ID + dates */}
      <div className="px-6 pb-4">
        <p className="text-[10px] font-mono text-slate-600">
          #{plan?._id?.slice(-8)?.toUpperCase() ?? '—'}
        </p>
        <p className="text-[10px] text-slate-700 mt-0.5">
          Created: {plan?.createdAt ? new Date(plan.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
        </p>
      </div>

      {/* Actions */}
      <div className="px-6 pb-6 mt-auto flex gap-3">
        <button
          onClick={() => {}}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-300 transition-all duration-150 cursor-pointer"
          style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          View
        </button>
        <button
          onClick={() => {}}
          className="flex-1 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all duration-150"
          style={{
            background: isPro ? 'rgba(234,179,8,0.15)' : 'rgba(234,179,8,0.1)',
            color: '#eab308',
            border: '1px solid rgba(234,179,8,0.25)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(234,179,8,0.25)'}
          onMouseLeave={e => e.currentTarget.style.background = isPro ? 'rgba(234,179,8,0.15)' : 'rgba(234,179,8,0.1)'}
        >
          Update
        </button>
      </div>
    </div>
  )
}

function Plans() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen p-8" style={{ background: '#0f1623', fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#eab308' }}>
          ● Management
        </p>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Plans</h1>
            <p className="text-sm text-slate-500 mt-1">
              {dummyPlans?.length ?? 0} total plans
            </p>
          </div>
          <button
            onClick={() => navigate('add-plan')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-opacity duration-150 hover:opacity-85"
            style={{ background: '#eab308', color: '#0f1623', border: 'none' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Plan
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      {dummyPlans?.length > 0 ? (
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
          {dummyPlans.map((plan) => (
            <PlanCard key={plan?._id} plan={plan} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-slate-600">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 opacity-40">
            <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <p className="text-base font-semibold text-slate-500">No plans available</p>
        </div>
      )}
    </div>
  )
}

export default Plans