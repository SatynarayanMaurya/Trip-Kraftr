import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
    ChevronDown, ChevronUp, User, MapPin, Calendar, Users,
    Car, Building2, Star, Zap, Map, Phone, Mail, Briefcase,
    BedDouble, UtensilsCrossed, CheckCircle2
} from 'lucide-react'
import PriceSection from '../Add Private Trip/PriceSection'

// ─── Helpers ────────────────────────────────────────────────────────────────
const fmt = (val) => `₹${Number(val || 0).toLocaleString('en-IN')}`

const mealPlanLabel = {
    ep: 'EP',
    cp: 'CP',
    map: 'MAP',
    ap: 'AP',
}

function SectionHeader({ icon: Icon, label, color = '#18305C' }) {
    return (
        <div className="flex items-center justify-center gap-2 py-3">
            <div className="h-px flex-1 bg-pink-100" />
            <div
                className="flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-sm font-semibold"
                style={{ background: color }}
            >
                <Icon size={15} />
                {label}
            </div>
            <div className="h-px flex-1 bg-pink-100" />
        </div>
    )
}

function InfoRow({ label, value }) {
    if (!value && value !== 0) return null
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs text-gray-400 font-medium">{label}</span>
            <span className="text-sm text-[#18305C] font-semibold">{value}</span>
        </div>
    )
}

// ─── Collapsible Wrapper ─────────────────────────────────────────────────────
function CollapsibleSection({ title, icon: Icon, isOpen, onToggle, children, defaultOpen }) {
    return (
        <div className="border border-pink-100 rounded-2xl overflow-hidden mb-4 shadow-sm">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-[#FFF0F5] transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#FFF0F5' }}>
                        <Icon size={16} color="#ED5F8D" />
                    </div>
                    <span className="font-bold text-[#18305C] text-base">{title}</span>
                </div>
                {isOpen
                    ? <ChevronUp size={18} color="#ED5F8D" />
                    : <ChevronDown size={18} color="#ED5F8D" />
                }
            </button>
            {isOpen && (
                <div className="bg-[#FFFAFC] border-t border-pink-100 p-5">
                    {children}
                </div>
            )}
        </div>
    )
}

// ─── Customer Details ────────────────────────────────────────────────────────
function CustomerDetails({ enquiry, enquiryType }) {
    if (!enquiry?.accountId) return <p className="text-gray-400 text-sm">No customer data.</p>
    const { businessName, fullName, email, phone, source } = enquiry.accountId
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-2">
                <Briefcase size={15} className="mt-0.5 text-pink-400 shrink-0" />
                <InfoRow label="Business Name" value={businessName || fullName} />
            </div>
            <div className="flex items-start gap-2">
                <Mail size={15} className="mt-0.5 text-pink-400 shrink-0" />
                <InfoRow label="Email" value={email} />
            </div>
            <div className="flex items-start gap-2">
                <Phone size={15} className="mt-0.5 text-pink-400 shrink-0" />
                <InfoRow label="Phone" value={phone} />
            </div>
            <div className="flex items-start gap-2">
                <User size={15} className="mt-0.5 text-pink-400 shrink-0" />
                <InfoRow label="Source" value={source} />
            </div>
            <div className="flex items-start gap-2">
                <CheckCircle2 size={15} className="mt-0.5 text-pink-400 shrink-0" />
                <InfoRow label="Enquiry Type" value={enquiryType?.toUpperCase()} />
            </div>
        </div>
    )
}

// ─── Region Details ──────────────────────────────────────────────────────────
function RegionDetails({ regionDetails }) {
    if (!regionDetails) return null
    const { region1, region2, region3, adults, children, childAges, noOfDays, startDate } = regionDetails
    const regions = [region1, region2, region3].filter(Boolean)
    const start = startDate ? new Date(startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : null

    return (
        <div className="flex flex-col gap-5">
            {/* Regions */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {regions.map((r, i) => (
                    <div key={r._id} className="flex items-center gap-2 bg-white border border-pink-100 rounded-xl px-4 py-3 shadow-sm">
                        <MapPin size={15} color="#ED5F8D" />
                        <div>
                            <p className="text-xs text-gray-400">Region {i + 1}</p>
                            <p className="text-sm font-bold text-[#18305C]">{r.name}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-2">
                    <Calendar size={15} className="mt-0.5 text-pink-400 shrink-0" />
                    <InfoRow label="Start Date" value={start} />
                </div>
                <div className="flex items-start gap-2">
                    <Calendar size={15} className="mt-0.5 text-pink-400 shrink-0" />
                    <InfoRow label="No. of Days" value={noOfDays ? `${noOfDays} Days` : null} />
                </div>
                <div className="flex items-start gap-2">
                    <Users size={15} className="mt-0.5 text-pink-400 shrink-0" />
                    <InfoRow label="Adults" value={adults} />
                </div>
                <div className="flex items-start gap-2">
                    <Users size={15} className="mt-0.5 text-pink-400 shrink-0" />
                    <InfoRow label="Children" value={children} />
                </div>
                {childAges?.length > 0 && (
                    <div className="flex items-start gap-2 col-span-2 md:col-span-1">
                        <Users size={15} className="mt-0.5 text-pink-400 shrink-0" />
                        <InfoRow label="Child Ages" value={childAges.join(', ')} />
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Vehicle Section ─────────────────────────────────────────────────────────
function VehicleSection({ vehicles }) {
    if (!vehicles?.length) return (
        <p className="text-xs text-gray-400 italic">No vehicles assigned.</p>
    )
    return (
        <div className="flex flex-col gap-4">
            {vehicles.map((v, i) => (
                <div key={v._id || i} className="flex flex-col sm:flex-row gap-4 bg-white border border-pink-100 rounded-xl p-4 shadow-sm">
                    {v.vehicleImageUrl && (
                        <img
                            src={v.vehicleImageUrl}
                            alt={v.vehicleModel}
                            className="w-full sm:w-44 h-28 object-cover rounded-lg shrink-0"
                            onError={(e) => { e.target.style.display = 'none' }}
                        />
                    )}
                    <div className="flex flex-col gap-2 justify-center">
                        <p className="font-bold text-[#18305C] text-sm">{v.vehicleModel || '—'}</p>
                        <div className="flex flex-wrap gap-3">
                            {v.vehicleType && (
                                <span className="text-xs bg-pink-50 text-pink-500 border border-pink-200 rounded-full px-3 py-0.5 font-medium">
                                    {v.vehicleType}
                                </span>
                            )}
                            {v.capacity && (
                                <span className="text-xs text-gray-500">
                                    <span className="font-semibold text-[#18305C]">Capacity:</span> {v.capacity} pax
                                </span>
                            )}
                            {v.quantity && (
                                <span className="text-xs text-gray-500">
                                    <span className="font-semibold text-[#18305C]">Qty:</span> {v.quantity}
                                </span>
                            )}
                            {v.pricePerDay && (
                                <span className="text-xs text-gray-500">
                                    <span className="font-semibold text-[#18305C]">Price:</span> {fmt(v.pricePerDay)}/day
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

// ─── Hotel Section ───────────────────────────────────────────────────────────
function HotelSection({ hotel }) {
    if (!hotel) return <p className="text-xs text-gray-400 italic">No hotel assigned.</p>
    const isInventory = hotel.hotelType === 'inventory'

    return (
        <div className="bg-white border border-pink-100 rounded-xl p-4 shadow-sm">
            {/* Top: image (if inventory) + basic info */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex flex-col gap-3">
                    {/* Type badge */}
                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-3 py-0.5 rounded-full border ${isInventory
                                ? 'bg-[#18305C] text-white border-[#18305C]'
                                : 'bg-white text-[#18305C] border-[#18305C]'
                            }`}>
                            {isInventory ? 'Inventory' : 'Manual'}
                        </span>
                        {hotel.hotelCategory && (
                            <span className="text-xs bg-pink-50 text-pink-500 border border-pink-200 rounded-full px-3 py-0.5 font-medium">
                                {hotel.hotelCategory}
                            </span>
                        )}
                    </div>

                    <div>
                        <p className="font-bold text-[#18305C] text-sm">{hotel.hotelName || '—'}</p>
                    </div>

                    {/* Amenities (inventory only) */}
                    {isInventory && hotel.amenities?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {hotel.amenities.map((a) => (
                                <span key={a} className="text-xs bg-gray-50 text-gray-600 border border-gray-200 rounded-full px-2.5 py-0.5">
                                    {a}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Hotel image (inventory only) */}
                {isInventory && hotel.hotelImage && (
                    <img
                        src={hotel.hotelImage}
                        alt={hotel.hotelName}
                        className="w-full sm:w-40 h-28 object-cover rounded-lg shrink-0"
                        onError={(e) => { e.target.style.display = 'none' }}
                    />
                )}
            </div>

            {/* Rooms */}
            {hotel.rooms?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-pink-50">
                    <p className="text-xs font-bold text-[#18305C] mb-3 flex items-center gap-1">
                        <BedDouble size={13} color="#ED5F8D" /> Rooms
                    </p>
                    <div className="flex flex-col gap-3">
                        {hotel.rooms.map((room, i) => (
                            <div key={i} className="bg-[#FFFAFC] border border-pink-100 rounded-lg p-3">
                                <p className="text-sm font-semibold text-[#18305C] mb-2">
                                    Room {i + 1}{room.roomType ? ` — ${room.roomType}` : ''}
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {room.mealPlan && (
                                        <InfoRow label="Meal Plan" value={mealPlanLabel[room.mealPlan] || room.mealPlan?.toUpperCase()} />
                                    )}
                                    {room.noOfRooms !== undefined && (
                                        <InfoRow label="No. of Rooms" value={room.noOfRooms} />
                                    )}
                                    {room.maxAdults !== undefined && (
                                        <InfoRow label="Max Adults" value={room.maxAdults} />
                                    )}
                                    {room.roomPrice !== undefined && (
                                        <InfoRow label="Room Price" value={fmt(room.roomPrice)} />
                                    )}
                                    {room.extraMattressPrice !== undefined && (
                                        <InfoRow label="Extra Mattress" value={fmt(room.extraMattressPrice)} />
                                    )}
                                    {room.cnbPrice !== undefined && (
                                        <InfoRow label="CNB Price" value={fmt(room.cnbPrice)} />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

// ─── Places Section ──────────────────────────────────────────────────────────
function PlacesSection({ places }) {
    const validPlaces = places?.filter((p) => p?.placeId?.placeName)
    if (!validPlaces?.length) return <p className="text-xs text-gray-400 italic">No places added.</p>

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-3">
            {validPlaces?.map((p, i) => (
                <div
                    key={i}
                    className={`relative bg-white border rounded-xl p-3 shadow-sm ${p?.isFavourite ? 'border-pink-300' : 'border-pink-100'
                        }`}
                >
                    {p.isFavourite && (
                        <Star size={14} fill="#ED5F8D" color="#ED5F8D" className="absolute top-3.5 right-3.5" />
                    )}
                    <img src={p?.placeId?.imageUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_zl51KaFQb56joRd1jPYTMxPMx2bBMEHXUkaPrvjb9Q&s"} alt="" className='object-contain rounded-lg w-full h-24' />
                    <p className="text-sm mt-2 font-bold text-[#18305C] pr-5">{p?.placeId?.placeName}</p>
                    {p?.placeId?.notes && <p className="text-xs text-gray-500 mt-1">{p?.placeId?.notes}</p>}
                </div>
            ))}
        </div>
    )
}

// ─── Activities Section ──────────────────────────────────────────────────────
function ActivitiesSection({ activities }) {
    if (!activities?.length) return <p className="text-xs text-gray-400 italic">No activities added.</p>

    return (
        <div className="flex flex-col gap-3">
            {activities.map((a, i) => (
                <div key={a._id || i} className="flex items-center justify-between bg-white border border-pink-100 rounded-xl px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Zap size={14} color="#ED5F8D" />
                        <div>
                            <p className="text-sm font-bold text-[#18305C]">{a.activityName || '—'}</p>
                            <div className="flex gap-3 mt-0.5">
                                {a.quantity !== undefined && (
                                    <span className="text-xs text-gray-500">Qty: {a.quantity}</span>
                                )}
                                {a.isComplimentary ? (
                                    <span className="text-xs text-green-500 font-semibold">Complimentary</span>
                                ) : (
                                    a.price !== undefined && (
                                        <span className="text-xs text-gray-500">{fmt(a.price)}</span>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${a.isComplimentary
                            ? 'bg-green-50 text-green-600 border-green-200'
                            : 'bg-pink-50 text-pink-500 border-pink-200'
                        }`}>
                        {a.isComplimentary ? 'Free' : 'Paid'}
                    </span>
                </div>
            ))}
        </div>
    )
}

// ─── Single Day Content ───────────────────────────────────────────────────────
function DayContent({ day }) {
    const subRegions = [day.subRegion1, day.subRegion2, day.subRegion3].filter(Boolean)

    return (
        <div className="flex flex-col gap-5">
            {/* Sub Regions */}
            {subRegions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {subRegions.map((sr, i) => (
                        <span key={sr._id || i} className="flex items-center gap-1.5 text-xs font-semibold bg-[#18305C] text-white px-3 py-1 rounded-full">
                            <MapPin size={11} /> {sr.name}
                        </span>
                    ))}
                </div>
            )}

            {/* Day Overview */}
            {day.dayOverview && (
                <p className="text-sm text-gray-600 italic">{day.dayOverview}</p>
            )}

            {/* Vehicle */}
            <div className="rounded-xl border border-pink-100 overflow-hidden">
                <SectionHeader icon={Car} label="Vehicle" color="#18305C" />
                <div className="px-4 pb-4">
                    <VehicleSection vehicles={day.vehicleDetails} />
                </div>
            </div>

            {/* Hotel */}
            <div className="rounded-xl border border-pink-100 overflow-hidden">
                <SectionHeader icon={Building2} label="Hotels" color="#18305C" />
                <div className="px-4 pb-4">
                    <HotelSection hotel={day.hotelDetails} />
                </div>
            </div>

            {/* Places */}
            <div className="rounded-xl border border-pink-100 overflow-hidden">
                <SectionHeader icon={Map} label="Places" color="#18305C" />
                <div className="px-4 pb-4">
                    <PlacesSection places={day.placeDetails} />
                </div>
            </div>

            {/* Activities */}
            <div className="rounded-xl border border-pink-100 overflow-hidden">
                <SectionHeader icon={Zap} label="Activities" color="#18305C" />
                <div className="px-4 pb-4">
                    <ActivitiesSection activities={day.activities} />
                </div>
            </div>
        </div>
    )
}

// ─── Days Details ─────────────────────────────────────────────────────────────
function DaysDetails_Inner({ daysDetails, startDate }) {
    const [activeDay, setActiveDay] = useState(0)

    const getDateForDay = (index) => {
        if (!startDate) return null
        const d = new Date(startDate)
        d.setDate(d.getDate() + index)
        return d
    }

    const dayLabel = (index) => {
        const d = getDateForDay(index)
        return d ? d.toLocaleDateString('en-IN', { weekday: 'short' }) : ''
    }

    return (
        <div className="flex flex-col md:flex-row gap-5">
            {/* Day Tabs — horizontal scroll on mobile, vertical on desktop */}
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-1 md:pb-0 md:w-28 shrink-0">
                {daysDetails.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveDay(i)}
                        className={`shrink-0 flex flex-col items-center justify-center px-4 py-2.5 rounded-xl font-semibold text-sm transition-all
              ${activeDay === i
                                ? 'bg-[#18305C] text-white shadow-md'
                                : 'bg-white border border-pink-100 text-[#18305C] hover:bg-[#FFF0F5]'
                            }`}
                    >
                        <span className="text-xs font-bold">Day {i + 1}</span>
                        {dayLabel(i) && (
                            <span className={`text-xs ${activeDay === i ? 'text-pink-200' : 'text-gray-400'}`}>
                                {dayLabel(i)}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Day Content */}
            <div className="flex-1 min-w-0">
                {daysDetails[activeDay] && (
                    <DayContent day={daysDetails[activeDay]} />
                )}
            </div>
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────
function DaysDetails() {
    const { privateTripId } = useParams()
    const privateTripDetails = useSelector((s) => s.privateTrip.privateTripById?.[privateTripId])

    const [openSection, setOpenSection] = useState('days')

    const toggle = (key) => setOpenSection((prev) => (prev === key ? null : key))

    const enquiry = privateTripDetails?.enquiryId
    const regionDetails = privateTripDetails?.regionDetails
    const itinerary = privateTripDetails?.itineraryBuilder

    return (
        <div  style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <div className=" w-full mx-auto">
                {/* Customer Details */}
                <CollapsibleSection
                    title="Customer Details"
                    icon={User}
                    isOpen={openSection === 'customer'}
                    onToggle={() => toggle('customer')}
                >
                    <CustomerDetails enquiry={enquiry} enquiryType={privateTripDetails?.enquiryType} />
                </CollapsibleSection>

                {/* Region Details */}
                <CollapsibleSection
                    title="Region Details"
                    icon={MapPin}
                    isOpen={openSection === 'region'}
                    onToggle={() => toggle('region')}
                >
                    <RegionDetails regionDetails={regionDetails} />
                </CollapsibleSection>

                {/* Days Details */}
                <CollapsibleSection
                    title="Days Details"
                    icon={Calendar}
                    isOpen={openSection === 'days'}
                    onToggle={() => toggle('days')}
                >
                    {itinerary?.daysDetails?.length > 0 ? (
                        <DaysDetails_Inner
                            daysDetails={itinerary.daysDetails}
                            startDate={regionDetails?.startDate}
                        />
                    ) : (
                        <p className="text-sm text-gray-400 italic">No day details available.</p>
                    )}
                </CollapsibleSection>

            </div>

            <PriceSection 
                price={privateTripDetails?.price} 
                noOfDays={privateTripDetails?.regionDetails?.noOfDays || 3} 
                isEditable={false} 
                formData={privateTripDetails} 
                
            />
        </div>
    )
}

export default DaysDetails