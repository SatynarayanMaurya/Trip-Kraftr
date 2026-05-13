



import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEnquiryHooks } from '../../../hooks/useEnquiryHooks';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify'
import { ArrowLeft, MapPin, Calendar, Users, Hotel, Utensils, User, Phone, Mail, Building2, Tag, Pencil, Trash2 } from 'lucide-react'

const STATUS_STYLES = {
  New: 'bg-[#EFF6FF] text-[#3B82F6]',
  'In Progress': 'bg-[#FEF3C7] text-[#B45309]',
  Warm: 'bg-[#FFF7ED] text-[#EA580C]',
  Won: 'bg-[#F0FDF4] text-[#16A34A]',
  Lost: 'bg-[#FFF1F2] text-[#E11D48]',
}

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
}

function LoadingSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-5 w-28" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <Skeleton className="h-5 w-28" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <Skeleton className="h-5 w-28" />
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    </div>
  )
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-[#08255B]">{value || '—'}</p>
    </div>
  )
}

function ContactRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 p-1.5 rounded-full bg-[#FFF0F5]">
        <Icon size={13} className="text-[#ED5F8D]" />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-[#08255B]">{value || '—'}</p>
      </div>
    </div>
  )
}

function ViewB2BEnquiry() {
  const { enquiryId } = useParams()
  const navigate = useNavigate()
  const isProduction = useSelector(s => s.user.isProduction)
  const { getb2bEnquiryById } = useEnquiryHooks()
  const [fetchLoading, setFetchLoading] = useState(false)
  const [enquiryDetails, setEnquiryDetails] = useState(null)

  const fetchEnquiry = async () => {
    try {
      setFetchLoading(true)
      const response = await getb2bEnquiryById(enquiryId)
      setEnquiryDetails(response?.data?.foundEnquiry)
    } catch (error) {
      if (!isProduction) console.log("Error:", error)
      toast.error(error?.response?.data?.message || error?.message || "Failed to fetch enquiry")
    } finally {
      setFetchLoading(false)
    }
  }

  useEffect(() => {
    if (enquiryId && !enquiryDetails) fetchEnquiry()
  }, [enquiryId])

  if (fetchLoading) return <LoadingSkeleton />

  const d = enquiryDetails
  const acc = d?.accountId

  const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
  const childAgesStr = d?.childAges?.length ? `(${d.childAges.map(a => `${a}y`).join(', ')})` : ''

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans">
      {/* Header */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#08255B] mb-4 transition-colors">
        <ArrowLeft size={16} /> Back to List
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-lg font-bold text-[#08255B]">{d?.enquiryId || '—'}</h1>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLES[d?.status] || 'bg-gray-100 text-gray-600'}`}>
              {d?.status || '—'}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#08255B] text-white">B2B</span>
          </div>
          <p className="text-xs text-gray-400">Created on {formatDate(d?.createdAt)}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>navigate(`/enquiries/edit-b2b/${enquiryId}`)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
            <Pencil size={16} />
          </button>
          <button className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-400">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Trip Details */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 rounded-full bg-[#FFF0F5]">
              <MapPin size={14} className="text-[#ED5F8D]" />
            </div>
            <h2 className="text-sm font-bold text-[#08255B]">Trip Details</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5">
            <InfoItem label="Destinations" value={d?.destinations?.join(', ')} />
            <InfoItem label="No. of Days" value={d?.noOfDays ? `${d.noOfDays} Days` : '—'} />
            <InfoItem label="Start Date" value={formatDate(d?.startDate)} />
            <InfoItem label="Adults" value={d?.adult} />
            <InfoItem label="Child" value={d?.child ? `${d.child} ${childAgesStr}` : '0'} />
            <InfoItem label="Total Members" value={d?.totalMembers} />
            <InfoItem label="Hotel Category" value={d?.hotelCategory} />
            <InfoItem label="Trip Type" value={d?.tripType} />
            <InfoItem label="Dietary Preference" value={d?.dietaryPreference} />
            <InfoItem label="Assigned To" value={d?.assignedTo} />
            <InfoItem label="Source" value={acc?.source} />
          </div>
        </div>

        {/* Customer / Account Info */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 rounded-full bg-[#FFF0F5]">
              <User size={14} className="text-[#ED5F8D]" />
            </div>
            <h2 className="text-sm font-bold text-[#08255B]">Account Info</h2>
          </div>
          <div className="mb-4">
            <p className="text-sm font-bold text-[#08255B]">{acc?.businessName || '—'}</p>
            <p className="text-xs text-gray-400">Account ID: {acc?.accountId || '—'}</p>
          </div>
          <div className="space-y-3">
            <ContactRow icon={Phone} label="Phone Number" value={acc?.phone} />
            <ContactRow icon={Mail} label="Email Address" value={acc?.email} />
            <ContactRow icon={MapPin} label="State" value={acc?.state} />
            <ContactRow icon={Building2} label="Source" value={acc?.source} />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-full bg-[#FFF0F5]">
            <Tag size={14} className="text-[#ED5F8D]" />
          </div>
          <h2 className="text-sm font-bold text-[#08255B]">Notes & Requirements</h2>
        </div>
        {d?.notes
          ? <p className="text-sm text-gray-600 bg-[#FFF0F5CF] rounded-xl px-4 py-3 italic">"{d.notes}"</p>
          : <p className="text-sm text-gray-400 bg-gray-50 rounded-xl px-4 py-3">No notes added.</p>
        }
      </div>
    </div>
  )
}

export default ViewB2BEnquiry

