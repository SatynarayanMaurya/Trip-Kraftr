

import React, { useState } from 'react';
import { cardStyle, cardStyleHotel, cardStylePlaces, inputStyle, labelStyle } from '../../Common/CommonCss';
import { Save, Hotel, MapPin, Zap } from 'lucide-react';
import {
    Wifi, Waves, ParkingCircle, Utensils, Dumbbell, Wind,
    Tv, Coffee, ShowerHead, Car, Shirt, Baby,
    Flame, Shield, Accessibility, BedDouble
} from 'lucide-react'
const PINK = '#ED5F8D';
const BLUE = '#18305C';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


const AMENITIES_LIST = [
    { key: 'wifi', label: 'Free Wi-Fi', icon: <Wifi size={16} /> },
    { key: 'pool', label: 'Swimming Pool', icon: <Waves size={16} /> },
    { key: 'parking', label: 'Free Parking', icon: <ParkingCircle size={16} /> },
    { key: 'restaurant', label: 'Restaurant', icon: <Utensils size={16} /> },
    { key: 'gym', label: 'Fitness Center', icon: <Dumbbell size={16} /> },
    { key: 'ac', label: 'Air Conditioning', icon: <Wind size={16} /> },
    { key: 'tv', label: 'Smart TV', icon: <Tv size={16} /> },
    { key: 'breakfast', label: 'Breakfast', icon: <Coffee size={16} /> },
    { key: 'hotwater', label: 'Hot Shower', icon: <ShowerHead size={16} /> },
    { key: 'airportShuttle', label: 'Airport Shuttle', icon: <Car size={16} /> },
    { key: 'laundry', label: 'Laundry', icon: <Shirt size={16} /> },
    { key: 'kidsPlay', label: 'Kids Play Area', icon: <Baby size={16} /> },
    { key: 'bonfire', label: 'Bonfire', icon: <Flame size={16} /> },
    { key: 'security', label: '24/7 Security', icon: <Shield size={16} /> },
    { key: 'accessible', label: 'Accessible', icon: <Accessibility size={16} /> },
    { key: 'roomService', label: 'Room Service', icon: <BedDouble size={16} /> },
]

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
            {/* <div style={{
                border: '1px solid #eee', borderRadius: '10px',
                padding: '18px', background: 'white',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: BLUE }}>Hotel Details</span>
                    <span style={{
                        background: isInventory ? '#E8F5E9' : '#FFDDE6',
                        color: isInventory ? '#388E3C' : PINK,
                        border: `1px solid ${isInventory ? '#A5D6A7' : '#F48FB1'}`,
                        borderRadius: '20px', padding: '3px 12px',
                        fontSize: '12px', fontWeight: '600',
                    }}>
                        {isInventory ? 'Inventory' : 'Manual'}
                    </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                    <ReadField label="Hotel Name" value={day?.hotelDetails?.hotelName} />
                    <ReadField label="Room Type"  value={day?.hotelDetails?.roomType}  />

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
            </div> */}


            <HotelDetails dayData={day}/>
            <PlacesSection dayData={day}/>

            {/* Places */}
            {/* <div>
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
            </div> */}

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

function StarRating({ rating }) {
    const num = parseFloat(rating) || 0;
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {[1, 2, 3, 4, 5].map(i => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24"
                    fill={i <= Math.round(num) ? '#FFC107' : '#e0e0e0'}
                    stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            ))}
            {num > 0 && <span style={{ fontSize: '12px', fontWeight: '600', color: '#555', marginLeft: '3px' }}>{num}</span>}
        </div>
    );
}

// ─── Amenity Tag ──────────────────────────────────────────────────────────────
function AmenityTag({ label }) {
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            padding: '3px 10px', fontSize: '11px', color: '#555',
        }}>
            <span className='text-[#D7A30F]'>
                {AMENITIES_LIST?.find(v => v.label === label)?.icon}
            </span>
            {label}
        </span>
    );
}

function SectionHeader({ icon, label }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
            <div style={{
                background: BLUE, color: 'white', borderRadius: '8px',
                padding: '8px 28px', display: 'flex', alignItems: 'center', gap: '8px',
                fontSize: '14px', fontWeight: '700', letterSpacing: '0.01em',
            }}>
                {icon}
                {label}
            </div>
        </div>
    );
}

function HotelDetails({ dayData}) {
    const hotelType = dayData?.hotelDetails?.hotelType ?? 'inventory';
    const isInventory = hotelType === 'inventory';



    const selectedMeals = (dayData?.hotelDetails?.meals ?? '').split(',').map(m => m.trim()).filter(Boolean);
    const amenities = dayData?.hotelDetails?.hotelId?.amenities ??  [];
    const hotelImage = dayData?.hotelDetails?.hotelId?.images?.[0]?.url ||  null;
    const rating = dayData?.hotelDetails?.googleRating ?? null;


    return (
        <div style={{ ...cardStyleHotel, border: '1px solid #eee', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>

            {/* Centered Hotels header */}
            <SectionHeader icon={<Hotel size={16} />} label="Hotels" />

            {/* Toggle row: Inventory | Manual pills  +  pink + button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        style={{
                            padding: '5px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: '600',
                            border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                            background: isInventory ? PINK : 'transparent',
                            color: isInventory ? 'white' : '#aaa',
                            border: isInventory ? `1px solid ${PINK}` : '1px solid #ddd',
                        }}
                    >
                        Inventory
                    </button>
                    <button
                        style={{
                            padding: '5px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: '600',
                            border: '1px solid #ddd', cursor: 'pointer', transition: 'all 0.15s',
                            background: !isInventory ? '#f5f5f5' : 'transparent',
                            color: !isInventory ? '#333' : '#aaa',
                        }}
                    >
                        Manual
                    </button>
                </div>
            </div>

            {/* ── INVENTORY mode ─────────────────────────────────────────── */}
            {isInventory && (
                <>
                    {/* Main content: left fields + right image */}
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>

                        {/* Left: all dropdowns + meals */}
                        <div style={{ flex: 1, minWidth: '260px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

                            {/* Row 1: Hotel Category | Hotel Name */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>

                                {/* Hotel Category */}
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: BLUE, marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <span style={{ fontSize: '14px' }}>🏨</span> Hotel Category
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            style={{ ...inputStyle, appearance: 'none', paddingRight: '28px', fontSize: '13px' }}
                                            value={dayData?.hotelDetails?.hotelId?.category ?? ''}
                                            readOnly
                                        >
                                        </input>
                                    </div>
                                </div>

                                {/* Hotel Name */}
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: BLUE, marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <span style={{ fontSize: '14px' }}>🏨</span> Hotel Name
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            style={{ ...inputStyle, appearance: 'none', paddingRight: '28px', fontSize: '13px' }}
                                            value={dayData?.hotelDetails?.hotelName ?? ''}
                                            readOnly
                                        >
                                        </input>
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Room Type | Meals */}
                            <div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', alignItems: 'start' }}>

                                    {/* Room Type */}
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '600', color: BLUE, marginBottom: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <span style={{ fontSize: '14px' }}>🛏</span> Room Type
                                            </span>
                                            {/* <span style={{ color: PINK, fontSize: '18px', cursor: 'pointer', fontWeight: '400', lineHeight: 1 }}>+</span> */}
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                style={{ ...inputStyle, appearance: 'none', paddingRight: '28px', fontSize: '13px' }}
                                                value={dayData?.hotelDetails?.roomType ?? ''}
                                                readOnly
                                            >
                                            </input>
                                        </div>

                                        {/* No. of rooms row */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                                            <span style={{ fontSize: '11px', color: '#999', whiteSpace: 'nowrap' }}>
                                                ({dayData?.hotelDetails?.roomTypeId?.quantity ?? '—'}) No of rooms
                                            </span>
                                        </div>
                                    </div>

                                    {/* Meals — stacked vertically */}
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '600', color: BLUE, marginBottom: '8px', display: 'block' }}>Meals</label>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {['Breakfast', 'Lunch', 'Dinner'].map(meal => (
                                                <label key={meal} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#444', cursor: 'pointer', userSelect: 'none' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedMeals.includes(meal)}
                                                        readOnly
                                                        style={{ accentColor: PINK, width: '15px', height: '15px', cursor: 'pointer' }}
                                                    />
                                                    {meal}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Amenities — full width below */}
                                {amenities?.length > 0 && (
                                    <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {amenities.map((a, i) => <AmenityTag key={i} label={a} />)}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: hotel image + rating */}
                        <div style={{ width: '20vw', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ width: '20vw', height: "25vh", borderRadius: '10px', overflow: 'hidden', background: '#f0f0f0', border: '1px solid #eee' }}>
                                {hotelImage ? (
                                    <img src={hotelImage} alt="Hotel" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '12px' }}>No Image</div>
                                )}
                            </div>
                            {rating && (
                                <div>
                                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '3px' }}>Rating </div>
                                    <StarRating rating={rating} />
                                </div>
                            )}
                        </div>
                    </div>

                </>
            )}

            {/* ── MANUAL mode ──────────────────────────────────────────────── */}
            {!isInventory && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
                    <div>
                        <label style={{ ...labelStyle, color: BLUE, fontWeight: '700' }}>Hotel Name</label>
                        <input type="text" style={inputStyle} placeholder="Enter hotel name" value={dayData?.hotelDetails?.hotelName ?? ''} readOnly />
                    </div>
                    <div>
                        <label style={{ ...labelStyle, color: BLUE, fontWeight: '700' }}>Room Type</label>
                        <input type="text" style={inputStyle} placeholder="Enter room type" value={dayData?.hotelDetails?.roomType ?? ''} readOnly />
                    </div>
                    <div>
                        <label style={{ ...labelStyle, color: BLUE, fontWeight: '700' }}>Meals</label>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', paddingTop: '6px' }}>
                            {['Breakfast', 'Lunch', 'Dinner'].map(meal => (
                                <label key={meal} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#444', cursor: 'pointer', userSelect: 'none' }}>
                                    <input type="checkbox" checked={selectedMeals.includes(meal)} readOnly style={{ accentColor: PINK, width: '15px', height: '15px', cursor: 'pointer' }} />
                                    {meal}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function PlacesSection({ dayData, placesForActiveDay, onDayChange }) {
    const selectedPlaces = dayData?.placeDetails ?? [];

    const togglePlace = (place) => {
        const exists = selectedPlaces.find(p => p.placeId === place._id);
        const updated = exists
            ? selectedPlaces.filter(p => p.placeId !== place._id)
            : [...selectedPlaces, { placeId: place._id, isFavourite: false }];
        onDayChange('placeDetails', updated);
    };


    const isSelected = (id) => selectedPlaces.some(p => p.placeId === id);
    const isFav = (id) => selectedPlaces.find(p => p.placeId === id)?.isFavourite ?? false;

    return (
        <div style={{ border: '1px solid #fce4ec', borderRadius: '12px', padding: '20px', marginBottom: '20px', ...cardStylePlaces }}>

            <SectionHeader icon={<MapPin size={16} />} label="Places" />

            {!dayData?.placeDetails?.length ? (
                <p style={{ fontSize: '13px', color: '#aaa', textAlign: 'center', margin: '8px 0' }}>No places available for selected sub-regions.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                    {dayData?.placeDetails?.map(pl => {
                        const place = pl?.placeId
                        const selected = isSelected(place._id);
                        const favourite = pl?.isFavourite
                        return (
                            <div
                                key={place._id}
                                style={{
                                    borderRadius: '10px', overflow: 'hidden',
                                    border: `1.5px solid ${selected ? PINK : '#f0d0da'}`,
                                    background: 'white', cursor: 'pointer',
                                    boxShadow: selected ? `0 0 0 2px ${PINK}25` : 'none',
                                    transition: 'border-color 0.15s, box-shadow 0.15s',
                                    position: 'relative',
                                    display: 'flex', flexDirection: 'column',
                                }}
                            >
                                {/* Image */}
                                <div style={{ width: '100%', height: '100px', background: '#f0f0f0', overflow: 'hidden', position: 'relative' }}>
                                    {place?.imageUrl ? (
                                        <img src={place.imageUrl} alt={place.placeName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ddd', fontSize: '11px' }}>No image</div>
                                    )}

                                    {/* Star — top right over image */}
                                    <button
                                        title={selected ? 'Mark as favourite' : 'Select place first'}
                                        style={{
                                            position: 'absolute', top: '6px', right: '6px',
                                            background: 'rgba(255,255,255,0.85)', border: 'none',
                                            borderRadius: '50%', width: '24px', height: '24px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: selected ? 'pointer' : 'not-allowed',
                                            fontSize: '14px', lineHeight: 1,
                                            opacity: selected ? 1 : 0.4,
                                            color: favourite ? '#FFC107' : '#bbb',
                                        }}
                                    >
                                        {favourite ? '★' : '☆'}
                                    </button>
                                </div>

                                {/* Info + checkbox row */}
                                <div style={{ padding: '8px 10px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px' }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '13px', fontWeight: '700', color: BLUE, lineHeight: '1.3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {place.placeName}
                                        </div>
                                        {place?.subRegionId?.name && (
                                            <div style={{ fontSize: '11px', color: '#888', marginTop: '1px' }}>{place.subRegionId.name}</div>
                                        )}
                                        {place?.notes && (
                                            <div style={{ fontSize: '11px', color: '#aaa', marginTop: '1px' }}>{place.notes?.length > 30 ? `${place?.notes?.slice(0, 30)}...` : place?.notes}</div>
                                        )}
                                    </div>

                                    {/* Checkbox */}
                                    <input
                                        type="checkbox"
                                        checked
                                        readOnly
                                        style={{ accentColor: PINK, width: '15px', height: '15px', cursor: 'pointer', flexShrink: 0, marginTop: '2px' }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
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

