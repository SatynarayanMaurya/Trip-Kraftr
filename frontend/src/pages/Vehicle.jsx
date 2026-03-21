import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Car, MapPin, Map, LayoutGrid, Plus, Search, SlidersHorizontal,
  Pencil, Trash2, ChevronDown, X, AlertTriangle
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useVehicleHooks } from '../hooks/useVehicleHooks'
import { toast } from 'react-toastify'
import VehicleSkeletonGrid from '../components/Vehicles/VehicleSkeleton'
import { clearVehicles, setVehiclePageLimit } from '../redux/slices/vehicleSlice'
import { useRegionHooks } from '../hooks/useRegionHooks'
import { useCommonHooks } from '../hooks/useCommonHooks'

// ── Dummy data ────────────────────────────────────────────────────────────
const DUMMY_VEHICLES = [
  {
    _id: '69bce880b86f87342219122e',
    regionId: { _id: '69b631aa516e096539851340', name: 'Explore Sikkim', country: 'India' },
    pricePerDay: 4000, transferPrice: 5000,
    contactNo: '8765432109', vehicleImageUrl: '',
    vehicleModel: 'Toyota Camry', vehicleType: 'SUV',
    vendorName: 'Swift Travels', is_active: true,
    createdAt: '2026-03-20T06:26:08.039Z',
  },
  {
    _id: '69bce880b86f87342219122f',
    regionId: { _id: '69b631aa516e096539851341', name: 'Explore Sikkim', country: 'India' },
    pricePerDay: 4000, transferPrice: 5000,
    contactNo: '9876543210', vehicleImageUrl: '',
    vehicleModel: 'Toyota Camry', vehicleType: 'SUV',
    vendorName: 'Raju Travels', is_active: true,
    createdAt: '2026-03-18T10:00:00.000Z',
  },
  {
    _id: '69bce880b86f87342219123a',
    regionId: { _id: '69b631aa516e096539851342', name: 'Explore Sikkim', country: 'India' },
    pricePerDay: 4000, transferPrice: 5000,
    contactNo: '9123456780', vehicleImageUrl: '',
    vehicleModel: 'Toyota Camry', vehicleType: 'SUV',
    vendorName: 'Mountain Cabs', is_active: true,
    createdAt: '2026-03-15T08:00:00.000Z',
  },
  {
    _id: '69bce880b86f87342219123b',
    regionId: { _id: '69b631aa516e096539851343', name: 'Explore Sikkim', country: 'India' },
    pricePerDay: 4000, transferPrice: 5000,
    contactNo: '9000011111', vehicleImageUrl: '',
    vehicleModel: 'Toyota Camry', vehicleType: 'SUV',
    vendorName: 'Hill Riders', is_active: false,
    createdAt: '2026-03-10T12:00:00.000Z',
  },
  {
    _id: '69bce880b86f87342219123c',
    regionId: { _id: '69b631aa516e096539851344', name: 'Europe Tour', country: 'France' },
    pricePerDay: 8000, transferPrice: 9000,
    contactNo: '9111122223', vehicleImageUrl: '',
    vehicleModel: 'Mercedes E-Class', vehicleType: 'Luxury Car',
    vendorName: 'Luxe Rides', is_active: true,
    createdAt: '2026-03-05T09:00:00.000Z',
  },
]


// const ALL_TYPES = ['All Type', 'Sedan', 'SUV', 'Van', 'Hatchback', 'Minibus', 'Coach', 'Luxury Car']
const ALL_TYPES = [
  'All Type','Sedan', 'SUV', 'Hatchback', 'Van', 'Minibus', 'Bus',
    'Coach', 'Luxury Car',"Tempo Traveller",
]
const SORT_OPTIONS = ['Recently Added', 'Price: Low to High', 'Price: High to Low', 'Name: A to Z']

// ── Custom Select ─────────────────────────────────────────────────────────
function CustomSelect({ value, onChange, options }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          boxShadow: open
            ? '0 0 0 3px rgba(24,48,92,0.08), 0 2px 8px rgba(0,0,0,0.10)'
            : '0 1px 6px rgba(0,0,0,0.09)',
          border: open ? '1.5px solid #18305C' : '1.5px solid #E5E7EB',
          transition: 'all 0.15s ease',
        }}
        className="flex items-center gap-2 px-3.5 py-[9px] bg-white text-sm font-semibold rounded-xl whitespace-nowrap text-[#18305C]"
      >
        {value}
        <ChevronDown
          size={15}
          strokeWidth={2.5}
          className="text-[#18305C]"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        />
      </button>
      {open && (
        <div
          className="absolute z-30 mt-1.5 min-w-full bg-white border border-gray-200 rounded-xl overflow-hidden"
          style={{ boxShadow: '0 8px 28px rgba(0,0,0,0.13)' }}
        >
          {options?.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false) }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors whitespace-nowrap
                ${value === opt
                  ? 'bg-[#18305C] text-white font-semibold'
                  : 'text-[#18305C] hover:bg-[#F5F7FA] font-medium'
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Stat Card wrapper ──────────────────────────────────────────────────────
function StatCard({ children }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="bg-white rounded-2xl px-6 py-5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: hovered ? '1.5px solid #D1D5DB' : '1.5px solid #E5E7EB',
        boxShadow: hovered
          ? '0 6px 20px rgba(24,48,92,0.11)'
          : '0 1px 8px rgba(0,0,0,0.07)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.2s ease',
      }}
    >
      <div className="flex items-start gap-4">{children}</div>
    </div>
  )
}

// ── Vehicle Card ──────────────────────────────────────────────────────────
function VehicleCard({ vehicle, onEdit, onDelete }) {
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
            onClick={() => onEdit?.(vehicle)}
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

        {/* Region */}
        <div className="flex items-center gap-1 mb-3">
          <MapPin size={13} className="text-[#E91E8C] shrink-0" strokeWidth={2.5} fill="#E91E8C" />
          <span className="text-sm font-bold text-[#E91E8C]">{vehicle?.regionId?.name ?? '—'}</span>
        </div>

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

// ── Main ──────────────────────────────────────────────────────────────────
export default function Vehicle() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { getVehicles } = useVehicleHooks();
  const {getRegionsForOrg} = useRegionHooks()
  const {searchVehicles} = useCommonHooks()

  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('All Region')
  const [type, setType] = useState('All Type')
  const [sort, setSort] = useState('Recently Added')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [searchFocused, setSearchFocused] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const isProduction = useSelector((state) => state.user.isProduction)
  const [fetchLoading, setFetchLoading] = useState(false)
  const currentPageVehicle = useSelector((state) => state.vehicle.vehiclesPages?.[currentPage])
  const [searchedVehicles , setSearchedVehicles] = useState([])
  const pagination = useSelector((state) => state.vehicle.paginationVehicles)
  const pageLimit = useSelector((state) => state.vehicle.vehiclesPageLimit)
  const stats = useSelector((state) => state.vehicle.statsVehicles)
  const [isSearching, setIsSearching] = useState(false)
  const [allRegions,setAllRegions] = useState( [])
  let allRegionsForSuggestions = useSelector((state)=>state.user.allRegionsForSuggestions)

  useEffect(() => {
    if (!allRegionsForSuggestions) return;
  
    const regions = allRegionsForSuggestions
      .flatMap((val) => val?.name || []) // flatten arrays safely
      .filter(Boolean); // remove undefined/null
  
    setAllRegions(['All Region', ...regions]);
  }, [allRegionsForSuggestions]);

  // ── Stats ────────────────────────────────────────────────────────────
  const total = pagination.totalRecords

  const regionCounts = DUMMY_VEHICLES.reduce((acc, v) => {
    const r = v?.regionId?.name ?? 'Unknown'
    acc[r] = (acc[r] || 0) + 1
    return acc
  }, {})
  const topRegion = Object.entries(regionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  const typeCounts = DUMMY_VEHICLES.reduce((acc, v) => {
    const t = v?.vehicleType ?? 'Unknown'
    acc[t] = (acc[t] || 0) + 1
    return acc
  }, {})
  const popularType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'


  const searchVehicle = async()=>{
    try{
      setFetchLoading(true)
      setIsSearching(true)
      const regionId = allRegionsForSuggestions?.find((val)=>val?.name===region)?._id
      const response = await searchVehicles(search, sort, type, regionId,pageLimit)
      setSearchedVehicles(response?.data?.searchedVehicle || [])
      setFetchLoading(false)
      
    }
    catch(error){
      setFetchLoading(false)
      setIsSearching(false)
      if (!isProduction) {
        console.log("========= ERROR DEBUG START =========");
        console.log("Error:", error);
        console.log("Response:", error?.response);
        console.log("========= ERROR DEBUG END =========");
      }
      toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
    }




  }

  useEffect(()=>{
    if(search === "" && type ==="All Type" && sort==='Recently Added' && region ==="All Region"){
      setIsSearching(false)
      return ;
    }
    searchVehicle()

  },[search,region,type,sort])

  const filtered = isSearching ? searchedVehicles : currentPageVehicle
  const handleEdit = (v) => navigate(`update-vehicle/${v?._id}`, { state: { vehicle: v } })
  const handleDelete = (v) => setDeleteTarget(v)
  const confirmDelete = () => { console.log('Delete:', deleteTarget?._id); setDeleteTarget(null) }

  const fetchVehilces = async () => {
    try {
      setFetchLoading(true)
      await getVehicles(currentPage, pageLimit)
      setFetchLoading(false)
    }
    catch (error) {
      setFetchLoading(false)
      if (!isProduction) {
        console.log("========= ERROR DEBUG START =========");
        console.log("Error:", error);
        console.log("Response:", error?.response);
        console.log("========= ERROR DEBUG END =========");
      }
      toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
    }
  }

  const fetchRegionsForSuggestion = async()=>{
    try{
      if(allRegionsForSuggestions && allRegionsForSuggestions?.length > 0) return 
      setFetchLoading(true)
      await getRegionsForOrg()
      setFetchLoading(false)
    }
    catch(error){
      setFetchLoading(false)
      if (!isProduction) {
        console.log("========= ERROR DEBUG START =========");
        console.log("Error:", error);
        console.log("Response:", error?.response);
        console.log("========= ERROR DEBUG END =========");
      }
      toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
    }




  }

  useEffect(() => {
    if(!currentPageVehicle?.[currentPage]){
      fetchVehilces()
    }
    
  }, [currentPage,pageLimit])

  useEffect(()=>{
    if(allRegionsForSuggestions && allRegionsForSuggestions?.length > 0) return 
    else{
      fetchRegionsForSuggestion()
    }
  },[])

  const changePageLimit = (val)=>{
    dispatch(clearVehicles())
    setCurrentPage(1)
    dispatch(setVehiclePageLimit(Number(val)))
}

  return (
    <div className="min-h-screen bg-white font-sans" style={{ padding: '28px 32px' }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-[28px] font-bold text-[#18305C] leading-tight tracking-tight">
            Vehicle Inventory
          </h1>
          <p className="text-sm text-gray-400 mt-1 font-medium">
            Manage your fleet across all regions and body types.
          </p>
        </div>
        <button
          onClick={() => navigate('add-vehicle')}
          className="flex items-center gap-2 px-4 md:px-5 py-2.5 text-white text-sm font-bold rounded-xl shrink-0"
          style={{
            background: '#E91E8C',
            boxShadow: '0 2px 10px rgba(233,30,140,0.30)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#C81878'
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(233,30,140,0.40)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#E91E8C'
            e.currentTarget.style.boxShadow = '0 2px 10px rgba(233,30,140,0.30)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span className="hidden sm:inline">Add Vehicle</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

        <StatCard>
          <div className="w-11 h-11 rounded-xl bg-[#F1F3F7] flex items-center justify-center shrink-0">
            <Car size={20} className="text-[#18305C]" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-gray-400 mb-1.5">Total Vehicles</p>
            <p className="text-[32px] font-bold text-[#18305C] leading-none">{total}</p>
          </div>
        </StatCard>

        <StatCard>
          <div className="w-11 h-11 rounded-xl bg-[#F1F3F7] flex items-center justify-center shrink-0">
            <Map size={20} className="text-[#18305C]" strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-gray-400 mb-1.5">Top Region</p>
            <p className="text-base font-bold text-[#18305C] truncate">{topRegion}</p>
            <div className="flex flex-wrap gap-x-3 mt-1.5">
              {Object.entries(regionCounts).slice(0, 3).map(([r, c]) => (
                <span key={r} className="text-[11px] text-gray-400 font-medium">{r.split(' ').pop()}: {c}</span>
              ))}
            </div>
          </div>
        </StatCard>

        <StatCard>
          <div className="w-11 h-11 rounded-xl bg-[#F1F3F7] flex items-center justify-center shrink-0">
            <LayoutGrid size={20} className="text-[#18305C]" strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-gray-400 mb-1.5">Popular Type</p>
            <p className="text-base font-bold text-[#18305C] truncate">{popularType}</p>
            <div className="flex flex-wrap gap-x-3 mt-1.5">
              {Object.entries(typeCounts).slice(0, 3).map(([t, c]) => (
                <span key={t} className="text-[11px] text-gray-400 font-medium">{t}: {c}</span>
              ))}
            </div>
          </div>
        </StatCard>
      </div>

      {/* ── Search + Filters ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">

        {/* Search */}
        <div
          className="flex-1 flex items-center gap-2.5 bg-white rounded-xl px-4 py-[10px]"
          style={{
            border: searchFocused ? '1.5px solid #18305C' : '1.5px solid #E5E7EB',
            boxShadow: searchFocused
              ? '0 0 0 3px rgba(24,48,92,0.07), 0 2px 10px rgba(0,0,0,0.10)'
              : '0 1px 6px rgba(0,0,0,0.09)',
            transition: 'all 0.15s ease',
          }}
        >
          <Search size={16} className="text-gray-400 shrink-0" strokeWidth={2} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search by vehicle model and type"
            className="bg-transparent flex-1 outline-none text-sm text-[#18305C] placeholder-gray-400 font-medium"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Filter dropdowns */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <CustomSelect value={region} onChange={setRegion} options={allRegions} />
          <CustomSelect value={type} onChange={setType} options={ALL_TYPES} />
          <CustomSelect value={sort} onChange={setSort} options={SORT_OPTIONS} />

          <button
            className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shrink-0"
            style={{
              border: '1.5px solid #E5E7EB',
              boxShadow: '0 1px 6px rgba(0,0,0,0.09)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#18305C'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(24,48,92,0.07), 0 2px 8px rgba(0,0,0,0.09)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#E5E7EB'
              e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.09)'
            }}
          >
            <SlidersHorizontal size={16} className="text-[#18305C]" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* ── Vehicle Grid ─────────────────────────────────────────────────── */}
      {
        fetchLoading ?
          <VehicleSkeletonGrid /> :
          filtered?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Car size={52} className="mb-3 text-gray-200" strokeWidth={1.2} />
              <p className="font-bold text-[#18305C]">No vehicles found</p>
              <p className="text-sm mt-1 text-gray-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered?.map((v) => (
                <VehicleCard
                  key={v?._id}
                  vehicle={v}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

      {/* Footer count */}
      {filtered?.length > 0 && (
        <p className="text-xs text-gray-400 mt-5 font-medium">
          Showing <span className="text-[#18305C] font-bold">{filtered.length}</span> of{' '}
          <span className="text-[#18305C] font-bold">{total}</span> vehicles
        </p>
      )}


      {/* Pagination */}
      <div
        className="flex items-center justify-between mt-6 bg-white rounded-xl px-5 py-3"
        style={{
          border: '1.5px solid #E5E7EB',
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        }}
      >

        {/* Left Controls */}
        <div className="flex items-center gap-3">

          <button
            disabled={currentPage === 1 || isSearching}
            onClick={() => setCurrentPage(currentPage - 1)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200
        ${currentPage === 1 || isSearching
                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#E91E8C] border-[#E91E8C] text-white hover:bg-[#C81878] cursor-pointer'
              }`}
          >
            ← Prev
          </button>

          <p className="text-sm text-gray-400">
            Page <span className="text-[#18305C] font-semibold">{currentPage || 1}</span> of{" "}
            <span className="text-[#18305C] font-semibold">{pagination?.totalPages || 0}</span>
          </p>

          <button
            disabled={currentPage === pagination?.totalPages || isSearching}
            onClick={() => setCurrentPage(Number(currentPage + 1))}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200
        ${currentPage === pagination?.totalPages || isSearching
                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#E91E8C] border-[#E91E8C] text-white hover:bg-[#C81878] cursor-pointer'
              }`}
          >
            Next →
          </button>

        </div>

        {/* Limit */}
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span>Limit</span>

          <select
            value={pageLimit}
            disabled={isSearching}
            onChange={(e) => changePageLimit(Number(e.target.value))}
            className="bg-white border border-gray-200 text-[#18305C] text-sm px-3 py-2 rounded-lg outline-none focus:border-[#E91E8C] cursor-pointer"
            style={{
              boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
            }}
          >
            <option value="4">4</option>
            <option value="8">8</option>
            <option value="12">12</option>
            <option value="16">16</option>
          </select>
        </div>

        {/* Go to page */}
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span>Go to page</span>

          <select
            value={currentPage}
            disabled={isSearching}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            className="bg-white border border-gray-200 text-[#18305C] text-sm px-3 py-2 rounded-lg outline-none focus:border-[#E91E8C] cursor-pointer"
            style={{
              boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
            }}
          >
            {Array.from({ length: pagination?.totalPages || 1 }, (_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* ── Delete Modal ────────────────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm"
            style={{ border: '1.5px solid #E5E7EB', boxShadow: '0 12px 40px rgba(0,0,0,0.18)' }}
          >
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={22} className="text-red-500" strokeWidth={2} />
            </div>
            <h3 className="text-center font-bold text-lg text-[#18305C] mb-1">Delete Vehicle?</h3>
            <p className="text-center text-sm text-gray-500 mb-1">
              <span className="font-bold text-[#18305C]">{deleteTarget?.vehicleModel}</span>
            </p>
            <p className="text-center text-xs text-gray-400 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-[#18305C] transition-colors hover:bg-gray-50"
                style={{ border: '1.5px solid #E5E7EB' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-colors"
                style={{ boxShadow: '0 2px 8px rgba(239,68,68,0.25)' }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}