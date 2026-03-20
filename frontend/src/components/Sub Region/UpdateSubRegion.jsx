import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useSubRegionHooks } from '../../hooks/useSubRegionHooks'
// import { useSubRegionHooks } from '../../hooks/useSubRegionHooks'  // swap with real hook

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function formatDateTime(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// ─── Dummy data (replace with API call using id from useParams) ────────────
const DUMMY_DATA = {
  _id: '69b6b8085e890cfc2464831e',
  regionId: {
    _id: '69b631c4516e096539851348',
    name: 'Maharashtra',
    country: 'India',
  },
  org_id: '69a3d95988766a4150e0d113',
  name: 'Mumbai',
  description: "India's financial and entertainment capital, part of the Mumbai Metropolitan Region.",
  is_active: true,
  createdAt: '2026-03-15T13:45:44.592Z',
  updatedAt: '2026-03-15T13:45:44.592Z',
  __v: 0,
}

export default function UpdateSubRegion() {
  const navigate = useNavigate()
  const location = useLocation();
  const { subRegionId } = useParams()
  const isProduction = useSelector((state) => state?.user?.isProduction)
  const {getSubRegionById, updateSubRegionById} = useSubRegionHooks()

  const [originalData, setOriginalData] = useState(null)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const [form, setForm] = useState({
    name: '',
    description: '',
    is_active: true,
  })

  const [errors, setErrors] = useState({})

  const clearError = (field) => {
    setErrors((prev) => {
      const updated = { ...prev }
      delete updated[field]
      return updated
    })
  }

  const subRegionDetails = location.state?.subRegion;
  useEffect(()=>{
    setOriginalData(subRegionDetails)
    setForm({
      name: subRegionDetails?.name ?? '',
      description: subRegionDetails?.description ?? '',
      is_active: subRegionDetails?.is_active ?? true,
    })
  },[subRegionDetails])

  // ── Fetch sub-region by id ─────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchLoading(true)
        const res = await getSubRegionById(subRegionId)  
        console.log("response : ",res)
        setOriginalData(res?.data?.findSubRegion)
        setForm({
          name: res?.data?.findSubRegion?.name ?? '',
          description: res?.data?.findSubRegion?.description ?? '',
          is_active: res?.data?.findSubRegion?.is_active ?? true,
        })
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
    if(!subRegionDetails){
        fetchData()
    }
  }, [subRegionId])

  // ── Validation ─────────────────────────────────────────────────────────
  const validate = () => {
    const e = {}
    if (!form?.name?.trim()) e.name = 'Sub-region name is required.'
    return e
  }

  // ── Check if anything changed ──────────────────────────────────────────
  const hasChanges =
    form?.name !== (originalData?.name ?? '') ||
    form?.description !== (originalData?.description ?? '') ||
    form?.is_active !== (originalData?.is_active ?? true)

  // ── Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length !== 0) return

    try {
      setSubmitLoading(true)
      const res = await updateSubRegionById(originalData?._id, form) 
      toast.success(res?.data?.message || 'Sub-region updated successfully')
      navigate('/sub-regions')
    } catch (error) {
      if (!isProduction) {
        console.log('========= ERROR DEBUG START =========')
        console.log('Error:', error)
        console.log('Response:', error?.response)
        console.log('========= ERROR DEBUG END =========')
      }
      toast.error(error?.response?.data?.message || error?.message || 'Error updating sub-region')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleReset = () => {
    setForm({
      name: originalData?.name ?? '',
      description: originalData?.description ?? '',
      is_active: originalData?.is_active ?? true,
    })
    setErrors({})
  }

  // ── Loading skeleton ───────────────────────────────────────────────────
  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 font-sans">
        <div className="mb-6 animate-pulse">
          <div className="h-7 w-48 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-64 bg-gray-100 rounded" />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 animate-pulse space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                <div className="h-10 bg-gray-100 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Update Sub-Region</h1>
        <p className="text-sm text-gray-500 mt-1">
          Edit the details for <span className="font-semibold text-pink-500">{originalData?.name ?? '—'}</span>
        </p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mt-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to List
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: Edit Form ────────────────────────────────────────────── */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-base font-bold text-gray-700 mb-5 flex items-center gap-2">
            <span className="w-1 h-4 bg-pink-500 rounded-full inline-block" />
            Editable Fields
          </h2>

          <div className="space-y-5">

            {/* Sub-Region Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Sub-Region Name <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                value={form?.name ?? ''}
                onChange={(e) => {
                  setForm((f) => ({ ...f, name: e.target.value }))
                  clearError('name')
                }}
                placeholder="Enter sub-region name"
                className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all
                  ${errors?.name
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-100'
                  }`}
              />
              {errors?.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Description{' '}
                <span className="text-gray-400 font-normal text-xs">(optional)</span>
              </label>
              <textarea
                value={form?.description ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Enter a brief description of the sub-region..."
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none resize-none transition-all focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            {/* Active Status Toggle */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Status <span className="text-pink-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                {/* Active option */}
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, is_active: true }))}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all
                    ${form?.is_active
                      ? 'border-green-500 bg-green-50 text-green-600'
                      : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                    }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${form?.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Active
                  {form?.is_active && (
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                {/* Inactive option */}
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, is_active: false }))}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all
                    ${!form?.is_active
                      ? 'border-red-400 bg-red-50 text-red-500'
                      : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                    }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${!form?.is_active ? 'bg-red-400' : 'bg-gray-300'}`} />
                  Inactive
                  {!form?.is_active && (
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* Changed indicator */}
          {hasChanges && (
            <div className="mt-5 flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-lg px-4 py-2.5">
              <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <p className="text-xs text-amber-600 font-medium">You have unsaved changes</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-7 flex items-center gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitLoading || !hasChanges}
              className={`px-6 py-2.5 flex items-center gap-2 bg-pink-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-pink-200
                ${submitLoading || !hasChanges ? 'opacity-60 cursor-not-allowed' : 'hover:bg-pink-600'}`}
            >
              {submitLoading && (
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
                </svg>
              )}
              {submitLoading ? 'Updating...' : 'Save Changes'}
            </button>

            <button
              type="button"
              disabled={submitLoading || !hasChanges}
              onClick={handleReset}
              className={`px-6 py-2.5 border border-gray-300 text-gray-600 text-sm font-semibold rounded-lg transition-colors
                ${submitLoading || !hasChanges ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            >
              Reset
            </button>
          </div>
        </div>

        {/* ── Right: Info Panel ──────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Read-only details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-gray-300 rounded-full inline-block" />
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
                value={originalData?.regionId?.name ?? '—'}
              />
              <InfoRow
                icon={
                  <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                }
                label="Country"
                value={originalData?.regionId?.country ?? '—'}
              />
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-gray-300 rounded-full inline-block" />
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
                value={formatDateTime(originalData?.createdAt)}
              />
              <InfoRow
                icon={
                  <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                label="Last Updated"
                value={formatDateTime(originalData?.updatedAt)}
              />
            </div>
          </div>

          {/* Current status badge */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-gray-300 rounded-full inline-block" />
              Current Status
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Saved in DB</span>
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border
                ${originalData?.is_active
                  ? 'bg-green-50 text-green-600 border-green-200'
                  : 'bg-red-50 text-red-500 border-red-200'
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${originalData?.is_active ? 'bg-green-500' : 'bg-red-400'}`} />
                {originalData?.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            {/* Arrow if status changed */}
            {form?.is_active !== originalData?.is_active && (
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-gray-500">After save</span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border
                  ${form?.is_active
                    ? 'bg-green-50 text-green-600 border-green-200'
                    : 'bg-red-50 text-red-500 border-red-200'
                  }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${form?.is_active ? 'bg-green-500' : 'bg-red-400'}`} />
                  {form?.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

// ── Small reusable info row ────────────────────────────────────────────────
function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-sm text-gray-700 font-semibold mt-0.5">{value}</p>
      </div>
    </div>
  )
}