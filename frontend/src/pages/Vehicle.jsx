import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Car,  Map, LayoutGrid, Plus, Search, SlidersHorizontal,
   ChevronDown, X
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useVehicleHooks } from '../hooks/useVehicleHooks'
import { toast } from 'react-toastify'
import VehicleSkeletonGrid from '../components/Vehicles/VehicleSkeleton'
import { clearVehicles, setVehiclePageLimit } from '../redux/slices/vehicleSlice'
import { useRegionHooks } from '../hooks/useRegionHooks'
import { useCommonHooks } from '../hooks/useCommonHooks'
import VehicleCard from '../components/Vehicles/VehicleCard'
import DeleteModal from '../components/DeleteModals/DeleteModal'



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

// ── Main ──────────────────────────────────────────────────────────────────
export default function Vehicle() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { getVehicles, deleteVehicleForOrg } = useVehicleHooks();
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
  const insights = useSelector((state)=>state.vehicle.insights)
  const [isSearching, setIsSearching] = useState(false)
  const [allRegions,setAllRegions] = useState( [])
  let allRegionsForSuggestions = useSelector((state)=>state.user.allRegionsForSuggestions)

  useEffect(() => {
    if (!allRegionsForSuggestions) return;
  
    const regions = allRegionsForSuggestions
      .flatMap((val) => val?.name || []) 
      .filter(Boolean); 
  
    setAllRegions(['All Region', ...regions]);
  }, [allRegionsForSuggestions]);


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

  },[search,region,type,sort,pageLimit])

  const filtered = isSearching ? searchedVehicles : currentPageVehicle
  const handleDelete = (v) => setDeleteTarget(v)
  const confirmDelete =async () => { 
    try{
      setFetchLoading(true)
      const response = await deleteVehicleForOrg (deleteTarget?._id,deleteTarget?.regionId?._id )
      toast.success(response?.data?.message)
      setDeleteTarget(null) 
      setFetchLoading(false)
    }
    catch(error){
      setFetchLoading(false)
      setDeleteTarget(null) 
      if (!isProduction) {
        console.log("========= ERROR DEBUG START =========");
        console.log("Error:", error);
        console.log("Response:", error?.response);
        console.log("========= ERROR DEBUG END =========");
      }
      toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
    }




   
  }

  const fetchVehilces = async () => {
    try {
      setFetchLoading(true)
      const res = await getVehicles(currentPage, pageLimit)
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

const resetFilter = ()=>{
  setSearch('')
  setRegion('All Region')
  setType('All Type')
  setSort('Recently Added')
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
            <p className="text-[32px] font-bold text-[#18305C] leading-none">{pagination?.totalRecords||0}</p>
          </div>
        </StatCard>

        <StatCard>
          <div className="w-11 h-11 rounded-xl bg-[#F1F3F7] flex items-center justify-center shrink-0">
            <Map size={20} className="text-[#18305C]" strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-gray-400 mb-1.5">Top Region</p>
            <p className="text-base font-bold text-[#18305C] truncate">{insights?.topRegion?.name || "N/A"}</p>
            <div className="flex flex-wrap gap-x-3 mt-1.5">
                <span className="text-[11px] text-gray-400 font-medium">{insights?.topRegion?.name || "N/A"}: {insights?.topRegion?.totalVehicles || "N/A"}</span>
            </div>
          </div>
        </StatCard>

        <StatCard>
          <div className="w-11 h-11 rounded-xl bg-[#F1F3F7] flex items-center justify-center shrink-0">
            <LayoutGrid size={20} className="text-[#18305C]" strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-gray-400 mb-1.5">Popular Type</p>
            <p className="text-base font-bold text-[#18305C] truncate">{insights?.topVehicleType?.vehicleType||"N/A"}</p>
            <div className="flex flex-wrap gap-x-3 mt-1.5">
                <span  className="text-[11px] text-gray-400 font-medium">{insights?.topVehicleType?.vehicleType||"N/A"}: {insights?.topVehicleType?.totalVehicles||"N/A"}</span>
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
            placeholder="Search by vehicle model"
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
            onClick={()=>resetFilter()}
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
                  // onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

      {/* Footer count */}
      {filtered?.length > 0 && (
        <p className="text-xs text-gray-400 mt-5 font-medium">
          Showing <span className="text-[#18305C] font-bold">{filtered.length}</span> of{' '}
          <span className="text-[#18305C] font-bold">{pagination?.totalRecords}</span> vehicles
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
        <DeleteModal onClose={()=>setDeleteTarget(null)} onDelete={confirmDelete} itemName = {deleteTarget?.vehicleModel} confirmText =  {deleteTarget?.vehicleModel}/>
      )}
    </div>
  )
}