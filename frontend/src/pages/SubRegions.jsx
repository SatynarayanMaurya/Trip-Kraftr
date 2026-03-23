import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useRegionHooks } from '../hooks/useRegionHooks'       // swap with real sub-region hook later
import { useCommonHooks } from '../hooks/useCommonHooks'       // swap with real sub-region hook later
import { toast } from 'react-toastify'
import { useSubRegionHooks } from '../hooks/useSubRegionHooks'
import { clearSubRegions, setSubRegionPageLimit } from '../redux/slices/subRegionSlice'
import RegionDropDown from '../components/Common/RegionDropDown'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function SubRegionSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="grid grid-cols-[2fr_1.5fr_1.5fr_1.2fr_160px] px-6 py-4 items-center border-b border-gray-100 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-pink-100" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-28 bg-gray-200 rounded" />
          <div className="h-6 w-16 bg-gray-100 rounded-full" />
          <div className="flex gap-2">
            <div className="h-8 w-12 bg-gray-100 rounded-lg" />
            <div className="h-8 w-12 bg-gray-100 rounded-lg" />
            <div className="h-8 w-12 bg-gray-100 rounded-lg" />
          </div>
        </div>
      ))}
    </>
  )
}

function SubRegions() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {getRegionsForOrg} = useRegionHooks()

  // ── state ──────────────────────────────────────────────────────────────────
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const currentPageSubRegions = useSelector((state) => state.subRegion.subRegionsPages?.[currentPage])
  const pageLimit = useSelector((state) => state.subRegion.subRegionsPageLimit)
  const pagination = useSelector((state) => state.subRegion.paginationSubRegions)
  const stats = useSelector((state) => state.subRegion.statsSubRegions)
  const [loading, setLoading] = useState(false)
  const [searchedSubRegions, setSearchedSubRegions] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [allRegions,setAllRegions] = useState( [])
  let allRegionsForSuggestions = useSelector((state)=>state.user.allRegionsForSuggestions)
  const [region,setRegion]= useState('All Region')
  
  useEffect(() => {
    if (!allRegionsForSuggestions) return;
  
    const regions = allRegionsForSuggestions
      .flatMap((val) => val?.name || []) 
      .filter(Boolean); 
  
    setAllRegions(['All Region', ...regions]);
  }, [allRegionsForSuggestions]);

  const fetchRegionsForSuggestion = async()=>{
    try{
      if(allRegionsForSuggestions && allRegionsForSuggestions?.length > 0) return 
      setLoading(true)
      await getRegionsForOrg()
      setLoading(false)
    }
    catch(error){
      setLoading(false)
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


  const isProduction = useSelector((state) => state.user.isProduction)

  const {  searchSubRegionForOrg } = useCommonHooks()
  const { getSubRegions } = useSubRegionHooks()

  // ── fetch ──────────────────────────────────────────────────────────────────
  const fetchSubRegions = async (page, limit) => {
    try {
      setLoading(true)
      await getSubRegions(page, limit)
    } catch (error) {
      if (!isProduction) console.log(error)
      toast.error(error?.response?.data?.message || error?.message || 'Error fetching sub-regions')
    } finally {
      setLoading(false)
    }
  }

  const searchSubRegions = async () => {
    try {
      setLoading(true)
      setIsSearching(true)
      const regionId = allRegionsForSuggestions?.find((val)=>val?.name===region)?._id  
      const res = await searchSubRegionForOrg(search, filter,regionId,pageLimit)     // ← replace with searchSubRegion
      setSearchedSubRegions(res?.data?.searchedSubRegions || [])
    } catch (error) {
      if (!isProduction) console.log(error)
      toast.error(error?.response?.data?.message || error?.message || 'Error searching sub-regions')
    } finally {
      setLoading(false)
    }
  }

  // ── effects ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (search.trim() !== '' || filter !== 'All' || region !== 'All Region') {
      searchSubRegions()
    } else {
      setIsSearching(false)
      setSearchedSubRegions([])
    }
  }, [search, filter,region,pageLimit])

  useEffect(() => {
    if (!currentPageSubRegions?.[currentPage]) {
      fetchSubRegions(currentPage, pageLimit)
    }
  }, [currentPage, pageLimit])

  const changePageLimit = (e) => {
    const val = Number(e.target.value)
    setCurrentPage(1)
    dispatch(setSubRegionPageLimit(val))
    dispatch(clearSubRegions())
  }
  // ── derived ────────────────────────────────────────────────────────────────
  const displayed = isSearching ? searchedSubRegions : currentPageSubRegions;


  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sub-Regions</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pagination.totalRecords} total · {stats.active} active · {stats.inactive} inactive
          </p>
        </div>
        <button
          onClick={() => navigate('add-sub-region')}
          className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-sm shadow-pink-200"
        >
          <span className="text-lg leading-none">+</span> Add Sub-Region
        </button>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total', value: pagination?.totalRecords, color: 'text-gray-800', bg: 'bg-white', accent: 'border-gray-200' },
          { label: 'Active', value: stats?.activeSubRegion, color: 'text-green-600', bg: 'bg-green-50', accent: 'border-green-100' },
          { label: 'Inactive', value: stats?.inactiveSubRegion, color: 'text-red-500', bg: 'bg-red-50', accent: 'border-red-100' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border ${s.accent} rounded-2xl px-6 py-4 shadow-sm`}>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value ?? 0}</p>
          </div>
        ))}
      </div>

      {/* ── Search + Filter ─────────────────────────────────────────────────── */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-pink-400 focus-within:ring-2 focus-within:ring-pink-100 transition-all shadow-sm">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by sub-region..."
            className="bg-transparent flex-1 outline-none text-gray-700 text-sm placeholder-gray-400"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600 text-xs font-bold">✕</button>
          )}
        </div>

        <RegionDropDown value={region} onChange={(value)=>setRegion(value)} options={allRegions}/>

        <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {['All', 'Active', 'Inactive'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 text-sm font-semibold transition-colors ${filter === f
                ? 'bg-pink-500 text-white'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1.2fr_160px] px-6 py-3.5 border-b border-gray-100 bg-gray-50">
          {['Sub-Region Name', 'Region', 'Created', 'Status', 'Actions'].map((h) => (
            <span key={h} className="text-[11px] font-bold tracking-widest uppercase text-gray-400">{h}</span>
          ))}
        </div>

        {/* Rows */}
        {loading ? (
          <SubRegionSkeleton />
        ) : displayed?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <svg className="w-12 h-12 mb-3 text-pink-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="font-semibold text-gray-500">No sub-regions found</p>
            <p className="text-sm mt-1 text-gray-400">Try adjusting your search or filter</p>
          </div>
        ) : (
          displayed?.map((sub, idx) => (
            <div
              key={sub._id}
              className={`grid grid-cols-[2fr_1.5fr_1.5fr_1.2fr_160px] px-6 py-4 items-center transition-colors hover:bg-pink-50/40 ${idx !== displayed.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              {/* Sub-Region Name */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-pink-100 border border-pink-200 flex items-center justify-center text-sm font-bold text-pink-500 shrink-0">
                  {sub?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-gray-800 font-semibold text-sm">{sub.name}</p>
                  {sub?.description && (
                    <p className="text-xs text-gray-400 truncate max-w-[160px]">{sub.description}</p>
                  )}
                </div>
              </div>

              {/* Region */}
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-pink-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-gray-700 text-sm font-medium">{sub?.regionId?.name || '—'}</p>
                  {sub?.regionId?.country && (
                    <p className="text-xs text-gray-400">{sub.regionId.country}</p>
                  )}
                </div>
              </div>

              {/* Created */}
              <span className="text-gray-500 text-sm">{sub?.createdAt ? formatDate(sub?.createdAt) : '—'}</span>

              {/* Status */}
              <div>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${sub.is_active
                  ? 'bg-green-50 text-green-600 border-green-200'
                  : 'bg-red-50 text-red-500 border-red-200'
                  }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sub.is_active ? 'bg-green-500' : 'bg-red-400'}`} />
                  {sub.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    navigate(`update-sub-region/${sub?._id}`, {
                      state: { subRegion: sub }
                    })
                  }
                  className="flex-1 text-xs font-bold py-2 px-3 rounded-lg bg-pink-50 border border-pink-200 text-pink-500 hover:bg-pink-100 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    navigate(`view-sub-region/${sub?._id}`, {
                      state: { subRegion: sub }
                    })
                  }
                  className="flex-1 text-xs font-bold py-2 px-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors"
                >
                  View
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer count */}
      {displayed?.length > 0 && (
        <p className="text-xs text-gray-400 mt-4 px-1">
          Showing <span className="text-gray-600 font-semibold">{displayed.length}</span> of{' '}
          <span className="text-gray-600 font-semibold">{pagination.totalRecords}</span> sub-regions
        </p>
      )}

      {/* ── Pagination ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mt-5 bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm">

        {/* Prev / Next */}
        <div className="flex items-center gap-3">
          <button
            disabled={currentPage === 1 || isSearching}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${currentPage === 1 || isSearching
              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-pink-500 border-pink-500 text-white hover:bg-pink-600 cursor-pointer'
              }`}
          >
            ← Prev
          </button>
          <p className="text-sm text-gray-500">
            Page <span className="text-gray-800 font-semibold">{currentPage}</span> of{' '}
            <span className="text-gray-800 font-semibold">{pagination.totalPages || 1}</span>
          </p>
          <button
            disabled={currentPage === pagination.totalPages || isSearching}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${currentPage === pagination.totalPages || isSearching
              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-pink-500 border-pink-500 text-white hover:bg-pink-600 cursor-pointer'
              }`}
          >
            Next →
          </button>
        </div>

        {/* Limit */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Rows per page</span>
          <select
            value={pageLimit}
            onChange={(e) => changePageLimit(e)}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm px-3 py-2 rounded-lg outline-none focus:border-pink-400 cursor-pointer"
          >
            {[5, 10, 20].map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        {/* Go to page */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Go to page</span>
          <select
            value={currentPage}
            disabled={isSearching}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm px-3 py-2 rounded-lg outline-none focus:border-pink-400 cursor-pointer"
          >
            {Array.from({ length: pagination.totalPages || 1 }, (_, i) => (
              <option key={i} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>
      </div>

    </div>
  )
}

export default SubRegions