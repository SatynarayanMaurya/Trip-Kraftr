

import React, { useState } from 'react';
import { cardStyle } from '../../Common/CommonCss';

const PINK = '#ED5F8D';
const BLUE = '#18305C';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getDayOfWeek(fromDate, dayIndex) {
    if (!fromDate) return '';
    const d = new Date(fromDate);
    d.setDate(d.getDate() + dayIndex);
    return DAY_NAMES[d.getDay()];
}

// ─── read-only field ──────────────────────────────────────────────────────────
function ReadField({ label, value }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#888' }}>{label}</span>
            <div style={{
                border: '1.5px solid #eee', borderRadius: '6px',
                padding: '8px 12px', fontSize: '14px', color: BLUE,
                background: '#fafafa', minHeight: '36px',
            }}>
                {value || '—'}
            </div>
        </div>
    );
}

// ─── meal pill ────────────────────────────────────────────────────────────────
function MealPill({ label }) {
    return (
        <span style={{
            background: '#E8F5E9', color: '#388E3C',
            border: '1px solid #A5D6A7', borderRadius: '20px',
            padding: '4px 12px', fontSize: '12px', fontWeight: '600',
        }}>
            {label}
        </span>
    );
}

// ─── place chip ───────────────────────────────────────────────────────────────
function PlaceChip({ placeName, isFavourite }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            border: `1.5px solid ${isFavourite ? PINK : '#ddd'}`,
            borderRadius: '8px', padding: '7px 12px',
            background: isFavourite ? '#fff0f5' : 'white',
        }}>
            <span style={{ fontSize: '13px', fontWeight: '500', color: BLUE }}>{placeName}</span>
            <span style={{ fontSize: '15px', color: isFavourite ? '#FFD700' : '#ddd' }}>
                {isFavourite ? '★' : '☆'}
            </span>
        </div>
    );
}

// ─── activity row ─────────────────────────────────────────────────────────────
function ActivityRow({ activity }) {
    return (
        <div style={{
            border: '1px solid #eee', borderRadius: '8px',
            padding: '12px 16px', background: '#fafafa',
            display: 'flex', flexDirection: 'column', gap: '8px',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: BLUE }}>
                    {activity?.activityName || '—'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {!activity?.isComplimentary && (
                        <span style={{ fontSize: '14px', fontWeight: '600', color: BLUE }}>
                            ₹ {activity?.price ?? 0}
                        </span>
                    )}
                    {activity?.isComplimentary ? (
                        <span style={{
                            background: '#E8F5E9', color: '#388E3C',
                            border: '1px solid #A5D6A7', borderRadius: '20px',
                            padding: '3px 12px', fontSize: '12px', fontWeight: '600',
                        }}>
                            Complimentary
                        </span>
                    ) : (
                        <span style={{
                            background: '#e3f2fd', color: '#1565c0',
                            borderRadius: '12px', padding: '3px 12px',
                            fontSize: '12px', fontWeight: '600',
                        }}>
                            Paid Activity
                        </span>
                    )}
                    <span style={{
                        background: activity?.activityType === 'inventory' ? '#EDE7F6' : '#FFF3E0',
                        color: activity?.activityType === 'inventory' ? '#5E35B1' : '#E65100',
                        borderRadius: '12px', padding: '3px 10px',
                        fontSize: '11px', fontWeight: '600',
                    }}>
                        {activity?.activityType === 'inventory' ? 'Inventory' : 'Manual'}
                    </span>
                </div>
            </div>
        </div>
    );
}

// ─── single day view ──────────────────────────────────────────────────────────
function DayView({ day }) {
    const subRegions = [day?.subRegion1, day?.subRegion2, day?.subRegion3].filter(Boolean);
    const meals = (day?.hotelDetails?.meals ?? '').split(',').map(m => m.trim()).filter(Boolean);
    const isInventory = day?.hotelDetails?.hotelType === 'inventory';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Day Overview */}
            <div>
                <span style={{ fontSize: '13px', fontWeight: '700', color: BLUE, display: 'block', marginBottom: '8px' }}>
                    Day Overview
                </span>
                <div style={{
                    border: '1.5px solid #eee', borderRadius: '6px',
                    padding: '10px 14px', fontSize: '14px', color: '#444',
                    background: '#fafafa', lineHeight: '1.6',
                    minHeight: '60px',
                }}>
                    {day?.dayOverview || '—'}
                </div>
            </div>

            {/* Sub-regions */}
            <div>
                <span style={{ fontSize: '13px', fontWeight: '700', color: BLUE, display: 'block', marginBottom: '10px' }}>
                    Sub-Regions
                </span>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {subRegions.length > 0 ? subRegions.map((sr, i) => (
                        <div key={i} style={{
                            border: '1.5px solid #eee', borderRadius: '8px',
                            padding: '8px 16px', background: '#fafafa',
                            fontSize: '13px', fontWeight: '600', color: BLUE,
                            display: 'flex', alignItems: 'center', gap: '6px',
                        }}>
                            <span style={{ fontSize: '11px', color: '#aaa' }}>0{i + 1}</span>
                            {sr?.name ?? sr}
                        </div>
                    )) : (
                        <span style={{ fontSize: '13px', color: '#aaa' }}>No sub-regions selected</span>
                    )}
                </div>
            </div>

            {/* Hotel Details */}
            <div style={{
                border: '1px solid #eee', borderRadius: '10px',
                padding: '18px', background: 'white',
            }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: BLUE }}>Hotel Details</span>
                    <span style={{
                        background: isInventory ? '#E8F5E9' : '#FFDDE6',
                        color: isInventory ? '#388E3C' : PINK,
                        border: `1px solid ${isInventory ? '#A5D6A7' : '#F48FB1'}`,
                        borderRadius: '20px', padding: '3px 12px',
                        fontSize: '12px', fontWeight: '600',
                    }}>
                        {/* {isInventory ? 'Inventory' : 'Manual'} */}
                        {isInventory ? 'Inventory' : 'Manual'}
                    </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                    <ReadField label="Hotel Name" value={day?.hotelDetails?.hotelName} />
                    <ReadField label="Room Type"  value={day?.hotelDetails?.roomType}  />

                    {/* Meals */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#888' }}>Meals</span>
                        {meals.length > 0 ? (
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '4px' }}>
                                {meals.map(m => <MealPill key={m} label={m} />)}
                            </div>
                        ) : (
                            <span style={{ fontSize: '14px', color: '#aaa', paddingTop: '4px' }}>—</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Places */}
            <div>
                <span style={{ fontSize: '13px', fontWeight: '700', color: BLUE, display: 'block', marginBottom: '10px' }}>
                    Places
                </span>
                {day?.placeDetails?.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {day.placeDetails.map((p, i) => (
                            <PlaceChip
                                key={p._id ?? i}
                                placeName={p?.placeName || p?.placeId?.placeName || '—'}
                                isFavourite={p?.isFavourite}
                            />
                        ))}
                    </div>
                ) : (
                    <span style={{ fontSize: '13px', color: '#aaa' }}>No places added</span>
                )}
            </div>

            {/* Activities */}
            <div>
                <span style={{ fontSize: '13px', fontWeight: '700', color: BLUE, display: 'block', marginBottom: '10px' }}>
                    Activities
                </span>
                {day?.activities?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {day.activities.map((act, i) => (
                            <ActivityRow key={act._id ?? i} activity={act} />
                        ))}
                    </div>
                ) : (
                    <span style={{ fontSize: '13px', color: '#aaa' }}>No activities added</span>
                )}
            </div>
        </div>
    );
}

// ─── main component ───────────────────────────────────────────────────────────
function ViewItineraryBuilder({ groupTripSummary, groupTripDetails }) {
    const [activeDay, setActiveDay] = useState(1);

    const daysDetails = groupTripDetails?.itineraryBuilder?.daysDetails ?? [];
    const tripOverview = groupTripDetails?.itineraryBuilder?.tripOverview ?? '';
    const fromDate = groupTripDetails?.regionDetails?.fromDate ?? '';
    const numDays = daysDetails.length;
    const currentDay = daysDetails[activeDay - 1];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* ── Trip details summary card (your existing code) ── */}
            <div style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: BLUE }}>Total Seats :</span>
                        <span style={{ fontSize: '14px', color: BLUE }}>{groupTripDetails?.tripDetails?.totalSeats}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: BLUE }}>Min Seats :</span>
                        <span style={{ fontSize: '14px', color: BLUE }}>{groupTripDetails?.tripDetails?.minSeats}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: BLUE }}>No. of days :</span>
                        <span style={{ fontSize: '14px', color: BLUE }}>{groupTripDetails?.regionDetails?.noOfDays || numDays || '—'}</span>
                    </div>
                </div>

                <div style={{ height: '1px', background: '#eee', margin: '12px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: BLUE }}>Single Occupancy :</span>
                        <span style={{ fontSize: '14px', color: BLUE }}>{groupTripDetails?.tripDetails?.occupancy?.single || '—'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: BLUE }}>Double Occupancy :</span>
                        <span style={{ fontSize: '14px', color: BLUE }}>{groupTripDetails?.tripDetails?.occupancy?.double || '—'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: BLUE }}>Triple Occupancy :</span>
                        <span style={{ fontSize: '14px', color: BLUE }}>{groupTripDetails?.tripDetails?.occupancy?.triple || '—'}</span>
                    </div>
                </div>
            </div>

            {/* ── Trip Overview ── */}
            <div style={cardStyle}>
                <div style={{ fontSize: '15px', fontWeight: '700', color: BLUE, marginBottom: '10px' }}>Trip Overview</div>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.7', margin: 0 }}>
                    {tripOverview || 'No overview provided.'}
                </p>
            </div>

            {/* ── Day layout: sidebar + content ── */}
            {numDays > 0 ? (
                <div style={{ display: 'flex', background: 'white', borderRadius: '10px', border: '1px solid #eee', overflow: 'hidden' }}>

                    {/* Mobile horizontal tabs */}
                    <style>{`
                        .vib-sidebar { display: flex; }
                        .vib-layout  { display: flex; flex-direction: row; }
                        @media (max-width: 640px) {
                            .vib-layout  { flex-direction: column !important; }
                            .vib-sidebar {
                                flex-direction: row !important;
                                min-width: unset !important;
                                width: 100% !important;
                                border-radius: 10px 10px 0 0 !important;
                                overflow-x: auto;
                                padding: 8px !important;
                                gap: 6px;
                            }
                        }
                    `}</style>

                    {/* Sidebar */}
                    <div className="vib-layout" style={{ width: '100%' }}>
                        <div className="vib-sidebar" style={{
                            background: BLUE, borderRadius: '10px 0 0 10px',
                            padding: '16px 0', width: '130px', flexShrink: 0,
                            flexDirection: 'column', gap: '2px',
                        }}>
                            {Array.from({ length: numDays }, (_, i) => {
                                const dayNum = i + 1;
                                const dow = getDayOfWeek(fromDate, i);
                                const isActive = activeDay === dayNum;
                                return (
                                    <button
                                        key={dayNum}
                                        onClick={() => setActiveDay(dayNum)}
                                        style={{
                                            background: isActive ? '#FEF4F8' : 'transparent',
                                            border: 'none',
                                            borderRadius: isActive ? '20px 0 0 20px' : '0',
                                            margin: isActive ? '0 0 0 8px' : '0',
                                            padding: '8px 6px',
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <div style={{ fontSize: '13px', fontWeight: '700', color:isActive ? BLUE : 'white' }}>Day {dayNum}</div>
                                        <div style={{ fontSize: '11px', color:  isActive ? BLUE : 'white'}}>{dow}</div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Day content */}
                        <div style={{ flex: 1, padding: '20px', overflowX: 'hidden', minWidth: 0 }}>
                            {currentDay ? (
                                <DayView day={currentDay} />
                            ) : (
                                <div style={{ color: '#aaa', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>
                                    No data for this day.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ ...cardStyle, textAlign: 'center', color: '#aaa', padding: '40px' }}>
                    No itinerary days found.
                </div>
            )}
        </div>
    );
}

export default ViewItineraryBuilder;

