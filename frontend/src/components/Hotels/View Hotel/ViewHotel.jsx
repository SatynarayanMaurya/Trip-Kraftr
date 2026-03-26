import { useEffect, useState } from 'react'
import { useHotelHooks } from '../../../hooks/useHotelHooks'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  ArrowLeft, MapPin, Pencil, Star,
  Wifi, Wind, Tv, Clock, UtensilsCrossed,
  BedDouble, CheckSquare, Image as ImageIcon,
} from 'lucide-react'



// ── Category badge style ───────────────────────────────────────────────────
const categoryStyle = (cat) => {
  if (cat === 'Luxury')  return 'text-amber-600 bg-amber-50 border-amber-200'
  if (cat === 'Premium') return 'text-purple-600 bg-purple-50 border-purple-200'
  return 'text-blue-600 bg-blue-50 border-blue-200'
}

// ── Star display ───────────────────────────────────────────────────────────
function StarDisplay({ value }) {
  const filled = Math.round(Number(value) || 0)
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={18}
          className={s <= filled ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  )
}

// ── Toggle switch ──────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none
        ${checked ? 'bg-[#18305C]' : 'bg-gray-300'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
          ${checked ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  )
}

// ── Default image placeholder ──────────────────────────────────────────────
function ImagePlaceholder() {
  return (
    <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center gap-2 rounded-xl">
      <ImageIcon size={32} className="text-gray-300" />
      <span className="text-xs text-gray-400 font-medium">No Image</span>
    </div>
  )
}

// ── Loading Skeleton ───────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="min-h-screen bg-white p-6 md:p-8 font-sans animate-pulse">
      <div className="h-7 w-36 bg-gray-200 rounded mb-1" />
      <div className="h-4 w-24 bg-gray-100 rounded mb-6" />
      <div className="w-9 h-9 bg-gray-200 rounded-lg mb-6" />
      <div className="h-8 w-56 bg-gray-200 rounded mb-4" />
      <div className="flex gap-3 mb-6">
        <div className="h-6 w-24 bg-gray-100 rounded-full" />
        <div className="h-6 w-36 bg-gray-100 rounded-full" />
      </div>
      {/* Image row skeleton */}
      <div className="flex gap-4 mb-6">
        {[1,2,3].map(i => <div key={i} className="flex-1 h-44 bg-gray-100 rounded-xl" />)}
      </div>
      {/* Details card skeleton */}
      <div className="rounded-2xl border border-gray-200 p-6 space-y-4">
        <div className="h-4 w-64 bg-gray-100 rounded" />
        <div className="flex gap-3 flex-wrap">
          {[1,2,3,4,5].map(i => <div key={i} className="h-6 w-20 bg-gray-100 rounded" />)}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-8 w-full bg-gray-100 rounded" />
          <div className="h-8 w-full bg-gray-100 rounded" />
        </div>
        <div className="h-4 w-32 bg-gray-100 rounded" />
        <div className="flex gap-1">
          {[1,2,3,4,5].map(i => <div key={i} className="w-5 h-5 bg-gray-100 rounded" />)}
        </div>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function ViewHotel() {
  const { getHotelById } = useHotelHooks()
  const isProduction = useSelector((state) => state?.user?.isProduction)
  const { hotelId }  = useParams()
  const navigate     = useNavigate()

  const [hotelDetails, setHotelDetails] = useState(null)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [isActive,     setIsActive]     = useState(false)

  const fetchHotelDetails = async () => {
    try {
      setFetchLoading(true)
      const response = await getHotelById(hotelId)
      const data = response?.data?.foundHotel
      setHotelDetails(data)
      setIsActive(data?.is_active ?? false)
    } catch (error) {
      if (!isProduction) {
        console.log('========= ERROR DEBUG START =========')
        console.log('Error:', error)
        console.log('Response:', error?.response)
        console.log('========= ERROR DEBUG END =========')
      }
      toast.error(error?.response?.data?.message || error?.message || 'Error fetching hotel details')
    } finally {
      setFetchLoading(false)
    }
  }

  useEffect(() => {
    if (!hotelDetails) fetchHotelDetails()
  }, [])

  if (fetchLoading) return <Skeleton />

  // Build image slots — always 3 slots, fill with placeholders if needed
  const imageSlots = [0, 1, 2].map((i) => hotelDetails?.images?.[i] ?? null)

  return (
    <div className="min-h-screen bg-white p-6 md:p-8 ">

      {/* ── Page title ────────────────────────────────────────────────── */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-[#18305C]">Hotel Details</h1>
        <p className="text-sm text-gray-400 mt-0.5">Choose Path</p>
      </div>

      {/* ── Back button ───────────────────────────────────────────────── */}
      <button
        onClick={() => navigate(-1)}
        className="w-9 h-9 rounded-lg bg-[#E91E8C] hover:bg-pink-600 flex items-center justify-center transition-colors shadow-sm shadow-pink-200 mb-5 shrink-0"
      >
        <ArrowLeft size={16} className="text-white" />
      </button>

      {/* ── Hotel name + region pills ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
        <h2 className="text-2xl font-bold text-[#18305C]">
          {hotelDetails?.hotelName ?? '—'}
        </h2>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Sub-Region */}
          <div className="text-center">
            <p className="text-[11px] text-gray-400 font-medium mb-1">Sub-Region</p>
            <span className="inline-block px-3 py-1 rounded-full border border-[#E91E8C] text-[#E91E8C] text-xs font-semibold bg-pink-50">
              {hotelDetails?.subRegionId?.name ?? '—'}
            </span>
          </div>
          {/* Region */}
          <div className="text-center">
            <p className="text-[11px] text-gray-400 font-medium mb-1">Region</p>
            <span className="inline-block px-3 py-1 rounded-full border border-gray-300 text-[#18305C] text-xs font-semibold bg-gray-50">
              {hotelDetails?.regionId?.name ?? '—'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Image gallery ─────────────────────────────────────────────── */}
      <div
        className="bg-white rounded-2xl p-5 mb-5"
        style={{ 
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' 
          }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {imageSlots.map((img, idx) => (
            <div key={idx} className="h-44 rounded-xl overflow-hidden bg-gray-100">
              {img?.url ? (
                <img
                  src={img.url}
                  alt={`hotel-img-${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling?.style && (e.target.nextSibling.style.display = 'flex') }}
                />
              ) : (
                <ImagePlaceholder />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Details card ──────────────────────────────────────────────── */}
      <div
        // className="bg-white rounded-2xl p-5 md:p-6 mb-8"
        // style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.09)' }}
        className="bg-white rounded-2xl p-5 md:p-6 mb-8"
        style={{ 
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' 
        }}
      >
        {/* Top row: address + edit + toggle */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-2 min-w-0">
            <MapPin size={14} className="text-[#18305C] shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 leading-relaxed">
              {hotelDetails?.hotelName ?? '—'},{' '}
              {hotelDetails?.subRegionId?.name ?? '—'},{' '}
              {hotelDetails?.regionId?.name ?? '—'}{' '}
              {hotelDetails?.address ? `· ${hotelDetails.address}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate(`/hotels/update-hotel/${hotelDetails?._id}`, { state: { hotel: hotelDetails } })}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#E91E8C] hover:bg-pink-50 transition-colors"
              title="Edit"
            >
              <Pencil size={15} />
            </button>
            <Toggle checked={isActive} onChange={setIsActive} />
          </div>
        </div>

        {/* Amenities row */}
        {hotelDetails?.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-x-5 gap-y-2 mb-5">
            {hotelDetails.amenities.map((a) => (
              <div key={a} className="flex items-center gap-1.5 text-xs text-[#18305C] font-medium">
                <span className="text-[#18305C]"><CheckSquare size={13} /></span>
                {a}
              </div>
            ))}
          </div>
        )}

        {/* Contact + Email + Category row */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-4">
          <div className="flex gap-4 flex-wrap flex-1">
            {/* Contact */}
            <div>
              <p className="text-xs font-semibold text-[#18305C] mb-1">Contact no.</p>
              <div className="px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-xs text-[#18305C] font-medium">
                {hotelDetails?.contact ?? '—'}
              </div>
            </div>
            {/* Email */}
            <div>
              <p className="text-xs font-semibold text-[#18305C] mb-1">Email id</p>
              <div className="px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-xs text-[#18305C] font-medium">
                {hotelDetails?.email ?? '—'}
              </div>
            </div>
          </div>

          {/* Hotel Category */}
          <div className="shrink-0">
            <p className="text-xs font-semibold text-[#18305C] mb-1.5">Hotel Category</p>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${categoryStyle(hotelDetails?.category)}`}>
              <MapPin size={11} />
              {hotelDetails?.category ?? '—'}
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#18305C]">Rating</span>
          <span className="text-sm font-bold text-[#18305C]">{hotelDetails?.googleRating ?? '—'}</span>
          <StarDisplay value={hotelDetails?.googleRating} />
        </div>
      </div>

      {/* ── Manage Rooms button — bottom right ────────────────────────── */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate("manage-rooms", { state: { hotel:hotelDetails } })}
          className="flex items-center gap-2 px-6 py-3 bg-[#E91E8C] hover:bg-pink-600 text-white text-sm font-bold rounded-xl transition-colors"
          style={{ boxShadow: '0 4px 14px rgba(233,30,140,0.35)' }}
        >
          <BedDouble size={17} />
          Manage Rooms
        </button>
      </div>
    </div>
  )
}