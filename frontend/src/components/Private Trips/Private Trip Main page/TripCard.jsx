import React from 'react'
import { Eye, Trash2, Plus, Search, ChevronDown, MapPin, Zap, Calendar, Users } from 'lucide-react'

const countPlaces = (daysDetails = []) =>
    daysDetails.reduce((sum, day) => sum + (day?.placeDetails?.length ?? 0), 0)

const countActivities = (daysDetails = []) =>
    daysDetails.reduce((sum, day) => sum + (day?.activities?.length ?? 0), 0)

const formatPrice = (price) => {
    if (!price) return '—'
    const num = price?.discountedPrice ?? price?.totalPrice ?? 0
    return `₹${Number(num).toLocaleString('en-IN')}`
}

const STATUS_STYLES = {
    Created: 'bg-green-100 text-green-700',
    Confirmed: 'bg-blue-100 text-blue-700',
    Cancelled: 'bg-red-100 text-red-700',
    Completed: 'bg-gray-100 text-gray-600',
}

const formatDate = (dateStr) => {
    if (!dateStr) return null
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
    })
}
function TripCard({ trip, onView, onDelete }) {
    const { privateTripId, enquiryId, regionDetails, itineraryBuilder, status, price } = trip

    const customerName = enquiryId?.accountId?.fullName ?? '—'
    const regionName = regionDetails?.region1?.name ?? null
    const tripName = itineraryBuilder?.tripName ?? null
    const daysDetails = itineraryBuilder?.daysDetails ?? []
    const places = countPlaces(daysDetails)
    const activities = countActivities(daysDetails)
    const nights = regionDetails?.noOfDays ?? null
    const days = nights ? nights + 1 : null
    const adults = regionDetails?.adults ?? 0
    const children = regionDetails?.children ?? 0
    const startDate = regionDetails?.startDate ? formatDate(regionDetails.startDate) : null
    const tripStatus = status ?? 'Created'

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-pink-100 transition-all duration-200 flex flex-col overflow-hidden">
            {/* header */}
            <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-2">
                <div>
                    <p className="text-xs text-gray-400 font-medium tracking-wide mb-0.5">{privateTripId}</p>
                    <h3 className="font-bold text-gray-900 text-base leading-tight">{customerName}</h3>
                    {(regionName || tripName) && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">
                            {tripName ?? regionName}
                        </p>
                    )}
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_STYLES[tripStatus] ?? 'bg-gray-100 text-gray-600'}`}>
                    {tripStatus}
                </span>
            </div>

            {/* meta row */}
            <div className="px-4 pb-3 flex flex-wrap gap-x-4 gap-y-1.5">
                {nights && days && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar size={12} className="text-gray-400" />
                        <span className="font-medium text-gray-700">{nights}N / {days}D</span>
                    </div>
                )}
                {(adults > 0 || children > 0) && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Users size={12} className="text-gray-400" />
                        <span className="font-medium text-gray-700">
                            {adults > 0 && `${adults} Adult${adults > 1 ? 's' : ''}`}
                            {adults > 0 && children > 0 && ', '}
                            {children > 0 && `${children} Child${children > 1 ? 'ren' : ''}`}
                        </span>
                    </div>
                )}
                {startDate && (
                    <div className="text-xs text-gray-500">
                        Starts: <span className="font-medium text-gray-700">{startDate}</span>
                    </div>
                )}
            </div>

            {/* tags */}
            <div className="px-4 pb-3 flex flex-wrap gap-2">
                <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-100">
                    <MapPin size={10} />
                    {places} {places === 1 ? 'Place' : 'Places'}
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                    <Zap size={10} />
                    {activities} {activities === 1 ? 'Activity' : 'Activities'}
                </span>
            </div>

            {/* footer */}
            <div className="mt-auto px-4 py-3 border-t border-gray-50 flex items-center justify-between">
                <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Total Price</p>
                    <p className="text-base font-bold text-[#E91E8C]">{formatPrice(price)}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onView(trip)}
                        className="p-2 rounded-lg text-pink-400 hover:text-[#E91E8C] hover:bg-pink-50 transition-colors"
                        title="View"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(trip)}
                        className="p-2 rounded-lg text-red-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TripCard