import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, SlidersHorizontal, Upload, Download, Plus,
  Pencil, Trash2, Phone, MapPin, ChevronDown, X,
} from 'lucide-react'
import HotelCard from '../components/Hotels/HotelCard'
import { useDispatch, useSelector } from 'react-redux'
import { useHotelHooks } from '../hooks/useHotelHooks'
import HotelCardSkeleton from '../components/Hotels/HotelCardSkeleton'
import { clearHotels, setHotelPageLimit } from '../redux/slices/hotelSlice'
import { toast } from 'react-toastify'
import { useRegionHooks } from '../hooks/useRegionHooks'
import { useCommonHooks } from '../hooks/useCommonHooks'


const CATEGORIES = ['All', 'Budget', 'Premium', 'Luxury']



// ── Filter dropdown ────────────────────────────────────────────────────────
function FilterSelect({ label, value, onChange, options }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const active = value !== 'All'

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all whitespace-nowrap
          ${active
            ? 'border-[#E91E8C] bg-pink-50 text-[#E91E8C]'
            : open
              ? 'border-[#E91E8C] ring-2 ring-pink-100 text-[#18305C] bg-white'
              : 'border-gray-200 text-[#18305C] hover:border-gray-300 bg-white'
          }`}
      >
        {active ? `${label}: ${value}` : label}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-30 mt-1 min-w-[150px] bg-white border border-gray-200 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.13)] overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false) }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                ${value === opt ? 'bg-[#E91E8C] text-white font-semibold' : 'text-[#18305C] hover:bg-pink-50'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}



// ── Main ───────────────────────────────────────────────────────────────────
export default function Hotels() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { getHotels, } = useHotelHooks();
  const { getRegionsForOrg} = useRegionHooks()
  const {searchHotels} = useCommonHooks()

  const [search, setSearch] = useState('')
  const [filterRegion, setFilterRegion] = useState('All')
  const [filterSub, setFilterSub] = useState('All')
  const [filterCat, setFilterCat] = useState('All')
  const [filterOpen, setFilterOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const currentPageHotels = useSelector((state) => state.hotel.hotelsPages?.[currentPage])
  const pagination = useSelector((state) => state.hotel.paginationHotels)
  const pageLimit = useSelector((state) => state.hotel.HotelPageLimit)
  const [searchedHotels, setSearchedHotels ] = useState([])

  const [isSearching, setIsSearching] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(false)
  const isProduction = useSelector((state) => state.user.isProduction)
  
  const [allRegions,setAllRegions] = useState( [])
  let allRegionsForSuggestions = useSelector((state)=>state.user.allRegionsForSuggestions)

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

  useEffect(()=>{
    if(allRegionsForSuggestions && allRegionsForSuggestions?.length > 0) return 
    else{
      fetchRegionsForSuggestion()
    }
  },[])

  useEffect(() => {
    if (!allRegionsForSuggestions) return;
  
    const regions = allRegionsForSuggestions
      .flatMap((val) => val?.name || []) 
      .filter(Boolean); 
  
    setAllRegions(['All', ...regions]);
  }, [allRegionsForSuggestions]);

  const fetchHotels = async () => {
    try {
      setFetchLoading(true)
      const response = await getHotels(currentPage, pageLimit);
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

  const searchHotel = async()=>{
    try{
      setIsSearching(true)
      setFetchLoading(true)
      const regionId = allRegionsForSuggestions?.find((val)=>val?.name===filterRegion)?._id 
      const response = await searchHotels (search, regionId,filterCat,null,pageLimit)
      setSearchedHotels(response?.data?.searchedHotels)
      setFetchLoading(false)
    }
    catch(error){
      setIsSearching(false)
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

  useEffect(()=>{
    if(search !== ""||filterCat!=='All'||filterRegion!=='All'||filterSub!=='All'){
      searchHotel()
    }
    else{
      setIsSearching(false)
    }
  },[search,filterCat,filterRegion,filterSub,pageLimit])


  useEffect(() => {
    if (!currentPageHotels?.[currentPage]) {
      fetchHotels()
    }

  }, [currentPage, pageLimit])

  const filtered = isSearching? searchedHotels : currentPageHotels

  const activeFilters =
    (filterRegion !== 'All' ? 1 : 0) +
    (filterSub !== 'All' ? 1 : 0) +
    (filterCat !== 'All' ? 1 : 0)

    const changePageLimit = (val)=>{
      dispatch(clearHotels())
      setCurrentPage(1)
      dispatch(setHotelPageLimit(Number(val)))
  }

  const clearFilters = () => { setFilterRegion('All'); setFilterSub('All'); setFilterCat('All') }
  const handleEdit = (h) => navigate(`update-hotel/${h?._id}`)
  const handleView = (h) => navigate(`view-hotel/${h?._id}`)
  const handleDelete = (h) => setDeleteTarget(h)
  const confirmDelete = () => { console.log('Delete:', deleteTarget?._id); setDeleteTarget(null) }

  return (
    <div className="min-h-screen bg-white p-6 md:p-8 ">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-[26px] font-bold text-[#18305C]">Hotels Inventory</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your contracted properties and catalog drafts.</p>
      </div>

      {/* ── Action buttons — right aligned, above the card ───────────────── */}
      <div className="flex items-center justify-end gap-2.5 mb-5 flex-wrap">
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-[#18305C] text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap"
          style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <Upload size={15} />
          Bulk Import
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-[#18305C] text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <Download size={15} />
          Export
        </button>
        <button
          onClick={() => navigate('add-hotel')}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#ED5F8D] hover:bg-[#ED5F8D] text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap"
          style={{ boxShadow: '0 2px 8px rgba(233,30,140,0.30)' }}
        >
          <Plus size={15} />
          Add New Hotels
        </button>
      </div>

      <div
        className="bg-white rounded-3xl p-5 md:p-6"
        style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.09)' }}
      >

        {/* ── Search bar ──────────────────────────────────────────────────
            Pill-shaped, with its own visible shadow, full width inside the container
        */}
        <div
          className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3 mb-5"
          style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.10)', border: '1px solid #f0f0f0' }}
        >
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by hotel names..."
            className="flex-1 bg-transparent outline-none text-sm text-[#18305C] placeholder-gray-400"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={14} />
            </button>
          )}

          {/* Divider */}
          <div className="h-5 w-px bg-gray-200" />

          {/* Filter icon */}
          <button
            onClick={() => setFilterOpen((o) => !o)}
            className={`relative w-8 h-8 flex items-center justify-center rounded-lg border transition-colors
              ${filterOpen || activeFilters > 0
                ? 'border-[#E91E8C] bg-pink-50 text-[#E91E8C]'
                : 'border-gray-200 text-gray-400 hover:border-gray-300'
              }`}
          >
            <SlidersHorizontal size={15} />
            {activeFilters > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#E91E8C] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {activeFilters}
              </span>
            )}
          </button>
        </div>

        {/* Filter pills */}
        {filterOpen && (
          <div className="flex items-center gap-2.5 mb-5 flex-wrap">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Filter:</span>
            <FilterSelect label="Region" value={filterRegion} onChange={setFilterRegion} options={allRegions} />
            {/* <FilterSelect label="Sub-Region" value={filterSub} onChange={setFilterSub} options={SUB_REGIONS} /> */}
            <FilterSelect label="Category" value={filterCat} onChange={setFilterCat} options={CATEGORIES} />
            {activeFilters > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 font-semibold ml-1 transition-colors"
              >
                <X size={12} /> Clear all
              </button>
            )}
          </div>
        )}

        {/* Results count */}
        {(search || activeFilters > 0) && filtered?.length > 0 && (
          <p className="text-xs text-gray-400 mb-4">
            Showing <span className="text-[#18305C] font-semibold">{filtered?.length}</span> of{' '}
            <span className="text-[#18305C] font-semibold">{pagination?.totalRecords}</span> hotels
          </p>
        )}

        {/* ── Hotel Cards grid ─────────────────────────────────────────── */}


        {
          fetchLoading ?
            (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-6">
                <HotelCardSkeleton />
              </div>
            ) :
            filtered?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <Search size={26} className="text-gray-300" />
                </div>
                <p className="font-semibold text-[#18305C]">No hotels found</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
                {(search || activeFilters > 0) && (
                  <button
                    onClick={() => { setSearch(''); clearFilters() }}
                    className="mt-3 text-sm text-[#E91E8C] font-semibold hover:underline"
                  >
                    Clear search & filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-6">
                {filtered?.map((h) => (
                  <HotelCard
                    key={h._id}
                    hotel={h}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                  />
                ))}
              </div>
            )}
      </div>


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
            <option value="20">20</option>
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

      {/* ── Delete Modal ─────────────────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 w-full max-w-sm">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h3 className="text-center font-bold text-lg text-[#18305C] mb-1">Delete Hotel?</h3>
            <p className="text-center text-sm text-gray-500 mb-1">
              <span className="font-semibold text-[#18305C]">{deleteTarget?.hotelName}</span>
            </p>
            <p className="text-center text-xs text-gray-400 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors"
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