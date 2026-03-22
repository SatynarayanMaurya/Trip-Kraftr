import React, { useState } from 'react'
import {
    Car, MapPin, Pencil, Trash2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'


function VehicleCard({ vehicle, onEdit, onDelete }) {
    const navigate = useNavigate()
    const [imgError, setImgError] = useState(false)
    const [hovered, setHovered] = useState(false)

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="bg-white rounded-2xl overflow-hidden"
            style={{
                border: hovered ? '1.5px solid #C9CDD6' : '1.5px solid #E5E7EB',
                boxShadow: hovered
                    ? '0 10px 32px rgba(24,48,92,0.14), 0 2px 8px rgba(0,0,0,0.06)'
                    : '0 2px 10px rgba(0,0,0,0.07)',
                transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
                transition: 'all 0.22s ease',
            }}
        >
            {/* Image area */}
            <div className="relative bg-[#ECEEF2] h-[150px] overflow-hidden">
                {vehicle?.vehicleImageUrl && !imgError ? (
                    <img
                        src={vehicle.vehicleImageUrl}
                        alt={vehicle?.vehicleModel}
                        className="w-full h-full object-cover"
                        style={{
                            transform: hovered ? 'scale(1.05)' : 'scale(1)',
                            transition: 'transform 0.35s ease',
                        }}
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Car size={38} className="text-[#BDC2CE]" strokeWidth={1.4} />
                    </div>
                )}

                {/* Edit / Delete */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    <button
                        onClick={() =>
                            navigate(`update-vehicle/${vehicle?._id}`, {
                                state: { vehicle: vehicle }
                            })
                        }
                        title="Edit"
                        className="w-7 h-7 rounded-lg bg-white flex items-center justify-center"
                        style={{
                            border: '1.5px solid #F3C6E0',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
                            transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = '#FFF0F7'
                            e.currentTarget.style.borderColor = '#E91E8C'
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(233,30,140,0.20)'
                            e.currentTarget.style.transform = 'scale(1.08)'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = '#fff'
                            e.currentTarget.style.borderColor = '#F3C6E0'
                            e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.10)'
                            e.currentTarget.style.transform = 'scale(1)'
                        }}
                    >
                        <Pencil size={13} className="text-[#E91E8C]" strokeWidth={2} />
                    </button>
                    <button
                        onClick={() => onDelete?.(vehicle)}
                        title="Delete"
                        className="w-7 h-7 rounded-lg bg-white flex items-center justify-center"
                        style={{
                            border: '1.5px solid #FECACA',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
                            transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = '#FFF5F5'
                            e.currentTarget.style.borderColor = '#EF4444'
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(239,68,68,0.20)'
                            e.currentTarget.style.transform = 'scale(1.08)'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = '#fff'
                            e.currentTarget.style.borderColor = '#FECACA'
                            e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.10)'
                            e.currentTarget.style.transform = 'scale(1)'
                        }}
                    >
                        <Trash2 size={13} className="text-[#EF4444]" strokeWidth={2} />
                    </button>
                </div>

                {/* Inactive badge */}
                {!vehicle?.is_active && (
                    <div className="absolute top-2.5 left-2.5">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-500 border border-red-200">
                            Inactive
                        </span>
                    </div>
                )}
            </div>

            {/* Card body */}
            <div className="px-4 pt-3 pb-4">

                {/* Type + Model row */}
                <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                        <Car size={15} className="text-[#E91E8C] shrink-0" strokeWidth={2} />
                        <span className="text-sm font-bold text-[#18305C]">{vehicle?.vehicleType ?? '—'}</span>
                    </div>
                    <span className="text-sm font-bold text-[#18305C]">{vehicle?.vehicleModel ?? '—'}</span>
                </div>
                {/* Type + Model row */}
                <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1 mb-3">
                        <MapPin size={13} className="text-[#E91E8C] shrink-0" strokeWidth={2.5} fill="#E91E8C" />
                        <span className="text-sm font-bold text-[#E91E8C]">{vehicle?.regionId?.name ?? '—'}</span>
                    </div>
                    <span className="text-sm font-bold text-[#18305C]">{vehicle?.capacity ?? '—'}</span>
                </div>

                {/* Region */}


                {/* Divider */}
                <div className="border-t border-gray-100 mb-3" />

                {/* Pricing */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[11px] text-gray-400 font-semibold mb-0.5">Daily Rate</p>
                        <p className="text-sm font-bold text-[#18305C]">
                            ₹ {vehicle?.pricePerDay?.toLocaleString('en-IN') ?? '—'}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[11px] text-gray-400 font-semibold mb-0.5">Transfer</p>
                        <p className="text-sm font-bold text-[#18305C]">
                            ₹ {vehicle?.transferPrice?.toLocaleString('en-IN') ?? '—'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VehicleCard