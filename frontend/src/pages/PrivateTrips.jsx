

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { usePrivateTripHooks } from '../hooks/usePrivateTripHooks'
import { Eye, Trash2, Plus, Search, ChevronDown, MapPin, Zap, Calendar, Users } from 'lucide-react'
import TripCard from '../components/Private Trips/Private Trip Main page/TripCard'
import PrivateCardSkeleton from '../components/Private Trips/Private Trip Main page/PrivateCardSkeleton'
import Pagination from '../components/Common/Pagination'
import { setCurrentPagePrivateTrip } from '../redux/slices/privateTripSlice'
import DeleteModal from '../components/DeleteModals/DeleteModal'
import { toast } from 'react-toastify'
import { useCommonHooks } from '../hooks/useCommonHooks'
import { useRegionsData } from '../hooks/Resuable Hooks/useResuableData'

// ── helpers ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = ['All', 'created', 'confirmed', 'cancelled', 'completed']


// ── sub-components ─────────────────────────────────────────────────────────

function FilterDropdown({ label, value, onChange, options }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-700 hover:border-[#E91E8C] hover:text-[#E91E8C] transition-colors min-w-27.5 justify-between shadow-sm"
      >
        <span>{value || label}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-20 max-h-[40vh] top-full mt-1 left-0 bg-white border border-gray-100 rounded-xl shadow-lg min-w-32.5 py-1 overflow-auto">
          {options?.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt === 'All' || opt === 0 ? '' : opt); setOpen(false) }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-pink-50 hover:text-[#E91E8C] transition-colors ${(value === opt || (!value && (opt === 'All' || opt === 0)))
                ? 'text-[#E91E8C] font-medium bg-pink-50'
                : 'text-gray-700'
                }`}
            >
              {opt === 0 ? 'Select Days' : opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function FilterSelect({ value, onChange, placeholder, children }) {
  return (
    <div className="relative">
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? null : e.target.value)}
        className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm rounded-xl pl-3.5 pr-9 py-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#e91e8c]/30 focus:border-[#e91e8c]/60 transition min-w-[110px]"
      >
        <option value="">{placeholder}</option>
        {children}
      </select>
      <ChevronDown
        size={15}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
}


// ── main component ──────────────────────────────────────────────────────────

function PrivateTrips() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {searchPrivateTrips } = useCommonHooks()
  const { getPrivateTrips, deletePrivateTripById } = usePrivateTripHooks()

  const { regions, loading: regionLoading }         = useRegionsData();

  const [fetchLoading, setFetchLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [daysFilter, setDaysFilter] = useState('')
  const isProduction = useSelector(s=>s.user.isProduction)
  const [regionId,  setRegionId]  = useState(null);
  const [isSearching, setIsSearching] = useState(false)
  const [searchedPrivatetrips, setSearchedPrivateTrips] = useState([])
  const currentPage = useSelector((s) => s.privateTrip.currentPagePrivateTrip)
  const currentPagePrivateTrip = useSelector((s) => s.privateTrip.privateTripByPages?.[currentPage])
  const pagination = useSelector((s) => s.privateTrip.paginationPrivateTrip)
  const pageLimit = useSelector((s) => s.privateTrip.privateTripPageLimit)
  const [isDeleteModal, setIsDeleteModal] = useState(false)
  const [deleteTripDetails, setDeleteTripDetails] = useState(null)
  const [isDeleted, setIsDeleted] = useState(false)

  const fetchPrivateTrips = async () => {
    try {
      setFetchLoading(true)
      await getPrivateTrips(currentPage, pageLimit)
    } catch (error) {
      console.error('Error fetching private trips:', error)
    } finally {
      setFetchLoading(false)
    }
  }

  const searchPrivatetrip = async () => {
    try {
      setIsSearching(true)
      setFetchLoading(true)
      const response = await searchPrivateTrips(search,regionId,daysFilter,statusFilter)
      setSearchedPrivateTrips(response?.data?.data)
    } catch (error) {
      console.error('Error fetching private trips:', error)
    } finally {
      setFetchLoading(false)
    }
  }


  useEffect(() => {
    if (!currentPagePrivateTrip) fetchPrivateTrips()
  }, [currentPage, pageLimit,isDeleted])

  useEffect(()=>{
    if(search || regionId || daysFilter || statusFilter){
      searchPrivatetrip()
    }
    else{
      setIsSearching(false)
    }
  },[search,regionId,daysFilter,statusFilter])

  // derive unique regions from loaded data
  const allRegions = React.useMemo(() => {
    const names = (currentPagePrivateTrip ?? [])
      .map((t) => t?.regionDetails?.region1?.name)
      .filter(Boolean)
    return ['All', ...new Set(names)]
  }, [currentPagePrivateTrip])

  const daysOptions = [0, ...Array.from({ length: 30 }, (_, i) => i + 1)]

  // client-side filtering
  const filtered = isSearching ? searchedPrivatetrips : currentPagePrivateTrip

  const handleView = (trip) => navigate(`view/${trip._id}`)

  const handleDelete = (trip) => {
    setDeleteTripDetails(trip)
    setIsDeleteModal(true)
  };

  const handleDeleteTrip = async () => {
    try {
      setFetchLoading(true);
      const response = await deletePrivateTripById(deleteTripDetails?._id);
      toast.success(response?.data?.message)
      setIsDeleted(!isDeleted)
       setIsDeleteModal(false)
    } catch (error) {
      if (!isProduction) console.log('Error:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Error fetching group trips');
    } finally {
      setFetchLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Itineraries</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and track your travel packages</p>
        </div>
        <button
          onClick={() => navigate('add-private-trip')}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#E91E8C] hover:bg-[#d01879] text-white text-sm font-semibold rounded-xl shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus size={16} />
          Create Itinerary
        </button>
      </div>

      {/* filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* search */}
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Name / Phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-[#E91E8C] shadow-sm"
          />
        </div>

        {/* dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
                  <FilterSelect value={regionId} onChange={setRegionId} placeholder="Region">
          {regionLoading
            ? <option disabled>Loading…</option>
            : regions?.map((r) => (
                <option key={r._id} value={r._id}>{r.name}</option>
              ))
          }
        </FilterSelect>
          <FilterDropdown
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={STATUS_OPTIONS}
          />
          <FilterDropdown
            label="Days"
            value={daysFilter ? `${daysFilter} Days` : ''}
            onChange={setDaysFilter}
            options={daysOptions}
          />
        </div>
      </div>

      {/* grid */}
      {fetchLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <PrivateCardSkeleton key={i} />)}
        </div>
      ) : filtered?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center mb-4">
            <MapPin size={28} className="text-[#E91E8C]" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-1">No itineraries found</h3>
          <p className="text-sm text-gray-400">Try adjusting your filters or create a new trip.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered?.map((trip) => (
            <TripCard
              key={trip._id}
              trip={trip}
              onView={handleView}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}


      {/* Pagination */}
      <Pagination pagination={pagination} isSearching={false} currentPage={currentPage} setCurrentPage={(val) => dispatch(setCurrentPagePrivateTrip(val))} />

        {/* Delete Modal  */}
        <>
          {
            isDeleteModal && 
            <DeleteModal  onClose={()=>setIsDeleteModal(false)} onDelete={handleDeleteTrip} itemName = "Private Trip" confirmText = {deleteTripDetails?.privateTripId}/>
          }
        </>
    </div>
  )
}

export default PrivateTrips