import React from 'react';

const PINK = '#ED5F8D';
const BLUE = '#18305C';
const BLUE_LIGHT_BG = '#4C78CA2E';

// ─── inline SVG icons ─────────────────────────────────────────────────────────
const PersonIcon = ({ color = PINK, size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);

const RupeeIcon = ({ color = PINK, size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h12M6 8h12M6 13l8 8M6 13h3a4 4 0 0 0 0-8" />
    </svg>
);

const TrendIcon = ({ color = PINK, size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
);

// ─── reusable summary card ────────────────────────────────────────────────────
function SummaryCard({ icon, title, rows, footer }) {
    return (
        <div style={{
            background: 'white', borderRadius: '12px',
            border: '1px solid #f0f0f0', padding: '20px 24px',
            boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
            display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, minWidth: '220px',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {icon}
                <span style={{ fontSize: '16px', fontWeight: '700', color: BLUE }}>{title}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {rows.map(({ label, value }, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: '#666' }}>{label}</span>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: BLUE }}>{value ?? 0}</span>
                    </div>
                ))}
            </div>
            {footer && <div style={{ marginTop: 'auto' }}>{footer}</div>}
        </div>
    );
}

// ─── main component ───────────────────────────────────────────────────────────
function ViewGroupTripOverview({ groupTripDetails, groupTripSummary,setIsFinancialPopup }) {
    const tripOverview = groupTripDetails?.itineraryBuilder?.tripOverview ?? '';
    const assignedTo   = groupTripDetails?.tripDetails?.assignedTo ?? '—';
    const totalSeats   = groupTripDetails?.tripDetails?.totalSeats ?? 0;
    const minSeats     = groupTripDetails?.tripDetails?.minSeats ?? 0;

    // Viability = confirmed bookings / min seats * 100
    const confirmedBookings = groupTripSummary?.bookingSummary?.confirmedBookings ?? 0;
    // const viabilityPct = minSeats > 0 ? Math.min(Math.round((confirmedBookings / minSeats) * 100), 100) : 0;
    const viabilityPct = minSeats > 0 ? Math.min(Math.round((minSeats / totalSeats) * 100), 100) : 0;

    const viabilityStatus = viabilityPct >= 100 ? 'Confirmed' : viabilityPct >= 60 ? 'Pending Minimum seats' : 'Pending Minimum seats';
    const viabilityStatusColor = viabilityPct >= 100 ? '#448B47' : '#FF9800';
    const viabilityStatusBg   = viabilityPct >= 100 ? '#E8F5E9'  : '#FFF3E0';

    const availableSeats = groupTripSummary?.bookingSummary?.availableSeats ?? 0;

    const totalRevenue     = groupTripSummary?.financialOverview?.totalRevenue ?? 0;
    const totalCost        = groupTripSummary?.financialOverview?.totalCost    ?? 0;
    const totalPL          = totalRevenue - totalCost;

    const totalPaid        = groupTripSummary?.paymentSummary?.totalPaid        ?? 0;
    const totalBalance     = groupTripSummary?.paymentSummary?.totalBalance     ?? 0;
    const potentialRevenue = groupTripSummary?.paymentSummary?.potentialRevenue ?? 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* ── Trip Overview card ── */}
            <div style={{
                background: 'white', borderRadius: '12px',
                border: '1px solid #f0f0f0', padding: '20px 24px',
                boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
            }}>
                <div style={{ fontSize: '15px', fontWeight: '700', color: BLUE, marginBottom: '10px' }}>Trip Overview</div>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.7', margin: 0 }}>
                    {tripOverview || 'No overview provided.'}
                </p>
            </div>

            {/* ── Viability + Trip Owner row ── */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>

                {/* Trip Viability */}
                <div style={{
                    flex: 2, minWidth: '260px',
                    background: 'white', borderRadius: '12px',
                    border: '1px solid #f0f0f0', padding: '20px 24px',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
                }}>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: BLUE, marginBottom: '12px' }}>Trip Viability</div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <span style={{ fontSize: '28px', fontWeight: '800', color: BLUE }}>{viabilityPct}%</span>
                            <span style={{ fontSize: '13px', color: '#999' }}>of minimum seats required</span>
                        </div>
                        <span style={{
                            background: viabilityStatusBg, color: viabilityStatusColor,
                            fontSize: '12px', fontWeight: '700',
                            padding: '5px 14px', borderRadius: '20px',
                            border: `1px solid ${viabilityStatusColor}40`,
                        }}>
                            {viabilityStatus}
                        </span>
                    </div>

                    {/* Progress bar */}
                    <div style={{ height: '10px', background: '#f0f0f0', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%',
                            width: `${viabilityPct}%`,
                            background: `linear-gradient(90deg, ${PINK}, #f97fb3)`,
                            borderRadius: '10px',
                            transition: 'width 0.4s ease',
                        }} />
                    </div>
                </div>

                {/* Trip Owner */}
                <div style={{
                    flex: 1, minWidth: '200px',
                    background: BLUE_LIGHT_BG, borderRadius: '12px',
                    border: '1px solid #4C78CA40', padding: '20px 24px',
                    display: 'flex', flexDirection: 'column', gap: '16px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '34px', height: '34px', borderRadius: '50%',
                            background: '#4C78CA20', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <PersonIcon color="#4C78CA" size={18} />
                        </div>
                        <span style={{ fontSize: '15px', fontWeight: '700', color: BLUE }}>Trip Owner</span>
                    </div>
                    <div style={{
                        background: 'white', borderRadius: '8px',
                        padding: '10px 16px', fontSize: '14px',
                        fontWeight: '600', color: BLUE,
                        border: '1px solid #e8eaf0',
                    }}>
                        {assignedTo}
                    </div>
                </div>
            </div>

            {/* ── Summary cards row ── */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>

                {/* Booking Summary */}
                <SummaryCard
                    icon={<PersonIcon color={PINK} size={20} />}
                    title="Booking Summary"
                    rows={[
                        { label: 'Confirmed Bookings', value: confirmedBookings },
                        { label: 'Available Seats',    value: availableSeats   },
                        { label: 'Total Seats',        value: totalSeats       },
                    ]}
                />

                {/* Financial Overview */}
                <SummaryCard
                    icon={<RupeeIcon color={PINK} size={20} />}
                    title="Financial Overview"
                    rows={[
                        { label: 'Total Revenue', value: totalRevenue },
                        { label: 'Total Cost',    value: totalCost    },
                        { label: 'Total P/L',     value: totalPL      },
                    ]}
                    footer={
                        <button style={{
                            background: 'none', border: 'none', color: PINK,
                            fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                            padding: 0, float: 'right',
                        }} onClick={()=>setIsFinancialPopup()}>
                            + Add Details
                        </button>
                    }
                />

                {/* Payment Summary */}
                <SummaryCard
                    icon={<TrendIcon color={PINK} size={20} />}
                    title="Payment Summary"
                    rows={[
                        { label: 'Total Paid',        value: totalPaid        },
                        { label: 'Total Balance',     value: totalBalance     },
                        { label: 'Potential Revenue', value: potentialRevenue },
                    ]}
                />
            </div>
        </div>
    );
}

export default ViewGroupTripOverview;