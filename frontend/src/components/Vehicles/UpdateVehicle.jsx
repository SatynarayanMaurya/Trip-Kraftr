import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useCommonHooks } from '../../hooks/useCommonHooks'
import { useVehicleHooks } from '../../hooks/useVehicleHooks'
// import { useVehicleHooks } from '../../hooks/useVehicleHooks'

const VEHICLE_TYPES = [
  'Sedan', 'SUV', 'Hatchback', 'Van', 'Minibus', 'Bus',
  'Luxury Car', 'Convertible', 'Pickup Truck', 'Jeep',
]

export default function UpdateVehicle() {
  const navigate      = useNavigate()
  const location      = useLocation()
  const { vehicleId } = useParams()
  const isProduction  = useSelector((state) => state?.user?.isProduction)
  const { searchRegionForOrg } = useCommonHooks();
  const {updateVehicleForOrg} = useVehicleHooks()
  // const { getVehicleById, updateVehicleById } = useVehicleHooks()

  // ── State ──────────────────────────────────────────────────────────────
  const [originalData,  setOriginalData]  = useState(null)
  const [fetchLoading,  setFetchLoading]  = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const [form, setForm] = useState({
    vehicleType:     '',
    regionId:        '',
    regionName:      '',
    vehicleModel:    '',
    pricePerDay:     '',
    transferPrice:   '',
    vehicleImageUrl: '',
    capacity:        '',
  })

  const [sameAsPrice, setSameAsPrice] = useState(false)
  const [errors, setErrors]           = useState({})

  // Vehicle type dropdown
  const [typeOpen, setTypeOpen] = useState(false)
  const typeRef = useRef(null)

  // Region search
  const [regionInput,       setRegionInput]       = useState('')
  const [regionSuggestions, setRegionSuggestions] = useState([])
  const [regionLoading,     setRegionLoading]     = useState(false)
  const regionRef = useRef(null)

  // ── Close dropdowns on outside click ──────────────────────────────────
  useEffect(() => {
    const h = (e) => {
      if (typeRef.current   && !typeRef.current.contains(e.target))   setTypeOpen(false)
      if (regionRef.current && !regionRef.current.contains(e.target)) setRegionSuggestions([])
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  // ── Sync transfer price ────────────────────────────────────────────────
  useEffect(() => {
    if (sameAsPrice) {
      setForm((f) => ({ ...f, transferPrice: f.pricePerDay }))
      clearError('transferPrice')
    }
  }, [sameAsPrice, form.pricePerDay])

  // ── Region search on input change ──────────────────────────────────────
  useEffect(() => {
    if (regionInput.trim().length < 1) { setRegionSuggestions([]); return }
    // Skip fetch if user hasn't changed from the currently selected region name
    if (form.regionId && regionInput === form.regionName) return

    const fetchRegions = async () => {
      try {
        setRegionLoading(true)
        const res = await searchRegionForOrg(regionInput)
        setRegionSuggestions(res?.data?.searchedRegions || [])
      } catch (error) {
        if (!isProduction) {
          console.log('========= ERROR DEBUG START =========')
          console.log('Error:', error)
          console.log('Response:', error?.response)
          console.log('========= ERROR DEBUG END =========')
        }
        toast.error(error?.response?.data?.message || error?.message || 'Error fetching regions')
      } finally {
        setRegionLoading(false)
      }
    }
    fetchRegions()
  }, [regionInput])

  // ── Load data from location.state or API ──────────────────────────────
  useEffect(() => {
    const passed = location.state?.vehicle
    if (passed) { populate(passed); return }
  }, [vehicleId])

  const populate = (data) => {
    setOriginalData(data)
    const isSame = data?.pricePerDay === data?.transferPrice
    setSameAsPrice(isSame)
    setForm({
      vehicleType:     data?.vehicleType     ?? '',
      regionId:        data?.regionId?._id   ?? '',
      regionName:      data?.regionId?.name  ?? '',
      vehicleModel:    data?.vehicleModel    ?? '',
      pricePerDay:     data?.pricePerDay     ?? '',
      transferPrice:   data?.transferPrice   ?? '',
      vehicleImageUrl: data?.vehicleImageUrl ?? '',
      capacity:        data?.capacity        ?? '',
    })
    setRegionInput(data?.regionId?.name ?? '')
  }

  // ── Helpers ────────────────────────────────────────────────────────────
  const clearError = (field) =>
    setErrors((p) => { const e = { ...p }; delete e[field]; return e })

  const handleRegionSelect = (r) => {
    setForm((f) => ({ ...f, regionId: r?._id, regionName: r?.name }))
    setRegionInput(r?.name ?? '')
    setRegionSuggestions([])
    clearError('regionId')
  }

  // ── Has changes ────────────────────────────────────────────────────────
  const hasChanges =
    form.vehicleType     !== (originalData?.vehicleType     ?? '')            ||
    form.regionId        !== (originalData?.regionId?._id   ?? '')            ||
    form.vehicleModel    !== (originalData?.vehicleModel    ?? '')            ||
    String(form.pricePerDay)   !== String(originalData?.pricePerDay   ?? '')  ||
    String(form.transferPrice) !== String(originalData?.transferPrice ?? '')  ||
    form.vehicleImageUrl !== (originalData?.vehicleImageUrl ?? '')            ||
    String(form.capacity)      !== String(originalData?.capacity      ?? '')

  // ── Validation ─────────────────────────────────────────────────────────
  const validate = () => {
    const e = {}
    if (!form.vehicleType)              e.vehicleType     = 'Please select a vehicle type.'
    if (!form.regionId)                 e.regionId        = 'Please select a region.'
    if (!form.vehicleModel?.trim())     e.vehicleModel    = 'Vehicle model is required.'
    if (form.pricePerDay === '')        e.pricePerDay     = 'Price per day is required.'
    else if (Number(form.pricePerDay) < 0)  e.pricePerDay = 'Price cannot be negative.'
    if (!sameAsPrice) {
      if (form.transferPrice === '')    e.transferPrice   = 'Transfer price is required.'
      else if (Number(form.transferPrice) < 0) e.transferPrice = 'Price cannot be negative.'
    }
    if (!form.vehicleImageUrl?.trim()) e.vehicleImageUrl = 'Image URL is required.'
    else if (!/^https?:\/\/.+/.test(form.vehicleImageUrl.trim())) e.vehicleImageUrl = 'Enter a valid URL.'
    if (form.capacity !== '' && Number(form.capacity) < 1) e.capacity = 'Capacity must be at least 1.'
    return e
  }

  // ── Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length !== 0) return
    try {
      setSubmitLoading(true)
      const payload = {
        vehicleType:     form.vehicleType,
        regionId:        form.regionId,
        vehicleModel:    form.vehicleModel,
        pricePerDay:     Number(form.pricePerDay),
        transferPrice:   sameAsPrice ? Number(form.pricePerDay) : Number(form.transferPrice),
        vehicleImageUrl: form.vehicleImageUrl,
        ...(form.capacity !== '' && { capacity: Number(form.capacity) }),
      }
      const res = await updateVehicleForOrg(vehicleId,payload)
      toast.success(res?.data?.message || 'Vehicle updated successfully')
      navigate(-1)
    } catch (error) {
      if (!isProduction) console.log(error)
      toast.error(error?.response?.data?.message || error?.message || 'Error updating vehicle')
    } finally {
      setSubmitLoading(false)
    }
  }

  // ── Input class helper — pink focus ────────────────────────────────────
  const inputCls = (field) =>
    `w-full px-4 py-[10px] rounded-lg border text-sm text-[#18305C] outline-none transition-all bg-white placeholder-gray-400
    ${errors[field]
      ? 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100'
      : 'border-gray-300 focus:border-[#E91E8C] focus:ring-2 focus:ring-pink-100'
    }`

  // ── Loading skeleton ───────────────────────────────────────────────────
  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-white p-6 md:p-8 font-sans animate-pulse">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-lg bg-gray-200" />
          <div className="h-7 w-40 bg-gray-200 rounded" />
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-4xl mx-auto space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
                <div className="h-10 bg-gray-100 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-6 md:p-8 font-sans">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-10">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-lg bg-[#E91E8C] hover:bg-pink-600 flex items-center justify-center transition-colors shadow-sm shadow-pink-200 shrink-0"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-[#18305C]">Edit Vehicle</h1>
      </div>

      {/* ── Form Card ───────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.07)] p-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

          {/* Vehicle Type */}
          <div className="relative" ref={typeRef}>
            <label className="block text-sm font-semibold text-[#18305C] mb-2">
              Vehicle Type <span className="text-[#E91E8C]">*</span>
            </label>
            <button
              type="button"
              onClick={() => setTypeOpen((o) => !o)}
              className={`w-full px-4 py-[10px] rounded-lg border text-sm text-left flex justify-between items-center outline-none transition-all bg-white
                ${errors.vehicleType
                  ? 'border-red-400 bg-red-50'
                  : typeOpen
                    ? 'border-[#E91E8C] ring-2 ring-pink-100'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
            >
              <span className={form.vehicleType ? 'text-[#18305C]' : 'text-gray-400'}>
                {form.vehicleType || 'Select type'}
              </span>
              <svg
                className={`w-4 h-4 text-[#18305C] transition-transform ${typeOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {errors.vehicleType && <p className="text-red-500 text-xs mt-1">{errors.vehicleType}</p>}
            {typeOpen && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] overflow-hidden">
                <div className="max-h-48 overflow-y-auto">
                  {VEHICLE_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => { setForm((f) => ({ ...f, vehicleType: t })); setTypeOpen(false); clearError('vehicleType') }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                        ${form.vehicleType === t
                          ? 'bg-[#E91E8C] text-white font-semibold'
                          : 'text-[#18305C] hover:bg-pink-50'
                        }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Region — searchable */}
          <div className="relative" ref={regionRef}>
            <label className="block text-sm font-semibold text-[#18305C] mb-2">
              Region <span className="text-[#E91E8C]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={regionInput}
                onChange={(e) => {
                  setRegionInput(e.target.value)
                  // Clear stored selection when user edits
                  if (form.regionId) setForm((f) => ({ ...f, regionId: '', regionName: '' }))
                  clearError('regionId')
                }}
                placeholder="Search region e.g. Maharashtra"
                className={`w-full px-4 pr-10 py-[10px] rounded-lg border text-sm text-[#18305C] outline-none transition-all bg-white placeholder-gray-400
                  ${errors.regionId
                    ? 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                    : form.regionId
                      ? 'border-[#E91E8C] bg-pink-50/30 focus:border-[#E91E8C] focus:ring-2 focus:ring-pink-100'
                      : 'border-gray-300 focus:border-[#E91E8C] focus:ring-2 focus:ring-pink-100'
                  }`}
              />
              {/* Right icon: spinner / checkmark / chevron */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                {regionLoading ? (
                  <svg className="animate-spin h-4 w-4 text-[#E91E8C]" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
                  </svg>
                ) : form.regionId ? (
                  <svg className="w-4 h-4 text-[#E91E8C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                  </svg>
                )}
              </div>
            </div>

            {errors.regionId && <p className="text-red-500 text-xs mt-1">{errors.regionId}</p>}

            {/* No results hint */}
            {!regionLoading && regionInput.trim().length >= 1 && regionSuggestions?.length === 0 && !form.regionId && (
              <p className="text-xs text-gray-400 mt-1">No regions found for "{regionInput}"</p>
            )}

            {/* Suggestions dropdown */}
            {regionSuggestions?.length > 0 && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] overflow-hidden">
                <div className="max-h-48 overflow-y-auto">
                  {regionSuggestions?.map((r) => (
                    <button
                      key={r?._id}
                      onClick={() => handleRegionSelect(r)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                        ${form.regionId === r?._id
                          ? 'bg-[#E91E8C] text-white font-semibold'
                          : 'text-[#18305C] hover:bg-pink-50'
                        }`}
                    >
                      <span className="font-medium">{r?.name}</span>
                      {r?.country && (
                        <span className={`text-xs ml-2 ${form.regionId === r?._id ? 'text-pink-100' : 'text-gray-400'}`}>
                          {r.country}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Vehicle Model */}
          <div>
            <label className="block text-sm font-semibold text-[#18305C] mb-2">
              Vehicle Model <span className="text-[#E91E8C]">*</span>
            </label>
            <input
              type="text"
              value={form.vehicleModel}
              onChange={(e) => { setForm((f) => ({ ...f, vehicleModel: e.target.value })); clearError('vehicleModel') }}
              placeholder="e.g., Toyota Camry"
              className={inputCls('vehicleModel')}
            />
            {errors.vehicleModel && <p className="text-red-500 text-xs mt-1">{errors.vehicleModel}</p>}
          </div>

          {/* Price per Day */}
          <div>
            <label className="block text-sm font-semibold text-[#18305C] mb-2">
              Price per Day <span className="text-[#E91E8C]">*</span>
            </label>
            <input
              type="number"
              min="0"
              value={form.pricePerDay}
              onChange={(e) => { setForm((f) => ({ ...f, pricePerDay: e.target.value })); clearError('pricePerDay') }}
              placeholder="0"
              className={inputCls('pricePerDay')}
            />
            {errors.pricePerDay && <p className="text-red-500 text-xs mt-1">{errors.pricePerDay}</p>}
          </div>

          {/* Transfer Price */}
          <div>
            <label className="block text-sm font-semibold text-[#18305C] mb-2">
              Transfer Price
            </label>
            <input
              type="number"
              min="0"
              value={sameAsPrice ? form.pricePerDay : form.transferPrice}
              disabled={sameAsPrice}
              onChange={(e) => { setForm((f) => ({ ...f, transferPrice: e.target.value })); clearError('transferPrice') }}
              placeholder="0"
              className={`w-full px-4 py-[10px] rounded-lg border text-sm outline-none transition-all
                ${sameAsPrice
                  ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                  : errors.transferPrice
                    ? 'border-red-400 bg-red-50 text-[#18305C] focus:border-red-400 focus:ring-2 focus:ring-red-100'
                    : 'border-gray-300 focus:border-[#E91E8C] focus:ring-2 focus:ring-pink-100 bg-white text-[#18305C]'
                }`}
            />
            {errors.transferPrice && !sameAsPrice && (
              <p className="text-red-500 text-xs mt-1">{errors.transferPrice}</p>
            )}
            {/* Same as Price checkbox */}
            <label className="flex items-center gap-2 mt-2 cursor-pointer w-fit">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={sameAsPrice}
                  onChange={(e) => { setSameAsPrice(e.target.checked); clearError('transferPrice') }}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all
                  ${sameAsPrice
                    ? 'bg-[#E91E8C] border-[#E91E8C]'
                    : 'bg-white border-gray-300 hover:border-[#E91E8C]'
                  }`}>
                  {sameAsPrice && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-500 select-none">Same as Price per Day</span>
            </label>
          </div>

          {/* Vehicle Image URL */}
          <div>
            <label className="block text-sm font-semibold text-[#18305C] mb-2">
              Vehicle Image URL <span className="text-[#E91E8C]">*</span>
            </label>
            <input
              type="url"
              value={form.vehicleImageUrl}
              onChange={(e) => { setForm((f) => ({ ...f, vehicleImageUrl: e.target.value })); clearError('vehicleImageUrl') }}
              placeholder="https://image.jpg"
              className={inputCls('vehicleImageUrl')}
            />
            {errors.vehicleImageUrl && <p className="text-red-500 text-xs mt-1">{errors.vehicleImageUrl}</p>}
            {/* Image preview */}
            {form.vehicleImageUrl && !errors.vehicleImageUrl && (
              <div className="mt-2 w-full h-28 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <img
                  src={form.vehicleImageUrl}
                  alt="preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none' }}
                  onLoad={(e)  => { e.target.style.display = 'block' }}
                />
              </div>
            )}
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-semibold text-[#18305C] mb-2">
              Capacity
              <span className="ml-2 text-[10px] font-normal text-gray-400">(optional)</span>
            </label>
            <input
              type="number"
              min="1"
              value={form.capacity}
              onChange={(e) => { setForm((f) => ({ ...f, capacity: e.target.value })); clearError('capacity') }}
              placeholder="e.g., 4"
              className={inputCls('capacity')}
            />
            {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
          </div>

        </div>

        {/* Unsaved changes banner */}
        {hasChanges && (
          <div className="mt-6 flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-lg px-4 py-2.5">
            <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <p className="text-xs text-amber-600 font-medium">You have unsaved changes</p>
          </div>
        )}

        {/* ── Actions ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-7 py-2.5 border border-gray-300 text-[#18305C] text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitLoading || !hasChanges}
            className={`flex items-center gap-2 px-7 py-2.5 bg-[#E91E8C] text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-pink-200
              ${submitLoading || !hasChanges ? 'opacity-60 cursor-not-allowed' : 'hover:bg-pink-600'}`}
          >
            {submitLoading ? (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            )}
            {submitLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}