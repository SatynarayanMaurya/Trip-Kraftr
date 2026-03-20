import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useCommonHooks } from '../../hooks/useCommonHooks'   // swap with real region hook path
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useVehicleHooks } from '../../hooks/useVehicleHooks'

const VEHICLE_TYPES = [
    'Sedan', 'SUV', 'Hatchback', 'Van', 'Minibus', 'Bus',
    'Luxury Car', 'Convertible', 'Pickup Truck', 'Jeep',
]

export default function AddVehicle() {
    const navigate = useNavigate()
    const {  searchRegionForOrg } = useCommonHooks()   
    const {addVehicle} = useVehicleHooks()
    const isProduction = useSelector((state) => state?.user?.isProduction)
    const [submitLoading, setSubmitLoading] = useState(false)

    const [form, setForm] = useState({
        vendorName: '',
        contactNo: '',
        vehicleType: '',
        regionId: '',
        regionName: '',
        vehicleModel: '',
        pricePerDay: '',
        transferPrice: '',
        vehicleImageUrl: '',
    })

    const [sameAsPrice, setSameAsPrice] = useState(false)
    const [errors, setErrors] = useState({})

    // Vehicle type dropdown
    const [typeOpen, setTypeOpen] = useState(false)
    const typeRef = useRef(null)

    // Region search
    const [regionInput, setRegionInput] = useState('')
    const [regionSuggestions, setRegionSuggestions] = useState([])
    const [regionLoading, setRegionLoading] = useState(false)
    const regionRef = useRef(null)

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e) => {
            if (typeRef.current && !typeRef.current.contains(e.target)) setTypeOpen(false)
            if (regionRef.current && !regionRef.current.contains(e.target)) setRegionSuggestions([])
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    // Sync transfer price when checkbox toggled
    useEffect(() => {
        if (sameAsPrice) {
            setForm((f) => ({ ...f, transferPrice: f.pricePerDay }))
            setErrors((prev) => { const e = { ...prev }; delete e.transferPrice; return e })
        }
    }, [sameAsPrice, form.pricePerDay])

    // Fetch region suggestions on input change
    useEffect(() => {
        if (regionInput.trim().length < 1) {
            setRegionSuggestions([])
            return
        }
        // Don't re-fetch if user already selected and input still matches
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

    const handleRegionSelect = (region) => {
        setForm((f) => ({ ...f, regionId: region?._id, regionName: region?.name }))
        setRegionInput(region?.name)
        setRegionSuggestions([])
        clearError('region')
    }

    const clearError = (field) => {
        setErrors((prev) => { const e = { ...prev }; delete e[field]; return e })
    }

    const validate = () => {
        const e = {}
        if (!form.vendorName.trim())      e.vendorName    = 'Vendor name is required.'
        if (!form.contactNo.trim())       e.contactNo     = 'Contact number is required.'
        else if (!/^\d{7,15}$/.test(form.contactNo.trim())) e.contactNo = 'Enter a valid contact number.'
        if (!form.vehicleType)            e.vehicleType   = 'Please select a vehicle type.'
        if (!form.regionId)               e.region        = 'Please select a region.'
        if (!form.vehicleModel.trim())    e.vehicleModel  = 'Vehicle model is required.'
        if (form.pricePerDay === '')      e.pricePerDay   = 'Price per day is required.'
        else if (Number(form.pricePerDay) < 0) e.pricePerDay = 'Price cannot be negative.'
        if (!sameAsPrice) {
            if (form.transferPrice === '') e.transferPrice = 'Transfer price is required.'
            else if (Number(form.transferPrice) < 0) e.transferPrice = 'Price cannot be negative.'
        }
        if (!form.vehicleImageUrl.trim()) e.vehicleImageUrl = 'Image URL is required.'
        else if (!/^https?:\/\/.+/.test(form.vehicleImageUrl.trim())) e.vehicleImageUrl = 'Enter a valid URL starting with http(s).'
        return e
    }

    const handleSubmit =async () => {
        try{
    
    
            const e = validate()
            setErrors(e)
            if (Object.keys(e).length !== 0) return
            const payload = {
                vendorName:      form.vendorName,
                contactNo:       form.contactNo,
                vehicleType:     form.vehicleType,
                regionId:        form.regionId,        // sent to DB
                vehicleModel:    form.vehicleModel,
                pricePerDay:     form.pricePerDay,
                transferPrice:   sameAsPrice ? form.pricePerDay : form.transferPrice,
                vehicleImageUrl: form.vehicleImageUrl,
            }
            console.log('=== AddVehicle Form Data ===', payload)
            setSubmitLoading(true)
            const response = await addVehicle(payload)
            console.log("Response : ",response)
            toast.success(response?.data?.message)
            setSubmitLoading(false)
            // connect to DB here
        }
        catch(error){
            setSubmitLoading(false)
          if (!isProduction) {
            console.log("========= ERROR DEBUG START =========");
            console.log("Error:", error);
            console.log("Response:", error?.response);
            console.log("========= ERROR DEBUG END =========");
          }
          toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
        }
    
    

    }

    const inputBase = (field) =>
        `w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all bg-white
        ${errors[field]
            ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-100'
            : 'border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-100'
        }`

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans">

            {/* ── Header ────────────────────────────────────────────────────── */}
            <div className="mb-8 flex flex-col">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-9 h-9 rounded-lg bg-pink-500 hover:bg-pink-600 flex items-center justify-center transition-colors shadow-sm shadow-pink-200 shrink-0"
                    >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Add New Vehicle</h1>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-gray-500 mt-3 hover:text-[#18305C] cursor-pointer w-fit"
                >
                    <ArrowLeft size={16} />
                    Back to List
                </button>
            </div>

            {/* ── Form Card ─────────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">

                    {/* Vendor Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Vendor Name <span className="text-pink-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.vendorName}
                            onChange={(e) => { setForm((f) => ({ ...f, vendorName: e.target.value })); clearError('vendorName') }}
                            placeholder="e.g., Raju"
                            className={inputBase('vendorName')}
                        />
                        {errors.vendorName && <p className="text-red-500 text-xs mt-1">{errors.vendorName}</p>}
                    </div>

                    {/* Contact No */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Contact No. <span className="text-pink-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={form.contactNo}
                            onChange={(e) => { setForm((f) => ({ ...f, contactNo: e.target.value?.slice(0,10) })); clearError('contactNo') }}
                            placeholder="e.g., 9456874324"
                            className={inputBase('contactNo')}
                        />
                        {errors.contactNo && <p className="text-red-500 text-xs mt-1">{errors.contactNo}</p>}
                    </div>

                    {/* Vehicle Type — static dropdown */}
                    <div className="relative" ref={typeRef}>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Vehicle Type <span className="text-pink-500">*</span>
                        </label>
                        <button
                            type="button"
                            onClick={() => setTypeOpen((o) => !o)}
                            className={`w-full px-4 py-2.5 rounded-lg border text-sm text-left flex justify-between items-center outline-none transition-all bg-white
                                ${errors.vehicleType
                                    ? 'border-red-400 bg-red-50'
                                    : typeOpen
                                        ? 'border-pink-500 ring-2 ring-pink-100'
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                        >
                            <span className={form.vehicleType ? 'text-gray-700' : 'text-gray-400'}>
                                {form.vehicleType || 'Select type'}
                            </span>
                            <svg
                                className={`w-4 h-4 text-gray-400 transition-transform ${typeOpen ? 'rotate-180' : ''}`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {errors.vehicleType && <p className="text-red-500 text-xs mt-1">{errors.vehicleType}</p>}
                        {typeOpen && (
                            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                                <div className="max-h-48 overflow-y-auto">
                                    {VEHICLE_TYPES.map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => { setForm((f) => ({ ...f, vehicleType: t })); setTypeOpen(false); clearError('vehicleType') }}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                                                ${form.vehicleType === t ? 'bg-pink-50 text-pink-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Region — dynamic search from backend */}
                    <div className="relative" ref={regionRef}>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Region <span className="text-pink-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={regionInput}
                                onChange={(e) => {
                                    setRegionInput(e.target.value)
                                    // Clear stored selection if user modifies input
                                    if (form.regionId) {
                                        setForm((f) => ({ ...f, regionId: '', regionName: '' }))
                                    }
                                    clearError('region')
                                }}
                                placeholder="Search region e.g. Maharashtra"
                                className={`w-full px-4 pr-10 py-2.5 rounded-lg border text-sm outline-none transition-all bg-white
                                    ${errors.region
                                        ? 'border-red-400 bg-red-50'
                                        : form.regionId
                                            ? 'border-pink-400 bg-pink-50'
                                            : 'border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-100'
                                    }`}
                            />
                            {/* Right icon: spinner / checkmark */}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                {regionLoading ? (
                                    <svg className="animate-spin h-4 w-4 text-pink-400" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
                                    </svg>
                                ) : form.regionId ? (
                                    <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : null}
                            </div>
                        </div>

                        {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region}</p>}

                        {/* No results hint */}
                        {!regionLoading && regionInput.trim().length >= 1 && regionSuggestions?.length === 0 && !form.regionId && (
                            <p className="text-xs text-gray-400 mt-1">No regions found for "{regionInput}"</p>
                        )}

                        {/* Suggestions dropdown */}
                        {regionSuggestions?.length > 0 && (
                            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                                <div className="max-h-48 overflow-y-auto">
                                    {regionSuggestions.map((r) => (
                                        <button
                                            key={r?._id}
                                            onClick={() => handleRegionSelect(r)}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                                                ${form.regionId === r?._id
                                                    ? 'bg-pink-50 text-pink-600 font-medium'
                                                    : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'
                                                }`}
                                        >
                                            <span className="font-medium">{r?.name}</span>
                                            {r?.country && (
                                                <span className="text-gray-400 text-xs ml-2">{r.country}</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Vehicle Model */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Vehicle Model <span className="text-pink-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.vehicleModel}
                            onChange={(e) => { setForm((f) => ({ ...f, vehicleModel: e.target.value })); clearError('vehicleModel') }}
                            placeholder="e.g., Toyota Camry"
                            className={inputBase('vehicleModel')}
                        />
                        {errors.vehicleModel && <p className="text-red-500 text-xs mt-1">{errors.vehicleModel}</p>}
                    </div>

                    {/* Price per Day */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Price per Day <span className="text-pink-500">*</span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={form.pricePerDay}
                            onChange={(e) => { setForm((f) => ({ ...f, pricePerDay: e.target.value })); clearError('pricePerDay') }}
                            placeholder="0"
                            className={inputBase('pricePerDay')}
                        />
                        {errors.pricePerDay && <p className="text-red-500 text-xs mt-1">{errors.pricePerDay}</p>}
                    </div>

                    {/* Transfer Price */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Transfer Price <span className="text-pink-500">*</span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={sameAsPrice ? form.pricePerDay : form.transferPrice}
                            disabled={sameAsPrice}
                            onChange={(e) => { setForm((f) => ({ ...f, transferPrice: e.target.value })); clearError('transferPrice') }}
                            placeholder="0"
                            className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all
                                ${sameAsPrice
                                    ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                                    : errors.transferPrice
                                        ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-100'
                                        : 'border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 bg-white'
                                }`}
                        />
                        {errors.transferPrice && !sameAsPrice && (
                            <p className="text-red-500 text-xs mt-1">{errors.transferPrice}</p>
                        )}
                        <label className="flex items-center gap-2 mt-2 cursor-pointer w-fit">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={sameAsPrice}
                                    onChange={(e) => { setSameAsPrice(e.target.checked); clearError('transferPrice') }}
                                    className="sr-only"
                                />
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all
                                    ${sameAsPrice ? 'bg-pink-500 border-pink-500' : 'bg-white border-gray-300 hover:border-pink-400'}`}>
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
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Vehicle Image URL <span className="text-pink-500">*</span>
                        </label>
                        <input
                            type="url"
                            value={form.vehicleImageUrl}
                            onChange={(e) => { setForm((f) => ({ ...f, vehicleImageUrl: e.target.value })); clearError('vehicleImageUrl') }}
                            placeholder="https://image.jpg"
                            className={inputBase('vehicleImageUrl')}
                        />
                        {errors.vehicleImageUrl && <p className="text-red-500 text-xs mt-1">{errors.vehicleImageUrl}</p>}
                        {form.vehicleImageUrl && !errors.vehicleImageUrl && (
                            <div className="mt-2 w-full h-28 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                <img
                                    src={form.vehicleImageUrl}
                                    alt="Vehicle preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.style.display = 'none' }}
                                    onLoad={(e) => { e.target.style.display = 'block' }}
                                />
                            </div>
                        )}
                    </div>

                </div>

                {/* ── Actions ───────────────────────────────────────────────── */}
                <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-7 py-2.5 border border-gray-300 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-7 py-2.5 bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-pink-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}