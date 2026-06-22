import {
    Search, SlidersHorizontal, Upload, Download, Plus,
    Pencil, Trash2, Phone, MapPin, ChevronDown, X,
  } from 'lucide-react'


  const categoryStyle = (cat) => {
    if (cat === 'Luxury')  return 'text-amber-600 bg-amber-50 border-amber-200'
    if (cat === 'Premium') return 'text-purple-600 bg-purple-50 border-purple-200'
    return 'text-blue-600 bg-blue-50 border-blue-200'
  }
// ── Hotel Card ─────────────────────────────────────────────────────────────
function HotelCard({ hotel, onEdit, onDelete, onView }) {
    return (
      <div
        className="bg-white rounded-2xl flex flex-col gap-3 p-5 transition-all duration-200 hover:-translate-y-1 cursor-default"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.09)' }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.14)' }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.09)' }}
      >
        {/* Status + Actions */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border
            ${hotel?.is_active
              ? 'bg-green-50 text-green-600 border-green-100'
              : 'bg-red-50 text-red-500 border-red-100'
            }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${hotel?.is_active ? 'bg-green-500' : 'bg-red-400'}`} />
            {hotel?.is_active ? 'Active' : 'Inactive'}
          </span>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => onDelete?.(hotel)}
              title="Delete"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
  
        {/* Name + Location */}
        <div>
          <h3 className="text-[18px] font-semibold text-[#18305C] leading-snug">{hotel?.hotelName ?? '—'}</h3>
          <p className="text-[12px] text-gray-400 mt-0.5">{hotel?.subRegionId?.name ?? '—'}</p>
          <p className="text-[14px] text-gray-400">{hotel?.regionId?.name ?? '—'}</p>
        </div>
  
        {/* Category */}
        <div className="flex items-center gap-1.5">
          <MapPin size={13} className="text-[#E91E8C] shrink-0" />
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${categoryStyle(hotel?.category)}`}>
            {hotel?.category ?? '—'}
          </span>
        </div>
  
        {/* Contact + View Details */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5">
            <Phone size={12} className="text-gray-400 shrink-0" />
            <span className="text-xs text-[#18305C] font-medium">{hotel?.contact ?? '—'}</span>
          </div>
          <button
            onClick={() => onView?.(hotel)}
            className="cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#18305C] text-[#18305C] hover:bg-[#18305C] hover:text-white transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    )
  }

  export default HotelCard