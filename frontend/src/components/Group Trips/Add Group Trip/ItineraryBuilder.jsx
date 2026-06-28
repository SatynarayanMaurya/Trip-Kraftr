
import React, { useEffect } from 'react';
import { inputStyle, labelStyle, cardStyle, cardStyleHotel, cardStylePlaces } from '../../Common/CommonCss';
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

// ─── Star Rating ──────────────────────────────────────────────────────────────
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
            // border: '1px solid #f48fb1', borderRadius: '6px',
            padding: '3px 10px', fontSize: '11px', color: '#555',
            // background: 'white', whiteSpace: 'nowrap',
        }}>
            <span className='text-[#D7A30F]'>
                {AMENITIES_LIST?.find(v => v.label === label)?.icon}
            </span>
            {label}
        </span>
    );
}

// ─── Dark centered section header button ──────────────────────────────────────
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

// ─── SubRegionDropdowns — UNCHANGED ──────────────────────────────────────────
function SubRegionDropdowns({ dayData, allSubRegions, onDayChange, subRegionLoading }) {
    const getFiltered = (excludeKeys) => {
        const excluded = excludeKeys.map(k => dayData?.[k]).filter(Boolean);
        return (allSubRegions ?? []).filter(s => !excluded.includes(s._id));
    };

    const fields = [
        { key: 'subRegion1', label: 'Sub- Region', exclude: ['subRegion2', 'subRegion3'], dependsOn: null },
        { key: 'subRegion2', label: 'Sub- Region', exclude: ['subRegion1', 'subRegion3'], dependsOn: 'subRegion1' },
        { key: 'subRegion3', label: 'Sub- Region', exclude: ['subRegion1', 'subRegion2'], dependsOn: 'subRegion2' },
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            {fields.map(({ key, label, exclude, dependsOn }) => {
                const isLocked = dependsOn && !dayData?.[dependsOn];
                return (
                    <div key={key}>
                        <label style={{ ...labelStyle, color: isLocked ? '#bbb' : BLUE, fontWeight: '700' }}>{label}</label>
                        <div style={{ position: 'relative' }}>
                            <select
                                style={{ ...inputStyle, appearance: 'none', paddingRight: '32px', background: isLocked ? '#f5f5f5' : 'white', color: isLocked ? '#bbb' : '#333', cursor: isLocked ? 'not-allowed' : 'pointer' }}
                                value={dayData?.[key] ?? ''}
                                onChange={e => onDayChange(key, e.target.value)}
                                disabled={subRegionLoading || isLocked}
                            >
                                <option value="">{isLocked ? 'Select Sub-Region first' : 'e.g. Arunachal Pradesh'}</option>
                                {!isLocked && getFiltered(exclude).map(s => (
                                    <option key={s._id} value={s._id}>{s.name}</option>
                                ))}
                            </select>
                            <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: isLocked ? '#ccc' : '#aaa', pointerEvents: 'none' }}>▼</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ─── HotelDetails — UPDATED UI to match image ────────────────────────────────
function HotelDetails({ dayData, hotelsForActiveDay, roomTypesForActiveDay, hotelLoading, roomTypeLoading, onDayChange }) {
    const hotelType = dayData?.hotelDetails?.hotelType ?? 'inventory';
    const isInventory = hotelType === 'inventory';

    const updateHotel = (field, value) => {
        if (field === 'roomType') {
            if (isInventory) {
                const findRoom = roomTypesForActiveDay?.find(r => r._id === value);
                onDayChange('hotelDetails', { ...dayData?.hotelDetails, roomTypeId: value, roomType: findRoom?.roomName ?? '' });
            } else {
                onDayChange('hotelDetails', { ...dayData?.hotelDetails, roomTypeId: null, roomType: value });
            }
        } else {
            onDayChange('hotelDetails', { ...dayData?.hotelDetails, [field]: value });
        }
    };

    const toggleMeal = (meal) => {
        const current = dayData?.hotelDetails?.meals ?? '';
        const meals = current ? current.split(',').map(m => m.trim()) : [];
        const updated = meals.includes(meal) ? meals.filter(m => m !== meal) : [...meals, meal];
        updateHotel('meals', updated.join(', '));
    };

    const selectedMeals = (dayData?.hotelDetails?.meals ?? '').split(',').map(m => m.trim()).filter(Boolean);
    const selectedHotel = hotelsForActiveDay?.find(h => h._id === dayData?.hotelDetails?.hotelId);
    const selectedRoom = roomTypesForActiveDay?.find(r => r?._id === dayData?.hotelDetails?.roomTypeId);
    const amenities = selectedHotel?.amenities ?? dayData?.hotelDetails?.amenities ?? [];
    const hotelImage = selectedHotel?.images?.[0]?.url || dayData?.hotelDetails?.hotelImage || null;
    const rating = selectedHotel?.googleRating ?? null;

    return (
        <div style={{ ...cardStyleHotel, border: '1px solid #eee', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>

            {/* Centered Hotels header */}
            <SectionHeader icon={<Hotel size={16} />} label="Hotels" />

            {/* Toggle row: Inventory | Manual pills  +  pink + button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => updateHotel('hotelType', 'inventory')}
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
                        onClick={() => updateHotel('hotelType', 'manual')}
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
                {/* <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: PINK, fontSize: '24px', lineHeight: 1, padding: '0 2px', fontWeight: '300' }}>
                    +
                </button> */}
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
                                        <select
                                            disabled={!dayData?.subRegion1}
                                            style={{ ...inputStyle, appearance: 'none', paddingRight: '28px', fontSize: '13px' }}
                                            value={dayData?.hotelDetails?.hotelCategory ?? ''}
                                            onChange={e => updateHotel('hotelCategory', e.target.value)}
                                        >
                                            <option value="">Category</option>
                                            <option value="Budget">Budget</option>
                                            <option value="Premium">Premium</option>
                                            <option value="Luxury">Luxury</option>
                                        </select>
                                        <span style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px', color: '#aaa', pointerEvents: 'none' }}>▼</span>
                                    </div>
                                </div>

                                {/* Hotel Name */}
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: BLUE, marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <span style={{ fontSize: '14px' }}>🏨</span> Hotel Name
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <select
                                            style={{ ...inputStyle, appearance: 'none', paddingRight: '28px', fontSize: '13px' }}
                                            value={dayData?.hotelDetails?.hotelId ?? ''}
                                            disabled={dayData?.hotelDetails?.hotelCategory === '' || hotelLoading}
                                            onChange={e => {
                                                const h = hotelsForActiveDay?.find(h => h._id === e.target.value);
                                                onDayChange('hotelDetails', {
                                                    ...dayData?.hotelDetails,
                                                    hotelId: e.target.value,
                                                    hotelImage: h?.images?.[0]?.url || null,
                                                    amenities: h?.amenities,
                                                    hotelName: h?.hotelName ?? '',
                                                    roomType: '',
                                                    roomTypeId: null,
                                                });
                                            }}
                                        >
                                            <option value="">Hotel Name</option>
                                            {(hotelsForActiveDay ?? [])
                                                .filter(h => !dayData?.hotelDetails?.hotelCategory || h.category === dayData?.hotelDetails?.hotelCategory)
                                                .map(h => (
                                                    <option key={h._id} value={h._id}>{h.hotelName}</option>
                                                ))}
                                        </select>
                                        <span style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px', color: '#aaa', pointerEvents: 'none' }}>▼</span>
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
                                            <select
                                                style={{ ...inputStyle, appearance: 'none', paddingRight: '28px', fontSize: '13px' }}
                                                value={dayData?.hotelDetails?.roomTypeId ?? ''}
                                                onChange={e => updateHotel('roomType', e.target.value)}
                                                disabled={roomTypeLoading || !dayData?.hotelDetails?.hotelId}
                                            >
                                                <option value="">Room Type</option>
                                                {(roomTypesForActiveDay ?? []).map(r => (
                                                    <option key={r._id} value={r._id}>{r.roomName}</option>
                                                ))}
                                            </select>
                                            <span style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px', color: '#aaa', pointerEvents: 'none' }}>▼</span>
                                        </div>

                                        {/* No. of rooms row */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                                            <span style={{ fontSize: '11px', color: '#999', whiteSpace: 'nowrap' }}>
                                                ({selectedRoom?.quantity ?? '—'}) No of rooms
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
                                                        onChange={() => toggleMeal(meal)}
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

                    {/* Amenities — full width below */}
                    {/* {amenities?.length > 0 && (
                        <div style={{ marginTop: '2px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {amenities.map((a, i) => <AmenityTag key={i} label={a} />)}
                        </div>
                    )} */}
                </>
            )}

            {/* ── MANUAL mode ──────────────────────────────────────────────── */}
            {!isInventory && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
                    <div>
                        <label style={{ ...labelStyle, color: BLUE, fontWeight: '700' }}>Hotel Name</label>
                        <input type="text" style={inputStyle} placeholder="Enter hotel name" value={dayData?.hotelDetails?.hotelName ?? ''} onChange={e => updateHotel('hotelName', e.target.value)} />
                    </div>
                    <div>
                        <label style={{ ...labelStyle, color: BLUE, fontWeight: '700' }}>Room Type</label>
                        <input type="text" style={inputStyle} placeholder="Enter room type" value={dayData?.hotelDetails?.roomType ?? ''} onChange={e => updateHotel('roomType', e.target.value)} />
                    </div>
                    <div>
                        <label style={{ ...labelStyle, color: BLUE, fontWeight: '700' }}>Meals</label>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', paddingTop: '6px' }}>
                            {['Breakfast', 'Lunch', 'Dinner'].map(meal => (
                                <label key={meal} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#444', cursor: 'pointer', userSelect: 'none' }}>
                                    <input type="checkbox" checked={selectedMeals.includes(meal)} onChange={() => toggleMeal(meal)} style={{ accentColor: PINK, width: '15px', height: '15px', cursor: 'pointer' }} />
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

// ─── PlacesSection — UPDATED UI: image card grid matching image ───────────────
function PlacesSection({ dayData, placesForActiveDay, onDayChange }) {
    const selectedPlaces = dayData?.placeDetails ?? [];

    const togglePlace = (place) => {
        const exists = selectedPlaces.find(p => p.placeId === place._id);
        const updated = exists
            ? selectedPlaces.filter(p => p.placeId !== place._id)
            : [...selectedPlaces, { placeId: place._id, isFavourite: false }];
        onDayChange('placeDetails', updated);
    };

    const toggleFavourite = (e, placeId) => {
        e.stopPropagation();
        const isChecked = selectedPlaces.find(p => p.placeId === placeId);
        if (!isChecked) return;
        const updated = selectedPlaces.map(p => ({
            ...p,
            isFavourite: p.placeId === placeId ? !p.isFavourite : false,
        }));
        onDayChange('placeDetails', updated);
    };

    const isSelected = (id) => selectedPlaces.some(p => p.placeId === id);
    const isFav = (id) => selectedPlaces.find(p => p.placeId === id)?.isFavourite ?? false;

    return (
        <div style={{ border: '1px solid #fce4ec', borderRadius: '12px', padding: '20px', marginBottom: '20px', ...cardStylePlaces }}>

            <SectionHeader icon={<MapPin size={16} />} label="Places" />

            {!placesForActiveDay?.length ? (
                <p style={{ fontSize: '13px', color: '#aaa', textAlign: 'center', margin: '8px 0' }}>No places available for selected sub-regions.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                    {placesForActiveDay.map(place => {
                        const selected = isSelected(place._id);
                        const favourite = isFav(place._id);
                        return (
                            <div
                                key={place._id}
                                onClick={() => togglePlace(place)}
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
                                        onClick={e => toggleFavourite(e, place._id)}
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
                                        checked={selected}
                                        onChange={() => togglePlace(place)}
                                        onClick={e => e.stopPropagation()}
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

// ─── ActivitiesSection — UNCHANGED ───────────────────────────────────────────
function ActivitiesSection({ dayData, activitiesForActiveDay, onDayChange }) {
    const activities = dayData?.activities ?? [
        { activityType: 'inventory', activityId: '', activityName: '', isComplimentary: false, price: 0 }
    ];

    const updateActivity = (index, updates) => {
        const updated = activities.map((a, i) => i === index ? { ...a, ...updates } : a);
        onDayChange('activities', updated);
    };

    const addActivity = () => {
        onDayChange('activities', [...activities, { activityType: 'inventory', activityId: '', activityName: '', isComplimentary: false, price: 0 }]);
    };

    const removeActivity = (index) => {
        if (activities.length === 1) return;
        onDayChange('activities', activities.filter((_, i) => i !== index));
    };

    const handleNameChange = (index, value) => {
        const found = activitiesForActiveDay?.find(a => a.activityName.toLowerCase() === value.toLowerCase());
        if (found) {
            updateActivity(index, { activityName: found.activityName, activityId: found._id, activityType: 'inventory', ...(!activities[index].isComplimentary && { price: found.price ?? 0 }) });
        } else {
            updateActivity(index, { activityName: value, activityId: '', activityType: 'manual' });
        }
    };

    return (
        <div style={{ marginBottom: '8px' }}>
            {/* Centered Activities header */}
            <SectionHeader icon={<Zap size={16} />} label="Activities" />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                <button onClick={addActivity} style={{ background: 'none', border: 'none', color: PINK, fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                    + Add Activity
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activities.map((act, index) => (
                    <div key={index} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '14px' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div style={{ flex: 2, minWidth: '140px' }}>
                                <input
                                    type="text"
                                    list={`activity-list-${index}`}
                                    style={{ ...inputStyle }}
                                    placeholder="Enter activity name"
                                    value={act.activityName}
                                    onChange={e => handleNameChange(index, e.target.value)}
                                />
                                <datalist id={`activity-list-${index}`}>
                                    {(activitiesForActiveDay ?? []).map(a => <option key={a._id} value={a.activityName} />)}
                                </datalist>
                            </div>

                            {!act.isComplimentary && (
                                <div style={{ flex: 1, minWidth: '110px', display: 'flex', alignItems: 'center', gap: '6px', border: '1.5px solid #ddd', borderRadius: '6px', padding: '0 10px', height: '38px', background: 'white' }}>
                                    <span style={{ fontSize: '14px', color: '#555' }}>₹</span>
                                    <input type="number" min={0} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', color: '#333' }} value={act.price ?? 0} onChange={e => updateActivity(index, { price: Number(e.target.value) })} />
                                </div>
                            )}

                            <button onClick={() => removeActivity(index)} disabled={activities.length === 1} style={{ background: 'none', border: 'none', cursor: activities.length === 1 ? 'not-allowed' : 'pointer', opacity: activities.length === 1 ? 0.35 : 1, fontSize: '16px', color: '#e53935' }}>🗑</button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px', flexWrap: 'wrap' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#444', cursor: 'pointer', userSelect: 'none' }}>
                                <input type="checkbox" checked={act.isComplimentary ?? false} onChange={e => updateActivity(index, { isComplimentary: e.target.checked, price: e.target.checked ? null : 0 })} style={{ accentColor: PINK, width: '14px', height: '14px', cursor: 'pointer' }} />
                                Complimentary
                            </label>
                            {!act.isComplimentary && (
                                <span style={{ background: '#e3f2fd', color: '#1565c0', fontSize: '12px', fontWeight: '600', padding: '3px 12px', borderRadius: '12px' }}>
                                    Paid Activity
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── ItineraryBuilder — props + Trip Overview + sidebar UNCHANGED ─────────────
function ItineraryBuilder({
    formData, activeDay, setActiveDay,
    allSubRegions, hotelsForActiveDay, placesForActiveDay,
    activitiesForActiveDay, roomTypesForActiveDay,
    subRegionLoading, hotelLoading, placeLoading,
    activityLoading, roomTypeLoading,
    handleItineraryChange, handleSave, submitLoading
}) {
    const { itineraryBuilder, regionDetails } = formData;
    const { fromDate } = regionDetails ?? {};
    const numDays = itineraryBuilder?.daysDetails?.length ?? 0;
    const currentDay = itineraryBuilder?.daysDetails?.[activeDay - 1];

    const updateDayField = (field, value) => {
        if (value === '') value = null;
        let updates = { [field]: value };
        if (field === 'subRegion1' && !value) updates = { subRegion1: null, subRegion2: null, subRegion3: null };
        else if (field === 'subRegion2' && !value) updates = { subRegion2: null, subRegion3: null };
        handleItineraryChange(activeDay - 1, updates);
    };

    useEffect(() => {
        if (!placesForActiveDay || !currentDay) return;
        const ids = new Set(placesForActiveDay.map(p => p._id));
        handleItineraryChange(activeDay - 1, { placeDetails: currentDay.placeDetails?.filter(d => ids.has(d.placeId)) });
    }, [placesForActiveDay]);

    useEffect(() => {
        if (!activitiesForActiveDay || !currentDay) return;
        const ids = new Set(activitiesForActiveDay.map(p => p._id));
        handleItineraryChange(activeDay - 1, { activities: currentDay.activities?.filter(d => !d.activityId || ids.has(d.activityId)) });
    }, [activitiesForActiveDay]);

    useEffect(() => {
        if (!hotelsForActiveDay || !currentDay) return;
        const ids = new Set(hotelsForActiveDay.map(h => h._id));
        const cur = currentDay?.hotelDetails;
        const updated = (cur && (!ids.has(cur.hotelId) && cur?.hotelType !== 'manual'))
            ? { hotelType: 'inventory', hotelCategory: cur?.hotelCategory, hotelId: null, hotelName: '', roomTypeId: null, roomType: '', meals: '' }
            : cur;
        handleItineraryChange(activeDay - 1, { hotelDetails: updated });
    }, [hotelsForActiveDay]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>


            {/* Trip Name — UNTOUCHED */}
            <div className="w-full flex items-center gap-3 border border-[#18305C] rounded-full px-5 py-2 bg-white">

                <span className="text-[18px] font-bold text-[#18305C] whitespace-nowrap">
                    Trip Name :
                </span>

                <input
                    type="text"
                    placeholder="Enter Trip Name..."
                    value={itineraryBuilder?.tripName ?? ""}
                    onChange={(e) =>
                        handleItineraryChange(null, "tripName", e.target.value)
                    }
                    className="w-full bg-transparent outline-none border-none text-[18px]  text-[#18305C] placeholder:text-[#18305C]"
                />

            </div>

            {/* Trip Overview — UNTOUCHED */}
            <div style={{ ...cardStyle }}>
                <div style={{ fontSize: '18px', fontWeight: '700', color: BLUE, marginBottom: '12px' }}>Trip Overview</div>
                <textarea
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '70px', lineHeight: '1.6' }}
                    placeholder="Describe the overall trip experience..."
                    value={itineraryBuilder?.tripOverview ?? ''}
                    onChange={e => handleItineraryChange(null, 'tripOverview', e.target.value)}
                />
            </div>

            {/* Days layout */}
            <div style={{ display: 'flex', flexDirection: 'column', background: 'white', borderRadius: '10px', border: '1px solid #eee', overflow: 'hidden' }}>

                {/* Mobile horizontal tabs */}
                <div className="day-tabs-mobile" style={{ display: 'none', background: BLUE, overflowX: 'auto', padding: '8px', gap: '6px', borderRadius: '10px 10px 0 0' }}>
                    {Array.from({ length: numDays }, (_, i) => {
                        const dayNum = i + 1;
                        const isActive = activeDay === dayNum;
                        return (
                            <button key={dayNum} onClick={() => setActiveDay(dayNum)} style={{ flexShrink: 0, background: isActive ? '#FEF4F8' : 'transparent', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', textAlign: 'center', minWidth: '70px' }}>
                                <div style={{ fontSize: '13px', fontWeight: '700', color: isActive ? BLUE : 'white', whiteSpace: 'nowrap' }}>Day {dayNum}</div>
                                <div style={{ fontSize: '10px', color: isActive ? BLUE : 'rgba(255,255,255,0.55)', marginTop: '2px' }}>{getDayOfWeek(fromDate, i)}</div>
                            </button>
                        );
                    })}
                </div>

                <div className="day-layout-desktop" style={{ display: 'flex', flex: 1 }}>

                    {/* Sidebar */}
                    <div className="day-sidebar-desktop" style={{ background: BLUE, borderRadius: '10px 0 0 10px', padding: '8px 0', width: '140px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {Array.from({ length: numDays }, (_, i) => {
                            const dayNum = i + 1;
                            const isActive = activeDay === dayNum;
                            return (
                                <button key={dayNum} onClick={() => setActiveDay(dayNum)} style={{ background: isActive ? '#FEF4F8' : 'transparent', border: 'none', borderRadius: isActive ? '20px 0 0 20px' : '0', margin: isActive ? '0 0 0 8px' : '0', padding: '8px 6px', cursor: 'pointer', textAlign: 'center' }}>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: isActive ? BLUE : 'white' }}>Day {dayNum}</div>
                                    <div style={{ fontSize: '11px', color: isActive ? BLUE : 'rgba(255,255,255,0.6)' }}>{getDayOfWeek(fromDate, i)}</div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Day content */}
                    <div style={{ flex: 1, padding: '20px', overflowX: 'hidden', minWidth: 0 }}>

                        {/* Day Overview */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ ...labelStyle, color: BLUE, fontWeight: '700', fontSize: '14px' }}>Day Overview</label>
                            <textarea
                                style={{ ...inputStyle, resize: 'none', minHeight: '44px', padding: '10px 24px', borderRadius: '9999px', border: '1px solid rgba(0,0,0,0.12)', background: '#fff', boxShadow: 'inset 0px 2px 6px rgba(0,0,0,0.08)', outline: 'none', fontSize: '14px', lineHeight: '1.4' }}
                                placeholder="Experience the magic of Bali with our curated group trip..."
                                value={currentDay?.dayOverview ?? ''}
                                onChange={e => updateDayField('dayOverview', e.target.value)}
                            />
                        </div>

                        <SubRegionDropdowns dayData={currentDay} allSubRegions={allSubRegions} onDayChange={updateDayField} subRegionLoading={subRegionLoading} />
                        <HotelDetails dayData={currentDay} hotelsForActiveDay={hotelsForActiveDay} roomTypesForActiveDay={roomTypesForActiveDay} hotelLoading={hotelLoading} roomTypeLoading={roomTypeLoading} onDayChange={updateDayField} />
                        <PlacesSection dayData={currentDay} placesForActiveDay={placesForActiveDay} onDayChange={updateDayField} />
                        <ActivitiesSection dayData={currentDay} activitiesForActiveDay={activitiesForActiveDay} onDayChange={updateDayField} />
                    </div>
                </div>
            </div>

            <style>{`
                .day-tabs-mobile  { display: none !important; }
                .day-sidebar-desktop { display: flex !important; }
                .day-layout-desktop  { display: flex !important; }
                @media (max-width: 640px) {
                    .day-tabs-mobile     { display: flex !important; }
                    .day-sidebar-desktop { display: none !important; }
                    .day-layout-desktop  { flex-direction: column !important; }
                }
            `}</style>

            {/* Save button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={submitLoading}
                    className={`flex items-center gap-2 px-6 py-2.5 bg-[#E91E8C] text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-pink-200 ${submitLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-pink-600'}`}
                >
                    {submitLoading ? (
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
                        </svg>
                    ) : (
                        <Save size={16} />
                    )}
                    {submitLoading ? 'Saving...' : 'Save'}
                </button>
            </div>
        </div>
    );
}

export default ItineraryBuilder;




















// import React, { useEffect } from 'react';
// import { Save, Hotel, MapPin, Zap, ChevronDown, Star, Plus, Trash2 } from 'lucide-react';
// import { inputStyle, labelStyle, cardStyle, cardStyleHotel } from '../../Common/CommonCss';
// const PINK = '#ED5F8D';
// const BLUE = '#18305C';

// // const inputStyle = {
// //     width: '100%',
// //     padding: '8px 14px',
// //     border: '1.5px solid #e2e8f0',
// //     borderRadius: '8px',
// //     fontSize: '13px',
// //     color: '#334155',
// //     background: 'white',
// //     outline: 'none',
// //     boxSizing: 'border-box',
// // };

// // const labelStyle = {
// //     display: 'block',
// //     fontSize: '12px',
// //     fontWeight: '700',
// //     marginBottom: '5px',
// //     letterSpacing: '0.02em',
// // };

// const SectionHeader = ({ icon: Icon, label }) => (
//     <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
//         <div style={{
//             display: 'inline-flex', alignItems: 'center', gap: '8px',
//             background: BLUE, color: 'white',
//             padding: '8px 28px', borderRadius: '8px',
//             fontSize: '14px', fontWeight: '700',
//         }}>
//             <Icon size={15} />
//             {label}
//         </div>
//     </div>
// );

// const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// function getDayOfWeek(fromDate, dayIndex) {
//     if (!fromDate) return '';
//     const d = new Date(fromDate);
//     d.setDate(d.getDate() + dayIndex);
//     return DAY_NAMES[d.getDay()];
// }

// // ─── SubRegion Dropdowns ──────────────────────────────────────────────────────
// function SubRegionDropdowns({ dayData, allSubRegions, onDayChange, subRegionLoading }) {
//     const getFiltered = (excludeKeys) => {
//         const excluded = excludeKeys.map(k => dayData?.[k]).filter(Boolean);
//         return (allSubRegions ?? []).filter(s => !excluded.includes(s._id));
//     };
//     const fields = [
//         { key: 'subRegion1', label: 'Sub- Region  01', exclude: ['subRegion2', 'subRegion3'], dependsOn: null },
//         { key: 'subRegion2', label: 'Sub- Region  02', exclude: ['subRegion1', 'subRegion3'], dependsOn: 'subRegion1' },
//         { key: 'subRegion3', label: 'Sub- Region  03', exclude: ['subRegion1', 'subRegion2'], dependsOn: 'subRegion2' },
//     ];
//     return (
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
//             {fields.map(({ key, label, exclude, dependsOn }) => {
//                 const isLocked = dependsOn && !dayData?.[dependsOn];
//                 return (
//                     <div key={key}>
//                         <label style={{ ...labelStyle, color: isLocked ? '#bbb' : BLUE }}>{label}</label>
//                         <div style={{ position: 'relative' }}>
//                             <select
//                                 style={{ ...inputStyle, appearance: 'none', paddingRight: '32px', background: isLocked ? '#f8fafc' : 'white', color: isLocked ? '#bbb' : '#334155', cursor: isLocked ? 'not-allowed' : 'pointer' }}
//                                 value={dayData?.[key] ?? ''}
//                                 onChange={e => onDayChange(key, e.target.value)}
//                                 disabled={subRegionLoading || isLocked}
//                             >
//                                 <option value="">{isLocked ? `Select Sub-Region ${fields.findIndex(f => f.key === dependsOn) + 1} first` : 'e.g. Arunachal Pradesh'}</option>
//                                 {!isLocked && getFiltered(exclude).map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
//                             </select>
//                             <ChevronDown size={13} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: isLocked ? '#ccc' : '#94a3b8', pointerEvents: 'none' }} />
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }

// // ─── Star Rating ──────────────────────────────────────────────────────────────
// function StarRating({ rating }) {
//     const num = parseFloat(rating) || 0;
//     return (
//         <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
//             {[1, 2, 3, 4, 5].map(i => (
//                 <Star key={i} size={14} fill={i <= num ? '#f59e0b' : 'none'} stroke={i <= num ? '#f59e0b' : '#d1d5db'} />
//             ))}
//             {rating && <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '3px' }}>{num.toFixed(1)}</span>}
//         </div>
//     );
// }

// // ─── Amenity Tag ──────────────────────────────────────────────────────────────
// function AmenityTag({ label }) {
//     const icons = {
//         Restaurant: '🍽️', WiFi: '📶', TV: '📺', AC: '❄️',
//         '24Hour Room Service': '🛎️', Pool: '🏊', Gym: '💪', Parking: '🅿️',
//     };
//     const icon = icons[label] || '✦';
//     return (
//         <span style={{
//             display: 'inline-flex', alignItems: 'center', gap: '4px',
//             border: `1px solid ${PINK}40`, borderRadius: '6px',
//             padding: '3px 8px', fontSize: '11px', color: '#475569',
//             background: `${PINK}08`, whiteSpace: 'nowrap',
//         }}>
//             <span style={{ fontSize: '12px' }}>{icon}</span>{label}
//         </span>
//     );
// }

// // ─── Hotel Details ────────────────────────────────────────────────────────────
// function HotelDetails({ dayData, hotelsForActiveDay, roomTypesForActiveDay, hotelLoading, roomTypeLoading, onDayChange }) {
//     const hotelType = dayData?.hotelDetails?.hotelType ?? 'inventory';
//     const isInventory = hotelType === 'inventory';

//     const updateHotel = (field, value) => {
//         if (field === 'roomType') {
//             if (isInventory) {
//                 const findRoom = roomTypesForActiveDay?.find(r => r._id === value);
//                 onDayChange('hotelDetails', { ...dayData?.hotelDetails, roomTypeId: value, roomType: findRoom?.roomName ?? '' });
//             } else {
//                 onDayChange('hotelDetails', { ...dayData?.hotelDetails, roomTypeId: null, roomType: value });
//             }
//         } else {
//             onDayChange('hotelDetails', { ...dayData?.hotelDetails, [field]: value });
//         }
//     };

//     const toggleMeal = (meal) => {
//         const current = dayData?.hotelDetails?.meals ?? '';
//         const meals = current ? current.split(',').map(m => m.trim()) : [];
//         const updated = meals.includes(meal) ? meals.filter(m => m !== meal) : [...meals, meal];
//         updateHotel('meals', updated.join(', '));
//     };

//     const selectedMeals = (dayData?.hotelDetails?.meals ?? '').split(',').map(m => m.trim()).filter(Boolean);
//     const selectedHotel = hotelsForActiveDay?.find(h => h._id === dayData?.hotelDetails?.hotelId);
//     const selectedRoom = roomTypesForActiveDay?.find(r => r?._id === dayData?.hotelDetails?.roomTypeId);

//     return (
//         <div style={{ border: '1px solid #e8edf5', borderRadius: '12px', padding: '18px', marginBottom: '20px', background: '#fafbfd' }}>
//             <SectionHeader icon={Hotel} label="Hotels" />

//             {/* Toggle */}
//             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
//                 <button
//                     onClick={() => updateHotel('hotelType', 'inventory')}
//                     style={{
//                         padding: '5px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
//                         background: isInventory ? PINK : 'transparent',
//                         color: isInventory ? 'white' : '#94a3b8',
//                         border: isInventory ? `1px solid ${PINK}` : '1px solid #e2e8f0',
//                         transition: 'all 0.18s',
//                     }}
//                 >Inventory</button>
//                 <button
//                     onClick={() => updateHotel('hotelType', 'manual')}
//                     style={{
//                         padding: '5px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
//                         background: !isInventory ? BLUE : 'transparent',
//                         color: !isInventory ? 'white' : '#94a3b8',
//                         border: !isInventory ? `1px solid ${BLUE}` : '1px solid #e2e8f0',
//                         transition: 'all 0.18s',
//                     }}
//                 >Manual</button>
//             </div>

//             {/* Main content grid */}
//             <div style={{ display: 'grid', gridTemplateColumns: isInventory ? '1fr 1fr 1fr auto' : '1fr 1fr auto', gap: '16px', alignItems: 'start' }}>

//                 {/* Left column: fields */}
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', gridColumn: isInventory ? 'span 3' : 'span 2' }}>

//                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
//                         {/* Hotel Category (inventory only) */}
//                         {isInventory && (
//                             <div>
//                                 <label style={{ ...labelStyle, color: BLUE,fontWeight: '700' }}>
//                                     <span style={{ marginRight: '4px' }}>🏨</span> Hotel Category
//                                 </label>
//                                 <div style={{ position: 'relative' }}>
//                                     <select
//                                         style={{ ...inputStyle, appearance: 'none', paddingRight: '32px' }}
//                                         disabled
//                                         value={selectedHotel?.category || ""}
//                                         onChange={() => { }}
//                                     >
//                                         <option value=""></option>
//                                         <option value="Budget">Budget</option>
//                                         <option value="Premium">Premium</option>
//                                         <option value="Luxury">Luxury</option>
//                                     </select>
//                                     <ChevronDown size={13} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
//                                 </div>
//                             </div>
//                         )}

//                         {/* Hotel Name */}
//                         <div>
//                             <label style={{ ...labelStyle, color: BLUE,fontWeight: '700' }}>
//                                 <span style={{ marginRight: '4px' }}>🏨</span> Hotel Name
//                             </label>
//                             {isInventory ? (
//                                 <div style={{ position: 'relative' }}>
//                                     <select
//                                         style={{ ...inputStyle, appearance: 'none', paddingRight: '32px' }}
//                                         value={dayData?.hotelDetails?.hotelId ?? ''}
//                                         onChange={e => {
//                                             const h = hotelsForActiveDay?.find(h => h._id === e.target.value);
//                                             onDayChange('hotelDetails', {
//                                                 ...dayData?.hotelDetails,
//                                                 hotelId: e.target.value,
//                                                 hotelImage: h?.images?.[0]?.url || null,
//                                                 amenities: h?.amenities,
//                                                 hotelName: h?.hotelName ?? '',
//                                                 roomType: '',
//                                                 roomTypeId: null,
//                                             });
//                                         }}
//                                         disabled={hotelLoading}
//                                     >
//                                         <option value="">Hotel Name</option>
//                                         {(hotelsForActiveDay ?? []).map(h => <option key={h._id} value={h._id}>{h.hotelName}</option>)}
//                                     </select>
//                                     <ChevronDown size={13} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
//                                 </div>
//                             ) : (
//                                 <input type="text" style={inputStyle} placeholder="Enter hotel name"
//                                     value={dayData?.hotelDetails?.hotelName ?? ''}
//                                     onChange={e => updateHotel('hotelName', e.target.value)} />
//                             )}
//                         </div>
//                     </div>

//                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', alignItems: 'end' }}>
//                         {/* Room Type */}
//                         <div>
//                             <label style={{ ...labelStyle, color: BLUE,fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                                 <span><span style={{ marginRight: '4px' }}>🏠</span> Room Type</span>
//                             </label>
//                             {isInventory ? (
//                                 <div style={{ position: 'relative' }}>
//                                     <select
//                                         style={{ ...inputStyle, appearance: 'none', paddingRight: '32px' }}
//                                         value={dayData?.hotelDetails?.roomTypeId ?? ''}
//                                         onChange={e => updateHotel('roomType', e.target.value)}
//                                         disabled={roomTypeLoading || !dayData?.hotelDetails?.hotelId}
//                                     >
//                                         <option value="">Room Type</option>
//                                         {(roomTypesForActiveDay ?? []).map(r => <option key={r._id} value={r._id}>{r.roomName}</option>)}
//                                     </select>
//                                     <ChevronDown size={13} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
//                                 </div>
//                             ) : (
//                                 <input type="text" style={inputStyle} placeholder="Enter room type"
//                                     value={dayData?.hotelDetails?.roomType ?? ''}
//                                     onChange={e => updateHotel('roomType', e.target.value)} />
//                             )}
//                         </div>


//                         {/* Meals */}
//                         <div>
//                             <label style={{ ...labelStyle, color: BLUE }}>Meals</label>
//                             <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', paddingTop: '6px' }}>
//                                 {['Breakfast', 'Lunch', 'Dinner'].map(meal => (
//                                     <label key={meal} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#475569', cursor: 'pointer', userSelect: 'none' }}>
//                                         <input type="checkbox" checked={selectedMeals.includes(meal)} onChange={() => toggleMeal(meal)}
//                                             style={{ accentColor: PINK, width: '14px', height: '14px', cursor: 'pointer' }} />
//                                         {meal}
//                                     </label>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', alignItems: 'end' }}>

//                         {/* No of rooms (inventory only) */}
//                         {isInventory && selectedRoom?.quantity && (
//                             <div>
//                                 <label style={{ ...labelStyle, color: BLUE }}>No of Rooms</label>
//                                 <div style={{
//                                     display: 'flex', alignItems: 'center', gap: '8px',
//                                     border: '1.5px solid #e2e8f0', borderRadius: '8px',
//                                     padding: '7px 12px', background: '#f8fafc',
//                                 }}>
//                                     <span style={{
//                                         background: BLUE, color: 'white', borderRadius: '50%',
//                                         width: '20px', height: '20px', display: 'flex', alignItems: 'center',
//                                         justifyContent: 'center', fontSize: '11px', fontWeight: '700',
//                                     }}>{selectedRoom.quantity}</span>
//                                     {/* <span style={{ fontSize: '12px', color: '#64748b' }}>No of rooms</span> */}
//                                 </div>
//                             </div>
//                         )}

//                         {/* No of rooms (inventory only) */}
//                         {isInventory && selectedRoom?.quantity && (
//                             <div>
//                                 <label style={{ ...labelStyle, color: BLUE }}>Rating</label>
//                                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                                 <StarRating rating={selectedHotel.googleRating} />
//                             </div>
//                             </div>
//                         )}


//                         {/* Rating (inventory + hotel selected) */}
//                         {/* {isInventory && selectedHotel?.googleRating && (
//                             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                                 <span style={{ fontSize: '12px', fontWeight: '600', color: BLUE }}>Rating</span>
//                                 <StarRating rating={selectedHotel.googleRating} />
//                             </div>
//                         )} */}
//                     </div>



//                     {/* Amenities */}
//                     {isInventory && selectedHotel?.amenities?.length > 0 && (
//                         <div>
//                             <label style={{ ...labelStyle, color: BLUE, marginBottom: '8px' }}>Amenities</label>
//                             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
//                                 {selectedHotel.amenities.map((a, i) => <AmenityTag key={i} label={a} />)}
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* Right column: Hotel Image (inventory + hotel selected) */}
//                 {isInventory && (
//                     <div style={{ gridColumn: 'span 1' }}>
//                         {selectedHotel?.images?.[0]?.url ? (
//                             <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1.5px solid #e2e8f0' }}>
//                                 <img src={selectedHotel.images[0].url} alt="Hotel"
//                                     style={{ width: '20vw', height: '160px', objectFit: 'cover', display: 'block' }} />
//                             </div>
//                         ) : (
//                             <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1.5px solid #e2e8f0' }}>
//                                 <img src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ799fyQRixe5xOmxYZc3kAy6wgXGO-GHpHSA&s'} alt="Hotel"
//                                     style={{ width: '20vw', height: '160px', objectFit: 'cover', display: 'block' }} />
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// // ─── Places Section ───────────────────────────────────────────────────────────
// function PlacesSection({ dayData, placesForActiveDay, onDayChange }) {
//     const selectedPlaces = dayData?.placeDetails ?? [];

//     const togglePlace = (place) => {
//         const exists = selectedPlaces.find(p => p.placeId === place._id);
//         const updated = exists
//             ? selectedPlaces.filter(p => p.placeId !== place._id)
//             : [...selectedPlaces, { placeId: place._id, isFavourite: false }];
//         onDayChange('placeDetails', updated);
//     };

//     const toggleFavourite = (placeId, e) => {
//         e.stopPropagation();
//         if (!selectedPlaces.find(p => p.placeId === placeId)) return;
//         const updated = selectedPlaces.map(p => ({
//             ...p, isFavourite: p.placeId === placeId ? !p.isFavourite : false,
//         }));
//         onDayChange('placeDetails', updated);
//     };

//     const isSelected = (placeId) => selectedPlaces.some(p => p.placeId === placeId);
//     const isFavourite = (placeId) => selectedPlaces.find(p => p.placeId === placeId)?.isFavourite ?? false;

//     return (
//         <div style={{ border: '1px solid #e8edf5', borderRadius: '12px', padding: '18px', marginBottom: '20px', background: '#fdf8fb' }}>
//             <SectionHeader icon={MapPin} label="Places" />

//             {!placesForActiveDay?.length ? (
//                 <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', padding: '12px 0' }}>No places available for selected sub-regions.</p>
//             ) : (
//                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
//                     {placesForActiveDay.map(place => {
//                         const sel = isSelected(place._id);
//                         const fav = isFavourite(place._id);
//                         return (
//                             <div key={place._id} onClick={() => togglePlace(place)}
//                                 style={{
//                                     display: 'flex', gap: '10px', alignItems: 'flex-start',
//                                     border: `1.5px solid ${sel ? PINK : '#e2e8f0'}`,
//                                     borderRadius: '10px', padding: '8px', cursor: 'pointer',
//                                     background: sel ? `${PINK}08` : 'white',
//                                     transition: 'all 0.15s',
//                                     position: 'relative',
//                                 }}>
//                                 {/* Thumbnail */}
//                                 <div style={{ flexShrink: 0, width: '72px', height: '56px', borderRadius: '7px', overflow: 'hidden', background: '#f1f5f9' }}>
//                                     {place.imageUrl
//                                         ? <img src={place.imageUrl} alt={place.placeName} style={{ width: '20vw', height: '100%', objectFit: 'cover' }} />
//                                         : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}><MapPin size={20} /></div>
//                                     }
//                                 </div>

//                                 {/* Info */}
//                                 <div style={{ flex: 1, minWidth: 0 }}>
//                                     <div style={{ fontSize: '12px', fontWeight: '700', color: BLUE, marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{place.placeName}</div>
//                                     {place.subRegionId?.name && <div style={{ fontSize: '11px', color: '#64748b' }}>{place.subRegionId.name}</div>}
//                                     {place.notes && <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '1px' }}>{place.notes?.length > 15 ? `${place?.notes?.slice(0,15)}...`:place?.notes}</div>}
//                                 </div>

//                                 {/* Top-right controls */}
//                                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
//                                     <button onClick={e => { e.stopPropagation(); toggleFavourite(place._id, e); }}
//                                         style={{ background: 'none', border: 'none', cursor: sel ? 'pointer' : 'not-allowed', padding: '0', fontSize: '14px', opacity: sel ? 1 : 0.3 }}>
//                                         {fav ?<Star size={14} fill={'#f59e0b'} stroke={'#f59e0b'} /> : <Star size={14} fill={'none'} stroke={'#d1d5db'} />}
//                                     </button>
//                                     <input type="checkbox" checked={sel} onChange={() => togglePlace(place)}
//                                         onClick={e => e.stopPropagation()}
//                                         style={{ accentColor: PINK, width: '13px', height: '13px', cursor: 'pointer' }} />
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             )}
//         </div>
//     );
// }

// // ─── Activities Section ───────────────────────────────────────────────────────
// function ActivitiesSection({ dayData, activitiesForActiveDay, onDayChange }) {
//     const activities = dayData?.activities ?? [
//         { activityType: 'inventory', activityId: '', activityName: '', isComplimentary: false, price: 0 }
//     ];

//     const updateActivity = (index, updates) => {
//         onDayChange('activities', activities.map((a, i) => i === index ? { ...a, ...updates } : a));
//     };

//     const addActivity = () => {
//         onDayChange('activities', [...activities, { activityType: 'inventory', activityId: '', activityName: '', isComplimentary: false, price: 0 }]);
//     };

//     const removeActivity = (index) => {
//         if (activities.length === 1) return;
//         onDayChange('activities', activities.filter((_, i) => i !== index));
//     };

//     const handleNameChange = (index, value) => {
//         const found = activitiesForActiveDay?.find(a => a.activityName.toLowerCase() === value.toLowerCase());
//         if (found) {
//             updateActivity(index, { activityName: found.activityName, activityId: found._id, activityType: 'inventory', ...(!activities[index].isComplimentary && { price: found.price ?? 0 }) });
//         } else {
//             updateActivity(index, { activityName: value, activityId: '', activityType: 'manual' });
//         }
//     };

//     return (
//         <div style={{ border: '1px solid #e8edf5', borderRadius: '12px', padding: '18px', marginBottom: '20px', background: '#f8fbff' }}>
//             <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', position: 'relative' }}>
//                 <div style={{
//                     display: 'inline-flex', alignItems: 'center', gap: '8px',
//                     background: BLUE, color: 'white',
//                     padding: '8px 28px', borderRadius: '8px',
//                     fontSize: '14px', fontWeight: '700',
//                 }}>
//                     <Zap size={15} /> Activities
//                 </div>
//                 <button onClick={addActivity}
//                     style={{
//                         position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
//                         background: 'none', border: 'none', color: PINK,
//                         fontSize: '12px', fontWeight: '700', cursor: 'pointer',
//                         display: 'flex', alignItems: 'center', gap: '3px',
//                     }}>
//                     <Plus size={14} /> Add Activity
//                 </button>
//             </div>

//             <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
//                 {activities.map((act, index) => (
//                     <div key={index} style={{ border: '1.5px solid #e8edf5', borderRadius: '10px', padding: '12px 14px', background: 'white' }}>
//                         <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
//                             {/* Name */}
//                             <div style={{ flex: 2, minWidth: '140px' }}>
//                                 <input type="text" list={`activity-list-${index}`} style={{ ...inputStyle }}
//                                     placeholder="Enter activity name"
//                                     value={act.activityName}
//                                     onChange={e => handleNameChange(index, e.target.value)} />
//                                 <datalist id={`activity-list-${index}`}>
//                                     {(activitiesForActiveDay ?? []).map(a => <option key={a._id} value={a.activityName} />)}
//                                 </datalist>
//                             </div>

//                             {/* Price */}
//                             {!act.isComplimentary && (
//                                 <div style={{
//                                     flex: 1, minWidth: '100px', display: 'flex', alignItems: 'center',
//                                     gap: '6px', border: '1.5px solid #e2e8f0', borderRadius: '8px',
//                                     padding: '0 10px', height: '38px', background: 'white',
//                                 }}>
//                                     <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>₹</span>
//                                     <input type="number" min={0}
//                                         style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13px', color: '#334155' }}
//                                         value={act.price ?? 0}
//                                         onChange={e => updateActivity(index, { price: Number(e.target.value) })} />
//                                 </div>
//                             )}

//                             {/* Delete */}
//                             <button onClick={() => removeActivity(index)} disabled={activities.length === 1}
//                                 style={{ background: 'none', border: 'none', cursor: activities.length === 1 ? 'not-allowed' : 'pointer', opacity: activities.length === 1 ? 0.3 : 1, padding: '4px', color: '#ef4444' }}>
//                                 <Trash2 size={15} />
//                             </button>
//                         </div>

//                         <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px', flexWrap: 'wrap' }}>
//                             <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#475569', cursor: 'pointer', userSelect: 'none' }}>
//                                 <input type="checkbox" checked={act.isComplimentary ?? false}
//                                     onChange={e => updateActivity(index, { isComplimentary: e.target.checked, price: e.target.checked ? null : 0 })}
//                                     style={{ accentColor: PINK, width: '13px', height: '13px', cursor: 'pointer' }} />
//                                 Complimentary
//                             </label>
//                             {!act.isComplimentary && (
//                                 <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>
//                                     Paid Activity
//                                 </span>
//                             )}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// // ─── Main ItineraryBuilder ────────────────────────────────────────────────────
// function ItineraryBuilder({
//     formData,
//     activeDay,
//     setActiveDay,
//     allSubRegions,
//     hotelsForActiveDay,
//     placesForActiveDay,
//     activitiesForActiveDay,
//     roomTypesForActiveDay,
//     subRegionLoading,
//     hotelLoading,
//     placeLoading,
//     activityLoading,
//     roomTypeLoading,
//     handleItineraryChange,
//     handleSave,
//     submitLoading
// }) {
//     const { itineraryBuilder, regionDetails } = formData;
//     const { fromDate } = regionDetails ?? {};
//     const numDays = itineraryBuilder?.daysDetails?.length ?? 0;
//     const currentDay = itineraryBuilder?.daysDetails?.[activeDay - 1];

//     const updateDayField = (field, value) => {
//         if (value === '') value = null;
//         let updates = { [field]: value };
//         if (field === 'subRegion1' && !value) updates = { subRegion1: null, subRegion2: null, subRegion3: null };
//         else if (field === 'subRegion2' && !value) updates = { subRegion2: null, subRegion3: null };
//         handleItineraryChange(activeDay - 1, updates);
//     };

//     useEffect(() => {
//         if (!placesForActiveDay || !currentDay) return;
//         const ids = new Set(placesForActiveDay.map(p => p._id));
//         handleItineraryChange(activeDay - 1, { placeDetails: currentDay.placeDetails?.filter(d => ids.has(d.placeId)) });
//     }, [placesForActiveDay]);

//     useEffect(() => {
//         if (!activitiesForActiveDay || !currentDay) return;
//         const ids = new Set(activitiesForActiveDay.map(p => p._id));
//         handleItineraryChange(activeDay - 1, { activities: currentDay.activities?.filter(d => !d.activityId || ids.has(d.activityId)) });
//     }, [activitiesForActiveDay]);

//     useEffect(() => {
//         if (!hotelsForActiveDay || !currentDay) return;
//         const ids = new Set(hotelsForActiveDay.map(h => h._id));
//         const curr = currentDay?.hotelDetails;
//         if (curr && !ids.has(curr.hotelId)) {
//             handleItineraryChange(activeDay - 1, { hotelDetails: { hotelType: 'inventory', hotelId: null, hotelName: '', roomTypeId: null, roomType: '', meals: '' } });
//         }
//     }, [hotelsForActiveDay]);

//     return (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

//             {/* Trip Overview */}
//             <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e8edf5', padding: '20px' }}>
//                 <div style={{ fontSize: '16px', fontWeight: '700', color: BLUE, marginBottom: '12px' }}>Trip Overview</div>
//                 <textarea
//                     style={{ ...inputStyle, resize: 'vertical', minHeight: '70px', lineHeight: '1.6' }}
//                     placeholder="Describe the overall trip experience..."
//                     value={itineraryBuilder?.tripOverview ?? ''}
//                     onChange={e => handleItineraryChange(null, 'tripOverview', e.target.value)}
//                 />
//             </div>

//             {/* Days layout */}
//             <div style={{ display: 'flex', background: 'white', borderRadius: '12px', border: '1px solid #e8edf5', overflow: 'hidden' }} className="day-layout">

//                 {/* Sidebar (desktop) */}
//                 <div style={{ background: BLUE, width: '130px', flexShrink: 0, padding: '10px 0', display: 'flex', flexDirection: 'column', gap: '2px' }} className="day-sidebar">
//                     {Array.from({ length: numDays }, (_, i) => {
//                         const dayNum = i + 1;
//                         const dow = getDayOfWeek(fromDate, i);
//                         const isActive = activeDay === dayNum;
//                         return (
//                             <button key={dayNum} onClick={() => setActiveDay(dayNum)}
//                                 style={{
//                                     background: isActive ? '#f8f4f9' : 'transparent',
//                                     border: 'none', borderRadius: isActive ? '20px 0 0 20px' : '0',
//                                     margin: isActive ? '0 0 0 8px' : '0',
//                                     padding: '10px 8px', cursor: 'pointer', textAlign: 'center',
//                                 }}>
//                                 <div style={{ fontSize: '13px', fontWeight: '800', color: isActive ? BLUE : 'white' }}>Day {dayNum}</div>
//                                 <div style={{ fontSize: '10px', color: isActive ? '#64748b' : 'rgba(255,255,255,0.6)', marginTop: '2px' }}>{dow}</div>
//                             </button>
//                         );
//                     })}
//                 </div>

//                 {/* Tab bar (mobile) */}
//                 <div style={{ display: 'none', background: BLUE, overflowX: 'auto', padding: '8px', gap: '6px', borderRadius: '12px 12px 0 0' }} className="day-tabs">
//                     {Array.from({ length: numDays }, (_, i) => {
//                         const dayNum = i + 1;
//                         const dow = getDayOfWeek(fromDate, i);
//                         const isActive = activeDay === dayNum;
//                         return (
//                             <button key={dayNum} onClick={() => setActiveDay(dayNum)}
//                                 style={{ flexShrink: 0, background: isActive ? '#f8f4f9' : 'transparent', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', minWidth: '66px' }}>
//                                 <div style={{ fontSize: '12px', fontWeight: '700', color: isActive ? BLUE : 'white' }}>Day {dayNum}</div>
//                                 <div style={{ fontSize: '10px', color: isActive ? '#64748b' : 'rgba(255,255,255,0.55)' }}>{dow}</div>
//                             </button>
//                         );
//                     })}
//                 </div>

//                 {/* Day content */}
//                 <div style={{ flex: 1, padding: '20px', overflowX: 'hidden', minWidth: 0 }}>
//                     {/* Day Overview */}
//                     <div style={{ marginBottom: '20px' }}>
//                         <label style={{ ...labelStyle, color: BLUE, fontSize: '13px' }}>Day Overview</label>
//                         <textarea
//                             style={{
//                                 ...inputStyle, resize: 'none', minHeight: '44px',
//                                 padding: '10px 20px', borderRadius: '9999px',
//                                 border: '1px solid rgba(0,0,0,0.12)',
//                                 boxShadow: 'inset 0px 2px 6px rgba(0,0,0,0.07)',
//                                 lineHeight: '1.4', fontSize: '13px',
//                             }}
//                             placeholder="Experience the magic of Bali with our curated group trip..."
//                             value={currentDay?.dayOverview ?? ''}
//                             onChange={e => updateDayField('dayOverview', e.target.value)}
//                         />
//                     </div>

//                     <SubRegionDropdowns dayData={currentDay} allSubRegions={allSubRegions} onDayChange={updateDayField} subRegionLoading={subRegionLoading} />
//                     <HotelDetails dayData={currentDay} hotelsForActiveDay={hotelsForActiveDay} roomTypesForActiveDay={roomTypesForActiveDay} hotelLoading={hotelLoading} roomTypeLoading={roomTypeLoading} onDayChange={updateDayField} />
//                     <PlacesSection dayData={currentDay} placesForActiveDay={placesForActiveDay} onDayChange={updateDayField} />
//                     <ActivitiesSection dayData={currentDay} activitiesForActiveDay={activitiesForActiveDay} onDayChange={updateDayField} />
//                 </div>
//             </div>

//             {/* Save */}
//             <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
//                 <button type="button" onClick={handleSave} disabled={submitLoading}
//                     className={`flex items-center gap-2 px-6 py-2.5 bg-[#E91E8C] text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-pink-200 ${submitLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-pink-600'}`}>
//                     {submitLoading
//                         ? <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" /></svg>
//                         : <Save size={16} />}
//                     {submitLoading ? 'Saving...' : 'Save'}
//                 </button>
//             </div>

//             <style>{`
//                 .day-sidebar { display: flex !important; }
//                 .day-tabs    { display: none  !important; }
//                 .day-layout  { flex-direction: row !important; }

//                 @media (max-width: 640px) {
//                     .day-sidebar { display: none  !important; }
//                     .day-tabs    { display: flex  !important; }
//                     .day-layout  { flex-direction: column !important; }
//                 }
//             `}</style>
//         </div>
//     );
// }

// export default ItineraryBuilder;















// import React, { useEffect, useMemo } from 'react';
// import { inputStyle, labelStyle, cardStyle, cardStyleHotel } from '../../Common/CommonCss';
// import { Save } from 'lucide-react';
// import { BlueButton } from '../Buttons';

// const PINK = '#ED5F8D';
// const BLUE = '#18305C';

// // ─── helpers ──────────────────────────────────────────────────────────────────

// const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// function getDayOfWeek(fromDate, dayIndex) {
//     if (!fromDate) return '';
//     const d = new Date(fromDate);
//     d.setDate(d.getDate() + dayIndex);
//     return DAY_NAMES[d.getDay()];
// }

// // ─── sub-components ───────────────────────────────────────────────────────────

// function SubRegionDropdowns({ dayData, allSubRegions, onDayChange, subRegionLoading }) {
//     const getFiltered = (excludeKeys) => {
//         const excluded = excludeKeys.map(k => dayData?.[k]).filter(Boolean);
//         return (allSubRegions ?? []).filter(s => !excluded.includes(s._id));
//     };

//     const fields = [
//         { key: 'subRegion1', label: 'Sub- Region  01', exclude: ['subRegion2', 'subRegion3'], dependsOn: null },
//         { key: 'subRegion2', label: 'Sub- Region  02', exclude: ['subRegion1', 'subRegion3'], dependsOn: 'subRegion1' },
//         { key: 'subRegion3', label: 'Sub- Region  03', exclude: ['subRegion1', 'subRegion2'], dependsOn: 'subRegion2' },
//     ];

//     return (
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
//             {fields.map(({ key, label, exclude, dependsOn }) => {
//                 const isLocked = dependsOn && !dayData?.[dependsOn];
//                 return (
//                     <div key={key}>
//                         <label style={{ ...labelStyle, color: isLocked ? '#bbb' : BLUE, fontWeight: '700' }}>{label}</label>
//                         <div style={{ position: 'relative' }}>
//                             <select
//                                 style={{
//                                     ...inputStyle,
//                                     appearance: 'none',
//                                     paddingRight: '32px',
//                                     background: isLocked ? '#f5f5f5' : 'white',
//                                     color: isLocked ? '#bbb' : '#333',
//                                     cursor: isLocked ? 'not-allowed' : 'pointer',
//                                 }}
//                                 value={dayData?.[key] ?? ''}
//                                 onChange={e => onDayChange(key, e.target.value)}
//                                 disabled={subRegionLoading || isLocked}
//                             >
//                                 <option value="">
//                                     {isLocked ? `Select Sub-Region ${fields.findIndex(f => f.key === dependsOn) + 1} first` : 'e.g. Aasam'}
//                                 </option>
//                                 {!isLocked && getFiltered(exclude).map(s => (
//                                     <option key={s._id} value={s._id}>{s.name}</option>
//                                 ))}
//                             </select>
//                             <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: isLocked ? '#ccc' : '#aaa', pointerEvents: 'none' }}>▼</span>
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );

// }

// function HotelDetails({ dayData, hotelsForActiveDay, roomTypesForActiveDay, hotelLoading, roomTypeLoading, onDayChange }) {
//     const hotelType = dayData?.hotelDetails?.hotelType ?? 'inventory';
//     const isInventory = hotelType === 'inventory';


//     const updateHotel = (field, value) => {
//         if (field === 'roomType') {
//             if (isInventory) {
//                 const findRoom = roomTypesForActiveDay?.find(r => r._id === value);
//                 onDayChange('hotelDetails', {
//                     ...dayData?.hotelDetails,
//                     roomTypeId: value,
//                     roomType: findRoom?.roomName ?? '',
//                 });
//             } else {
//                 // Manual — only store the typed name, clear any old inventory id
//                 onDayChange('hotelDetails', {
//                     ...dayData?.hotelDetails,
//                     roomTypeId: null,
//                     roomType: value,
//                 });
//             }
//         } else {
//             onDayChange('hotelDetails', {
//                 ...dayData?.hotelDetails,
//                 [field]: value,
//             });
//         }
//     };
//     const toggleMeal = (meal) => {
//         const current = dayData?.hotelDetails?.meals ?? '';
//         const meals = current ? current.split(',').map(m => m.trim()) : [];
//         const updated = meals.includes(meal) ? meals.filter(m => m !== meal) : [...meals, meal];
//         updateHotel('meals', updated.join(', '));
//     };

//     const selectedMeals = (dayData?.hotelDetails?.meals ?? '').split(',').map(m => m.trim()).filter(Boolean);

//     const selectedHotel = hotelsForActiveDay?.find(h => h._id === dayData?.hotelDetails?.hotelId);
//     const selectedRoom = roomTypesForActiveDay?.find(r=>r?._id ===dayData?.hotelDetails?.roomTypeId)
//     // console.log("selected room : ",selectedHotel)

//     return (
//         <div style={{  ...cardStyleHotel, border: '1px solid #eee', borderRadius: '10px', padding: '18px', marginBottom: '20px' }}>
//             <div className='flex justify-center'>
//                 <BlueButton text='Hotel'/>
//             </div>
//             {/* Header with toggle */}
//             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', flexWrap: 'wrap' }}>
//                 {/* <span style={{ fontSize: '15px', fontWeight: '700', color: BLUE }}>Hotel Details</span> */}
//                 <div style={{ display: 'flex', gap: '6px' }}>
//                     <button
//                         onClick={() => updateHotel('hotelType', 'inventory')}
//                         style={{
//                             padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600',
//                             border: 'none', cursor: 'pointer',
//                             background: isInventory ? '#e8f5e9' : 'transparent',
//                             color: isInventory ? '#2e7d32' : '#aaa',
//                             border: isInventory ? '1px solid #a5d6a7' : '1px solid #ddd',
//                         }}
//                     >
//                         Inventory
//                     </button>
//                     <button
//                         onClick={() => updateHotel('hotelType', 'manual')}
//                         style={{
//                             padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600',
//                             border: 'none', cursor: 'pointer',
//                             background: !isInventory ? PINK : 'transparent',
//                             color: !isInventory ? 'white' : '#aaa',
//                             border: !isInventory ? `1px solid ${PINK}` : '1px solid #ddd',
//                         }}
//                     >
//                         Manual
//                     </button>
//                 </div>
//             </div>

//             <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', alignItems: 'start' }}>
//                 {/* Hotel Name */}
//                 <div>
//                     <label style={{ ...labelStyle, color: BLUE, fontWeight: '700' }}>Hotel Name</label>
//                     {isInventory ? (
//                         <div style={{ position: 'relative' }}>
//                             <select
//                                 style={{ ...inputStyle, appearance: 'none', paddingRight: '32px' }}
//                                 value={dayData?.hotelDetails?.hotelId ?? ''}
//                                 onChange={e => {
//                                     const h = hotelsForActiveDay?.find(h => h._id === e.target.value);
//                                     onDayChange('hotelDetails', {
//                                         ...dayData?.hotelDetails,
//                                         hotelId: e.target.value,
//                                         hotelImage:h?.images?.[0]?.url||null,
//                                         amenities:h?.amenities,
//                                         hotelName: h?.hotelName ?? '',
//                                         roomType: '',
//                                     });
//                                 }}
//                                 disabled={hotelLoading}
//                             >
//                                 <option value="">Hotel Name</option>
//                                 {(hotelsForActiveDay ?? []).map(h => (
//                                     <option key={h._id} value={h._id}>{h.hotelName}</option>
//                                 ))}
//                             </select>
//                             <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#aaa', pointerEvents: 'none' }}>▼</span>
//                         </div>
//                     ) : (
//                         <input
//                             type="text"
//                             style={inputStyle}
//                             placeholder="Enter hotel name"
//                             value={dayData?.hotelDetails?.hotelName ?? ''}
//                             onChange={e => updateHotel('hotelName', e.target.value)}
//                         />
//                     )}
//                 </div>

//                 {/* Room Type */}
//                 <div>
//                     <label style={{ ...labelStyle, color: BLUE, fontWeight: '700' }}>Room Type</label>
//                     {isInventory ? (
//                         <div style={{ position: 'relative' }}>
//                             <select
//                                 style={{ ...inputStyle, appearance: 'none', paddingRight: '32px' }}
//                                 value={dayData?.hotelDetails?.roomTypeId ?? ''}
//                                 onChange={e => updateHotel('roomType', e.target.value)}
//                                 disabled={roomTypeLoading || !dayData?.hotelDetails?.hotelId}
//                             >
//                                 <option value="">Room Type</option>
//                                 {(roomTypesForActiveDay ?? []).map(r => (
//                                     <option key={r._id} value={r._id}>{r.roomName}</option>
//                                 ))}
//                             </select>
//                             <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#aaa', pointerEvents: 'none' }}>▼</span>
//                         </div>
//                     ) : (
//                         <input
//                             type="text"
//                             style={inputStyle}
//                             placeholder="Enter room type"
//                             value={dayData?.hotelDetails?.roomType ?? ''}
//                             onChange={e => updateHotel('roomType', e.target.value)}
//                         />
//                     )}
//                 </div>

//                 {/* Meals */}
//                 <div>
//                     <label style={{ ...labelStyle, color: BLUE, fontWeight: '700' }}>Meals</label>
//                     <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', paddingTop: '6px' }}>
//                         {['Breakfast', 'Lunch', 'Dinner'].map(meal => (
//                             <label key={meal} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#444', cursor: 'pointer', userSelect: 'none' }}>
//                                 <input
//                                     type="checkbox"
//                                     checked={selectedMeals.includes(meal)}
//                                     onChange={() => toggleMeal(meal)}
//                                     style={{ accentColor: PINK, width: '15px', height: '15px', cursor: 'pointer' }}
//                                 />
//                                 {meal}
//                             </label>
//                         ))}
//                     </div>
//                 </div>

//                 <div>
//                     <img src={selectedHotel?.images?.[0]?.url} alt="Hotel Image" />
//                 </div>
//                 <div>
//                     Room  Quantity : {selectedRoom?.quantity}
//                 </div>
//                 <div>
//                     Hotel Rating : {selectedHotel?.googleRating}
//                 </div>
//                 <div className='flex gap-3 '>
//                     {selectedHotel?.amenities?.map((val)=>{
//                         return <div className='border border-pink-500 px-4 py-2 rounded-lg text-sm'>{val}</div>
//                     })}
//                 </div>
//             </div>
//         </div>
//     );
// }

// function PlacesSection({ dayData, placesForActiveDay, onDayChange }) {
//     const selectedPlaces = dayData?.placeDetails ?? [];

//     const togglePlace = (place) => {
//         const exists = selectedPlaces.find(p => p.placeId === place._id);
//         let updated;
//         if (exists) {
//             updated = selectedPlaces.filter(p => p.placeId !== place._id);
//         } else {
//             updated = [...selectedPlaces, { placeId: place._id, isFavourite: false }];
//         }
//         onDayChange('placeDetails', updated);
//     };

//     const toggleFavourite = (placeId) => {
//         const isChecked = selectedPlaces.find(p => p.placeId === placeId);
//         if (!isChecked) return;
//         const updated = selectedPlaces.map(p => ({
//             ...p,
//             isFavourite: p.placeId === placeId ? !p.isFavourite : false,
//         }));
//         onDayChange('placeDetails', updated);
//     };

//     const isSelected = (placeId) => selectedPlaces.some(p => p.placeId === placeId);
//     const isFavourite = (placeId) => selectedPlaces.find(p => p.placeId === placeId)?.isFavourite ?? false;

//     if (!placesForActiveDay?.length) return (
//         <div style={{ marginBottom: '20px' }}>
//             <label style={{ ...labelStyle, color: BLUE, fontWeight: '700', fontSize: '15px' }}>Places</label>
//             <p style={{ fontSize: '13px', color: '#aaa' }}>No places available for selected sub-regions.</p>
//         </div>
//     );

//     // console.log("active place : ",placesForActiveDay)
//     return (
//         <div style={{ marginBottom: '20px' }}>
//             <label style={{ ...labelStyle, color: BLUE, fontWeight: '700', fontSize: '15px' }}>Places</label>
//             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
//                 {placesForActiveDay?.map(place => (
//                     <div
//                         key={place._id}
//                         style={{
//                             display: 'flex', alignItems: 'center', gap: '8px',
//                             border: `1.5px solid ${isSelected(place._id) ? PINK : '#ddd'}`,
//                             borderRadius: '8px', padding: '7px 12px',
//                             background: isSelected(place._id) ? '#fff0f5' : 'white',
//                             cursor: 'pointer', userSelect: 'none',
//                         }}
//                         onClick={() => togglePlace(place)}
//                     >
//                         <input
//                             type="checkbox"
//                             checked={isSelected(place._id)}
//                             onChange={() => togglePlace(place)}
//                             onClick={e => e.stopPropagation()}
//                             style={{ accentColor: PINK, width: '14px', height: '14px', cursor: 'pointer' }}
//                         />
//                         <span style={{ fontSize: '13px', fontWeight: '500', color: BLUE }}>{place.placeName}</span>
//                         <div className='flex flex-col '>
//                             <span style={{ fontSize: '13px', fontWeight: '500', color: BLUE }}>{place.subRegionId?.name}</span>
//                             <span style={{ fontSize: '13px', fontWeight: '500', color: BLUE }}>{place?.notes}</span>
//                             <img src={place?.imageUrl} alt="place image" className='w-[100px]' />
//                         </div>
//                         <button
//                             onClick={e => { e.stopPropagation(); if (isSelected(place._id)) toggleFavourite(place._id); }}
//                             title={isSelected(place._id) ? 'Mark as favourite' : 'Select place first'}
//                             style={{
//                                 background: 'none', border: 'none', cursor: isSelected(place._id) ? 'pointer' : 'not-allowed',
//                                 padding: '0', fontSize: '15px', lineHeight: 1,
//                                 opacity: isSelected(place._id) ? 1 : 0.35,
//                                 color: isFavourite ? '#FFD700' : '#ddd'
//                             }}
//                         >
//                             {isFavourite(place._id) ? '★' : '☆'}
//                         </button>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }


// function ActivitiesSection({ dayData, activitiesForActiveDay, onDayChange }) {
//     const activities = dayData?.activities ?? [
//         { activityType: 'inventory', activityId: '', activityName: '', isComplimentary: false, price: 0 }
//     ];

//     // Single-call update — patches multiple fields at once, no stale closure
//     const updateActivity = (index, updates) => {
//         const updated = activities.map((a, i) =>
//             i === index ? { ...a, ...updates } : a
//         );
//         onDayChange('activities', updated);
//     };

//     const addActivity = () => {
//         onDayChange('activities', [
//             ...activities,
//             { activityType: 'inventory', activityId: '', activityName: '', isComplimentary: false, price: 0 }
//         ]);
//     };

//     const removeActivity = (index) => {
//         if (activities.length === 1) return;
//         onDayChange('activities', activities.filter((_, i) => i !== index));
//     };

//     const handleNameChange = (index, value) => {
//         const found = activitiesForActiveDay?.find(
//             a => a.activityName.toLowerCase() === value.toLowerCase()
//         );

//         if (found) {
//             // Matched an inventory item — autofill everything
//             updateActivity(index, {
//                 activityName: found.activityName,
//                 activityId: found._id,
//                 activityType: 'inventory',
//                 // Only set price if not complimentary
//                 ...(!activities[index].isComplimentary && { price: found.price ?? 0 }),
//             });
//         } else {
//             // User is typing freely — manual mode, clear the inventory link
//             updateActivity(index, {
//                 activityName: value,
//                 activityId: '',
//                 activityType: 'manual',
//             });
//         }
//     };

//     return (
//         <div style={{ marginBottom: '8px' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
//                 <label style={{ ...labelStyle, color: BLUE, fontWeight: '700', fontSize: '15px', marginBottom: 0 }}>
//                     Activities
//                 </label>
//                 <button
//                     onClick={addActivity}
//                     style={{ background: 'none', border: 'none', color: PINK, fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
//                 >
//                     + Add Activity
//                 </button>
//             </div>

//             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//                 {activities.map((act, index) => (
//                     <div key={index} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '14px' }}>

//                         {/* Row 1: name + price + delete */}
//                         <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>

//                             {/* Activity name — free-type with suggestions */}
//                             <div style={{ flex: 2, minWidth: '140px' }}>
//                                 <input
//                                     type="text"
//                                     list={`activity-list-${index}`}
//                                     style={{ ...inputStyle }}
//                                     placeholder="Enter or search activity name"
//                                     // KEY FIX: uncontrolled-style — use defaultValue on mount,
//                                     // keep it controlled so we can clear it, but don't lock on re-render
//                                     value={act.activityName}
//                                     onChange={e => handleNameChange(index, e.target.value)}
//                                 />
//                                 <datalist id={`activity-list-${index}`}>
//                                     {(activitiesForActiveDay ?? []).map(a => (
//                                         <option key={a._id} value={a.activityName} />
//                                     ))}
//                                 </datalist>
//                             </div>

//                             {/* Price — hidden when complimentary */}
//                             {!act.isComplimentary && (
//                                 <div style={{
//                                     flex: 1, minWidth: '110px', display: 'flex', alignItems: 'center',
//                                     gap: '6px', border: '1.5px solid #ddd', borderRadius: '6px',
//                                     padding: '0 10px', height: '38px', background: 'white'
//                                 }}>
//                                     <span style={{ fontSize: '14px', color: '#555' }}>₹</span>
//                                     <input
//                                         type="number"
//                                         min={0}
//                                         style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', color: '#333' }}
//                                         value={act.price ?? 0}
//                                         onChange={e => updateActivity(index, { price: Number(e.target.value) })}
//                                     />
//                                 </div>
//                             )}

//                             {/* Delete */}
//                             <button
//                                 onClick={() => removeActivity(index)}
//                                 disabled={activities.length === 1}
//                                 style={{
//                                     background: 'none', border: 'none',
//                                     cursor: activities.length === 1 ? 'not-allowed' : 'pointer',
//                                     opacity: activities.length === 1 ? 0.35 : 1,
//                                     fontSize: '16px', color: '#e53935'
//                                 }}
//                                 title="Remove activity"
//                             >
//                                 🗑
//                             </button>
//                         </div>

//                         {/* Row 2: Complimentary + badge */}
//                         <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px', flexWrap: 'wrap' }}>
//                             <label style={{
//                                 display: 'flex', alignItems: 'center', gap: '6px',
//                                 fontSize: '13px', color: '#444', cursor: 'pointer', userSelect: 'none'
//                             }}>
//                                 <input
//                                     type="checkbox"
//                                     checked={act.isComplimentary ?? false}
//                                     onChange={e => {
//                                         const isNowComplimentary = e.target.checked;
//                                         updateActivity(index, {
//                                             isComplimentary: isNowComplimentary,
//                                             price: isNowComplimentary ? null : 0,
//                                         });
//                                     }}
//                                     style={{ accentColor: PINK, width: '14px', height: '14px', cursor: 'pointer' }}
//                                 />
//                                 Complimentary
//                             </label>

//                             {!act.isComplimentary && (
//                                 <span style={{
//                                     background: '#e3f2fd', color: '#1565c0',
//                                     fontSize: '12px', fontWeight: '600',
//                                     padding: '3px 12px', borderRadius: '12px'
//                                 }}>
//                                     Paid Activity
//                                 </span>
//                             )}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// function ItineraryBuilder({
//     formData,
//     activeDay,
//     setActiveDay,
//     allSubRegions,
//     hotelsForActiveDay,
//     placesForActiveDay,
//     activitiesForActiveDay,
//     roomTypesForActiveDay,
//     subRegionLoading,
//     hotelLoading,
//     placeLoading,
//     activityLoading,
//     roomTypeLoading,
//     handleItineraryChange,
//     handleSave,
//     submitLoading
// }) {
//     const { itineraryBuilder, regionDetails } = formData;
//     const { fromDate } = regionDetails ?? {};
//     const numDays = itineraryBuilder?.daysDetails?.length ?? 0;
//     const currentDay = itineraryBuilder?.daysDetails?.[activeDay - 1];

//     const updateDayField = (field, value) => {
//         if (value === '') {
//             value = null
//         }
//         let updates = { [field]: value };


//         // If clearing a subregion, cascade-clear the dependent ones
//         if (field === 'subRegion1' && !value) {
//             updates = { subRegion1: null, subRegion2: null, subRegion3: null };

//         } else if (field === 'subRegion2' && !value) {
//             updates = { subRegion2: null, subRegion3: null };
//         }


//         // Apply all updates at once
//         handleItineraryChange(activeDay - 1, updates);
//     };

//     useEffect(() => {
//         if (!placesForActiveDay || !currentDay) return;

//         const activePlaceIds = new Set(
//             placesForActiveDay.map(p => p._id)
//         );

//         const filteredPlaceDetails = currentDay.placeDetails?.filter(detail =>
//             activePlaceIds.has(detail.placeId)
//         );

//         handleItineraryChange(activeDay - 1, {
//             placeDetails: filteredPlaceDetails
//         });

//     }, [placesForActiveDay]);

//     useEffect(() => {
//         if (!activitiesForActiveDay || !currentDay) return;

//         const activeActivitesIds = new Set(
//             activitiesForActiveDay.map(p => p._id)
//         );

//         const filteredActivitiesDetails = currentDay.activities?.filter(detail => {
//             // keep manual activities
//             if (!detail.activityId) return true;

//             // keep only if exists in active list
//             return activeActivitesIds.has(detail.activityId);
//         });

//         handleItineraryChange(activeDay - 1, {
//             activities: filteredActivitiesDetails
//         });

//     }, [activitiesForActiveDay]);

//     useEffect(() => {
//         if (!hotelsForActiveDay || !currentDay) return;

//         const activeHotelIds = new Set(
//             hotelsForActiveDay.map(h => h._id)
//         );

//         const currentHotel = currentDay?.hotelDetails;

//         let updatedHotelDetails = currentHotel;

//         // If hotel exists but is NOT in active list → remove it
//         if (currentHotel && !activeHotelIds.has(currentHotel.hotelId)) {
//             updatedHotelDetails = {
//                 hotelType: 'inventory',
//                 hotelId: null,
//                 hotelName: '',
//                 roomTypeId: null,
//                 roomType: '',
//                 meals: '',
//             };
//         }

//         handleItineraryChange(activeDay - 1, {
//             hotelDetails: updatedHotelDetails
//         });

//     }, [hotelsForActiveDay]);

//     return (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

//             {/* Trip Overview card */}
//             <div style={{ ...cardStyle }}>
//                 <div style={{ fontSize: '18px', fontWeight: '700', color: BLUE, marginBottom: '12px' }}>Trip Overview</div>
//                 <textarea
//                     style={{ ...inputStyle, resize: 'vertical', minHeight: '70px', lineHeight: '1.6' }}
//                     placeholder="Describe the overall trip experience..."
//                     value={itineraryBuilder?.tripOverview ?? ''}
//                     onChange={e => handleItineraryChange(null, 'tripOverview', e.target.value)}
//                 />
//             </div>

//             {/* Days layout: sidebar + content */}
//             {/* Outer wrapper — flex row on desktop, flex column on mobile */}
//             <div style={{
//                 display: 'flex',
//                 flexDirection: 'column',   // mobile: stack tabs on top, content below
//                 background: 'white',
//                 borderRadius: '10px',
//                 border: '1px solid #eee',
//                 overflow: 'hidden',
//             }}>

//                 {/* ── MOBILE: horizontal scrollable tab bar ── */}
//                 <div style={{
//                     display: 'none',  // overridden by media query below
//                     background: BLUE,
//                     overflowX: 'auto',
//                     padding: '8px',
//                     gap: '6px',
//                     borderRadius: '10px 10px 0 0',
//                 }} className="day-tabs-mobile">
//                     {Array.from({ length: numDays }, (_, i) => {
//                         const dayNum = i + 1;
//                         const dow = getDayOfWeek(fromDate, i);
//                         const isActive = activeDay === dayNum;
//                         return (
//                             <button
//                                 key={dayNum}
//                                 onClick={() => setActiveDay(dayNum)}
//                                 style={{
//                                     flexShrink: 0,
//                                     background: isActive ? "#FEF4F8" : 'transparent',
//                                     border: 'none',
//                                     borderRadius: '8px',
//                                     padding: '8px 16px',
//                                     cursor: 'pointer',
//                                     textAlign: 'center',
//                                     minWidth: '70px',
//                                 }}
//                             >
//                                 <div style={{ fontSize: '13px', fontWeight: '700', color: 'white', whiteSpace: 'nowrap' }}>Day {dayNum}</div>
//                                 <div style={{ fontSize: '10px', color: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)', marginTop: '2px' }}>{dow}</div>
//                             </button>
//                         );
//                     })}
//                 </div>

//                 {/* ── DESKTOP: vertical sidebar + content side by side ── */}
//                 <div style={{ display: 'flex', flex: 1 }} className="day-layout-desktop">

//                     {/* Sidebar */}
//                     <div style={{
//                         background: BLUE,
//                         borderRadius: '10px 0 0 10px',
//                         padding: '8px 0',
//                         width: '140px',
//                         flexShrink: 0,
//                         display: 'flex',
//                         flexDirection: 'column',
//                         gap: '2px',
//                     }} className="day-sidebar-desktop">
//                         {Array.from({ length: numDays }, (_, i) => {
//                             const dayNum = i + 1;
//                             const dow = getDayOfWeek(fromDate, i);
//                             const isActive = activeDay === dayNum;
//                             return (
//                                 <button
//                                     key={dayNum}
//                                     onClick={() => setActiveDay(dayNum)}
//                                     style={{
//                                         background: isActive ? '#FEF4F8' : 'transparent',
//                                         color: isActive ? BLUE : 'white',

//                                         border: 'none',
//                                         borderRadius: isActive ? '20px 0 0 20px' : '0',
//                                         margin: isActive ? '0 0 0 8px' : '0',
//                                         padding: '8px 6px',
//                                         cursor: 'pointer',
//                                         textAlign: 'center',
//                                     }}
//                                 >
//                                     <div style={{ fontSize: '14px', fontWeight: '700', color: isActive ? BLUE : 'white' }}>Day {dayNum}</div>
//                                     <div style={{
//                                         fontSize: '11px',
//                                         color: isActive ? BLUE : 'white',
//                                     }}>
//                                         {dow}
//                                     </div>
//                                 </button>
//                             );
//                         })}
//                     </div>

//                     {/* Day content */}
//                     <div style={{ flex: 1, padding: '20px', overflowX: 'hidden', minWidth: 0 }}>
//                         {/* Day Overview */}
//                         <div style={{ marginBottom: '20px' }}>
//                             <label style={{ ...labelStyle, color: BLUE, fontWeight: '700', fontSize: '14px' }}>Day Overview</label>
//                             {/* <textarea
//                                 style={{ ...inputStyle, resize: 'vertical', minHeight: '60px', lineHeight: '1.6' }}
//                                 placeholder="Describe this day's experience..."
//                                 value={currentDay?.dayOverview ?? ''}
//                                 onChange={e => updateDayField('dayOverview', e.target.value)}
//                             /> */}
//                             <textarea
//                                 style={{
//                                     ...inputStyle,
//                                     resize: 'none',
//                                     minHeight: '44px',
//                                     padding: '10px 24px',
//                                     borderRadius: '9999px',
//                                     border: '1px solid rgba(0,0,0,0.12)',
//                                     background: '#fff',
//                                     boxShadow: 'inset 0px 2px 6px rgba(0,0,0,0.08)',
//                                     outline: 'none',
//                                     fontSize: '14px',
//                                     lineHeight: '1.4'
//                                 }}
//                                 placeholder="Experience the magic of Bali with our curated group trip..."
//                                 value={currentDay?.dayOverview ?? ''}
//                                 onChange={e => updateDayField('dayOverview', e.target.value)}
//                             />
//                         </div>

//                         <SubRegionDropdowns
//                             dayData={currentDay}
//                             allSubRegions={allSubRegions}
//                             onDayChange={updateDayField}
//                             subRegionLoading={subRegionLoading}
//                         />
//                         <HotelDetails
//                             dayData={currentDay}
//                             hotelsForActiveDay={hotelsForActiveDay}
//                             roomTypesForActiveDay={roomTypesForActiveDay}
//                             hotelLoading={hotelLoading}
//                             roomTypeLoading={roomTypeLoading}
//                             onDayChange={updateDayField}
//                         />
//                         <PlacesSection
//                             dayData={currentDay}
//                             placesForActiveDay={placesForActiveDay}
//                             onDayChange={updateDayField}
//                         />
//                         <ActivitiesSection
//                             dayData={currentDay}
//                             activitiesForActiveDay={activitiesForActiveDay}
//                             onDayChange={updateDayField}
//                         />
//                     </div>
//                 </div>
//             </div>

//             {/* Responsive styles */}
//             <style>{`
//                 .day-tabs-mobile  { display: none !important; }
//                 .day-sidebar-desktop { display: flex !important; }
//                 .day-layout-desktop  { display: flex !important; }

//                 @media (max-width: 640px) {
//                     .day-tabs-mobile     { display: flex !important; }
//                     .day-sidebar-desktop { display: none !important; }
//                     .day-layout-desktop  { flex-direction: column !important; }
//                 }
//             `}</style>

//             {/* Save button */}
//             <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
//                 <button
//                     type="button"
//                     onClick={handleSave}
//                     disabled={submitLoading}
//                     className={`flex items-center gap-2 px-6 py-2.5 bg-[#E91E8C] text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-pink-200
//             ${submitLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-pink-600'}`}
//                 >
//                     {submitLoading ? (
//                         <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
//                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
//                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
//                         </svg>
//                     ) : (
//                         <Save size={16} />
//                     )}
//                     {submitLoading ? 'Saving...' : 'Save'}
//                 </button>
//             </div>

//             {/* Mobile responsive */}
//             <style>{`
//                 @media (max-width: 640px) {
//                     .iti-layout { flex-direction: column !important; }
//                     .iti-day-sidebar {
//                         flex-direction: row !important;
//                         min-width: unset !important;
//                         border-radius: 10px 10px 0 0 !important;
//                         padding: 8px !important;
//                         overflow-x: auto;
//                         gap: 6px !important;
//                     }
//                     .iti-day-sidebar button {
//                         min-width: 72px;
//                         text-align: center !important;
//                     }
//                 }
//             `}</style>
//         </div>
//     );
// }

// export default ItineraryBuilder;



