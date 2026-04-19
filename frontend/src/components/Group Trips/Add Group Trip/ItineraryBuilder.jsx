import React, { useMemo } from 'react';
import { inputStyle, labelStyle, cardStyle } from '../../Common/CommonCss';

const PINK = '#ED5F8D';
const BLUE = '#18305C';

// ─── helpers ──────────────────────────────────────────────────────────────────

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getDayOfWeek(fromDate, dayIndex) {
    if (!fromDate) return '';
    const d = new Date(fromDate);
    d.setDate(d.getDate() + dayIndex);
    return DAY_NAMES[d.getDay()];
}

// ─── sub-components ───────────────────────────────────────────────────────────

function SubRegionDropdowns({ dayData, allSubRegions, onDayChange, subRegionLoading }) {
    const getFiltered = (excludeKeys) => {
        const excluded = excludeKeys.map(k => dayData?.[k]).filter(Boolean);
        return (allSubRegions ?? []).filter(s => !excluded.includes(s._id));
    };

    const fields = [
        { key: 'subRegion1', label: 'Sub- Region  01', exclude: ['subRegion2', 'subRegion3'], dependsOn: null },
        { key: 'subRegion2', label: 'Sub- Region  02', exclude: ['subRegion1', 'subRegion3'], dependsOn: 'subRegion1' },
        { key: 'subRegion3', label: 'Sub- Region  03', exclude: ['subRegion1', 'subRegion2'], dependsOn: 'subRegion2' },
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
                                style={{
                                    ...inputStyle,
                                    appearance: 'none',
                                    paddingRight: '32px',
                                    background: isLocked ? '#f5f5f5' : 'white',
                                    color: isLocked ? '#bbb' : '#333',
                                    cursor: isLocked ? 'not-allowed' : 'pointer',
                                }}
                                value={dayData?.[key] ?? ''}
                                onChange={e => onDayChange(key, e.target.value)}
                                disabled={subRegionLoading || isLocked}
                            >
                                <option value="">
                                    {isLocked ? `Select Sub-Region ${fields.findIndex(f => f.key === dependsOn) + 1} first` : 'e.g. Arunachal Pradesh'}
                                </option>
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

function HotelDetails({ dayData, hotelsForActiveDay, roomTypesForActiveDay, hotelLoading, roomTypeLoading, onDayChange }) {
    const hotelType = dayData?.hotelDetails?.hotelType ?? 'inventory';
    const isInventory = hotelType === 'inventory';

    // const updateHotel = (field, value) => {
    //     if(field === 'roomType'){
    //         if(isInventory){
    //             const findRoom = roomTypesForActiveDay?.find((val)=>val?._id === value)
    //             onDayChange('hotelDetails', { ...dayData?.hotelDetails, ['roomTypeId']: value });
    //             onDayChange('hotelDetails', { ...dayData?.hotelDetails, [field]: findRoom?.roomName });
    //         }
    //         else{
    //             onDayChange('hotelDetails', { ...dayData?.hotelDetails, [field]: value });
    //         }
    //     }
    //     else{
    //         onDayChange('hotelDetails', { ...dayData?.hotelDetails, [field]: value });
    //     }
    // };

    const updateHotel = (field, value) => {
        if (field === 'roomType') {
            if (isInventory) {
                const findRoom = roomTypesForActiveDay?.find(r => r._id === value);
                // Single call — both roomTypeId and roomType set together
                onDayChange('hotelDetails', {
                    ...dayData?.hotelDetails,
                    roomTypeId: value,
                    roomType: findRoom?.roomName ?? '',
                });
            } else {
                // Manual — only store the typed name, clear any old inventory id
                onDayChange('hotelDetails', {
                    ...dayData?.hotelDetails,
                    roomTypeId: '',
                    roomType: value,
                });
            }
        } else {
            onDayChange('hotelDetails', {
                ...dayData?.hotelDetails,
                [field]: value,
            });
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

    return (
        <div style={{ border: '1px solid #eee', borderRadius: '10px', padding: '18px', marginBottom: '20px' }}>
            {/* Header with toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '15px', fontWeight: '700', color: BLUE }}>Hotel Details</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                        onClick={() => updateHotel('hotelType', 'inventory')}
                        style={{
                            padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600',
                            border: 'none', cursor: 'pointer',
                            background: isInventory ? '#e8f5e9' : 'transparent',
                            color: isInventory ? '#2e7d32' : '#aaa',
                            border: isInventory ? '1px solid #a5d6a7' : '1px solid #ddd',
                        }}
                    >
                        Inventory
                    </button>
                    <button
                        onClick={() => updateHotel('hotelType', 'manual')}
                        style={{
                            padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600',
                            border: 'none', cursor: 'pointer',
                            background: !isInventory ? PINK : 'transparent',
                            color: !isInventory ? 'white' : '#aaa',
                            border: !isInventory ? `1px solid ${PINK}` : '1px solid #ddd',
                        }}
                    >
                        Manual
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', alignItems: 'start' }}>
                {/* Hotel Name */}
                <div>
                    <label style={{ ...labelStyle, color: BLUE, fontWeight: '700' }}>Hotel Name</label>
                    {isInventory ? (
                        <div style={{ position: 'relative' }}>
                            <select
                                style={{ ...inputStyle, appearance: 'none', paddingRight: '32px' }}
                                value={dayData?.hotelDetails?.hotelId ?? ''}
                                onChange={e => {
                                    const h = hotelsForActiveDay?.find(h => h._id === e.target.value);
                                    onDayChange('hotelDetails', {
                                        ...dayData?.hotelDetails,
                                        hotelId: e.target.value,
                                        hotelName: h?.hotelName ?? '',
                                        roomType: '',
                                    });
                                }}
                                disabled={hotelLoading}
                            >
                                <option value="">Hotel Name</option>
                                {(hotelsForActiveDay ?? []).map(h => (
                                    <option key={h._id} value={h._id}>{h.hotelName}</option>
                                ))}
                            </select>
                            <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#aaa', pointerEvents: 'none' }}>▼</span>
                        </div>
                    ) : (
                        <input
                            type="text"
                            style={inputStyle}
                            placeholder="Enter hotel name"
                            value={dayData?.hotelDetails?.hotelName ?? ''}
                            onChange={e => updateHotel('hotelName', e.target.value)}
                        />
                    )}
                </div>

                {/* Room Type */}
                <div>
                    <label style={{ ...labelStyle, color: BLUE, fontWeight: '700' }}>Room Type</label>
                    {isInventory ? (
                        <div style={{ position: 'relative' }}>
                            <select
                                style={{ ...inputStyle, appearance: 'none', paddingRight: '32px' }}
                                value={dayData?.hotelDetails?.roomTypeId ?? ''}
                                onChange={e => updateHotel('roomType', e.target.value)}
                                disabled={roomTypeLoading || !dayData?.hotelDetails?.hotelId}
                            >
                                <option value="">Room Type</option>
                                {(roomTypesForActiveDay ?? []).map(r => (
                                    <option key={r._id} value={r._id}>{r.roomName}</option>
                                ))}
                            </select>
                            <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#aaa', pointerEvents: 'none' }}>▼</span>
                        </div>
                    ) : (
                        <input
                            type="text"
                            style={inputStyle}
                            placeholder="Enter room type"
                            value={dayData?.hotelDetails?.roomType ?? ''}
                            onChange={e => updateHotel('roomType', e.target.value)}
                        />
                    )}
                </div>

                {/* Meals */}
                <div>
                    <label style={{ ...labelStyle, color: BLUE, fontWeight: '700' }}>Meals</label>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', paddingTop: '6px' }}>
                        {['Breakfast', 'Lunch', 'Dinner'].map(meal => (
                            <label key={meal} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#444', cursor: 'pointer', userSelect: 'none' }}>
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
        </div>
    );
}

function PlacesSection({ dayData, placesForActiveDay, onDayChange }) {
    const selectedPlaces = dayData?.placeDetails ?? [];

    const togglePlace = (place) => {
        const exists = selectedPlaces.find(p => p.placeId === place._id);
        let updated;
        if (exists) {
            updated = selectedPlaces.filter(p => p.placeId !== place._id);
        } else {
            updated = [...selectedPlaces, { placeId: place._id, isFavourite: false }];
        }
        onDayChange('placeDetails', updated);
    };

    const toggleFavourite = (placeId) => {
        const isChecked = selectedPlaces.find(p => p.placeId === placeId);
        if (!isChecked) return;
        const updated = selectedPlaces.map(p => ({
            ...p,
            isFavourite: p.placeId === placeId ? !p.isFavourite : false,
        }));
        onDayChange('placeDetails', updated);
    };

    const isSelected = (placeId) => selectedPlaces.some(p => p.placeId === placeId);
    const isFavourite = (placeId) => selectedPlaces.find(p => p.placeId === placeId)?.isFavourite ?? false;

    if (!placesForActiveDay?.length) return (
        <div style={{ marginBottom: '20px' }}>
            <label style={{ ...labelStyle, color: BLUE, fontWeight: '700', fontSize: '15px' }}>Places</label>
            <p style={{ fontSize: '13px', color: '#aaa' }}>No places available for selected sub-regions.</p>
        </div>
    );

    return (
        <div style={{ marginBottom: '20px' }}>
            <label style={{ ...labelStyle, color: BLUE, fontWeight: '700', fontSize: '15px' }}>Places</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {placesForActiveDay.map(place => (
                    <div
                        key={place._id}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            border: `1.5px solid ${isSelected(place._id) ? PINK : '#ddd'}`,
                            borderRadius: '8px', padding: '7px 12px',
                            background: isSelected(place._id) ? '#fff0f5' : 'white',
                            cursor: 'pointer', userSelect: 'none',
                        }}
                        onClick={() => togglePlace(place)}
                    >
                        <input
                            type="checkbox"
                            checked={isSelected(place._id)}
                            onChange={() => togglePlace(place)}
                            onClick={e => e.stopPropagation()}
                            style={{ accentColor: PINK, width: '14px', height: '14px', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '13px', fontWeight: '500', color: BLUE }}>{place.placeName}</span>
                        <button
                            onClick={e => { e.stopPropagation(); if (isSelected(place._id)) toggleFavourite(place._id); }}
                            title={isSelected(place._id) ? 'Mark as favourite' : 'Select place first'}
                            style={{
                                background: 'none', border: 'none', cursor: isSelected(place._id) ? 'pointer' : 'not-allowed',
                                padding: '0', fontSize: '15px', lineHeight: 1,
                                opacity: isSelected(place._id) ? 1 : 0.35,
                            }}
                        >
                            {isFavourite(place._id) ? '★' : '☆'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// function ActivitiesSection({ dayData, activitiesForActiveDay, onDayChange }) {
//     const activities = dayData?.activities ?? [{ activityType: 'inventory', activityId: '', activityName: '', isComplimentary: false, price: 0 }];

//     const updateActivity = (index, updates) => {
//         // updates is now an object of multiple fields at once
//         const updated = activities.map((a, i) =>
//             i === index ? { ...a, ...updates } : a
//         );
//         onDayChange('activities', updated);
//     };

//     const addActivity = () => {
//         onDayChange('activities', [...activities, { activityType: 'inventory', activityId: '', activityName: '', isComplimentary: false, price: 0 }]);
//     };

//     const removeActivity = (index) => {
//         if (activities.length === 1) return;
//         onDayChange('activities', activities.filter((_, i) => i !== index));
//     };


//     const handleActivitySelect = (index, activityId) => {
//         const found = activitiesForActiveDay?.find(a => a._id === activityId);
//         // Single call — all fields patched at once, no stale reads
//         updateActivity(index, {
//             activityId: activityId,
//             activityName: found?.activityName ?? '',
//             activityType: 'inventory',
//             ...(activities[index].isComplimentary ? {} : { price: found?.price ?? 0 }),
//         });
//     };

//     return (
//         <div style={{ marginBottom: '8px' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
//                 <label style={{ ...labelStyle, color: BLUE, fontWeight: '700', fontSize: '15px', marginBottom: 0 }}>Activities</label>
//                 <button
//                     onClick={addActivity}
//                     style={{ background: 'none', border: 'none', color: PINK, fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
//                 >
//                     + Add Activity
//                 </button>
//             </div>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//                 {activities?.map((act, index) => (
//                     <div key={index} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '14px' }}>
//                         {/* Row 1: name input + price + delete */}
//                         <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
//                             {/* Activity name — search/select from inventory or type manual */}
//                             <div style={{ flex: 2, minWidth: '140px' }}>
//                                 <input
//                                     list={`activity-list-${index}`}
//                                     style={{ ...inputStyle }}
//                                     placeholder="Enter activity name"
//                                     value={act.activityName ?? ''}
//                                     onChange={e => {
//                                         const found = activitiesForActiveDay?.find(a => a.activityName === e.target.value);
//                                         if (found) {
//                                             handleActivitySelect(index, found._id);
//                                         } else {
//                                             updateActivity(index, 'activityName', e.target.value);
//                                             updateActivity(index, 'activityId', '');
//                                             updateActivity(index, 'activityType', 'manual');
//                                         }
//                                     }}
//                                 />
//                                 <datalist id={`activity-list-${index}`}>
//                                     {(activitiesForActiveDay ?? []).map(a => (
//                                         <option key={a._id} value={a.activityName} />
//                                     ))}
//                                 </datalist>
//                             </div>

//                             {/* Price — hidden when complimentary */}
//                             {!act.isComplimentary && (
//                                 <div style={{ flex: 1, minWidth: '110px', display: 'flex', alignItems: 'center', gap: '6px', border: '1.5px solid #ddd', borderRadius: '6px', padding: '0 10px', height: '38px', background: 'white' }}>
//                                     <span style={{ fontSize: '14px', color: '#555' }}>₹</span>
//                                     <input
//                                         type="number"
//                                         min={0}
//                                         style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', color: '#333' }}
//                                         value={act.price ?? 0}
//                                         onChange={e => updateActivity(index, 'price', Number(e.target.value))}
//                                     />
//                                 </div>
//                             )}

//                             {/* Delete */}
//                             <button
//                                 onClick={() => removeActivity(index)}
//                                 disabled={activities.length === 1}
//                                 style={{ background: 'none', border: 'none', cursor: activities.length === 1 ? 'not-allowed' : 'pointer', opacity: activities.length === 1 ? 0.35 : 1, fontSize: '16px', color: '#e53935' }}
//                                 title="Remove activity"
//                             >
//                                 🗑
//                             </button>
//                         </div>

//                         {/* Row 2: Complimentary checkbox + Paid Activity badge */}
//                         <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px', flexWrap: 'wrap' }}>
//                             <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#444', cursor: 'pointer', userSelect: 'none' }}>
//                                 <input
//                                     type="checkbox"
//                                     checked={act.isComplimentary ?? false}
//                                     onChange={e => {
//                                         updateActivity(index, 'isComplimentary', e.target.checked);
//                                         if (e.target.checked) updateActivity(index, 'price', null);
//                                         else updateActivity(index, 'price', 0);
//                                     }}
//                                     style={{ accentColor: PINK, width: '14px', height: '14px', cursor: 'pointer' }}
//                                 />
//                                 Complimentary
//                             </label>

//                             {!act.isComplimentary && (
//                                 <span style={{ background: '#e3f2fd', color: '#1565c0', fontSize: '12px', fontWeight: '600', padding: '3px 12px', borderRadius: '12px' }}>
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

// ─── main component ───────────────────────────────────────────────────────────

function ActivitiesSection({ dayData, activitiesForActiveDay, onDayChange }) {
    const activities = dayData?.activities ?? [
        { activityType: 'inventory', activityId: '', activityName: '', isComplimentary: false, price: 0 }
    ];

    // Single-call update — patches multiple fields at once, no stale closure
    const updateActivity = (index, updates) => {
        const updated = activities.map((a, i) =>
            i === index ? { ...a, ...updates } : a
        );
        onDayChange('activities', updated);
    };

    const addActivity = () => {
        onDayChange('activities', [
            ...activities,
            { activityType: 'inventory', activityId: '', activityName: '', isComplimentary: false, price: 0 }
        ]);
    };

    const removeActivity = (index) => {
        if (activities.length === 1) return;
        onDayChange('activities', activities.filter((_, i) => i !== index));
    };

    const handleNameChange = (index, value) => {
        const found = activitiesForActiveDay?.find(
            a => a.activityName.toLowerCase() === value.toLowerCase()
        );

        if (found) {
            // Matched an inventory item — autofill everything
            updateActivity(index, {
                activityName: found.activityName,
                activityId: found._id,
                activityType: 'inventory',
                // Only set price if not complimentary
                ...(!activities[index].isComplimentary && { price: found.price ?? 0 }),
            });
        } else {
            // User is typing freely — manual mode, clear the inventory link
            updateActivity(index, {
                activityName: value,
                activityId: '',
                activityType: 'manual',
            });
        }
    };

    return (
        <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ ...labelStyle, color: BLUE, fontWeight: '700', fontSize: '15px', marginBottom: 0 }}>
                    Activities
                </label>
                <button
                    onClick={addActivity}
                    style={{ background: 'none', border: 'none', color: PINK, fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                >
                    + Add Activity
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activities.map((act, index) => (
                    <div key={index} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '14px' }}>

                        {/* Row 1: name + price + delete */}
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>

                            {/* Activity name — free-type with suggestions */}
                            <div style={{ flex: 2, minWidth: '140px' }}>
                                <input
                                    type="text"
                                    list={`activity-list-${index}`}
                                    style={{ ...inputStyle }}
                                    placeholder="Enter or search activity name"
                                    // KEY FIX: uncontrolled-style — use defaultValue on mount,
                                    // keep it controlled so we can clear it, but don't lock on re-render
                                    value={act.activityName}
                                    onChange={e => handleNameChange(index, e.target.value)}
                                />
                                <datalist id={`activity-list-${index}`}>
                                    {(activitiesForActiveDay ?? []).map(a => (
                                        <option key={a._id} value={a.activityName} />
                                    ))}
                                </datalist>
                            </div>

                            {/* Price — hidden when complimentary */}
                            {!act.isComplimentary && (
                                <div style={{
                                    flex: 1, minWidth: '110px', display: 'flex', alignItems: 'center',
                                    gap: '6px', border: '1.5px solid #ddd', borderRadius: '6px',
                                    padding: '0 10px', height: '38px', background: 'white'
                                }}>
                                    <span style={{ fontSize: '14px', color: '#555' }}>₹</span>
                                    <input
                                        type="number"
                                        min={0}
                                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', color: '#333' }}
                                        value={act.price ?? 0}
                                        onChange={e => updateActivity(index, { price: Number(e.target.value) })}
                                    />
                                </div>
                            )}

                            {/* Delete */}
                            <button
                                onClick={() => removeActivity(index)}
                                disabled={activities.length === 1}
                                style={{
                                    background: 'none', border: 'none',
                                    cursor: activities.length === 1 ? 'not-allowed' : 'pointer',
                                    opacity: activities.length === 1 ? 0.35 : 1,
                                    fontSize: '16px', color: '#e53935'
                                }}
                                title="Remove activity"
                            >
                                🗑
                            </button>
                        </div>

                        {/* Row 2: Complimentary + badge */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px', flexWrap: 'wrap' }}>
                            <label style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                fontSize: '13px', color: '#444', cursor: 'pointer', userSelect: 'none'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={act.isComplimentary ?? false}
                                    onChange={e => {
                                        const isNowComplimentary = e.target.checked;
                                        updateActivity(index, {
                                            isComplimentary: isNowComplimentary,
                                            price: isNowComplimentary ? null : 0,
                                        });
                                    }}
                                    style={{ accentColor: PINK, width: '14px', height: '14px', cursor: 'pointer' }}
                                />
                                Complimentary
                            </label>

                            {!act.isComplimentary && (
                                <span style={{
                                    background: '#e3f2fd', color: '#1565c0',
                                    fontSize: '12px', fontWeight: '600',
                                    padding: '3px 12px', borderRadius: '12px'
                                }}>
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
function ItineraryBuilder({
    formData,
    activeDay,
    setActiveDay,
    allSubRegions,
    hotelsForActiveDay,
    placesForActiveDay,
    activitiesForActiveDay,
    roomTypesForActiveDay,
    subRegionLoading,
    hotelLoading,
    placeLoading,
    activityLoading,
    roomTypeLoading,
    handleItineraryChange,
    handleSave,
}) {
    const { itineraryBuilder, regionDetails } = formData;
    const { fromDate } = regionDetails ?? {};
    const numDays = itineraryBuilder?.daysDetails?.length ?? 0;
    const currentDay = itineraryBuilder?.daysDetails?.[activeDay - 1];

    const updateDayField = (field, value) => {
        let updates = { [field]: value };

        // If clearing a subregion, cascade-clear the dependent ones
        if (field === 'subRegion1' && !value) {
            updates = { subRegion1: '', subRegion2: '', subRegion3: '' };
        } else if (field === 'subRegion2' && !value) {
            updates = { subRegion2: '', subRegion3: '' };
        }

        // Apply all updates at once
        handleItineraryChange(activeDay - 1, updates);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Trip Overview card */}
            <div style={{ ...cardStyle }}>
                <div style={{ fontSize: '18px', fontWeight: '700', color: BLUE, marginBottom: '12px' }}>Trip Overview</div>
                <textarea
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '70px', lineHeight: '1.6' }}
                    placeholder="Describe the overall trip experience..."
                    value={itineraryBuilder?.tripOverview ?? ''}
                    onChange={e => handleItineraryChange(null, 'tripOverview', e.target.value)}
                />
            </div>

            {/* Days layout: sidebar + content */}
            {/* Outer wrapper — flex row on desktop, flex column on mobile */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',   // mobile: stack tabs on top, content below
                background: 'white',
                borderRadius: '10px',
                border: '1px solid #eee',
                overflow: 'hidden',
            }}>

                {/* ── MOBILE: horizontal scrollable tab bar ── */}
                <div style={{
                    display: 'none',  // overridden by media query below
                    background: BLUE,
                    overflowX: 'auto',
                    padding: '8px',
                    gap: '6px',
                    borderRadius: '10px 10px 0 0',
                }} className="day-tabs-mobile">
                    {Array.from({ length: numDays }, (_, i) => {
                        const dayNum = i + 1;
                        const dow = getDayOfWeek(fromDate, i);
                        const isActive = activeDay === dayNum;
                        return (
                            <button
                                key={dayNum}
                                onClick={() => setActiveDay(dayNum)}
                                style={{
                                    flexShrink: 0,
                                    background: isActive ? "#FEF4F8" : 'transparent',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    minWidth: '70px',
                                }}
                            >
                                <div style={{ fontSize: '13px', fontWeight: '700', color: 'white', whiteSpace: 'nowrap' }}>Day {dayNum}</div>
                                <div style={{ fontSize: '10px', color: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)', marginTop: '2px' }}>{dow}</div>
                            </button>
                        );
                    })}
                </div>

                {/* ── DESKTOP: vertical sidebar + content side by side ── */}
                <div style={{ display: 'flex', flex: 1 }} className="day-layout-desktop">

                    {/* Sidebar */}
                    <div style={{
                        background: BLUE,
                        borderRadius: '10px 0 0 10px',
                        padding: '8px 0',
                        width: '140px',
                        flexShrink: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                    }} className="day-sidebar-desktop">
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
                                        color: isActive ? BLUE : 'white',
                                        
                                        border: 'none',
                                        // Active pill: rounded only on left side, bleeds to right edge of sidebar
                                        borderRadius: isActive ? '20px 0 0 20px' : '0',
                                        // Active: left margin only, no right margin so it touches the content border
                                        margin: isActive ? '0 0 0 8px' : '0',
                                        // padding: '10px 16px',
                                        padding: '8px 6px',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        // transition: 'background 0.15s ease, border-radius 0.15s ease',
                                    }}
                                >
                                    <div style={{ fontSize: '14px', fontWeight: '700', color:isActive ? BLUE : 'white'}}>Day {dayNum}</div>
                                    <div style={{
                                        fontSize: '11px',
                                        color: isActive ? BLUE : 'white',
                                        // marginTop: '1px',
                                    }}>
                                        {dow}
                                    </div>
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
                                style={{ ...inputStyle, resize: 'vertical', minHeight: '60px', lineHeight: '1.6' }}
                                placeholder="Describe this day's experience..."
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
                        <HotelDetails
                            dayData={currentDay}
                            hotelsForActiveDay={hotelsForActiveDay}
                            roomTypesForActiveDay={roomTypesForActiveDay}
                            hotelLoading={hotelLoading}
                            roomTypeLoading={roomTypeLoading}
                            onDayChange={updateDayField}
                        />
                        <PlacesSection
                            dayData={currentDay}
                            placesForActiveDay={placesForActiveDay}
                            onDayChange={updateDayField}
                        />
                        <ActivitiesSection
                            dayData={currentDay}
                            activitiesForActiveDay={activitiesForActiveDay}
                            onDayChange={updateDayField}
                        />
                    </div>
                </div>
            </div>

            {/* Responsive styles */}
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
                    onClick={handleSave}
                    style={{
                        background: PINK, color: 'white', border: 'none', borderRadius: '8px',
                        padding: '10px 28px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px',
                    }}
                >
                    &#128190; Save
                </button>
            </div>

            {/* Mobile responsive */}
            <style>{`
                @media (max-width: 640px) {
                    .iti-layout { flex-direction: column !important; }
                    .iti-day-sidebar {
                        flex-direction: row !important;
                        min-width: unset !important;
                        border-radius: 10px 10px 0 0 !important;
                        padding: 8px !important;
                        overflow-x: auto;
                        gap: 6px !important;
                    }
                    .iti-day-sidebar button {
                        min-width: 72px;
                        text-align: center !important;
                    }
                }
            `}</style>
        </div>
    );
}

export default ItineraryBuilder;



