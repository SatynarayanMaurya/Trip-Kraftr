import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useCommonHooks } from '../../hooks/useCommonHooks'
import { useRegionHooks } from "../../hooks/useRegionHooks"
import { useSelector } from 'react-redux'
import { SearchIcon, ChevronIcon, XIcon, UploadIcon, CheckIcon, MapPinIcon, ImageIcon, StarIcon } from '../Icons/Icons'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'


const MAX_IMAGES = 5

function AddRegionImage() {
    const { searchMasterRegion } = useCommonHooks();
    const { addRegionImages } = useRegionHooks();
    const navigate = useNavigate()

    const isProduction = useSelector((state) => state.user.isProduction)

    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const loading = useSelector((state) => state.user.loading)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [selectedRegion, setSelectedRegion] = useState(null)  // { _id, name, country }
    const [images, setImages] = useState([])         // [{ file, preview, id }]
    const [coverIndex, setCoverIndex] = useState(0)
    const [submitting, setSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [dragOver, setDragOver] = useState(false)

    const searchRef = useRef(null)
    const dropRef = useRef(null)
    const fileInputRef = useRef(null)

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropRef.current && !dropRef.current.contains(e.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    // Debounced search
    const handleSearch = useCallback(async (val) => {
        setQuery(val)
        setDropdownOpen(true)
        if (val?.trim() === "") {
            setDropdownOpen(false)
            return
        }
        try {
            const res = await searchMasterRegion(val)
            setResults(res?.data?.searchedMasterRegion || [])
        } catch { setResults([]) }
    }, [searchMasterRegion])

    const selectRegion = (region) => {
        setSelectedRegion(region)
        setQuery(region.name)
        setDropdownOpen(false)
        setResults([])
    }

    const clearRegion = () => {
        setSelectedRegion(null)
        setQuery('')
        setImages([])
        setCoverIndex(0)
        setSubmitSuccess(false)
    }

    const addFiles = (files) => {
        const remaining = MAX_IMAGES - images.length
        if (remaining <= 0) return
        const valid = Array.from(files)
            .filter(f => f.type.startsWith('image/'))
            .slice(0, remaining)
        const newImgs = valid.map(file => ({
            id: `${Date.now()}-${Math.random()}`,
            file,
            preview: URL.createObjectURL(file),
        }))
        setImages(prev => [...prev, ...newImgs])
        setSubmitSuccess(false)
    }

    const removeImage = (id) => {
        setImages(prev => {
            const idx = prev.findIndex(i => i.id === id)
            const next = prev.filter(i => i.id !== id)
            if (coverIndex >= next.length) setCoverIndex(Math.max(0, next.length - 1))
            else if (idx < coverIndex) setCoverIndex(c => c - 1)
            return next
        })
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragOver(false)
        addFiles(e.dataTransfer.files)
    }

    const handleSubmit = async () => {
        try {
            if (!selectedRegion || images.length === 0) return
            const formData = new FormData();
            formData.append("regionId", selectedRegion._id);
            images.forEach((i) => {
                formData.append("images", i.file); // <-- This is important
            });

            const res = await addRegionImages(formData)
            toast.success(res?.data?.message)
            navigate(-1)
        }
        catch (error) {
            if (!isProduction) {
                console.log("========= ERROR DEBUG START =========");
                console.log("Error:", error);
                console.log("Response:", error?.response);
                console.log("========= ERROR DEBUG END =========");
            }
            toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
        }


    }

    const canSubmit = selectedRegion && images.length >= 1 && !submitting

    return (
        <div className="min-h-screen bg-[#060d17] p-6 md:p-10 md:py-6">
            {/* ── Page Header ── */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-yellow-400/70 mb-2">
                    <span className="h-px w-4 bg-yellow-400/50" />
                    Management
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Region Images</h1>
                <p className="mt-2 text-sm text-slate-400">Search a region and upload up to 5 showcase images</p>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-gray-500 mt-2 hover:text-[#b0b3b8] cursor-pointer"
                >
                    <ArrowLeft size={16} />
                    Back to List
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                {/* ── Left panel ── */}
                <div className="xl:col-span-3 flex flex-col gap-5">

                    {/* Step 1 – Region Search */}
                    <div className="rounded-2xl border border-[#1e2a3a] bg-[#0a1120] p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-bold">1</div>
                            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Select Region</h2>
                        </div>

                        {/* Search box */}
                        <div className="relative" ref={dropRef}>
                            <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200
                ${selectedRegion
                                    ? 'border-green-500/40 bg-green-500/5'
                                    : 'border-[#1e2a3a] bg-[#0f1623] focus-within:border-yellow-400/50 focus-within:bg-yellow-400/5'
                                }`}>
                                <span className={selectedRegion ? 'text-green-400' : 'text-slate-500'}>
                                    {selectedRegion ? <MapPinIcon /> : <SearchIcon />}
                                </span>
                                <input
                                    ref={searchRef}
                                    type="text"
                                    value={query}
                                    onChange={e => handleSearch(e.target.value)}
                                    onFocus={() => query && setDropdownOpen(true)}
                                    disabled={!!selectedRegion}
                                    placeholder="Search region by name…"
                                    className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none disabled:cursor-not-allowed"
                                />
                                {loading && (
                                    <span className="h-4 w-4 rounded-full border-2 border-yellow-400/30 border-t-yellow-400 animate-spin" />
                                )}
                                {!loading && query && (
                                    <button onClick={clearRegion} className="text-slate-500 hover:text-red-400 transition">
                                        <XIcon />
                                    </button>
                                )}
                                {!selectedRegion && !loading && (
                                    <span className="text-slate-600"><ChevronIcon open={dropdownOpen} /></span>
                                )}
                            </div>

                            {/* Dropdown */}
                            {dropdownOpen && !selectedRegion && (
                                <div className="absolute z-50 mt-2 w-full rounded-xl border border-[#1e2a3a] bg-[#0d1726] shadow-2xl shadow-black/50 overflow-hidden">
                                    {results.length === 0 && !loading && query && (
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
                            <div className="mt-4 flex items-center justify-between rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                                        <CheckIcon />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{selectedRegion.name}</p>
                                        <p className="text-xs text-slate-400">{selectedRegion.country} · ID: <span className="font-mono text-slate-500">{selectedRegion._id}</span></p>
                                    </div>
                                </div>
                                <button onClick={clearRegion} className="text-slate-500 hover:text-red-400 transition text-xs flex items-center gap-1">
                                    <XIcon size={3} /> Change
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Step 2 – Upload */}
                    <div className={`rounded-2xl border bg-[#0a1120] p-6 transition-all duration-300 ${!selectedRegion ? 'opacity-40 pointer-events-none' : 'border-[#1e2a3a]'}`}>
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-bold">2</div>
                                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Upload Images</h2>
                            </div>
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${images.length >= MAX_IMAGES ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-[#1e2a3a] text-slate-400'}`}>
                                {images.length} / {MAX_IMAGES}
                            </span>
                        </div>

                        {/* Drop zone */}
                        {images.length < MAX_IMAGES && (
                            <label
                                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer py-10 transition-all duration-200
                  ${dragOver
                                        ? 'border-yellow-400 bg-yellow-400/10'
                                        : 'border-[#1e2a3a] bg-[#0f1623] hover:border-yellow-400/50 hover:bg-yellow-400/5'
                                    }`}
                            >
                                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors ${dragOver ? 'bg-yellow-400/20 text-yellow-400' : 'bg-[#1e2a3a] text-slate-500'}`}>
                                    <UploadIcon />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-white">
                                        {dragOver ? 'Drop images here' : 'Drag & drop or click to browse'}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5">PNG, JPG, WEBP · Max {MAX_IMAGES - images.length} more image{MAX_IMAGES - images.length !== 1 ? 's' : ''}</p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={e => addFiles(e.target.files)}
                                />
                            </label>
                        )}

                        {images.length >= MAX_IMAGES && (
                            <div className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 py-4 text-sm text-red-400">
                                <XIcon size={4} />
                                Maximum {MAX_IMAGES} images reached
                            </div>
                        )}

                        {/* Validation hint */}
                        {selectedRegion && images.length === 0 && (
                            <p className="mt-3 text-xs text-amber-400/70 flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 inline-block" />
                                At least 1 image required to submit
                            </p>
                        )}
                    </div>
                </div>

                {/* ── Right panel – Image Preview ── */}
                <div className="xl:col-span-2 flex flex-col gap-5">
                    <div className="rounded-2xl border border-[#1e2a3a] bg-[#0a1120] p-6 flex-1">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1e2a3a] text-slate-400">
                                <ImageIcon />
                            </div>
                            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Selected Images</h2>
                        </div>

                        {images?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-14 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0f1623] border border-[#1e2a3a] text-slate-700 mb-4">
                                    <ImageIcon />
                                </div>
                                <p className="text-sm text-slate-500">No images selected yet</p>
                                <p className="text-xs text-slate-600 mt-1">Images will appear here after uploading</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {/* Cover preview */}
                                {images[coverIndex] && (
                                    <div className="relative rounded-xl overflow-hidden aspect-video bg-[#0f1623]">
                                        <img src={images[coverIndex].preview} alt="cover" className="w-full h-full object-cover" />
                                        <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-yellow-400">
                                            <StarIcon filled /> Cover Image
                                        </div>
                                    </div>
                                )}

                                {/* Thumbnails */}
                                <div className="grid grid-cols-5 gap-2">
                                    {images.map((img, idx) => (
                                        <div key={img.id} className="relative group">
                                            <button
                                                onClick={() => setCoverIndex(idx)}
                                                className={`relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all duration-150
                          ${idx === coverIndex ? 'border-yellow-400 ring-2 ring-yellow-400/30' : 'border-[#1e2a3a] hover:border-slate-500'}`}
                                            >
                                                <img src={img.preview} alt={`img-${idx}`} className="w-full h-full object-cover" />
                                                {idx === coverIndex && (
                                                    <div className="absolute inset-0 bg-yellow-400/10 flex items-center justify-center">
                                                        <StarIcon filled />
                                                    </div>
                                                )}
                                            </button>
                                            {/* Remove button */}
                                            <button
                                                onClick={() => removeImage(img.id)}
                                                className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                                            >
                                                <XIcon size={2.5} />
                                            </button>
                                        </div>
                                    ))}
                                    {/* Empty slots */}
                                    {Array.from({ length: MAX_IMAGES - images.length }).map((_, i) => (
                                        <div key={`empty-${i}`} className="aspect-square rounded-lg border border-dashed border-[#1e2a3a] bg-[#0f1623]" />
                                    ))}
                                </div>

                                {images.length > 1 && (
                                    <p className="text-xs text-slate-500 text-center">Click a thumbnail to set as cover</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="rounded-2xl border border-[#1e2a3a] bg-[#0a1120] p-6">
                        {submitSuccess ? (
                            <div className="flex flex-col items-center gap-3 py-2 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                                    <CheckIcon />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">Images uploaded!</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{images.length} image{images.length !== 1 ? 's' : ''} saved for {selectedRegion?.name}</p>
                                </div>
                                <button onClick={clearRegion} className="mt-1 text-xs text-yellow-400 hover:text-yellow-300 transition underline underline-offset-2">
                                    Upload for another region
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Summary */}
                                <div className="flex flex-col gap-2 mb-5">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500">Region</span>
                                        <span className={selectedRegion ? 'text-white font-medium' : 'text-slate-600'}>
                                            {selectedRegion ? selectedRegion.name : '—'}
                                        </span>
                                    </div>
                                    <div className="h-px bg-[#1e2a3a]" />
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500">Images selected</span>
                                        <span className={images.length > 0 ? 'text-white font-medium' : 'text-slate-600'}>
                                            {images.length > 0 ? `${images.length} of ${MAX_IMAGES}` : '—'}
                                        </span>
                                    </div>
                                    <div className="h-px bg-[#1e2a3a]" />
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500">Cover image</span>
                                        <span className={images.length > 0 ? 'text-yellow-400 font-medium' : 'text-slate-600'}>
                                            {images.length > 0 ? `Image ${coverIndex + 1}` : '—'}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={!canSubmit || loading}
                                    className={`w-full rounded-xl py-3 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2
                    ${canSubmit
                                            ? 'bg-yellow-400 text-[#060d17] hover:bg-yellow-300 active:scale-[0.98] shadow-lg shadow-yellow-400/20'
                                            : 'bg-[#1e2a3a] text-slate-600 cursor-not-allowed'
                                        }`}

                                >
                                    {loading ? (
                                        <>
                                            <svg
                                                className="animate-spin w-4 h-4 text-black"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v8z"
                                                />
                                            </svg>
                                            Uploading...
                                        </>
                                    ) : (
                                        `Upload ${images.length > 0 ? images.length : ''} Image${images.length !== 1 ? 's' : ''}`
                                    )}
                                </button>

                                {!selectedRegion && (
                                    <p className="mt-2 text-center text-xs text-slate-600">Select a region first</p>
                                )}
                                {selectedRegion && images.length === 0 && (
                                    <p className="mt-2 text-center text-xs text-amber-400/60">Add at least 1 image to continue</p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddRegionImage