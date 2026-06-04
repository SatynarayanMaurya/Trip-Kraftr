// ─────────────────────────────────────────────────────────────────────────────
// ViewDayContent.jsx  — all sections for a single day (read-only)
// Sub-components: ViewVehicle, ViewHotel, ViewPlaces, ViewActivities
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
    Hotel, Car, MapPin, Zap, Star,
    Wifi, Waves, ParkingCircle, Utensils, Dumbbell, Wind,
    Tv, Coffee, ShowerHead, Shirt, Baby,
    Flame, Shield, Accessibility, BedDouble, ChevronDown, ChevronUp,
} from 'lucide-react';

const BLUE = '#18305C';
const PINK = '#ED5F8D';
const GOLD = '#D7A30F';

// ─── amenity icon map ─────────────────────────────────────────────────────────
const AMENITY_ICONS = {
    'Free Wi-Fi': <Wifi size={13} />,
    'Swimming Pool': <Waves size={13} />,
    'Free Parking': <ParkingCircle size={13} />,
    'Restaurant': <Utensils size={13} />,
    'Fitness Center': <Dumbbell size={13} />,
    'Air Conditioning': <Wind size={13} />,
    'Smart TV': <Tv size={13} />,
    'Breakfast': <Coffee size={13} />,
    'Hot Shower': <ShowerHead size={13} />,
    'Airport Shuttle': <Car size={13} />,
    'Laundry': <Shirt size={13} />,
    'Kids Play Area': <Baby size={13} />,
    'Bonfire': <Flame size={13} />,
    '24/7 Security': <Shield size={13} />,
    'Accessible': <Accessibility size={13} />,
    'Room Service': <BedDouble size={13} />,
};

// ─── shared style helpers ─────────────────────────────────────────────────────
const sectionCard = (borderColor = '#eee') => ({
    border: `1px solid ${borderColor}`,
    borderRadius: '12px', padding: '18px',
    marginBottom: '16px', background: '#fff',
});
const sectionHeader = {
    display: 'flex', justifyContent: 'center', marginBottom: '16px',
};
const sectionHeaderInner = {
    background: BLUE, color: 'white', borderRadius: '8px',
    padding: '7px 24px', display: 'flex', alignItems: 'center',
    gap: '8px', fontSize: '13px', fontWeight: '700',
};
const labelTiny = {
    fontSize: '11px', fontWeight: '600', color: '#888',
    textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '3px',
};
const valueBold = { fontSize: '13px', fontWeight: '600', color: BLUE };
const chip = (color = BLUE, bg = '#f0f4ff') => ({
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    padding: '3px 10px', borderRadius: '9999px', fontSize: '12px',
    fontWeight: '600', color, background: bg,
});
const readBox = {
    border: '1px solid #e5e7eb', borderRadius: '8px',
    padding: '6px 12px', fontSize: '13px', color: '#555',
    background: '#f9fafb', display: 'inline-block',
};

// ─── SectionHeader ────────────────────────────────────────────────────────────
function SH({ icon, label }) {
    return (
        <div style={sectionHeader}>
            <div style={sectionHeaderInner}>{icon} {label}</div>
        </div>
    );
}

// ─── StarRating ───────────────────────────────────────────────────────────────
function StarRating({ rating }) {
    const num = parseFloat(rating) || 0;
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {[1, 2, 3, 4, 5].map(i => (
                <svg key={i} width="13" height="13" viewBox="0 0 24 24"
                    fill={i <= Math.round(num) ? '#FFC107' : '#e0e0e0'} stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            ))}
            {num > 0 && <span style={{ fontSize: '12px', fontWeight: '600', color: '#555', marginLeft: '3px' }}>{num}</span>}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// ViewVehicle
// ─────────────────────────────────────────────────────────────────────────────
function ViewVehicle({ vehicleDetails }) {
    const vehicles = Array.isArray(vehicleDetails) ? vehicleDetails.filter(v => v?.vehicleId) : [];

    return (
        <div style={sectionCard()}>
            <SH icon={<Car size={15} />} label="Vehicle" />
            {vehicles.length === 0
                ? <p style={{ textAlign: 'center', color: '#aaa', fontSize: '13px' }}>No vehicle added.</p>
                : vehicles.map((v, idx) => (
                    <div key={idx} style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '14px', alignItems: 'center',
                        border: '1px solid #f0f0f0', borderRadius: '10px',
                        padding: '14px', marginBottom: idx < vehicles.length - 1 ? '10px' : 0,
                    }}>
                        {/* Image */}
                        <div style={{ height: '80px', borderRadius: '8px', overflow: 'hidden', background: '#f3f4f6', border: '1px solid #e5e7eb' }}>
                            {v.vehicleImageUrl
                                ? <img src={v.vehicleImageUrl} alt={v.vehicleModel} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: '11px' }}>No Image</div>
                            }
                        </div>
                        {/* Details */}
                        <div>
                            <div style={labelTiny}>Vehicle</div>
                            <div style={{ fontSize: '15px', fontWeight: '700', color: BLUE }}>{v.vehicleModel || '—'}</div>
                            {v.vehicleType && <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{v.vehicleType}</div>}
                        </div>
                        <div>
                            <div style={labelTiny}>Capacity</div>
                            <div style={valueBold}>{v.capacity ? `${v.capacity} pax` : '—'}</div>
                        </div>
                        <div>
                            <div style={labelTiny}>Quantity</div>
                            <div style={valueBold}>{v.quantity ?? 1}</div>
                        </div>
                        <div>
                            <div style={labelTiny}>Price / Day</div>
                            <div style={{ ...valueBold, color: PINK }}>₹ {v.pricePerDay ?? 0}</div>
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// ViewHotel
// ─────────────────────────────────────────────────────────────────────────────
function ViewHotel({ hotelDetails }) {
    if (!hotelDetails) return null;
    const { hotelName, hotelCategory, hotelType, hotelImage, amenities, rooms, googleRating } = hotelDetails;
    const isManual = hotelType === 'manual';
    const hasHotel = !!(hotelName);
    const roomList = Array.isArray(rooms) ? rooms : [];
    const isMdUp = window.innerWidth >= 768;

    return (
        <div style={sectionCard()}>
            <SH icon={<Hotel size={15} />} label="Hotels" />

            {/* Type badge */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <span style={chip(isManual ? '#555' : 'white', isManual ? '#f3f4f6' : PINK)}>
                    {isManual ? 'Manual' : 'Inventory'}
                </span>
                {hotelCategory && (
                    <span style={chip(BLUE, '#eff6ff')}>{hotelCategory}</span>
                )}
            </div>

            {!hasHotel
                ? <p style={{ textAlign: 'center', color: '#aaa', fontSize: '13px' }}>No hotel added.</p>
                : (
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>

                        {/* Left: hotel info + rooms */}
                        {/* <div style={{ flex: 1, minWidth: '220px' }}> */}
                        <div style={{ flex: 1, width: '60%' }}>
                            <div style={{ marginBottom: '14px' }}>
                                <div style={labelTiny}>Hotel Name</div>
                                <div style={{ fontSize: '16px', fontWeight: '700', color: BLUE }}>{hotelName}</div>
                            </div>


                            {/* Rooms */}
                            {roomList?.length === 0
                                ? <p style={{ fontSize: '13px', color: '#aaa', fontStyle: 'italic' }}>No rooms added.</p>
                                : roomList.map((room, idx) => (
                                    <div key={idx} style={{
                                        border: '1px solid #f0f0f0', borderRadius: '10px',
                                        padding: '12px', marginBottom: '10px', background: '#fafafa',
                                    }}>
                                        <div style={{ fontSize: '12px', fontWeight: '700', color: BLUE, marginBottom: '10px' }}>
                                            Room {idx + 1}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {/* Row 1 */}
                                            <div
                                                style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: '2fr 1fr',
                                                    gap: '16px',
                                                    alignItems: 'start'
                                                }}
                                            >
                                                <div>
                                                    <div style={labelTiny}>Room Type</div>
                                                    <div style={valueBold}>{room.roomType || '—'}</div>
                                                </div>

                                                <div>
                                                    <div style={labelTiny}>Meal Plan</div>
                                                    <div style={valueBold}>{room.mealPlan?.toUpperCase() || '—'}</div>
                                                </div>
                                            </div>

                                            {/* Row 2 */}
                                            <div
                                                style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                                    gap: '16px'
                                                }}
                                            >
                                                <div>
                                                    <div style={labelTiny}>No. of Rooms</div>
                                                    <div style={valueBold}>{room.noOfRooms ?? 1}</div>
                                                </div>

                                                <div>
                                                    <div style={labelTiny}>Extra Mattress</div>
                                                    <div style={valueBold}>{room.noOfExtraMattress ?? 0}</div>
                                                </div>

                                                <div>
                                                    <div style={labelTiny}>CNB</div>
                                                    <div style={valueBold}>{room.noOfCnb ?? 0}</div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Price row — only inventory */}
                                        {!isManual && (
                                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                                                {[
                                                    { label: 'Room Price', val: room.roomPrice ?? 0 },
                                                    { label: 'Extra Mat.', val: room.extraMattressPrice ?? 0 },
                                                    { label: 'CNB Price', val: room.cnbPrice ?? 0 },
                                                ].map(({ label, val }) => (
                                                    <div key={label}>
                                                        <div style={{ ...labelTiny, marginBottom: '2px' }}>{label}</div>
                                                        <span style={readBox}>₹ {val}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {/* Manual: single room price */}
                                        {isManual && room.roomPrice > 0 && (
                                            <div style={{ marginTop: '10px' }}>
                                                <div style={labelTiny}>Room Price</div>
                                                <span style={readBox}>₹ {room.roomPrice}</span>
                                            </div>
                                        )}
                                    </div>
                                ))
                            }
                        </div>

                        {/* Right: image + rating */}
                        {/* <div style={{ width: '180px', flexShrink: 0 }}> */}
                        <div style={{
                            width: isMdUp ? '40%' : '100%',
                            flexShrink: 0
                        }}>
                            <div style={{ height: '200px', borderRadius: '10px', overflow: 'hidden', background: '#f3f4f6', border: '1px solid #e5e7eb', marginBottom: '8px' }}>
                                {hotelImage
                                    ? <img src={hotelImage} alt={hotelName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: '11px' }}>No Image</div>
                                }
                            </div>


                            {/* Amenities */}
                            {amenities?.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                                    {amenities.map((a, i) => (
                                        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#555', padding: '2px 8px' }}>
                                            <span style={{ color: GOLD }}>{AMENITY_ICONS[a]}</span> {a}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {googleRating && (
                                <>
                                    <div style={labelTiny}>Rating</div>
                                    <StarRating rating={googleRating} />
                                </>
                            )}
                        </div>
                    </div>
                )
            }
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// ViewPlaces
// ─────────────────────────────────────────────────────────────────────────────
function ViewPlaces({ placeDetails }) {
    const places = (placeDetails ?? []).filter(p => p?.placeId?._id || p?.placeId?.name);

    return (
        <div style={{ ...sectionCard('#fce4ec'), marginBottom: '16px' }}>
            <SH icon={<MapPin size={15} />} label="Places" />
            {places.length === 0
                ? <p style={{ textAlign: 'center', color: '#aaa', fontSize: '13px' }}>No places selected.</p>
                : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
                        {places.map((p, idx) => {
                            const place = p.placeId;
                            const isFav = p.isFavourite;
                            const name = place?.name || place?.placeName || '—';
                            const subRegion = place?.subRegionId?.name;
                            const notes = place?.notes;
                            const image = place?.imageUrl;

                            return (
                                <div key={idx} style={{
                                    borderRadius: '10px', overflow: 'hidden',
                                    border: `1.5px solid ${isFav ? PINK : '#f0d0da'}`,
                                    background: 'white',
                                    boxShadow: isFav ? `0 0 0 2px ${PINK}25` : 'none',
                                }}>
                                    <div style={{ width: '100%', height: '90px', background: '#f0f0f0', position: 'relative', overflow: 'hidden' }}>
                                        {image
                                            ? <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                                            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ddd', fontSize: '11px' }}>No image</div>
                                        }
                                        {isFav && (
                                            <span style={{ position: 'absolute', top: '6px', right: '6px', fontSize: '16px', lineHeight: 1, color: '#FFC107' }}>★</span>
                                        )}
                                    </div>
                                    <div style={{ padding: '8px 10px' }}>
                                        <div style={{ fontSize: '13px', fontWeight: '700', color: BLUE, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
                                        {subRegion && <div style={{ fontSize: '11px', color: '#888', marginTop: '1px' }}>{subRegion}</div>}
                                        {notes && <div style={{ fontSize: '11px', color: '#aaa', marginTop: '1px' }}>{notes.length > 30 ? notes.slice(0, 30) + '…' : notes}</div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )
            }
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// ViewActivities — collapsible
// ─────────────────────────────────────────────────────────────────────────────
function ViewActivities({ activities }) {
    const [open, setOpen] = useState(true);
    const list = (activities ?? []).filter(a => a?.activityName);

    return (
        <div style={sectionCard()}>
            {/* header with toggle */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: open ? '16px' : 0, position: 'relative' }}>
                <div style={sectionHeaderInner}><Zap size={15} /> Activities</div>
                <button
                    onClick={() => setOpen(o => !o)}
                    style={{ position: 'absolute', right: 0, top: 0, background: 'none', border: 'none', cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center' }}
                >
                    {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
            </div>

            {open && (
                list.length === 0
                    ? <p style={{ textAlign: 'center', color: '#aaa', fontSize: '13px' }}>No activities added.</p>
                    : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                            {list.map((act, idx) => (
                                <div key={idx} style={{
                                    border: '1px solid #f0f0f0', borderRadius: '10px',
                                    padding: '12px', background: '#fafafa',
                                }}>
                                    <div style={{ fontSize: '13px', fontWeight: '700', color: BLUE, marginBottom: '8px' }}>
                                        {act.activityName}
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                        {act.isComplimentary
                                            ? <span style={chip('#16a34a', '#f0fdf4')}>Complimentary</span>
                                            : <span style={chip('#1565c0', '#e3f2fd')}>Paid</span>
                                        }
                                        <span style={chip(BLUE, '#f0f4ff')}>Qty: {act.quantity ?? 1}</span>
                                        {!act.isComplimentary && act.price > 0 && (
                                            <span style={chip(PINK, '#fdf2f8')}>₹ {act.price}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// ViewDayContent — main export, composes all sections
// ─────────────────────────────────────────────────────────────────────────────
function ViewDayContent({ dayData }) {
    const { dayOverview, subRegion1, subRegion2, subRegion3, vehicleDetails, hotelDetails, placeDetails, activities } = dayData ?? {};

    const subRegions = [subRegion1, subRegion2, subRegion3].filter(s => s?.name || (typeof s === 'string' && s));

    return (
        <div>
            {/* Day Overview */}
            {dayOverview && (
                <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Day Overview</div>
                    <div style={{
                        padding: '10px 20px', borderRadius: '9999px',
                        border: '1px solid rgba(0,0,0,0.1)', background: '#fff',
                        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.06)',
                        fontSize: '14px', color: '#333', lineHeight: '1.5',
                    }}>
                        {dayOverview}
                    </div>
                </div>
            )}

            {/* Sub Regions */}
            {subRegions.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                    {subRegions.map((s, i) => (
                        <div key={i}>
                            <div style={{ fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '3px' }}>
                                Sub-Region {i > 0 ? i + 1 : ''}
                                {i === 0 && <span style={{ color: GOLD, marginLeft: '4px' }}>★</span>}
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: BLUE }}>
                                {s?.name ?? s}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ViewVehicle vehicleDetails={vehicleDetails} />
            <ViewHotel hotelDetails={hotelDetails} />
            <ViewPlaces placeDetails={placeDetails} />
            <ViewActivities activities={activities} />
        </div>
    );
}

export default ViewDayContent;