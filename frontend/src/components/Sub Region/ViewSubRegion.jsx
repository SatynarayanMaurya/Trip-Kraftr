import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useSubRegionHooks } from '../../hooks/useSubRegionHooks'
import DeleteModal from '../DeleteModals/DeleteModal'

function formatDateTime(iso) {
    if (!iso) return '—'
    return new Date(iso).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    })
}

export default function ViewSubRegion() {
    const navigate = useNavigate()
    const location = useLocation()
    const { subRegionId } = useParams()
    const isProduction = useSelector((state) => state?.user?.isProduction)
    const { getSubRegionById,deleteSubRegionById } = useSubRegionHooks()

    const [data, setData] = useState(null)
    const [fetchLoading, setFetchLoading] = useState(false)
    const [isDeleteModal, setIsDeleteModal] = useState(false)

    const subRegionDetails = location.state?.subRegion

    // Use passed state if available, else fetch
    useEffect(() => {
        if (subRegionDetails) {
            setData(subRegionDetails)
            return
        }
        const fetchData = async () => {
            try {
                setFetchLoading(true)
                const res = await getSubRegionById(subRegionId)
                setData(res?.data?.findSubRegion)
            } catch (error) {
                if (!isProduction) {
                    console.log('========= ERROR DEBUG START =========')
                    console.log('Error:', error)
                    console.log('Response:', error?.response)
                    console.log('========= ERROR DEBUG END =========')
                }
                toast.error(error?.response?.data?.message || error?.message || 'Error fetching sub-region')
            } finally {
                setFetchLoading(false)
            }
        }
        fetchData()
    }, [subRegionId])

    // ── Loading skeleton ───────────────────────────────────────────────────
    if (fetchLoading) {
        return (
            <div className="min-h-screen bg-gray-100 p-6 font-sans">
                <div className="mb-6 animate-pulse">
                    <div className="h-7 w-48 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-64 bg-gray-100 rounded" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-8 space-y-5">
                        {[...Array(4)].map((_, i) => (
                            <div key={i}>
                                <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
                                <div className="h-10 bg-gray-100 rounded-lg" />
                            </div>
                        ))}
                    </div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
                                <div className="h-3 w-24 bg-gray-200 rounded" />
                                <div className="h-10 bg-gray-100 rounded-lg" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    const deleteSubRegionHandler = async()=>{
        try{
            await deleteSubRegionById(subRegionId)
            navigate("/sub-regions")

        }
        catch(error){
          if (!isProduction) {
            console.log("========= ERROR DEBUG START =========");
            console.log("Error:", error);
            console.log("Response:", error?.response);
            console.log("========= ERROR DEBUG END =========");
          }
          toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
        }
    
    
    
    
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 font-sans">

            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-gray-800">Sub-Region Details</h1>
                    {/* Active badge next to title */}
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border
            ${data?.is_active
                            ? 'bg-green-50 text-green-600 border-green-200'
                            : 'bg-red-50 text-red-500 border-red-200'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${data?.is_active ? 'bg-green-500' : 'bg-red-400'}`} />
                        {data?.is_active ? 'Active' : 'Inactive'}
                    </span>
                </div>
                <p className="text-sm text-gray-500">
                    Viewing details for{' '}
                    <span className="font-semibold text-pink-500">{data?.name ?? '—'}</span>
                </p>
                <div className="flex items-center gap-3 mt-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to List
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                        onClick={() => navigate(`/sub-regions/update-sub-region/${data?._id}`, { state: { subRegion: data } })}
                        className="flex items-center gap-1.5 text-sm text-pink-500 hover:text-pink-600 font-semibold transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Sub-Region
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ── Left: Main Info ────────────────────────────────────────────── */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Name + Description card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-base font-bold text-gray-700 mb-6 flex items-center gap-2">
                            <span className="w-1 h-4 bg-pink-500 rounded-full inline-block" />
                            General Information
                        </h2>

                        <div className="space-y-6">

                            {/* Name */}
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                    Sub-Region Name
                                </p>
                                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                                    <div className="w-9 h-9 rounded-lg bg-pink-100 border border-pink-200 flex items-center justify-center text-sm font-bold text-pink-500 shrink-0">
                                        {data?.name?.[0]?.toUpperCase() ?? '?'}
                                    </div>
                                    <p className="text-gray-800 font-semibold text-base">{data?.name ?? '—'}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                    Description
                                </p>
                                {data?.description ? (
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                                        <p className="text-gray-700 text-sm leading-relaxed">{data.description}</p>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl px-4 py-3">
                                        <p className="text-gray-400 text-sm italic">No description provided</p>
                                    </div>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                    Status
                                </p>
                                <div className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl border-2 text-sm font-semibold
                  ${data?.is_active
                                        ? 'border-green-200 bg-green-50 text-green-600'
                                        : 'border-red-200 bg-red-50 text-red-500'
                                    }`}>
                                    <span className={`w-2.5 h-2.5 rounded-full ${data?.is_active ? 'bg-green-500' : 'bg-red-400'}`} />
                                    {data?.is_active ? 'Active' : 'Inactive'}
                                </div>
                            </div>

                        </div>
                    </div>


                </div>

                {/* ── Right: Side Panel ─────────────────────────────────────────── */}
                <div className="space-y-4">

                    {/* Region Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <span className="w-1 h-4 bg-pink-300 rounded-full inline-block" />
                            Region Info
                        </h2>
                        <div className="space-y-3">
                            <InfoRow
                                icon={
                                    <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                }
                                label="Parent Region"
                                value={data?.regionId?.name ?? '—'}
                            />
                            <InfoRow
                                icon={
                                    <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                                    </svg>
                                }
                                label="Country"
                                value={data?.regionId?.country ?? '—'}
                            />
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <span className="w-1 h-4 bg-pink-300 rounded-full inline-block" />
                            Timestamps
                        </h2>
                        <div className="space-y-3">
                            <InfoRow
                                icon={
                                    <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                }
                                label="Created At"
                                value={formatDateTime(data?.createdAt)}
                            />
                            <InfoRow
                                icon={
                                    <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                }
                                label="Last Updated"
                                value={formatDateTime(data?.updatedAt)}
                            />
                        </div>
                    </div>

                    {/* Quick actions */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <span className="w-1 h-4 bg-pink-300 rounded-full inline-block" />
                            Quick Actions
                        </h2>
                        <div className="space-y-2.5">
                            <button
                                onClick={()=>setIsDeleteModal(true)}
                                className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-semibold hover:bg-pink-100 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 011-1h4a1 1 0 011 1m-7 0h8" />
                                </svg>
                                Delete this Sub-Region
                            </button>
                            <button
                                onClick={() => navigate(`/sub-regions/update-sub-region/${data?._id}`, { state: { subRegion: data } })}
                                className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-pink-200 bg-pink-50 text-pink-600 text-sm font-semibold hover:bg-pink-100 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit this Sub-Region
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {
                isDeleteModal && 
                <DeleteModal onClose={()=>setIsDeleteModal(false)} onDelete={()=>deleteSubRegionHandler()} itemName = {subRegionDetails?.name} confirmText = {subRegionDetails?.name}/>
            }
        </div>
    )
}

// ── Info row ──────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center shrink-0 mt-0.5">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-xs text-gray-400 font-medium">{label}</p>
                <div className="text-sm text-gray-700 font-semibold mt-0.5 wrap-break-words">{value}</div>
            </div>
        </div>
    )
}

// ── ID display field ──────────────────────────────────────────────────────
function IdField({ label, value }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        if (!value) return
        navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{label}</p>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
                <p className="font-mono text-xs text-gray-500 flex-1 truncate">{value ?? '—'}</p>
                {value && (
                    <button
                        onClick={handleCopy}
                        title="Copy to clipboard"
                        className="shrink-0 text-gray-400 hover:text-pink-500 transition-colors"
                    >
                        {copied ? (
                            <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}