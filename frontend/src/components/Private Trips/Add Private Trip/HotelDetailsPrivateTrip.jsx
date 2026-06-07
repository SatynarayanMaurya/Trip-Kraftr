// ─────────────────────────────────────────────────────────────────────────────
// HotelDetails.jsx  —  fully updated hotel section
// Drop-in replacement for the HotelDetails function + blankDay + handleItineraryChange
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect } from 'react';
import { Hotel, Plus, Trash2 } from 'lucide-react';
import {
    Wifi, Waves, ParkingCircle, Utensils, Dumbbell, Wind,
    Tv, Coffee, ShowerHead, Car, Shirt, Baby,
    Flame, Shield, Accessibility, BedDouble,RefreshCw
} from 'lucide-react';
import { inputStyle } from '../../Common/CommonCss'; // keep your existing import path
import { toast } from 'react-toastify';

// ─── constants ────────────────────────────────────────────────────────────────
const PINK = '#ED5F8D';
const BLUE = '#18305C';

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
];

const MEAL_PLANS = ['ep', 'cp', 'map', 'ap'];

// ─── blank room template (single room entry) ──────────────────────────────────
export const blankRoom = () => ({
    roomTypeId: null,
    roomType: '',
    mealPlan: 'ep',
    noOfRooms: 1,
    maxAdults: 1,
    noOfExtraMattress: 0,
    noOfCnb: 0,
    roomPrice: 0,
    extraMattressPrice: 0,
    cnbPrice: 0,
});

// ─── updated blankDay ─────────────────────────────────────────────────────────
// Export this and replace the one in AddSamplePackage.jsx
export const blankDay = () => ({
    dayOverview: '',
    subRegion1: null,
    subRegion2: null,
    subRegion3: null,
    hotelDetails: {
        hotelType: 'inventory',
        hotelCategory: '',
        hotelId: null,
        hotelName: '',
        rooms: [blankRoom()],
    },
    vehicleDetails: [{
        vehicleId: null,
        capacity: 0,
        pricePerDay: 0,
        vehicleImageUrl: '',
        vehicleModel: '',
        vehicleType: '',
        quantity: 1,
        // _id: '',
    }],
    placeDetails: [],
    activities: [
        {
            activityType: 'inventory',
            activityId: null,
            activityName: '',
            isComplimentary: false,
            quantity: 1,
            price: 0
        },
    ],
});

// ─── helper: consumed quantity per roomTypeId across all room entries ─────────
function getConsumedQuantities(rooms) {
    const map = {};
    rooms.forEach(r => {
        if (r.roomTypeId) {
            map[r.roomTypeId] = (map[r.roomTypeId] || 0) + (r.noOfRooms || 0);
        }
    });
    return map;
}

// const maxRooms = selectedRoomType
// ? availableQty(selectedRoomType, rooms, roomIndex) + (room.noOfRooms || 0)
// : 1;

// ─── helper: available quantity for a room type ───────────────────────────────
function availableQty(roomType, rooms, currentRoomIndex) {
    const total = roomType.quantity || 0;
    let used = 0;
    rooms.forEach((r, i) => {
        if (i !== currentRoomIndex && r.roomTypeId === roomType._id) {
            used += (r.noOfRooms || 1);
        }
    });
    return total - used;
}

// ─── helper: get price from rates ────────────────────────────────────────────
function getRoomPrice(roomRates, roomTypeId, mealPlan) {
    if (!roomRates?.roomRates) return 0;
    const entry = roomRates.roomRates.find(r => r.roomId === roomTypeId);
    return entry?.[mealPlan] ?? 0;
}

function getExtraMatPrice(roomRates, mealPlan) {
    return roomRates?.extraMattress?.[mealPlan] ?? 0;
}

function getCnbPrice(roomRates, mealPlan) {
    return roomRates?.cnb?.[mealPlan] ?? 0;
}

// ─── small shared style helpers ───────────────────────────────────────────────
const labelCls = `text-xs font-semibold mb-1 block`;
const labelStyle = { color: BLUE };

const selectCls = (disabled) =>
    `w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none appearance-none
   ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-400' : 'bg-white cursor-pointer'}`;

const numInputCls =
    'w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none bg-white';

const readonlyBoxCls =
    'flex-1 border border-gray-100 rounded-lg px-3 py-1.5 text-[12px] bg-gray-50 text-gray-500';

// ─── StarRating (unchanged) ───────────────────────────────────────────────────
function StarRating({ rating }) {
    const num = parseFloat(rating) || 0;
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24"
                    fill={i <= Math.round(num) ? '#FFC107' : '#e0e0e0'} stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            ))}
            {num > 0 && <span className="text-[12px] font-semibold text-gray-500 ml-1">{num}</span>}
        </div>
    );
}

// ─── AmenityTag (unchanged) ───────────────────────────────────────────────────
function AmenityTag({ label }) {
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] text-gray-500">
            <span className="text-[#D7A30F]">
                {AMENITIES_LIST.find(v => v.label === label)?.icon}
            </span>
            {label}
        </span>
    );
}

// ─── SectionHeader ────────────────────────────────────────────────────────────
function SectionHeader({ icon, label }) {
    return (
        <div className="flex items-center justify-center gap-2 mb-4">
            <span style={{ color: PINK }}>{icon}</span>
            <span className="text-[15px] font-bold" style={{ color: BLUE }}>{label}</span>
        </div>
    );
}

// ─── RoomEntryInventory ───────────────────────────────────────────────────────
function RoomEntryInventory({
    room, roomIndex, rooms,
    roomTypesForActiveDay,
    roomRatesForActiveDayHotel,
    canDelete,
    onRoomChange,
    onDeleteRoom,
}) {
    const consumed = getConsumedQuantities(rooms);

    // build room type options with available qty
    const roomTypeOptions = (roomTypesForActiveDay ?? []).map(rt => {
        const avail = availableQty(rt, rooms, roomIndex);
        const isFullyUsed = avail <= 0 && room.roomTypeId !== rt._id;
        return { ...rt, avail, isFullyUsed };
    });

    const selectedRoomType = roomTypesForActiveDay?.find(r => r._id === room.roomTypeId);
    const maxRooms = selectedRoomType
        // ? availableQty(selectedRoomType, rooms, roomIndex) + (room.noOfRooms || 0)
        ? availableQty(selectedRoomType, rooms, roomIndex)
        : 1;
    // noOfRooms dropdown: 1 … min(maxRooms, selectedRoomType.quantity)
    const roomQtyOptions = selectedRoomType
        ? Array.from({ length: Math.min(maxRooms, selectedRoomType.quantity) }, (_, i) => i + 1)
        : [1];

    // extra mattress max = noOfRooms * room.extraMattress
    const maxExtraMat = (room.noOfRooms || 1) * (selectedRoomType?.extraMattress || 0);
    const extraMatOptions = Array.from({ length: maxExtraMat + 1 }, (_, i) => i);

    // ── handlers
    const handleRoomTypeChange = (roomTypeId) => {
        const rt = roomTypesForActiveDay?.find(r => r._id === roomTypeId);
        const mealPlan = room.mealPlan || 'ep';
        const roomPrice = rt ? getRoomPrice(roomRatesForActiveDayHotel, roomTypeId, mealPlan) : 0
        if (roomPrice === 0 && rt) {
            toast.warn(
                "No hotel price is defined for the selected date. Using 0 as the default price."
            );
        }
        onRoomChange(roomIndex, {
            roomTypeId,
            roomType: rt?.roomName ?? '',
            noOfRooms: 1,
            maxAdults: rt?.adult ?? 1,
            noOfExtraMattress: 0,
            noOfCnb: 0,
            roomPrice: getRoomPrice(roomRatesForActiveDayHotel, roomTypeId, mealPlan),
            extraMattressPrice: getExtraMatPrice(roomRatesForActiveDayHotel, mealPlan),
            cnbPrice: getCnbPrice(roomRatesForActiveDayHotel, mealPlan),
        });
    };

    useEffect(() => {
        onRoomChange(roomIndex, {
            ...room,
            roomPrice: getRoomPrice(
                roomRatesForActiveDayHotel,
                room?.roomTypeId,
                room?.mealPlan
            ),
            extraMattressPrice: getExtraMatPrice(
                roomRatesForActiveDayHotel,
                room?.mealPlan
            ),
            cnbPrice: getCnbPrice(
                roomRatesForActiveDayHotel,
                room?.mealPlan
            )
        });
    }, [roomRatesForActiveDayHotel]);

    const handleMealPlanChange = (mealPlan) => {
        onRoomChange(roomIndex, {
            mealPlan,
            roomPrice: getRoomPrice(roomRatesForActiveDayHotel, room.roomTypeId, mealPlan),
            extraMattressPrice: getExtraMatPrice(roomRatesForActiveDayHotel, mealPlan),
            cnbPrice: getCnbPrice(roomRatesForActiveDayHotel, mealPlan),
        });
    };

    const handleNoOfRoomsChange = (val) => {
        const n = Number(val);
        onRoomChange(roomIndex, {
            noOfRooms: n,
            noOfExtraMattress: 0, // reset when qty changes
        });
    };

    const handleExtraMatChange = (val) => {
        onRoomChange(roomIndex, { noOfExtraMattress: Number(val) });
    };

    const handleCnbChange = (val) => {
        const n = Math.max(0, Number(val));
        onRoomChange(roomIndex, { noOfCnb: n });
    };

    return (
        <div className="border border-gray-100 rounded-xl p-4 mb-3 bg-white relative">

            {/* Room entry header */}
            <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-bold" style={{ color: BLUE }}>
                    Room {roomIndex + 1}
                </span>
                {canDelete && (
                    <button
                        type="button"
                        onClick={() => onDeleteRoom(roomIndex)}
                        className="p-1 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                        title="Remove room"
                    >
                        <Trash2 size={14} />
                    </button>
                )}
            </div>

            {/* Row 1: Room Type | Meal Plan */}
            <div className="grid grid-cols-2 gap-3 mb-3">

                {/* Room Type */}
                <div>
                    <label className={labelCls} style={labelStyle}>🛏 Room Type</label>
                    <div className="relative">
                        <select
                            className={selectCls(false)}
                            value={room.roomTypeId ?? ''}
                            onChange={e => handleRoomTypeChange(e.target.value)}
                        >
                            <option value="">Select Room</option>
                            {roomTypeOptions.map(rt => (
                                <option
                                    key={rt._id}
                                    value={rt._id}
                                    disabled={rt.isFullyUsed}
                                    style={rt.isFullyUsed ? { color: '#bbb' } : {}}
                                >
                                    {rt.roomName} {rt.isFullyUsed ? '(Full)' : ''}
                                </option>
                            ))}
                        </select>
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-300 pointer-events-none">▼</span>
                    </div>
                    {selectedRoomType && (
                        <p className="text-[11px] text-gray-400 mt-1">
                            Total available: {selectedRoomType.quantity}, Max Adult: {selectedRoomType.adult}
                        </p>
                    )}
                </div>

                {/* Meal Plan */}
                <div>
                    <label className={labelCls} style={labelStyle}>Meal Plan</label>
                    <div className="flex gap-2 pt-1 flex-wrap">
                        {MEAL_PLANS.map(mp => (
                            <label key={mp} className="flex items-center gap-1.5 text-[13px] text-gray-600 cursor-pointer select-none">
                                <input
                                    type="radio"
                                    name={`mealPlan-${roomIndex}`}
                                    value={mp}
                                    checked={room.mealPlan === mp}
                                    onChange={() => handleMealPlanChange(mp)}
                                    className="w-[14px] h-[14px] cursor-pointer"
                                    style={{ accentColor: PINK }}
                                />
                                {mp.toUpperCase()}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Row 2: No. of Rooms | Extra Mattress | CNB */}
            <div className="grid grid-cols-3 gap-3 mb-3">

                {/* No. of Rooms */}
                <div>
                    <label className={labelCls} style={labelStyle}>🛏 No. of Rooms</label>
                    <div className="relative">
                        <select
                            className={selectCls(!room.roomTypeId)}
                            disabled={!room.roomTypeId}
                            value={room.noOfRooms ?? 1}
                            onChange={e => handleNoOfRoomsChange(e.target.value)}
                        >
                            {roomQtyOptions.map(n => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-300 pointer-events-none">▼</span>
                    </div>
                </div>

                {/* Extra Mattress */}
                <div>
                    <label className={labelCls} style={labelStyle}>Extra Mattress</label>
                    <div className="relative">
                        <select
                            className={selectCls(!room.roomTypeId || maxExtraMat === 0)}
                            disabled={!room.roomTypeId || maxExtraMat === 0}
                            value={room.noOfExtraMattress ?? 0}
                            onChange={e => handleExtraMatChange(e.target.value)}
                        >
                            {extraMatOptions.map(n => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-300 pointer-events-none">▼</span>
                    </div>
                    {selectedRoomType && (
                        <p className="text-[11px] text-gray-400 mt-1">
                            Max: {maxExtraMat} ({room.noOfRooms}×{selectedRoomType.extraMattress})
                        </p>
                    )}
                </div>

                {/* CNB */}
                <div>
                    <label className={labelCls} style={labelStyle}>CNB</label>
                    <input
                        type="number"
                        readOnly={!room.roomTypeId && !room.roomType}
                        min={0}
                        onWheel={(e) => e.target.blur()}
                        className={numInputCls}
                        value={room.noOfCnb ?? 0}
                        onChange={e => handleCnbChange(e.target.value)}
                    />
                </div>
            </div>

            {/* Price preview (read-only, inventory only) */}
            <div className="flex gap-2 mt-2 flex-wrap">
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 mb-0.5">Room Price</span>
                    <span className={readonlyBoxCls}>₹ {room.roomPrice ?? 0}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 mb-0.5">Extra Mat. Price</span>
                    <span className={readonlyBoxCls}>₹ {room.extraMattressPrice ?? 0}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 mb-0.5">CNB Price</span>
                    <span className={readonlyBoxCls}>₹ {room.cnbPrice ?? 0}</span>
                </div>
            </div>
        </div>
    );
}

// ─── RoomEntryManual ──────────────────────────────────────────────────────────
function RoomEntryManual({ room, roomIndex, rooms, canDelete, onRoomChange, onDeleteRoom }) {

    const handleField = (field, value) => {
        onRoomChange(roomIndex, { [field]: value });
    };

    return (
        <div className="border border-gray-100 rounded-xl p-4 mb-3 bg-white relative">

            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-bold" style={{ color: BLUE }}>
                    Room {roomIndex + 1}
                </span>
                {canDelete && (
                    <button
                        type="button"
                        onClick={() => onDeleteRoom(roomIndex)}
                        className="p-1 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                        title="Remove room"
                    >
                        <Trash2 size={14} />
                    </button>
                )}
            </div>

            {/* Row 1: Room Type | No. of Rooms */}
            <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                    <label className={labelCls} style={labelStyle}>🛏 Room Type</label>
                    <input
                        type="text"
                        placeholder="Enter room type"
                        className={numInputCls}
                        value={room.roomType ?? ''}
                        onChange={e => handleField('roomType', e.target.value)}
                    />
                </div>
                <div>
                    <label className={labelCls} style={labelStyle}>No. of Rooms</label>
                    <input
                        type="number"
                        min={1}
                        placeholder="1"
                        onWheel={(e) => e.currentTarget.blur()}
                        className={numInputCls}
                        value={room.noOfRooms ?? 1}
                        onChange={e => handleField('noOfRooms', Math.max(1, Number(e.target.value)))}
                    />
                </div>
            </div>

            {/* Row 2: Extra Mattress | CNB | Room Price */}
            <div className="grid grid-cols-3 gap-3">
                <div>
                    <label className={labelCls} style={labelStyle}>Extra Mattress</label>
                    <input
                        type="number"
                        min={0}
                        placeholder="0"
                        onWheel={(e) => e.currentTarget.blur()}
                        className={numInputCls}
                        value={room.noOfExtraMattress ?? 0}
                        onChange={e => handleField('noOfExtraMattress', Math.max(0, Number(e.target.value)))}
                    />
                </div>
                <div>
                    <label className={labelCls} style={labelStyle}>CNB</label>
                    <input
                        type="number"
                        min={0}
                        placeholder="0"
                        onWheel={(e) => e.currentTarget.blur()}
                        className={numInputCls}
                        value={room.noOfCnb ?? 0}
                        onChange={e => handleField('noOfCnb', Math.max(0, Number(e.target.value)))}
                    />
                </div>
                <div>
                    <label className={labelCls} style={labelStyle}>Room Price (₹)</label>
                    <input
                        type="number"
                        min={0}
                        placeholder="0"
                        onWheel={(e) => e.currentTarget.blur()}
                        className={numInputCls}
                        value={room.roomPrice ?? 0}
                        onChange={e => handleField('roomPrice', Math.max(0, Number(e.target.value)))}
                    />
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// HotelDetails — main exported component
// ─────────────────────────────────────────────────────────────────────────────
function HotelDetailsPrivateTrip({
    dayData,
    hotelsForActiveDay,
    roomTypesForActiveDay,
    roomRatesForActiveDayHotel,
    hotelLoading,
    roomTypeLoading,
    onDayChange,
    fetchRoomRateAgain
}) {
    const hotelType = dayData?.hotelDetails?.hotelType ?? 'inventory';
    const isInventory = hotelType === 'inventory';
    const rooms = dayData?.hotelDetails?.rooms ?? [blankRoom()];

    // ── helpers ──────────────────────────────────────────────────────────────

    const updateHotelTop = (field, value) => {
        onDayChange('hotelDetails', { ...dayData?.hotelDetails, [field]: value });
    };

    // change hotel type — reset rooms
    const handleTypeToggle = (type) => {
        onDayChange('hotelDetails', {
            ...dayData?.hotelDetails,
            hotelType: type,
            rooms: [blankRoom()],
        });
    };

    // change hotel — reset rooms + clear dependent fields
    const handleHotelChange = (hotelId) => {
        const h = hotelsForActiveDay?.find(h => h._id === hotelId);
        onDayChange('hotelDetails', {
            ...dayData?.hotelDetails,
            hotelId,
            hotelName: h?.hotelName ?? '',
            hotelImage: h?.images?.[0]?.url || null,
            amenities: h?.amenities ?? [],
            rooms: [blankRoom()],   // reset when hotel changes
        });
    };

    // change hotel category — reset hotel + rooms
    const handleCategoryChange = (cat) => {
        onDayChange('hotelDetails', {
            ...dayData?.hotelDetails,
            hotelCategory: cat,
            hotelId: null,
            hotelName: '',
            hotelImage: null,
            amenities: [],
            rooms: [blankRoom()],
        });
    };

    // update a single room entry (patch only changed fields)
    const handleRoomChange = (roomIndex, patch) => {
        const updated = rooms.map((r, i) =>
            i === roomIndex ? { ...r, ...patch } : r
        );
        onDayChange('hotelDetails', { ...dayData?.hotelDetails, rooms: updated });
    };

    // add a new blank room — only if last room is "filled"
    const handleAddRoom = () => {
        const lastRoom = rooms[rooms.length - 1];
        const isFilled = isInventory
            ? !!lastRoom.roomTypeId
            : !!(lastRoom.roomType?.trim());
        if (!isFilled) return; // guard

        onDayChange('hotelDetails', {
            ...dayData?.hotelDetails,
            rooms: [...rooms, blankRoom()],
        });
    };

    // delete a room entry (min 1 room)
    const handleDeleteRoom = (roomIndex) => {
        if (rooms.length <= 1) return;
        const updated = rooms.filter((_, i) => i !== roomIndex);
        onDayChange('hotelDetails', { ...dayData?.hotelDetails, rooms: updated });
    };

    // can the + button be clicked?
    const lastRoom = rooms[rooms.length - 1];
    const canAddRoom = isInventory ? !!lastRoom.roomTypeId : !!(lastRoom.roomType?.trim());

    // derived
    const selectedHotel = hotelsForActiveDay?.find(h => h._id === dayData?.hotelDetails?.hotelId);
    const amenities = selectedHotel?.amenities ?? dayData?.hotelDetails?.amenities ?? [];
    const hotelImage = selectedHotel?.images?.[0]?.url || dayData?.hotelDetails?.hotelImage || null;
    const rating = selectedHotel?.googleRating ?? null;

    // ── render ───────────────────────────────────────────────────────────────
    return (
        <div
            className="border border-gray-100 rounded-xl p-5 mb-5 bg-white"
            style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}
        >
            <SectionHeader icon={<Hotel size={16} />} label="Hotels" />

            {/* Toggle: Inventory | Manual */}
            <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
                <div className="flex gap-2">
                    {['inventory', 'manual'].map(type => {
                        const active = hotelType === type;
                        return (
                            <button
                                key={type}
                                type="button"
                                onClick={() => handleTypeToggle(type)}
                                className="px-[18px] py-1.5 rounded-full text-[13px] font-semibold cursor-pointer transition-all"
                                style={{
                                    background: active ? PINK : 'transparent',
                                    color: active ? 'white' : '#aaa',
                                    border: active ? `1px solid ${PINK}` : '1px solid #ddd',
                                }}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── INVENTORY ────────────────────────────────────────────────────── */}
            {isInventory && (
                <div className="flex gap-4 flex-wrap items-start">

                    {/* Left: dropdowns + rooms */}
                    <div className="flex-1 min-w-[260px] flex flex-col gap-3">

                        {/* Hotel Category | Hotel Name */}
                        <div className="grid grid-cols-2 gap-3">

                            {/* Category */}
                            <div>
                                <label className={labelCls} style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span>🏨</span> Hotel Category
                                </label>
                                <div className="relative">
                                    <select
                                        className={selectCls(!dayData?.subRegion1)}
                                        disabled={!dayData?.subRegion1}
                                        value={dayData?.hotelDetails?.hotelCategory ?? ''}
                                        onChange={e => handleCategoryChange(e.target.value)}
                                    >
                                        <option value="">Category</option>
                                        <option value="Budget">Budget</option>
                                        <option value="Premium">Premium</option>
                                        <option value="Luxury">Luxury</option>
                                    </select>
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-300 pointer-events-none">▼</span>
                                </div>
                            </div>

                            {/* Hotel Name */}
                            <div>
                                <label className={labelCls} style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span>🏨</span> Hotel Name
                                </label>
                                <div className="relative">
                                    <select
                                        className={selectCls(hotelLoading || !dayData?.hotelDetails?.hotelCategory)}
                                        disabled={hotelLoading || !dayData?.hotelDetails?.hotelCategory}
                                        value={dayData?.hotelDetails?.hotelId ?? ''}
                                        onChange={e => handleHotelChange(e.target.value)}
                                    >
                                        <option value="">Hotel Name</option>
                                        {(hotelsForActiveDay ?? [])
                                            .filter(h => !dayData?.hotelDetails?.hotelCategory || h.category === dayData?.hotelDetails?.hotelCategory)
                                            .map(h => (
                                                <option key={h._id} value={h._id}>{h.hotelName}</option>
                                            ))}
                                    </select>
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-300 pointer-events-none">▼</span>
                                </div>
                            </div>
                        </div>

                        {/* Amenities */}
                        {amenities?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                                {amenities.map((a, i) => <AmenityTag key={i} label={a} />)}
                            </div>
                        )}

                        {/* Rooms section */}
                        {dayData?.hotelDetails?.hotelId && (
                            <div className="mt-2">
                                <div className="flex items-center justify-between mb-2">
                                    {/* <p className="text-[13px] font-bold" style={{ color: BLUE }}>Rooms  <span onClick={fetchRoomRateAgain}>Refetch Room</span></p> */}
                                    

                                    <div
                                        className="text-[13px] font-bold flex gap-4 items-center justify-between"
                                        style={{ color: BLUE }}
                                    >
                                        <span>Rooms</span>

                                        <button
                                            type="button"
                                            onClick={fetchRoomRateAgain}
                                            disabled={!dayData?.hotelDetails?.hotelId}
                                            title="Refetch room rates"
                                            className="flex items-center gap-1 text-xs font-medium hover:opacity-80 transition-opacity"
                                            style={{ color: BLUE }}
                                        >
                                            <RefreshCw size={14} />
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAddRoom}
                                        disabled={!canAddRoom}
                                        title={canAddRoom ? 'Add another room' : 'Fill current room first'}
                                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold transition-all
                      ${canAddRoom
                                                ? 'cursor-pointer text-white'
                                                : 'cursor-not-allowed text-gray-300 bg-gray-100 border border-gray-200'}`}
                                        style={canAddRoom ? { background: PINK, border: `1px solid ${PINK}` } : {}}
                                    >
                                        <Plus size={13} />
                                        Add Room
                                    </button>
                                </div>

                                {rooms.map((room, idx) => (
                                    <RoomEntryInventory
                                        key={idx}
                                        room={room}
                                        roomIndex={idx}
                                        rooms={rooms}
                                        roomTypesForActiveDay={roomTypesForActiveDay}
                                        roomRatesForActiveDayHotel={roomRatesForActiveDayHotel}
                                        canDelete={rooms.length > 1}
                                        onRoomChange={handleRoomChange}
                                        onDeleteRoom={handleDeleteRoom}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: image + rating */}
                    <div className="shrink-0 flex flex-col gap-2" style={{ width: '20vw' }}>
                        <div
                            className="rounded-xl overflow-hidden bg-gray-100 border border-gray-100"
                            style={{ width: '20vw', height: '25vh' }}
                        >
                            {hotelImage ? (
                                <img
                                    src={hotelImage}
                                    alt="Hotel"
                                    className="w-full h-full object-cover"
                                    onError={e => { e.target.style.display = 'none'; }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-[12px]">
                                    No Image
                                </div>
                            )}
                        </div>
                        {rating && (
                            <div>
                                <div className="text-[12px] text-gray-400 mb-1">Rating</div>
                                <StarRating rating={rating} />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── MANUAL ───────────────────────────────────────────────────────── */}
            {!isInventory && (
                <div className="flex flex-col gap-3">

                    {/* Hotel Name (shared) */}
                    <div className="max-w-xs">
                        <label className={labelCls} style={labelStyle}>🏨 Hotel Name</label>
                        <input
                            type="text"
                            placeholder="Enter hotel name"
                            className={numInputCls}
                            value={dayData?.hotelDetails?.hotelName ?? ''}
                            onChange={e => updateHotelTop('hotelName', e.target.value)}
                        />
                    </div>

                    {/* Rooms */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[13px] font-bold" style={{ color: BLUE }}>Rooms</p>
                            <button
                                type="button"
                                onClick={handleAddRoom}
                                disabled={!canAddRoom}
                                title={canAddRoom ? 'Add another room' : 'Fill current room first'}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold transition-all
                  ${canAddRoom
                                        ? 'cursor-pointer text-white'
                                        : 'cursor-not-allowed text-gray-300 bg-gray-100 border border-gray-200'}`}
                                style={canAddRoom ? { background: PINK, border: `1px solid ${PINK}` } : {}}
                            >
                                <Plus size={13} />
                                Add Room
                            </button>
                        </div>

                        {rooms.map((room, idx) => (
                            <RoomEntryManual
                                key={idx}
                                room={room}
                                roomIndex={idx}
                                rooms={rooms}
                                canDelete={rooms.length > 1}
                                onRoomChange={handleRoomChange}
                                onDeleteRoom={handleDeleteRoom}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}


export default HotelDetailsPrivateTrip