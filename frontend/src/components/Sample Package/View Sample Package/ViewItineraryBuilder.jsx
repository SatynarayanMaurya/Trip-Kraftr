// ─────────────────────────────────────────────────────────────────────────────
// ViewItineraryBuilder.jsx  — Tab 2: day sidebar + day content (read-only)
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ViewDayContent from './ViewDayContent';

const BLUE = '#18305C';
const PINK = '#ED5F8D';
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getDayOfWeek(startDate, dayIndex) {
    if (!startDate) return '';
    const d = new Date(startDate);
    d.setDate(d.getDate() + dayIndex);
    return DAY_NAMES[d.getDay()];
}

function ViewItineraryBuilder({ itineraryBuilder, regionDetails, activeDay, setActiveDay, price, vendorDetails }) {
    const { startDate } = regionDetails ?? {};
    const days = itineraryBuilder?.daysDetails ?? [];
    const numDays = days.length;
    const currentDay = days[activeDay - 1];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Trip name + overview */}
            <div className="w-full flex items-center gap-3 border border-[#18305C] rounded-full px-5 py-2 bg-white">
                <span className="text-[16px] font-bold text-[#18305C] whitespace-nowrap">Trip Name :</span>
                <span className="text-[16px] text-[#18305C]">{itineraryBuilder?.tripName || '—'}</span>
            </div>

            {itineraryBuilder?.tripOverview && (
                <div style={{ background: 'white', borderRadius: '12px', padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: BLUE, marginBottom: '8px' }}>Trip Overview</div>
                    <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.6', margin: 0 }}>{itineraryBuilder.tripOverview}</p>
                </div>
            )}

            {/* ── Vendor + Price cards ── */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>

                {/* Vendor Card */}
                <div style={{ background: BLUE, borderRadius: '16px', padding: '18px', minWidth: '280px', flex: '1', color: 'white' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '10px', marginBottom: '14px' }}>
                        Vendor Details
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[
                            { label: 'Name', value: vendorDetails?.vendorName || '—' },
                            { label: 'Vendor Price', value: vendorDetails?.vendorPrice != null ? `₹ ${vendorDetails.vendorPrice}` : '—' },
                            { label: 'Commission', value: vendorDetails?.commission != null ? `₹ ${vendorDetails.commission}` : '—' },
                        ].map(({ label, value }) => (
                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', opacity: 0.8 }}>{label}</span>
                                <span style={{ fontSize: '13px', fontWeight: '600', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '4px 12px' }}>
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Card */}
                <div style={{ background: BLUE, borderRadius: '16px', padding: '18px', minWidth: '280px', flex: '1', color: 'white' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '10px', marginBottom: '14px' }}>
                        Final Calculation
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[
                            { label: 'Total Price', value: `₹ ${price?.totalPrice ?? 0}` },
                            { label: 'Additional Price', value: `₹ ${price?.additionalPrice ?? 0}` },
                            { label: `GST ${price?.gstPercent ?? 5}%`, value: price?.isGstChecked ? `+ ₹ ${price?.gstPrice?.toFixed(0) ?? 0}` : 'Not applied' },
                        ].map(({ label, value }) => (
                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', opacity: 0.8 }}>{label}</span>
                                <span style={{ fontSize: '13px', fontWeight: '600', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '4px 12px' }}>
                                    {value}
                                </span>
                            </div>
                        ))}
                        <div style={{ borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '700', fontSize: '14px' }}>Final Price</span>
                            <span style={{ fontWeight: '800', fontSize: '20px' }}>₹ {price?.finalPrice?.toFixed(0) ?? 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Days panel */}
            <div style={{ display: 'flex', flexDirection: 'column', background: 'white', borderRadius: '10px', border: '1px solid #eee', overflow: 'hidden' }}>

                {/* ── Mobile: horizontal scroll tabs ── */}
                <div className="day-tabs-mobile" style={{ display: 'none', background: BLUE, overflowX: 'auto', padding: '8px', gap: '6px' }}>
                    {days.map((_, i) => {
                        const n = i + 1;
                        const active = activeDay === n;
                        return (
                            <button key={n} onClick={() => setActiveDay(n)}
                                style={{ flexShrink: 0, background: active ? '#FEF4F8' : 'transparent', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', textAlign: 'center', minWidth: '70px' }}>
                                <div style={{ fontSize: '13px', fontWeight: '700', color: active ? BLUE : 'white', whiteSpace: 'nowrap' }}>Day {n}</div>
                                <div style={{ fontSize: '10px', color: active ? BLUE : 'rgba(255,255,255,0.55)', marginTop: '2px' }}>{getDayOfWeek(startDate, i)}</div>
                            </button>
                        );
                    })}
                </div>

                {/* ── Desktop: sidebar + content ── */}
                <div className="day-layout-desktop" style={{ display: 'flex', flex: 1 }}>

                    {/* Sidebar */}
                    <div className="day-sidebar-desktop" style={{ background: BLUE, borderRadius: '10px 0 0 10px', padding: '8px 0', width: '140px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {days.map((_, i) => {
                            const n = i + 1;
                            const active = activeDay === n;
                            return (
                                <button key={n} onClick={() => setActiveDay(n)}
                                    style={{ background: active ? '#FEF4F8' : 'transparent', border: 'none', borderRadius: active ? '20px 0 0 20px' : '0', margin: active ? '0 0 0 8px' : '0', padding: '8px 6px', cursor: 'pointer', textAlign: 'center' }}>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: active ? BLUE : 'white' }}>Day {n}</div>
                                    <div style={{ fontSize: '11px', color: active ? BLUE : 'rgba(255,255,255,0.6)' }}>{getDayOfWeek(startDate, i)}</div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Day content */}
                    <div style={{ flex: 1, padding: '20px', overflowX: 'hidden', minWidth: 0 }}>
                        {currentDay
                            ? <ViewDayContent dayData={currentDay} startDate={startDate} dayIndex={activeDay - 1} />
                            : <p style={{ color: '#aaa', fontSize: '13px' }}>No data for this day.</p>
                        }

                        {/* Prev / Next nav */}
                        <div className="flex justify-end mt-5">
                            <div className="flex items-center gap-3">
                                <button disabled={activeDay === 1} onClick={() => setActiveDay(activeDay - 1)}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E91E8C] text-white text-sm font-medium shadow-md transition-all duration-200 hover:bg-[#d81b7f] disabled:bg-pink-300 disabled:cursor-not-allowed">
                                    <ChevronLeft size={16} /> Prev
                                </button>
                                <div className="px-4 text-sm font-medium text-gray-600">Day {activeDay} / {numDays}</div>
                                <button disabled={activeDay === numDays} onClick={() => setActiveDay(activeDay + 1)}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E91E8C] text-white text-sm font-medium shadow-md transition-all duration-200 hover:bg-[#d81b7f] disabled:bg-pink-300 disabled:cursor-not-allowed">
                                    Next <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .day-tabs-mobile     { display: none !important; }
                .day-sidebar-desktop { display: flex !important; }
                .day-layout-desktop  { display: flex !important; }
                @media (max-width: 640px) {
                    .day-tabs-mobile     { display: flex !important; }
                    .day-sidebar-desktop { display: none !important; }
                    .day-layout-desktop  { flex-direction: column !important; }
                }
            `}</style>
        </div>
    );
}

export default ViewItineraryBuilder;