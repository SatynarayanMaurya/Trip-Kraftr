
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGroupTripHooks } from '../hooks/useGroupTripHooks';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { clearGroupTrips, setGroupTripPageLimit } from '../redux/slices/groupTripSlice';
import { SearchIcon, CalendarIcon, PeopleIcon, CopyIcon, TrashIcon, FilterIcon, PlusIcon } from '../components/Icons/Icons';
import TripCard from '../components/Group Trips/TripCard';
import GroupTripSkeletonCard from '../components/Group Trips/GroupTripSkeletonCard';
import { useRegionsData } from '../hooks/Resuable Hooks/useResuableData';
import { useCommonHooks } from '../hooks/useCommonHooks';
const PINK = '#ED5F8D';
const BLUE = '#18305C';


// ─── Main component ───────────────────────────────────────────────────────────
function GroupTrips() {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const { getGroupTrips, deleteGroupTrip } = useGroupTripHooks();
  const { regions, loading: regionLoading } = useRegionsData();
  const {searchGroupTrips} = useCommonHooks()

  const [fetchLoading, setFetchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [showRegionDrop, setShowRegionDrop] = useState(false);
  const [isSearching, setIsSearching] = useState(false)
  const [searchedGroupTrips, setSearchedGroupTrips] = useState([])

  const isProduction = useSelector(s => s.user.isProduction);
  const allRegionsForSuggestions = useSelector(s => s.user.allRegionsForSuggestions)
  const pageLimit = useSelector(s => s.groupTrip.groupTripPageLimit);
  const currentPageGroupTrips = useSelector(s => s.groupTrip.groupTripsPages?.[currentPage]);
  const pagination = useSelector(s => s.groupTrip.paginationGroupTrips)

  const fetchGroupTrips = async () => {
    try {
      setFetchLoading(true);
      await getGroupTrips(currentPage, pageLimit);
    } catch (error) {
      if (!isProduction) console.log('Error:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Error fetching group trips');
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (!currentPageGroupTrips) fetchGroupTrips();
  }, [currentPage, pageLimit]);

  const filterGroupTrips = async()=>{
    try{
      setFetchLoading(true)
      setIsSearching(true)
      const res = await searchGroupTrips(searchQuery,regionFilter,pageLimit)
      setSearchedGroupTrips(res?.data?.searchedGroupTrips)
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
    if((searchQuery && searchQuery?.trim() !=='') || regionFilter !== '' ){
      filterGroupTrips()
    }
    else{
      setIsSearching(false)
    }
  },[searchQuery,regionFilter])

  // ── derived data ─────────────────────────────────────────────────────────
  const allTrips = currentPageGroupTrips ?? [];


  const filteredTrips =isSearching?searchedGroupTrips: allTrips

  const handleDelete = (trip) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    // deleteGroupTrip(trip._id);
    toast.success('Trip deleted');
  };

  const handleCopy = (trip) => {
    toast.info('Trip duplicated');
  };

  const handleView = (trip) => {
    navigate(`view/${trip._id}`);
  };


  const changePageLimit = (val) => {
    dispatch(clearGroupTrips())
    setCurrentPage(1)
    dispatch(setGroupTripPageLimit(Number(val)))
  }



  return (
    <div style={{ padding: '28px 32px', background: '#f5f6fa', minHeight: '100vh' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: BLUE, margin: 0 }}>Manage Group Trips</h1>
          <p style={{ fontSize: '14px', color: '#888', margin: '4px 0 0' }}>Overview of all active and upcoming group departures.</p>
        </div>
        <button
          onClick={() => navigate('add-group-trip')}
          style={{
            background: PINK, color: 'white', border: 'none',
            borderRadius: '8px', padding: '10px 20px', fontSize: '14px',
            fontWeight: '600', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}
        >
          <PlusIcon /> New Group Trip
        </button>
      </div>

      {/* ── Search + Filters ── */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap', alignItems: 'center' }}>

        {/* Search */}
        <div style={{
          flex: 1, minWidth: '220px',
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'white', border: '1.5px solid #e8e8e8',
          borderRadius: '10px', padding: '10px 16px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by Trip names"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ border: 'none', outline: 'none', flex: 1, fontSize: '14px', color: '#333', background: 'transparent' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: '16px', lineHeight: 1, padding: 0 }}>×</button>
          )}
        </div>

        {/* Region filter */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowRegionDrop(p => !p)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'white', border: `1.5px solid ${regionFilter ? BLUE : '#e8e8e8'}`,
              borderRadius: '10px', padding: '10px 18px', fontSize: '14px',
              fontWeight: '500', color: regionFilter ? BLUE : '#555',
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            <FilterIcon /> {allRegionsForSuggestions?.find(r=>r?._id===regionFilter)?.name || 'Region'}
            {regionFilter && (
              <span
                onClick={e => { e.stopPropagation(); setRegionFilter(''); }}
                style={{ marginLeft: '4px', color: '#aaa', fontWeight: '700' }}
              >×</span>
            )}
          </button>

          {showRegionDrop && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 100,
              background: 'white', border: '1px solid #eee', borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)', minWidth: '160px', overflow: 'hidden',
            }}>
              {allRegionsForSuggestions?.length === 0 && (
                <div style={{ padding: '10px 16px', fontSize: '13px', color: '#aaa' }}>No regions found</div>
              )}
              {allRegionsForSuggestions?.map(r => (
                <button
                  key={r?._id}
                  onClick={() => { setRegionFilter(r?._id); setShowRegionDrop(false); }}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '10px 16px', border: 'none', background: regionFilter === r ? '#f0f4ff' : 'white',
                    fontSize: '13px', color: BLUE, cursor: 'pointer', fontWeight: regionFilter === r ? '600' : '400',
                  }}
                >
                  {r?.name}
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Filter button */}
        <button style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'white', border: '1.5px solid #e8e8e8',
          borderRadius: '10px', padding: '10px 18px', fontSize: '14px',
          fontWeight: '500', color: '#555', cursor: 'pointer', whiteSpace: 'nowrap',
        }}>
          <FilterIcon /> Filter
        </button>
      </div>

      {/* ── Grid ── */}
      {fetchLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {Array.from({ length: 8 }).map((_, i) => <GroupTripSkeletonCard key={i} />)}
        </div>
      ) : filteredTrips?.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#aaa' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🗺️</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#bbb' }}>No group trips found</div>
          <div style={{ fontSize: '13px', marginTop: '6px' }}>Try adjusting your search or filters</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {filteredTrips?.map(trip => (
            <TripCard
              key={trip._id}
              trip={trip}
              onDelete={handleDelete}
              onCopy={handleCopy}
              onView={handleView}
            />
          ))}
        </div>
      )}
      <div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 bg-white rounded-xl px-4 md:px-5 py-4"
        style={{
          border: '1.5px solid #E5E7EB',
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        }}
      >

        {/* 🔹 Left Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">

          {/* Row: Prev → Page → Next */}
          <div className="flex items-center justify-between sm:justify-start gap-3 w-full">

            {/* Prev */}
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

            {/* Page Info */}
            <p className="text-sm text-gray-400 whitespace-nowrap">
              Page <span className="text-[#18305C] font-semibold">{currentPage || 1}</span> of{" "}
              <span className="text-[#18305C] font-semibold">{pagination?.totalPages || 0}</span>
            </p>

            {/* Next */}
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

        {/* 🔹 Right Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 w-full md:w-auto">

          {/* Limit */}
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

          {/* Go to page */}
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

      </div>


      <style>{`
                @keyframes shimmer {
                    0%   { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                @media (max-width: 640px) {
                    .gt-header { flex-direction: column !important; }
                }
            `}</style>
    </div>
  );
}

export default GroupTrips;









