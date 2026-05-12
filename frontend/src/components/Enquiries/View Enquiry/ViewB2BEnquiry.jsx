



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






// import React, { useEffect, useState } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { useEnquiryHooks } from '../../../hooks/useEnquiryHooks';
// import { useSelector } from 'react-redux';
// import { toast } from 'react-toastify'
// import {
//   ArrowLeft, MapPin, Calendar, Users, Hotel, Tag, Utensils,
//   User, Phone, Mail, Globe, Building2, Briefcase, ClipboardList,
//   Edit2, Trash2, Loader2
// } from 'lucide-react'

// /* ─────────────────────────────────────────────
//    SKELETON COMPONENTS
// ───────────────────────────────────────────── */
// const Shimmer = ({ className = '' }) => (
//   <div className={`skeleton-shimmer ${className}`} />
// )

// const SkeletonCard = ({ rows = 4 }) => (
//   <div className="card">
//     <div className="card-header-sk">
//       <Shimmer className="sk-icon-circle" />
//       <Shimmer className="sk-title" />
//     </div>
//     <div className="card-grid">
//       {Array.from({ length: rows }).map((_, i) => (
//         <div key={i} className="sk-field">
//           <Shimmer className="sk-label" />
//           <Shimmer className="sk-value" />
//         </div>
//       ))}
//     </div>
//   </div>
// )

// const SkeletonPage = () => (
//   <div className="page-wrapper">
//     {/* Header */}
//     <div className="top-bar">
//       <Shimmer className="sk-back-btn" />
//       <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
//         <Shimmer className="sk-icon-btn" />
//         <Shimmer className="sk-icon-btn" />
//       </div>
//     </div>

//     <div className="meta-row">
//       <Shimmer className="sk-enq-id" />
//       <Shimmer className="sk-badge" />
//       <Shimmer className="sk-date" />
//       <Shimmer className="sk-tag" />
//     </div>

//     <div className="two-col">
//       <SkeletonCard rows={6} />
//       <SkeletonCard rows={4} />
//     </div>

//     <SkeletonCard rows={1} />
//   </div>
// )

// /* ─────────────────────────────────────────────
//    HELPERS
// ───────────────────────────────────────────── */
// const fmt = (dateStr) => {
//   if (!dateStr) return '—'
//   return new Date(dateStr).toLocaleDateString('en-IN', {
//     day: '2-digit', month: 'short', year: 'numeric'
//   })
// }

// const StatusBadge = ({ status }) => {
//   const map = {
//     New: { bg: '#E8F5E9', color: '#2E7D32' },
//     'In Process': { bg: '#FFF3E0', color: '#E65100' },
//     Closed: { bg: '#FFEBEE', color: '#B71C1C' },
//     Confirmed: { bg: '#E3F2FD', color: '#0D47A1' },
//   }
//   const style = map[status] || { bg: '#F3F4F6', color: '#374151' }
//   return (
//     <span className="status-badge" style={{ background: style.bg, color: style.color }}>
//       {status}
//     </span>
//   )
// }

// const InfoRow = ({ icon: Icon, label, value, accent }) => (
//   <div className="info-row">
//     <div className="info-icon-wrap">
//       <Icon size={14} color="#ED5F8D" />
//     </div>
//     <div className="info-text">
//       <span className="info-label">{label}</span>
//       <span className={`info-value ${accent ? 'accent' : ''}`}>{value || '—'}</span>
//     </div>
//   </div>
// )

// const FieldBox = ({ label, value, wide }) => (
//   <div className={`field-box ${wide ? 'wide' : ''}`}>
//     <p className="field-label">{label}</p>
//     <p className="field-value">{value || '—'}</p>
//   </div>
// )

// /* ─────────────────────────────────────────────
//    MAIN COMPONENT
// ───────────────────────────────────────────── */
// function ViewB2BEnquiry() {
//   const { enquiryId } = useParams()
//   const navigate = useNavigate()
//   const isProduction = useSelector(s => s.user.isProduction)
//   const { getb2bEnquiryById } = useEnquiryHooks()
//   const [fetchLoading, setFetchLoading] = useState(false)
//   const [enquiryDetails, setEnquiryDetails] = useState(null)

//   const fetchEnquiry = async () => {
//     try {
//       setFetchLoading(true)
//       const response = await getb2bEnquiryById(enquiryId)
//       setEnquiryDetails(response?.data?.foundEnquiry)
//     } catch (error) {
//       if (!isProduction) {
//         console.log("========= ERROR DEBUG START =========")
//         console.log("Error:", error)
//         console.log("Response:", error?.response)
//         console.log("========= ERROR DEBUG END =========")
//       }
//       toast.error(error?.response?.data?.message || error?.message || "Error fetching enquiry")
//     } finally {
//       setFetchLoading(false)
//     }
//   }

//   useEffect(() => {
//     if (enquiryId && !enquiryDetails) fetchEnquiry()
//   }, [enquiryId])

//   if (fetchLoading) return (
//     <>
//       <style>{styles}</style>
//       <SkeletonPage />
//     </>
//   )

//   if (!enquiryDetails) return (
//     <>
//       <style>{styles}</style>
//       <div className="page-wrapper empty-state">
//         <p>No enquiry data found.</p>
//       </div>
//     </>
//   )

//   const {
//     enquiryId: enqId, status, createdAt, tripType,
//     destinations = [], noOfDays, startDate,
//     adult, child, childAges = [], hotelCategory,
//     dietaryPreference, assignedTo, notes,
//     accountId = {}
//   } = enquiryDetails

//   const { accountId: accId, businessName, email, phone, source, state } = accountId

//   return (
//     <>
//       <style>{styles}</style>
//       <div className="page-wrapper">

//         {/* ── Top bar ── */}
//         <div className="top-bar">
//           <button className="back-btn" onClick={() => navigate(-1)}>
//             <ArrowLeft size={16} />
//             Back to List
//           </button>
//           <div className="action-btns">
//             <button className="icon-btn edit-btn" title="Edit">
//               <Edit2 size={16} />
//             </button>
//             <button className="icon-btn delete-btn" title="Delete">
//               <Trash2 size={16} />
//             </button>
//           </div>
//         </div>

//         {/* ── Meta row ── */}
//         <div className="meta-row">
//           <span className="enq-id">{enqId}</span>
//           <StatusBadge status={status} />
//           <span className="created-date">Created on {fmt(createdAt)}</span>
//           {tripType && <span className="trip-type-tag">{tripType}</span>}
//         </div>

//         {/* ── Two-column layout ── */}
//         <div className="two-col">

//           {/* Trip Details card */}
//           <div className="card">
//             <div className="card-heading">
//               <span className="card-icon-wrap"><MapPin size={15} color="#ED5F8D" /></span>
//               <h2 className="card-title">Trip Details</h2>
//             </div>

//             <div className="card-grid">
//               <FieldBox
//                 label="Destinations"
//                 value={destinations.join(' , ')}
//                 wide
//               />
//               <FieldBox label="No. of Days" value={`${noOfDays} Day${noOfDays !== 1 ? 's' : ''}`} />
//               <FieldBox label="Start Date" value={fmt(startDate)} />
//               <FieldBox label="Adults" value={adult} />
//               <FieldBox
//                 label="Child"
//                 value={child
//                   ? `${child} (${childAges.map(a => `${a}y`).join(', ')})`
//                   : '0'}
//               />
//               <FieldBox label="Hotel Category" value={hotelCategory} />
//               <FieldBox label="Source" value={source} />
//               <FieldBox label="Dietary Preference" value={dietaryPreference} />
//               <FieldBox label="Assigned To" value={assignedTo} accent />
//             </div>
//           </div>

//           {/* Customer / Account Info card */}
//           <div className="card customer-card">
//             <div className="card-heading">
//               <span className="card-icon-wrap"><Building2 size={15} color="#ED5F8D" /></span>
//               <h2 className="card-title">Account Info</h2>
//             </div>

//             <div className="account-top">
//               <div className="account-avatar">
//                 <Building2 size={20} color="#ED5F8D" />
//               </div>
//               <div>
//                 <p className="account-name">{businessName || '—'}</p>
//                 <p className="account-id">Account ID: {accId || '—'}</p>
//               </div>
//             </div>

//             <div className="info-rows">
//               <InfoRow icon={Phone} label="Phone Number" value={phone} />
//               <InfoRow icon={Mail} label="Email Address" value={email} />
//               <InfoRow icon={Globe} label="Source" value={source} />
//               <InfoRow icon={MapPin} label="State" value={state} />
//             </div>
//           </div>
//         </div>

//         {/* ── Notes card ── */}
//         <div className="card notes-card">
//           <div className="card-heading">
//             <span className="card-icon-wrap"><ClipboardList size={15} color="#ED5F8D" /></span>
//             <h2 className="card-title">Notes &amp; Requirements</h2>
//           </div>
//           <div className="notes-box">
//             {notes
//               ? <p className="notes-text">"{notes}"</p>
//               : <p className="notes-empty">No notes added.</p>}
//           </div>
//         </div>

//       </div>
//     </>
//   )
// }

// export default ViewB2BEnquiry

// /* ─────────────────────────────────────────────
//    STYLES
// ───────────────────────────────────────────── */
// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

//   .page-wrapper {
//     font-family: 'DM Sans', sans-serif;
//     padding: 24px;
//     max-width: 1200px;
//     margin: 0 auto;
//     color: #08255B;
//   }

//   /* ── Top bar ── */
//   .top-bar {
//     display: flex;
//     align-items: center;
//     margin-bottom: 16px;
//     gap: 12px;
//   }

//   .back-btn {
//     display: flex;
//     align-items: center;
//     gap: 6px;
//     background: none;
//     border: none;
//     cursor: pointer;
//     color: #08255B;
//     font-size: 14px;
//     font-weight: 500;
//     padding: 6px 10px;
//     border-radius: 8px;
//     transition: background 0.2s;
//   }
//   .back-btn:hover { background: #FFF0F5CF; }

//   .action-btns { display: flex; gap: 8px; margin-left: auto; }

//   .icon-btn {
//     width: 36px; height: 36px;
//     border: none; border-radius: 8px;
//     cursor: pointer;
//     display: flex; align-items: center; justify-content: center;
//     transition: background 0.2s, transform 0.15s;
//   }
//   .icon-btn:hover { transform: scale(1.05); }
//   .edit-btn { background: #FFF0F5CF; color: #ED5F8D; }
//   .edit-btn:hover { background: #fce4ec; }
//   .delete-btn { background: #FFF0F5CF; color: #e53935; }
//   .delete-btn:hover { background: #ffebee; }

//   /* ── Meta row ── */
//   .meta-row {
//     display: flex;
//     align-items: center;
//     flex-wrap: wrap;
//     gap: 10px;
//     margin-bottom: 20px;
//   }

//   .enq-id {
//     font-size: 15px;
//     font-weight: 700;
//     color: #08255B;
//   }

//   .created-date {
//     font-size: 13px;
//     color: #6B7280;
//   }

//   .status-badge {
//     font-size: 12px;
//     font-weight: 600;
//     padding: 3px 12px;
//     border-radius: 20px;
//   }

//   .trip-type-tag {
//     background: #08255B;
//     color: #fff;
//     font-size: 11px;
//     font-weight: 600;
//     padding: 3px 10px;
//     border-radius: 20px;
//     letter-spacing: 0.3px;
//   }

//   /* ── Two column ── */
//   .two-col {
//     display: grid;
//     grid-template-columns: 1fr 320px;
//     gap: 16px;
//     margin-bottom: 16px;
//   }
//   @media (max-width: 900px) {
//     .two-col { grid-template-columns: 1fr; }
//   }

//   /* ── Card ── */
//   .card {
//     background: #fff;
//     border-radius: 14px;
//     padding: 20px 22px;
//     border: 1px solid #F0E4EA;
//     box-shadow: 0 2px 10px rgba(8,37,91,0.05);
//   }

//   .card-heading {
//     display: flex;
//     align-items: center;
//     gap: 8px;
//     margin-bottom: 18px;
//     padding-bottom: 12px;
//     border-bottom: 1.5px solid #FFF0F5CF;
//   }

//   .card-icon-wrap {
//     width: 28px; height: 28px;
//     background: #FFF0F5CF;
//     border-radius: 8px;
//     display: flex; align-items: center; justify-content: center;
//     flex-shrink: 0;
//   }

//   .card-title {
//     font-size: 15px;
//     font-weight: 700;
//     color: #08255B;
//     margin: 0;
//   }

//   /* ── Field grid ── */
//   .card-grid {
//     display: grid;
//     grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
//     gap: 16px 20px;
//   }

//   .field-box {}
//   .field-box.wide { grid-column: 1 / -1; }

//   .field-label {
//     font-size: 11.5px;
//     color: #9CA3AF;
//     margin: 0 0 4px;
//     font-weight: 500;
//     text-transform: uppercase;
//     letter-spacing: 0.4px;
//   }

//   .field-value {
//     font-size: 13.5px;
//     color: #08255B;
//     font-weight: 600;
//     margin: 0;
//   }

//   .field-value.accent { color: #ED5F8D; }

//   /* ── Customer card ── */
//   .customer-card {}

//   .account-top {
//     display: flex;
//     align-items: center;
//     gap: 12px;
//     margin-bottom: 16px;
//     padding-bottom: 14px;
//     border-bottom: 1px dashed #F0E4EA;
//   }

//   .account-avatar {
//     width: 44px; height: 44px;
//     background: #FFF0F5CF;
//     border-radius: 50%;
//     display: flex; align-items: center; justify-content: center;
//     flex-shrink: 0;
//   }

//   .account-name {
//     font-size: 14px;
//     font-weight: 700;
//     color: #08255B;
//     margin: 0 0 2px;
//   }

//   .account-id {
//     font-size: 11.5px;
//     color: #9CA3AF;
//     margin: 0;
//   }

//   .info-rows { display: flex; flex-direction: column; gap: 12px; }

//   .info-row {
//     display: flex;
//     align-items: flex-start;
//     gap: 10px;
//   }

//   .info-icon-wrap {
//     width: 28px; height: 28px;
//     background: #FFF0F5CF;
//     border-radius: 8px;
//     display: flex; align-items: center; justify-content: center;
//     flex-shrink: 0;
//     margin-top: 1px;
//   }

//   .info-text { display: flex; flex-direction: column; gap: 1px; }

//   .info-label {
//     font-size: 10.5px;
//     color: #9CA3AF;
//     font-weight: 500;
//     text-transform: uppercase;
//     letter-spacing: 0.3px;
//   }

//   .info-value {
//     font-size: 13px;
//     font-weight: 600;
//     color: #08255B;
//   }

//   .info-value.accent { color: #ED5F8D; }

//   /* ── Notes ── */
//   .notes-card {}

//   .notes-box {
//     background: #FFF0F5CF;
//     border-radius: 10px;
//     padding: 14px 18px;
//     min-height: 52px;
//   }

//   .notes-text {
//     font-size: 13.5px;
//     color: #374151;
//     margin: 0;
//     font-style: italic;
//     line-height: 1.6;
//   }

//   .notes-empty {
//     font-size: 13px;
//     color: #9CA3AF;
//     margin: 0;
//     font-style: italic;
//   }

//   /* ── Empty state ── */
//   .empty-state {
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     min-height: 200px;
//     color: #9CA3AF;
//     font-size: 14px;
//   }

//   /* ────────────────────────────────────────────
//      SKELETON STYLES
//   ──────────────────────────────────────────── */
//   @keyframes shimmer {
//     0% { background-position: -600px 0; }
//     100% { background-position: 600px 0; }
//   }

//   .skeleton-shimmer {
//     background: linear-gradient(90deg, #f0e8ee 25%, #fce4ec 50%, #f0e8ee 75%);
//     background-size: 600px 100%;
//     animation: shimmer 1.4s infinite linear;
//     border-radius: 6px;
//   }

//   .card-header-sk {
//     display: flex;
//     align-items: center;
//     gap: 10px;
//     margin-bottom: 18px;
//     padding-bottom: 12px;
//     border-bottom: 1.5px solid #FFF0F5CF;
//   }

//   .sk-icon-circle { width: 28px; height: 28px; border-radius: 8px; }
//   .sk-title { width: 120px; height: 16px; }
//   .sk-label { width: 80px; height: 11px; margin-bottom: 5px; }
//   .sk-value { width: 100px; height: 14px; }
//   .sk-field { display: flex; flex-direction: column; }

//   .sk-back-btn { width: 110px; height: 34px; border-radius: 8px; }
//   .sk-icon-btn { width: 36px; height: 36px; border-radius: 8px; }
//   .sk-enq-id { width: 70px; height: 16px; }
//   .sk-badge { width: 80px; height: 22px; border-radius: 20px; }
//   .sk-date { width: 140px; height: 14px; }
//   .sk-tag { width: 80px; height: 22px; border-radius: 20px; }
// `




















// import React, { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom'
// import { useEnquiryHooks } from '../../../hooks/useEnquiryHooks';
// import { useSelector } from 'react-redux';
// import {toast} from 'react-toastify'

// function ViewB2BEnquiry() {
//   const {enquiryId} = useParams();
//   const isProduction = useSelector(s=>s.user.isProduction)
//   const {getb2bEnquiryById} = useEnquiryHooks();
//   const [fetchLoading, setFetchLoading] = useState(false)
//   const [enquiryDetails, setEnquiryDetails] = useState(null)
//   console.log("Enquiry Details : ",enquiryDetails)

//   const fetchEnquiry = async()=>{
//     try{
//       setFetchLoading(true)
//       const response = await getb2bEnquiryById(enquiryId)
//       setEnquiryDetails(response?.data?.foundEnquiry)
//     }
//     catch(error){
//       if (!isProduction) {
//         console.log("========= ERROR DEBUG START =========");
//         console.log("Error:", error);
//         console.log("Response:", error?.response);
//         console.log("========= ERROR DEBUG END =========");
//       }
//       toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
//     }
//     finally{
//       setFetchLoading(false)
//     }
//   }

//   useEffect(()=>{
//     if(enquiryId && !enquiryDetails) fetchEnquiry()
//   },[enquiryId])
//   return (
//     <div>ViewB2BEnquiry</div>
//   )
// }

// export default ViewB2BEnquiry