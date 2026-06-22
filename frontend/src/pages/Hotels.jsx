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
import DeleteModal from '../components/DeleteModals/DeleteModal'
import Pagination from '../components/Common/Pagination'


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
        <div className="absolute z-30 mt-1 min-w-37.5 bg-white border border-gray-200 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.13)] overflow-hidden">
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
  const { getHotels, deleteHotelById } = useHotelHooks();
  const { getRegionsForOrg } = useRegionHooks()
  const { searchHotels } = useCommonHooks()

  const [search, setSearch] = useState('')
  const [filterRegion, setFilterRegion] = useState('All')
  const [filterSub, setFilterSub] = useState('All')
  const [filterCat, setFilterCat] = useState('All')
  const [filterOpen, setFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const currentPageHotels = useSelector((state) => state.hotel.hotelsPages?.[currentPage])
  const pagination = useSelector((state) => state.hotel.paginationHotels)
  const pageLimit = useSelector((state) => state.hotel.HotelPageLimit)
  const [searchedHotels, setSearchedHotels] = useState([])

  const [isDeleteModal, setIsDeleteModal] = useState(false)
  const [deleteHotelDetails, setDeleteHotelDetails] = useState(null)

  const [isSearching, setIsSearching] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(false)
  const isProduction = useSelector((state) => state.user.isProduction)

  const [allRegions, setAllRegions] = useState([])
  let allRegionsForSuggestions = useSelector((state) => state.user.allRegionsForSuggestions)

  const fetchRegionsForSuggestion = async () => {
    try {
      if (allRegionsForSuggestions && allRegionsForSuggestions?.length > 0) return
      setFetchLoading(true)
      await getRegionsForOrg()
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

  useEffect(() => {
    if (allRegionsForSuggestions && allRegionsForSuggestions?.length > 0) return
    else {
      fetchRegionsForSuggestion()
    }
  }, [])

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

  const searchHotel = async () => {
    try {
      setIsSearching(true)
      setFetchLoading(true)
      const regionId = allRegionsForSuggestions?.find((val) => val?.name === filterRegion)?._id
      const response = await searchHotels(search, regionId, filterCat, null, pageLimit)
      setSearchedHotels(response?.data?.searchedHotels)
      setFetchLoading(false)
    }
    catch (error) {
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

  useEffect(() => {
    if (search !== "" || filterCat !== 'All' || filterRegion !== 'All' || filterSub !== 'All') {
      searchHotel()
    }
    else {
      setIsSearching(false)
    }
  }, [search, filterCat, filterRegion, filterSub, pageLimit])


  useEffect(() => {
    if (!currentPageHotels?.[currentPage]) {
      fetchHotels()
    }

  }, [currentPage, pageLimit])

  const filtered = isSearching ? searchedHotels : currentPageHotels

  const activeFilters =
    (filterRegion !== 'All' ? 1 : 0) +
    (filterSub !== 'All' ? 1 : 0) +
    (filterCat !== 'All' ? 1 : 0)

  const changePageLimit = (val) => {
    dispatch(clearHotels())
    setCurrentPage(1)
    dispatch(setHotelPageLimit(Number(val)))
  }

  const clearFilters = () => { setFilterRegion('All'); setFilterSub('All'); setFilterCat('All') }
  const handleEdit = (h) => navigate(`update-hotel/${h?._id}`)
  const handleView = (h) => navigate(`view-hotel/${h?._id}`)

  const deleteHotel = async () => {
    try {
      setFetchLoading(true)
      const response = await deleteHotelById(deleteHotelDetails?._id, deleteHotelDetails?.regionId?._id)
      toast.success(response?.data?.message)
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

  return (
    <div className="min-h-screen bg-white p-6 md:p-8 ">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-[26px] font-bold text-[#18305C]">Hotels Inventory</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your contracted properties and catalog drafts.</p>
      </div>

      {/* ── Action buttons — right aligned, above the card ───────────────── */}
      <div className="flex items-center justify-end gap-2.5 mb-5 flex-wrap">
        <button
          onClick={() => navigate('add-hotel')}
          className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-[#ED5F8D] hover:bg-[#ED5F8D] text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap"
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
          className="flex items-center gap-3 bg-white rounded-2xl px-5 py-2 mb-5"
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



          {/* Filter pills */}
          <div className="flex items-center gap-2.5  flex-wrap">
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
        </div>

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
                    onDelete={() => {
                      setIsDeleteModal(true)
                      setDeleteHotelDetails(h)
                    }
                    }
                    onView={handleView}
                  />
                ))}
              </div>
            )}
      </div>


      {/* Pagination */}
      <Pagination
        setCurrentPage={setCurrentPage}
        pagination={pagination}
        currentPage={currentPage}
        isSearching={isSearching}
      />

      {/* <div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 bg-white rounded-xl px-4 md:px-5 py-4"
        style={{
          border: '1.5px solid #E5E7EB',
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        }}
      >

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">

          <div className="flex items-center justify-between sm:justify-start gap-3 w-full">

            <button
              disabled={currentPage === 1 || isSearching}
              onClick={() => setCurrentPage(currentPage - 1)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 w-full sm:w-auto
        ${currentPage === 1 || isSearching
                  ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#ED5F8D] border-[#E91E8C] text-white hover:bg-[#C81878] cursor-pointer'
                }`}
            >
              ← Prev
            </button>

            <p className="text-sm text-gray-400 whitespace-nowrap">
              Page <span className="text-[#18305C] font-semibold">{currentPage || 1}</span> of{" "}
              <span className="text-[#18305C] font-semibold">{pagination?.totalPages || 0}</span>
            </p>

            <button
              disabled={currentPage === pagination?.totalPages || isSearching}
              onClick={() => setCurrentPage(Number(currentPage + 1))}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 w-full sm:w-auto
        ${currentPage === pagination?.totalPages || isSearching
                  ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#ED5F8D] border-[#E91E8C] text-white hover:bg-[#C81878] cursor-pointer'
                }`}
            >
              Next →
            </button>

          </div>

        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 w-full md:w-auto">

          <div className="flex items-center justify-between sm:justify-start gap-3 text-sm text-gray-400 w-full sm:w-auto">
            <span>Limit</span>

            <select
              value={pageLimit}
              onChange={(e) => changePageLimit(Number(e.target.value))}
              className="w-[100px] bg-white border border-gray-200 text-[#18305C] text-sm px-3 py-2 rounded-lg outline-none focus:border-[#E91E8C] cursor-pointer"
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

          <div className="flex items-center justify-between sm:justify-start gap-3 text-sm text-gray-400 w-full sm:w-auto">
            <span>Go to page</span>

            <select
              value={currentPage}
              disabled={isSearching}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="w-[100px] bg-white border border-gray-200 text-[#18305C] text-sm px-3 py-2 rounded-lg outline-none focus:border-[#E91E8C] cursor-pointer"
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

      </div> */}

      {/* Delete Hotel  */}
      {isDeleteModal &&
        <DeleteModal onClose={() => setIsDeleteModal(false)} onDelete={() => deleteHotel()} itemName={deleteHotelDetails?.hotelName} confirmText={deleteHotelDetails?.hotelName} />
      }
    </div>
  )
}