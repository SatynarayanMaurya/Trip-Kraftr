
import React, { useEffect } from 'react';
import { inputStyle, labelStyle, cardStyle, cardStyleHotel, cardStylePlaces } from '../../Common/CommonCss';
import { Save, Hotel, MapPin, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import CalculationCard from './CalculationCard';
import HotelDetailsSimplePackage from './HotelDetailsSimplePackage';
import VehicleSectionSimplePackage from './VehicleSectionSimplePackage';
import ActivitySectionSimplePackage from './ActivitySectionSimplePackage';
import { useSelector } from 'react-redux';
const PINK = '#ED5F8D';
const BLUE = '#18305C';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


function getDayOfWeek(startDate, dayIndex) {
    if (!startDate) return '';
    const d = new Date(startDate);
    d.setDate(d.getDate() + dayIndex);
    return DAY_NAMES[d.getDay()];
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


// ─── PlacesSection — UPDATED UI: image card grid matching image ───────────────
function PlacesSection({ dayData, placesForActiveDay, onDayChange }) {
    const userDetails = useSelector(s => s.user.userDetails)
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
                                            <div style={{ fontSize: '11px', color: '#888', marginTop: '1px' }}>{place?.subRegionId?.name}</div>
                                        )}
                                        {place?.notes && (
                                            <div style={{ fontSize: '11px', color: '#aaa', marginTop: '1px' }}>
                                                {place?.notes?.length > 30 ? `${place?.notes?.slice(0, 30)}...` : place?.notes}
                                                {userDetails?.org_id !== place?.org_id && <span className='text-red-600'>*</span>}

                                            </div>
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


// ─── ItineraryBuilder — props + Trip Overview + sidebar UNCHANGED ─────────────
function ItineraryBuilderSampLePackage({
    formData, activeDay, setActiveDay,
    allSubRegions, allVehicles, hotelsForActiveDay, placesForActiveDay,
    activitiesForActiveDay, roomTypesForActiveDay, roomRatesForActiveDayHotel,
    subRegionLoading, hotelLoading, placeLoading,
    activityLoading, roomTypeLoading,
    handleItineraryChange, handleSave, submitLoading,
    price, handlePrice, vendorDetails, handleVendorDetails
}) {
    const { itineraryBuilder, regionDetails } = formData;
    const { startDate } = regionDetails ?? {};
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
            ? {
                hotelType: 'inventory',
                hotelCategory: cur?.hotelCategory,
                hotelId: null,
                hotelName: '',
                rooms: [
                    {
                        roomTypeId: null,
                        roomType: '',  // Room Name
                        mealPlan: '',
                        noOfRooms: 1,
                        extraMattress: 0,
                        cnb: 0,
                        price: 0
                    }
                ],
            }
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

            <CalculationCard price={price} handlePrice={handlePrice} vendorDetails={vendorDetails} handleVendorDetails={handleVendorDetails} />

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
                                <div style={{ fontSize: '10px', color: isActive ? BLUE : 'rgba(255,255,255,0.55)', marginTop: '2px' }}>{getDayOfWeek(startDate, i)}</div>
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
                                    <div style={{ fontSize: '11px', color: isActive ? BLUE : 'rgba(255,255,255,0.6)' }}>{getDayOfWeek(startDate, i)}</div>
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

                        <SubRegionDropdowns
                            dayData={currentDay}
                            allSubRegions={allSubRegions}
                            onDayChange={updateDayField}
                            subRegionLoading={subRegionLoading}
                        />


                        <VehicleSectionSimplePackage
                            dayData={currentDay}
                            allVehicles={allVehicles}
                            onDayChange={updateDayField}
                        />

                        <HotelDetailsSimplePackage
                            dayData={currentDay}
                            hotelsForActiveDay={hotelsForActiveDay}
                            roomTypesForActiveDay={roomTypesForActiveDay}
                            roomRatesForActiveDayHotel={roomRatesForActiveDayHotel}
                            hotelLoading={hotelLoading}
                            roomTypeLoading={roomTypeLoading}
                            onDayChange={updateDayField}
                        />

                        <PlacesSection
                            dayData={currentDay}
                            placesForActiveDay={placesForActiveDay}
                            onDayChange={updateDayField}
                        />

                        <ActivitySectionSimplePackage
                            dayData={currentDay}
                            activitiesForActiveDay={activitiesForActiveDay}
                            onDayChange={updateDayField}
                        />



                        <div className="flex justify-end">
                            <div className="flex items-center gap-3">
                                <button
                                    disabled={activeDay === 1}
                                    onClick={() => setActiveDay(activeDay - 1)}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E91E8C] text-white text-sm font-medium shadow-md transition-all duration-200 hover:bg-[#d81b7f] disabled:bg-pink-300 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft size={16} />
                                    Prev
                                </button>

                                <div className="px-4 text-sm font-medium text-gray-600">
                                    Day {activeDay} / {numDays}
                                </div>

                                <button
                                    disabled={activeDay === numDays}
                                    onClick={() => setActiveDay(activeDay + 1)}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E91E8C] text-white text-sm font-medium shadow-md transition-all duration-200 hover:bg-[#d81b7f] disabled:bg-pink-300 disabled:cursor-not-allowed"
                                >
                                    Next
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
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
            {/* <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
            </div> */}
            {/* Save button */}
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={submitLoading}
                    className={`flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-green-200 ${submitLoading
                            ? 'opacity-70 cursor-not-allowed'
                            : 'hover:bg-green-700'
                        }`}
                >
                    {submitLoading ? (
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
                            />
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


export default ItineraryBuilderSampLePackage