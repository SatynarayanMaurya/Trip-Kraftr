import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCommonHooks } from '../hooks/useCommonHooks'
import {useRegionHooks} from "../hooks/useRegionHooks"
import {SearchIcon,MapPinIcon,ChevronIcon,XIcon,ImageIcon,CheckIcon,EditIcon,PlusIcon,ExpandIcon,CloseIcon,GlobeIcon} from "../components/Icons/Icons"
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

// ─── Icons ────────────────────────────────────────────────────────────────────


// ─── Dummy image data for selected region ─────────────────────────────────────
const DUMMY_REGION_DATA = {
  _id: '69ad2afd0ee523acf4a220ec',
  masterRegionId: '69ac186468ebfef9457c215d',
  images: [
    {
      _id: '69ad2afd0ee523acf4a220ec',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      public_id: 'TRIPKRAFTR_STAGING/REGION_IMAGES/file_1',
      size: 107587,
    },
    {
      _id: '69ad2afd0ee523acf4a220ed',
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
      public_id: 'TRIPKRAFTR_STAGING/REGION_IMAGES/file_2',
      size: 234560,
    },
    {
      _id: '69ad2afd0ee523acf4a220ee',
      url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
      public_id: 'TRIPKRAFTR_STAGING/REGION_IMAGES/file_3',
      size: 189430,
    },
  ],
  updatedBy: '699f25e5fa8161dfe1557912',
  createdAt: '2026-03-08T07:53:33.453+00:00',
  updatedAt: '2026-03-08T07:53:33.453+00:00',
}

function formatBytes(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function RegionImages() {
  const navigate = useNavigate()
  const { searchMasterRegion } = useCommonHooks();
  const {fetchRegionImages} = useRegionHooks()
  const isProduction = useSelector((state)=>state.user.isProduction)
  const loading = useSelector((state)=>state.user.loading)

  const [query, setQuery]               = useState('')
  const [results, setResults]           = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [regionData, setRegionData]     = useState(null)
  const [dataLoading, setDataLoading]   = useState(false)
  const [lightbox, setLightbox]         = useState(null) // image object or null

  const dropRef   = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close lightbox on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleSearch = useCallback(async(val) => {
    setQuery(val)
    setDropdownOpen(true)
    if(val?.trim() === ""){
      setDropdownOpen(false)
      setResults([])
      return ;
    }
      try {
        setSearchLoading(true)
        const res = await searchMasterRegion(val)
        setResults(res?.data?.searchedMasterRegion || [])
        setSearchLoading(false)
      } 
      catch { 
        setSearchLoading(false)
        setResults([]) 
        if (!isProduction) {
          console.log("========= ERROR DEBUG START =========");
          console.log("Error:", error);
          console.log("Response:", error?.response);
          console.log("========= ERROR DEBUG END =========");
        }
        toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
      }
  }, [searchMasterRegion])

  const selectRegion = async (region) => {
    try{
      setSelectedRegion(region)
      setQuery(region.name)
      setDropdownOpen(false)
      setResults([])
      setRegionData(null)
      setDataLoading(true)
      // TODO: replace with real API call — e.g. await getRegionImages(region._id)
      const res = await fetchRegionImages(region?._id)
      setRegionData(res?.data?.regionsImages)
      setDataLoading(false)
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

  }

  const clearRegion = () => {
    setSelectedRegion(null)
    setQuery('')
    setResults([])
    setRegionData(null)
    setDropdownOpen(false)
  }

  const images = regionData?.images || []

  return (
    <div className="min-h-screen bg-[#060d17] p-6 md:p-10">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-yellow-400/70 mb-2">
            <span className="h-px w-4 bg-yellow-400/50" />
            Management
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Region Images</h1>
          <p className="mt-1 text-sm text-slate-400">Search a region to view and manage its images</p>
        </div>
        <button
          onClick={() => navigate('add-region-image')}
          className="flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-[#060d17] hover:bg-yellow-300 active:scale-95 transition-all shadow-lg shadow-yellow-400/20 whitespace-nowrap self-start sm:self-auto"
        >
          <PlusIcon /> Add Images
        </button>
      </div>

      {/* ── Search ── */}
      <div className="mb-8 max-w-xl" ref={dropRef}>
        <div className={`relative flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200
          ${selectedRegion
            ? 'border-green-500/40 bg-green-500/5'
            : 'border-[#1e2a3a] bg-[#0a1120] focus-within:border-yellow-400/50 focus-within:bg-yellow-400/5'
          }`}
        >
          <span className={selectedRegion ? 'text-green-400' : 'text-slate-500'}>
            {selectedRegion ? <MapPinIcon /> : <SearchIcon />}
          </span>
          <input
            type="text"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            onFocus={() => query && !selectedRegion && setDropdownOpen(true)}
            disabled={!!selectedRegion}
            placeholder="Search region by name…"
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none disabled:cursor-not-allowed"
          />
          {searchLoading && (
            <span className="h-4 w-4 rounded-full border-2 border-yellow-400/30 border-t-yellow-400 animate-spin" />
          )}
          {!searchLoading && query && (
            <button onClick={clearRegion} className="text-slate-500 hover:text-red-400 transition">
              <XIcon />
            </button>
          )}
          {!selectedRegion && !searchLoading && (
            <span className="text-slate-600"><ChevronIcon open={dropdownOpen} /></span>
          )}

          {/* Dropdown */}
          {dropdownOpen && !selectedRegion && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-[#1e2a3a] bg-[#0d1726] shadow-2xl shadow-black/60 overflow-hidden">
              {results.length === 0 && !searchLoading && query && (
                <div className="px-4 py-5 text-center text-sm text-slate-500">No regions found for "{query}"</div>
              )}
              {results.length === 0 && !query && (
                <div className="px-4 py-5 text-center text-sm text-slate-500">Start typing to search regions…</div>
              )}
              {results.map((r, i) => (
                <button
                  key={r._id}
                  onClick={() => selectRegion(r)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-yellow-400/5
                    ${i !== results.length - 1 ? 'border-b border-[#1e2a3a]' : ''}`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1e2a3a] text-yellow-400">
                    <MapPinIcon />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{r.name}</p>
                    <p className="text-xs text-slate-500">{r.country}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected region badge */}
        {selectedRegion && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                <CheckIcon />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{selectedRegion.name}</p>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <GlobeIcon />
                  {selectedRegion.country}
                  <span className="mx-1 text-slate-600">·</span>
                  <span className="font-mono text-slate-500">{selectedRegion._id}</span>
                </p>
              </div>
            </div>
            <button
              onClick={clearRegion}
              className="text-xs text-slate-500 hover:text-red-400 transition flex items-center gap-1"
            >
              <XIcon /> Clear
            </button>
          </div>
        )}
      </div>

      {/* ── Content area ── */}
      {!selectedRegion && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#0a1120] border border-[#1e2a3a] text-slate-700 mb-5">
            <ImageIcon />
          </div>
          <p className="text-base font-semibold text-slate-400">No region selected</p>
          <p className="text-sm text-slate-600 mt-1">Search and select a region above to view its images</p>
        </div>
      )}

      {selectedRegion && dataLoading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-[#1e2a3a] border-t-yellow-400 animate-spin" />
          <p className="text-sm text-slate-500">Fetching images for <span className="text-white font-medium">{selectedRegion.name}</span>…</p>
        </div>
      )}

      {selectedRegion && !dataLoading && (
        <div>
          {/* ── Stats bar ── */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-6">
              <div className="rounded-xl border border-[#1e2a3a] bg-[#0a1120] px-5 py-3">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Total Images</p>
                <p className="text-2xl font-bold text-white">{images?.length}</p>
              </div>
              <div className="rounded-xl border border-[#1e2a3a] bg-[#0a1120] px-5 py-3">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Total Size</p>
                <p className="text-2xl font-bold text-white">
                  {images?.length>0?formatBytes(images?.reduce((acc, i) => acc + (i.size || 0), 0)):0}
                </p>
              </div>
              <div className="rounded-xl border border-[#1e2a3a] bg-[#0a1120] px-5 py-3">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Last Updated</p>
                <p className="text-sm font-semibold text-white">
                  {regionData?.updatedAt?new Date(regionData?.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }):"N/A"}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('add-region-image', { state: { region: selectedRegion, regionData } })}
              className="flex items-center gap-2 rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-5 py-2.5 text-sm font-semibold text-yellow-400 hover:bg-yellow-400/20 active:scale-95 transition-all"
            >
              <EditIcon /> Edit Images
            </button>
          </div>

          {/* ── Image grid ── */}
          { images?.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#1e2a3a] bg-[#0a1120] py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0f1623] text-slate-700 mb-4">
                <ImageIcon />
              </div>
              <p className="text-sm font-semibold text-slate-400">No images uploaded yet</p>
              <p className="text-xs text-slate-600 mt-1 mb-5">This region has no images assigned</p>
              <button
                onClick={() => navigate('add-region-image', { state: { region: selectedRegion } })}
                className="flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-[#060d17] hover:bg-yellow-300 transition-all"
              >
                <PlusIcon /> Upload Images
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images?.map((img, idx) => (
                <div
                  key={img._id}
                  className="group relative rounded-2xl overflow-hidden border border-[#1e2a3a] bg-[#0a1120] hover:border-yellow-400/30 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden bg-[#0f1623]">
                    <img
                      src={img.url}
                      alt={`Region image ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={e => { e.target.src = `https://placehold.co/800x450/0a1120/1e2a3a?text=Image+${idx+1}` }}
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                      <span className="text-xs text-slate-300 font-medium">
                        {formatBytes(img.size)}
                      </span>
                      <button
                        onClick={() => setLightbox(img)}
                        className="flex items-center gap-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition"
                      >
                        <ExpandIcon /> View
                      </button>
                    </div>
                    {/* Index badge */}
                    <div className="absolute top-3 left-3 h-6 w-6 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                      {idx + 1}
                    </div>
                    {idx === 0 && (
                      <div className="absolute top-3 right-3 rounded-full bg-yellow-400/90 px-2 py-0.5 text-xs font-bold text-[#060d17]">
                        Cover
                      </div>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="px-4 py-3">
                    <p className="text-xs font-mono text-slate-500 truncate">{img.public_id}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-slate-600 font-mono">{img._id?.slice(-8)}</span>
                      <span className="text-xs text-slate-500">{formatBytes(img.size)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-4xl w-full rounded-2xl overflow-hidden border border-[#1e2a3a] shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={lightbox.url}
              alt="Lightbox"
              className="w-full max-h-[80vh] object-contain bg-[#0a1120]"
            />
            <div className="flex items-center justify-between px-5 py-3 bg-[#0a1120] border-t border-[#1e2a3a]">
              <div>
                <p className="text-xs font-mono text-slate-400 truncate max-w-sm">{lightbox.public_id}</p>
                <p className="text-xs text-slate-600 mt-0.5">{formatBytes(lightbox.size)}</p>
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="flex items-center gap-2 rounded-xl border border-[#1e2a3a] bg-[#0f1623] px-4 py-2 text-sm text-slate-400 hover:text-white hover:border-slate-500 transition"
              >
                <CloseIcon /> Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RegionImages