import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import {
  ArrowLeft, ChevronDown, Phone, Mail, MapPin,
  Star, Upload, X, Save, XCircle,
  BedDouble,
} from 'lucide-react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useHotelHooks } from '../../../hooks/useHotelHooks'
import { useRegionHooks } from '../../../hooks/useRegionHooks'
import { useCommonHooks } from '../../../hooks/useCommonHooks'



const CATEGORIES = ['Budget', 'Premium', 'Luxury']
const MAX_IMAGES = 3

// ── Amenities master list ─────────────────────────────────────────────────
const AMENITIES_LIST = [
  { key: 'wifi',           label: 'Free Wi-Fi' },
  { key: 'pool',           label: 'Swimming Pool' },
  { key: 'parking',        label: 'Free Parking' },
  { key: 'restaurant',     label: 'Restaurant' },
  { key: 'gym',            label: 'Fitness Center' },
  { key: 'ac',             label: 'Air Conditioning' },
  { key: 'tv',             label: 'Smart TV' },
  { key: 'breakfast',      label: 'Breakfast' },
  { key: 'hotwater',       label: 'Hot Shower' },
  { key: 'airportShuttle', label: 'Airport Shuttle' },
  { key: 'laundry',        label: 'Laundry' },
  { key: 'kidsPlay',       label: 'Kids Play Area' },
  { key: 'bonfire',        label: 'Bonfire' },
  { key: 'security',       label: '24/7 Security' },
  { key: 'accessible',     label: 'Accessible' },
  { key: 'roomService',    label: 'Room Service' },
]

// ── Star display ──────────────────────────────────────────────────────────
function StarDisplay({ value }) {
  const filled = Math.round(Number(value) || 0)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={26}
          className={`transition-colors ${s <= filled ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
        />
      ))}
    </div>
  )
}

// ── Amenity chip ──────────────────────────────────────────────────────────
function AmenityChip({ amenity, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(amenity.label)}
      className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all select-none"
      style={{
        border:     selected ? '1.5px solid #ED5F8D' : '1.5px solid #E5E7EB',
        background: selected ? '#FFF0F7' : '#FAFAFA',
        color:      selected ? '#ED5F8D' : '#6B7280',
        boxShadow:  selected ? '0 2px 8px rgba(237,95,141,0.13)' : '0 1px 4px rgba(0,0,0,0.06)',
        transform:  selected ? 'translateY(-1px)' : 'translateY(0)',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = '#F9A8D4'
          e.currentTarget.style.color = '#ED5F8D'
          e.currentTarget.style.background = '#FFF7FB'
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = '#E5E7EB'
          e.currentTarget.style.color = '#6B7280'
          e.currentTarget.style.background = '#FAFAFA'
        }
      }}
    >
      {amenity.label}
      {selected && (
        <span
          className="ml-0.5 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background: '#ED5F8D' }}
        >
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2.5 2.5L8 2.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </button>
  )
}

// ── Loading skeleton ──────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="min-h-screen bg-white p-6 md:p-8 font-sans animate-pulse max-w-4xl mx-auto">
      <div className="h-7 w-40 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-56 bg-gray-100 rounded mb-6" />
      <div className="rounded-2xl border border-gray-200 p-8 space-y-5">
        <div className="grid grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
              <div className="h-10 bg-gray-100 rounded-lg" />
            </div>
          ))}
        </div>
        <div className="h-3 w-24 bg-gray-200 rounded mt-2" />
        <div className="flex gap-2 flex-wrap">
          {[...Array(8)].map((_, i) => <div key={i} className="h-9 w-24 bg-gray-100 rounded-xl" />)}
        </div>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function UpdateHotel() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const { hotelId } = useParams()

  const isProduction           = useSelector((state) => state?.user?.isProduction)
  const allRegionsForSuggestions = useSelector((state) => state.user.allRegionsForSuggestions)

  const { searchSubRegionForOrg } = useCommonHooks()
  const { getRegionsForOrg }      = useRegionHooks()
  const { getHotelById, updateHotelById } = useHotelHooks()

  // ── Loading states ───────────────────────────────────────────────────
  const [fetchLoading,  setFetchLoading]  = useState(false)
  const [regionLoading, setRegionLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  // ── Original data (for change detection) ────────────────────────────
  const [originalData, setOriginalData] = useState(null)

  // ── Form state ───────────────────────────────────────────────────────
  const [form, setForm] = useState({
    hotelName:     '',
    category:      'Budget',
    regionId:      '',
    regionName:    '',
    subRegionId:   '',
    subRegionName: '',
    contact:       '',
    email:         '',
    address:       '',
    googleRating:  '',
  })

  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [errors, setErrors] = useState({})

  const [existingImages, setExistingImages] = useState([])
  const [imagesToDelete,  setImagesToDelete]  = useState([])  // public_ids
  const [newImages,       setNewImages]       = useState([])   // { file, preview }

  // ── Dropdown / search refs ───────────────────────────────────────────
  const categoryRef  = useRef(null)
  const regionRef    = useRef(null)
  const subRegionRef = useRef(null)
  const fileInputRef = useRef(null)

  const [categoryOpen, setCategoryOpen] = useState(false)
  const [regionOpen,   setRegionOpen]   = useState(false)

  const [subRegionInput,       setSubRegionInput]       = useState('')
  const [subRegionSuggestions, setSubRegionSuggestions] = useState([])
  const [subRegionLoading,     setSubRegionLoading]     = useState(false)

  // ── Derived ──────────────────────────────────────────────────────────
  const totalImages   = existingImages.length + newImages.length
  const slotsLeft     = MAX_IMAGES - totalImages
  const ratingNum     = Math.min(5, Math.max(0, Number(form.googleRating) || 0))

  // ── Fetch regions for dropdown ────────────────────────────────────────
  const fetchRegions = async () => {
    try {
      if (allRegionsForSuggestions?.length > 0) return
      setRegionLoading(true)
      await getRegionsForOrg()
    } catch (error) {
      if (!isProduction) console.log(error)
      toast.error(error?.response?.data?.message || error?.message || 'Error fetching regions')
    } finally {
      setRegionLoading(false)
    }
  }

  // ── Populate form from data ───────────────────────────────────────────
  const populate = (data) => {
    setOriginalData(data)
    setForm({
      hotelName:     data?.hotelName     ?? '',
      category:      data?.category      ?? 'Budget',
      regionId:      data?.regionId?._id ?? '',
      regionName:    data?.regionId?.name ?? '',
      subRegionId:   data?.subRegionId?._id ?? '',
      subRegionName: data?.subRegionId?.name ?? '',
      contact:       String(data?.contact ?? ''),
      email:         data?.email         ?? '',
      address:       data?.address       ?? '',
      googleRating:  data?.googleRating  ?? '',
    })
    setSubRegionInput(data?.subRegionId?.name ?? '')
    setSelectedAmenities(data?.amenities ?? [])
    setExistingImages(data?.images ?? [])
  }


  // ── Load hotel (from state or API) ────────────────────────────────────
  useEffect(() => {

    const passed = location.state?.hotel
    if (passed) { populate(passed); return }
    const fetch = async () => {
      try {
        setFetchLoading(true)
        const res = await getHotelById(hotelId)
        populate(res?.data?.foundHotel)
      } catch (error) {
        if (!isProduction) console.log(error)
        toast.error(error?.response?.data?.message || error?.message || 'Error fetching hotel')
      } finally {
        setFetchLoading(false)
      }
    }
    fetch()
  }, [hotelId])

  useEffect(() => { fetchRegions() }, [])

  // ── Close dropdowns on outside click ─────────────────────────────────
  useEffect(() => {
    const h = (e) => {
      if (categoryRef.current  && !categoryRef.current.contains(e.target))  setCategoryOpen(false)
      if (regionRef.current    && !regionRef.current.contains(e.target))    setRegionOpen(false)
      if (subRegionRef.current && !subRegionRef.current.contains(e.target)) setSubRegionSuggestions([])
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  // ── Cleanup new image object URLs ─────────────────────────────────────
  useEffect(() => {
    return () => newImages.forEach((img) => URL.revokeObjectURL(img.preview))
  }, [newImages])

  // ── Sub-region search ─────────────────────────────────────────────────
  useEffect(() => {
    if (!form.regionId || subRegionInput.trim().length < 1) { setSubRegionSuggestions([]); return }
    if (form.subRegionId && subRegionInput === form.subRegionName) return

    const fetchSub = async () => {
      try {
        setSubRegionLoading(true)
        const res = await searchSubRegionForOrg(subRegionInput, null, form.regionId)
        setSubRegionSuggestions(res?.data?.searchedSubRegions || [])
      } catch (error) {
        if (!isProduction) console.log(error)
        toast.error(error?.response?.data?.message || error?.message || 'Error fetching sub-regions')
      } finally {
        setSubRegionLoading(false)
      }
    }
    fetchSub()
  }, [subRegionInput])

  // ── Helpers ───────────────────────────────────────────────────────────
  const clearError = (field) =>
    setErrors((p) => { const e = { ...p }; delete e[field]; return e })

  const toggleAmenity = (label) =>
    setSelectedAmenities((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    )

  const handleRegionSelect = (region) => {
    setForm((f) => ({ ...f, regionId: region?._id, regionName: region?.name, subRegionId: '', subRegionName: '' }))
    setRegionOpen(false)
    setSubRegionInput('')
    setSubRegionSuggestions([])
    clearError('regionId')
  }

  const handleSubRegionSelect = (sr) => {
    setForm((f) => ({ ...f, subRegionId: sr?._id, subRegionName: sr?.name }))
    setSubRegionInput(sr?.name ?? '')
    setSubRegionSuggestions([])
    clearError('subRegionId')
  }

  // ── Image handlers ────────────────────────────────────────────────────
  /** Remove an existing cloudinary image — mark for deletion */
  const removeExistingImage = (img) => {
    setExistingImages((prev) => prev.filter((i) => i?._id !== img?._id))
    if (img?.public_id) setImagesToDelete((prev) => [...prev, img.public_id])
  }

  /** Remove a locally picked (not yet uploaded) image */
  const removeNewImage = (idx) => {
    setNewImages((prev) => {
      URL.revokeObjectURL(prev[idx].preview)
      return prev.filter((_, i) => i !== idx)
    })
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (slotsLeft <= 0) return
    const toAdd = files.slice(0, slotsLeft).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setNewImages((prev) => [...prev, ...toAdd])
    e.target.value = ''
  }

  // ── Change detection ──────────────────────────────────────────────────
  const hasChanges =
    form.hotelName     !== (originalData?.hotelName     ?? '')           ||
    form.category      !== (originalData?.category      ?? 'Budget')     ||
    form.regionId      !== (originalData?.regionId?._id ?? '')           ||
    form.subRegionId   !== (originalData?.subRegionId?._id ?? '')        ||
    form.contact       !== String(originalData?.contact ?? '')           ||
    form.email         !== (originalData?.email         ?? '')           ||
    form.address       !== (originalData?.address       ?? '')           ||
    String(form.googleRating) !== String(originalData?.googleRating ?? '') ||
    JSON.stringify(selectedAmenities.slice().sort()) !==
      JSON.stringify((originalData?.amenities ?? []).slice().sort())     ||
    imagesToDelete.length > 0                                            ||
    newImages.length > 0

  // ── Validation ────────────────────────────────────────────────────────
  const validate = () => {
    const e = {}
    if (!form.hotelName?.trim())  e.hotelName = 'Hotel name is required.'
    if (!form.category)           e.category  = 'Please select a category.'
    if (!form.regionId)           e.regionId  = 'Please select a region.'
    if (!form.contact?.trim())    e.contact   = 'Contact is required.'
    else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.contact.trim())) e.contact = 'Enter a valid contact number.'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Enter a valid email.'
    if (form.googleRating !== '') {
      const r = Number(form.googleRating)
      if (isNaN(r) || r < 0 || r > 5) e.googleRating = 'Rating must be between 0 and 5.'
    }
    return e
  }

  // ── Submit ────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length !== 0) return

    try {
      setSubmitLoading(true)

      const formData = new FormData()
      formData.append('hotelName', form.hotelName)
      formData.append('category',  form.category)
      formData.append('regionId',  form.regionId)
      if (form.subRegionId) formData.append('subRegionId', form.subRegionId)
      formData.append('contact',   form.contact)
      if (form.email)   formData.append('email',   form.email)
      if (form.address) formData.append('address', form.address)
      if (form.googleRating !== '') formData.append('googleRating', Number(form.googleRating))
      formData.append('amenities', JSON.stringify(selectedAmenities))

      // Images to delete (cloudinary public_ids)
      if (imagesToDelete.length > 0)
        formData.append('imagesToDelete', JSON.stringify(imagesToDelete))

      // New files to upload
      newImages.forEach((img) => formData.append('images', img.file))


      // ── Uncomment when real hook is ready ──
      const response = await updateHotelById(originalData?._id, formData)
      toast.success(response?.data?.message)
      navigate(-1)
    } catch (error) {
      if (!isProduction) {
        console.log('========= ERROR DEBUG START =========')
        console.log('Error:', error)
        console.log('Response:', error?.response)
        console.log('========= ERROR DEBUG END =========')
      }
      toast.error(error?.response?.data?.message || error?.message || 'Error updating hotel')
    } finally {
      setSubmitLoading(false)
    }
  }

  // ── Input class ───────────────────────────────────────────────────────
  const inputCls = (field) =>
    `w-full px-4 py-2.5 rounded-lg border text-sm text-[#18305C] outline-none transition-all bg-white placeholder-gray-400
    ${errors[field]
      ? 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100'
      : 'border-gray-300 focus:border-[#ED5F8D] focus:ring-2 focus:ring-pink-100'
    }`

  if (fetchLoading) return <Skeleton />

  return (
    <div className="min-h-screen bg-white p-6 md:p-8 font-sans">

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="mb-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[#18305C]">Update Hotel</h1>
        <p className="text-sm text-gray-500 mt-1">Edit property and contact details</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#18305C] mt-3 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to List
        </button>
      </div>

      {/* ── Form Card ─────────────────────────────────────────────────── */}
      <div
        className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 max-w-4xl mx-auto"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}
      >

        {/* Unsaved changes banner */}
        {hasChanges && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-lg px-4 py-2.5 mb-5">
            <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <p className="text-xs text-amber-600 font-medium">You have unsaved changes</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">

          {/* Hotel Name */}
          <div>
            <label className="block text-sm font-semibold text-[#18305C] mb-1.5">
              Hotel Name <span className="text-[#ED5F8D]">*</span>
            </label>
            <input
              type="text"
              value={form.hotelName}
              onChange={(e) => { setForm((f) => ({ ...f, hotelName: e.target.value })); clearError('hotelName') }}
              placeholder="e.g. Tawang Homestay"
              className={inputCls('hotelName')}
            />
            {errors.hotelName && <p className="text-red-500 text-xs mt-1">{errors.hotelName}</p>}
          </div>

          {/* Category */}
          <div className="relative" ref={categoryRef}>
            <label className="block text-sm font-semibold text-[#18305C] mb-1.5">
              Category <span className="text-[#ED5F8D]">*</span>
            </label>
            <button
              type="button"
              onClick={() => setCategoryOpen((o) => !o)}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm text-left flex justify-between items-center outline-none transition-all bg-white
                ${errors.category
                  ? 'border-red-400 bg-red-50'
                  : categoryOpen
                    ? 'border-[#ED5F8D] ring-2 ring-pink-100'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
            >
              <span className={form.category ? 'text-[#18305C]' : 'text-gray-400'}>
                {form.category || 'Select category'}
              </span>
              <ChevronDown size={16} className={`text-[#18305C] transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
            </button>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            {categoryOpen && (
              <div className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] overflow-hidden">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setForm((f) => ({ ...f, category: c })); setCategoryOpen(false); clearError('category') }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                      ${form.category === c ? 'bg-[#ED5F8D] text-white font-semibold' : 'text-[#18305C] hover:bg-pink-50'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Region */}
          <div className="relative" ref={regionRef}>
            <label className="block text-sm font-semibold text-[#18305C] mb-1.5">
              Region <span className="text-[#ED5F8D]">*</span>
            </label>
            <button
              type="button"
              onClick={() => setRegionOpen((o) => !o)}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm text-left flex justify-between items-center outline-none transition-all bg-white
                ${errors.regionId
                  ? 'border-red-400 bg-red-50'
                  : regionOpen
                    ? 'border-[#ED5F8D] ring-2 ring-pink-100'
                    : form.regionId
                      ? 'border-[#ED5F8D] bg-pink-50/20'
                      : 'border-gray-300 hover:border-gray-400'
                }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <MapPin size={14} className={`shrink-0 ${form.regionId ? 'text-[#ED5F8D]' : 'text-gray-400'}`} />
                <span className={`truncate ${form.regionId ? 'text-[#18305C] font-medium' : 'text-gray-400'}`}>
                  {form.regionName || 'Select region'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                {form.regionId && (
                  <span className="text-[11px] text-gray-400">
                    {allRegionsForSuggestions?.find((r) => r._id === form.regionId)?.country}
                  </span>
                )}
                {regionLoading ? (
                  <svg className="animate-spin h-4 w-4 text-[#ED5F8D]" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
                  </svg>
                ) : (
                  <ChevronDown size={16} className={`text-[#18305C] transition-transform ${regionOpen ? 'rotate-180' : ''}`} />
                )}
              </div>
            </button>
            {errors.regionId && <p className="text-red-500 text-xs mt-1">{errors.regionId}</p>}
            {regionOpen && (
              <div className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] overflow-hidden">
                <div className="max-h-52 overflow-y-auto">
                  {allRegionsForSuggestions?.map((r) => (
                    <button
                      key={r._id}
                      onClick={() => handleRegionSelect(r)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between
                        ${form.regionId === r._id ? 'bg-[#ED5F8D] text-white font-semibold' : 'text-[#18305C] hover:bg-pink-50'}`}
                    >
                      <span>{r.name}</span>
                      <span className={`text-xs ${form.regionId === r._id ? 'text-pink-100' : 'text-gray-400'}`}>{r.country}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sub-Region */}
          <div className="relative" ref={subRegionRef}>
            <label className="block text-sm font-semibold text-[#18305C] mb-1.5">
              Sub-Region
              <span className="ml-2 text-[11px] font-normal text-gray-400">(optional)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={subRegionInput}
                disabled={!form.regionId}
                onChange={(e) => {
                  setSubRegionInput(e.target.value)
                  if (form.subRegionId) setForm((f) => ({ ...f, subRegionId: '', subRegionName: '' }))
                  clearError('subRegionId')
                }}
                placeholder={form.regionId ? 'Search sub-region...' : 'Select a region first'}
                className={`w-full px-4 pr-10 py-2.5 rounded-lg border text-sm text-[#18305C] outline-none transition-all placeholder-gray-400
                  ${!form.regionId
                    ? 'bg-gray-50 border-gray-200 cursor-not-allowed text-gray-400'
                    : form.subRegionId
                      ? 'border-[#ED5F8D] bg-pink-50/20 focus:border-[#ED5F8D] focus:ring-2 focus:ring-pink-100'
                      : 'border-gray-300 focus:border-[#ED5F8D] focus:ring-2 focus:ring-pink-100 bg-white'
                  }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                {subRegionLoading ? (
                  <svg className="animate-spin h-4 w-4 text-[#ED5F8D]" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
                  </svg>
                ) : form.subRegionId ? (
                  <svg className="w-4 h-4 text-[#ED5F8D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : form.regionId ? (
                  <MapPin size={14} className="text-gray-400" />
                ) : null}
              </div>
            </div>
            {!subRegionLoading && subRegionInput.trim().length >= 1 && subRegionSuggestions.length === 0 && !form.subRegionId && form.regionId && (
              <p className="text-xs text-gray-400 mt-1">No sub-regions found for "{subRegionInput}"</p>
            )}
            {subRegionSuggestions.length > 0 && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] overflow-hidden">
                <div className="max-h-48 overflow-y-auto">
                  {subRegionSuggestions.map((sr) => (
                    <button
                      key={sr?._id}
                      onClick={() => handleSubRegionSelect(sr)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                        ${form.subRegionId === sr?._id ? 'bg-[#ED5F8D] text-white font-semibold' : 'text-[#18305C] hover:bg-pink-50'}`}
                    >
                      {sr?.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-semibold text-[#18305C] mb-1.5">
              Contact <span className="text-[#ED5F8D]">*</span>
            </label>
            <div className="relative">
              <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="tel"
                value={form.contact}
                onChange={(e) => { setForm((f) => ({ ...f, contact: e.target.value?.slice(0, 10) })); clearError('contact') }}
                placeholder="+91 0000000000"
                className={`${inputCls('contact')} pl-9`}
              />
            </div>
            {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-[#18305C] mb-1.5">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => { setForm((f) => ({ ...f, email: e.target.value })); clearError('email') }}
                placeholder="e.g. hotel@gmail.com"
                className={`${inputCls('email')} pl-9`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-[#18305C] mb-1.5">Address</label>
            <textarea
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              placeholder="Enter full address"
              rows={3}
              className={`${inputCls('address')} resize-none`}
            />
          </div>

          {/* Images ── spans right column rows 4-5 */}
          <div className="md:row-span-2">
            <label className="block text-sm font-semibold text-[#18305C] mb-1.5">
              Images
              <span className="ml-2 text-[11px] font-normal text-gray-400">(up to {MAX_IMAGES})</span>
            </label>

            {/* Upload box */}
            <button
              type="button"
              onClick={() => slotsLeft > 0 && fileInputRef.current?.click()}
              disabled={slotsLeft <= 0}
              className={`w-full border-2 border-dashed rounded-xl py-5 flex flex-col items-center gap-1.5 transition-all
                ${slotsLeft <= 0
                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  : 'border-gray-300 hover:border-[#ED5F8D] hover:bg-pink-50/30 cursor-pointer'
                }`}
            >
              <Upload size={20} className={slotsLeft <= 0 ? 'text-gray-300' : 'text-[#ED5F8D]'} />
              <span className={`text-sm font-semibold ${slotsLeft <= 0 ? 'text-gray-300' : 'text-[#18305C]'}`}>
                Browse File
              </span>
              <span className="text-xs text-gray-400">
                {slotsLeft <= 0 ? 'Maximum images reached' : `${slotsLeft} slot${slotsLeft !== 1 ? 's' : ''} remaining`}
              </span>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />

            {/* Existing cloudinary images */}
            {existingImages.length > 0 && (
              <div className="mt-3">
                <p className="text-[11px] text-gray-400 font-medium mb-2">Current images</p>
                <div className="flex gap-2 flex-wrap">
                  {existingImages.map((img) => (
                    <div key={img?._id} className="relative group">
                      <img
                        src={img?.url}
                        alt="existing"
                        className="w-20 h-20 rounded-lg object-cover border border-gray-200 shadow-sm"
                        onError={(e) => { e.target.src = '' }}
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(img)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <X size={11} className="text-white" />
                      </button>
                      {/* Cloudinary badge */}
                      <div className="absolute bottom-1 left-1 bg-black/50 text-white text-[8px] font-bold px-1 rounded">
                        saved
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Newly picked images */}
            {newImages.length > 0 && (
              <div className="mt-3">
                <p className="text-[11px] text-gray-400 font-medium mb-2">New images to upload</p>
                <div className="flex gap-2 flex-wrap">
                  {newImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img.preview}
                        alt={`new-${idx}`}
                        className="w-20 h-20 rounded-lg object-cover border border-[#ED5F8D]/40 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(idx)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={11} className="text-white" />
                      </button>
                      <div className="absolute bottom-1 left-1 bg-[#ED5F8D]/80 text-white text-[8px] font-bold px-1 rounded">
                        new
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Images-to-delete warning */}
            {imagesToDelete.length > 0 && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
                <X size={12} />
                {imagesToDelete.length} image{imagesToDelete.length > 1 ? 's' : ''} will be deleted on save
              </div>
            )}
          </div>

          {/* Google Rating */}
          <div>
            <label className="block text-sm font-semibold text-[#18305C] mb-1.5">Google Rating</label>
            <StarDisplay value={ratingNum} />
            <div className="relative mt-2">
              <Star size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none" />
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.googleRating}
                onChange={(e) => {
                  const val = e.target.value
                  setForm((f) => ({ ...f, googleRating: Number(val) > 5 ? '5' : val }))
                  clearError('googleRating')
                }}
                placeholder="0 – 5"
                className={`${inputCls('googleRating')} pl-9`}
              />
            </div>
            {errors.googleRating && <p className="text-red-500 text-xs mt-1">{errors.googleRating}</p>}
          </div>

        </div>

        {/* ── Amenities ──────────────────────────────────────────────────── */}
        <div className="mt-7">
          <div className="flex items-center justify-between mb-3">
            <div>
              <label className="block text-sm font-semibold text-[#18305C]">Amenities</label>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Select all amenities available at this property
                <span className="ml-2 font-semibold text-[#ED5F8D]">{selectedAmenities.length} selected</span>
              </p>
            </div>
            {selectedAmenities.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedAmenities([])}
                className="text-xs text-gray-400 hover:text-red-400 font-semibold transition-colors flex items-center gap-1"
              >
                <X size={12} /> Clear all
              </button>
            )}
          </div>

          <div
            className="rounded-xl p-4"
            style={{ border: '1.5px solid #F0F0F0', background: '#FAFAFA' }}
          >
            <div className="flex flex-wrap gap-2.5">
              {AMENITIES_LIST.map((amenity) => (
                <AmenityChip
                  key={amenity.key}
                  amenity={amenity}
                  selected={selectedAmenities.includes(amenity.label)}
                  onToggle={toggleAmenity}
                />
              ))}
            </div>
          </div>

          {/* Selected summary pills */}
          {selectedAmenities.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {selectedAmenities.map((label) => {
                const found = AMENITIES_LIST.find((a) => a.label === label)
                if (!found) return null
                return (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: '#FFF0F7', color: '#ED5F8D', border: '1px solid #FADADF' }}
                  >
                    {found.label}
                    <button
                      type="button"
                      onClick={() => toggleAmenity(label)}
                      className="ml-0.5 hover:opacity-70 transition-opacity"
                    >
                      <X size={10} strokeWidth={2.5} />
                    </button>
                  </span>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Actions ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 mt-6 max-w-4xl mx-auto">
        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={submitLoading}
          className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-[#18305C] text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          <XCircle size={16} />
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitLoading || !hasChanges}
          className={`flex items-center gap-2 px-6 py-2.5 bg-[#ED5F8D] text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-pink-200
            ${submitLoading || !hasChanges ? 'opacity-60 cursor-not-allowed' : 'hover:bg-pink-600'}`}
        >
          {submitLoading ? (
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
            </svg>
          ) : (
            <Save size={16} />
          )}
          {submitLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}