


import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSamplePackageHooks } from '../hooks/useSamplePackageHooks';
import { useRegionsData } from '../hooks/Resuable Hooks/useResuableData';
import {
  Plus,
  Search,
  ChevronDown,
  Eye,
  RefreshCw,
  Users,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import SamplePackageSkeleton from '../components/Sample Package/Sample Package Main page/SamplePackageSkeleton';
import { useCommonHooks } from '../hooks/useCommonHooks';

// ─── Dummy cover image (replace with real asset later) ───────────────────────
const DUMMY_IMAGE =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=300&fit=crop&auto=format';

// ─── Single package card ──────────────────────────────────────────────────────
function PackageCard({ pkg }) {
  const navigate = useNavigate();

  const {
    samplePackageName,
    itineraryBuilder,
    regionDetails,
  } = pkg;

  const tripName   = itineraryBuilder?.tripName    ?? 'Untitled Trip';
  const region1    = regionDetails?.region1?.name  ?? '—';
  const adults     = regionDetails?.adults          ?? 0;
  const children   = regionDetails?.children        ?? 0;
  const noOfDays   = regionDetails?.noOfDays        ?? 0;
  const noOfNights = noOfDays > 0 ? noOfDays - 1 : 0;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer">
      {/* ── Image section ── */}
      <div className="relative">
        <img
          src={DUMMY_IMAGE}
          alt={tripName}
          className="w-full h-44 object-cover"
        />

        {/* Package ID badge */}
        <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm text-[#1a2340] text-[11px] font-bold px-2 py-1 rounded-md shadow-sm">
          {samplePackageName}
        </span>

        {/* Best Match badge */}
        <span className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
          <CheckCircle size={11} strokeWidth={2.5} />
          Best Match
        </span>
      </div>

      {/* ── Card body ── */}
      <div className="p-3">
        {/* Top row: name + days */}
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <p className="text-[13.5px] font-bold text-[#1a2340] truncate">{tripName}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{region1}</p>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-gray-500 whitespace-nowrap mt-0.5">
            <Calendar size={12} className="text-gray-400" />
            {noOfNights}N / {noOfDays}D
          </div>
        </div>

        {/* Bottom row: pax + actions */}
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
            <Users size={13} className="text-gray-400" />
            {adults}A / {children}C
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`view/${pkg._id}`); }}
              className="text-[#e91e8c] hover:text-[#c2185b] transition-colors"
              title="View"
            >
              <Eye size={17} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); /* handle clone/refresh */ }}
              className="text-[#e91e8c] hover:text-[#c2185b] transition-colors"
              title="Clone / Refresh"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Custom select wrapper ────────────────────────────────────────────────────
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

// ─── Main component ───────────────────────────────────────────────────────────
function SamplePackages() {
  const navigate = useNavigate();


  const {searchSamplePackage} = useCommonHooks()

  const { getSamplePackages }                       = useSamplePackageHooks();
  const { regions, loading: regionLoading }         = useRegionsData();

  const [currentPage, setCurrentPage]   = useState(1);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false)

  // ── Filter state (stored but not used to filter — pagination will handle it)
  const [search,    setSearch]    = useState('');
  const [regionId,  setRegionId]  = useState(null);   // stores _id
  const [status,    setStatus]    = useState(null);   // stores status string
  const [days,      setDays]      = useState(null);   // stores day count (1-10)

  const isProduction  = useSelector((s) => s.user.isProduction);
  const pageLimit     = useSelector((s) => s.samplePackage.samplePackagePageLimit);
  const currentPageSamplePackages = useSelector(
    (s) => s.samplePackage.samplePackagesByPages?.[currentPage]
  );

  const [searchedSamplePackage, setSearchedSamplePackage] = useState([])

  const pagination = useSelector(s=>s.samplePackage.paginationSamplePackages)

  const fetchSamplePackages = async () => {
    try {
      setFetchLoading(true);
      await getSamplePackages(currentPage, pageLimit);
    } catch (error) {
      if (!isProduction) console.log('Error:', error);
      toast.error(
        error?.response?.data?.message || error?.message || 'Error fetching sample packages'
      );
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (!currentPageSamplePackages) fetchSamplePackages();
  }, [currentPage, pageLimit]);

  const isLoading = fetchLoading || !currentPageSamplePackages;

  const searchSamplePackages = async()=>{
    try{
      setFetchLoading(true)
      const response = await searchSamplePackage (search,regionId,days)
      setSearchedSamplePackage(response?.data?.searchedSamplePackage)
    }
    catch(error){
      if (!isProduction) {
        console.log("========= ERROR DEBUG START =========");
        console.log("Error:", error);
        console.log("Response:", error?.response);
        console.log("========= ERROR DEBUG END =========");
      }
      toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
    }
    finally{
      setFetchLoading(false)
    }
  }

  useEffect(()=>{
    if(regionId || days || search!==''){
      setIsSearching(true)
      searchSamplePackages()
    }
    else{
      setIsSearching(false)
    }
  },[regionId, days,search])

  // ── Days options (1-10, default null)
  const DAY_OPTIONS = Array.from({ length: 30 }, (_, i) => i + 1);

  const filteredData = isSearching ? searchedSamplePackage : currentPageSamplePackages

  // console.log("region id and days : ",regionId, days,search)

  return (
    <div className="min-h-screen bg-[#f5f6fa] p-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#1a2340] leading-tight">
            Sample Packages
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Create and manage reusable itinerary templates for your clients.
          </p>
        </div>

        <button
          onClick={() => navigate('add-sample-package')}
          className="flex items-center gap-2 bg-linear-to-r from-[#e91e8c] to-[#c2185b] hover:from-[#d81b7f] hover:to-[#ad1457] text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all whitespace-nowrap self-start"
        >
          <Plus size={16} strokeWidth={2.5} />
          Create Itinerary
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-3 mb-7">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Trip Name."
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e91e8c]/30 focus:border-[#e91e8c]/60 transition"
          />
        </div>

        {/* Region */}
        <FilterSelect value={regionId} onChange={setRegionId} placeholder="Region">
          {regionLoading
            ? <option disabled>Loading…</option>
            : regions?.map((r) => (
                <option key={r._id} value={r._id}>{r.name}</option>
              ))
          }
        </FilterSelect>

        {/* Days */}
        <FilterSelect value={days} onChange={setDays} placeholder="Days">
          {DAY_OPTIONS.map((d) => (
            <option key={d} value={d}>{d} {d === 1 ? 'Day' : 'Days'}</option>
          ))}
        </FilterSelect>
      </div>

      {/* ── Package grid ── */}
      {isLoading ? (
        /* Skeleton — component lives in SamplePackageSkeleton.jsx */
        <SamplePackageSkeleton count={pageLimit ?? 8} />
      ) : filteredData?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
          <p className="text-lg font-semibold">No packages found</p>
          <p className="text-sm">Try adjusting your filters or create a new package.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredData?.map((pkg) => (
            <PackageCard key={pkg._id} pkg={pkg} />
          ))}
        </div>
      )}

      {/* Pagination placeholder — add your pagination component here */}

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
    </div>
  );
}

export default SamplePackages;
