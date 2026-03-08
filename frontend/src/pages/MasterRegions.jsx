import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useRegionHooks } from '../hooks/useRegionHooks'
import { toast } from 'react-toastify'
import MasterRegionSkeleton from '../components/Regions/MasterRegionSkeleton'
import { useCommonHooks } from '../hooks/useCommonHooks'


function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
    })
}

function MasterRegions() {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('All')
    const { getmasterRegions } = useRegionHooks()
    const { searchMasterRegion } = useCommonHooks()
    const loading = useSelector((state) => state.user.loading)
    const [currentPage, setCurrentPage] = useState(1)
    const currentPageRegions = useSelector((state) => state.region.masterRegionsPages?.[currentPage])
    const pagination = useSelector((state) => state.region.paginationMasterRegions)
    const stats = useSelector((state) => state.region.statsMasterRegions)
    const isProduction = useSelector((state) => state.user.isProduction)

    const [searchedRegions, setSearchedRegions] = useState([])
    const [isSearching, setIsSearching] = useState(false)

    const fetchRegions = async (currentPage, limit) => {
        try {
            await getmasterRegions(currentPage, limit)
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

    const searchMasterRegions = async () => {
        try {

            setIsSearching(true)

            const res = await searchMasterRegion(search, filter)

            setSearchedRegions(res?.data?.searchedMasterRegion || [])

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

    useEffect(() => {
        if (search.trim() !== "" || filter !== "All") {
            searchMasterRegions()
        } else {
            setIsSearching(false)
            setSearchedRegions([])
        }

    }, [search, filter])

    useEffect(() => {
        if (!currentPageRegions) {
            fetchRegions(currentPage, 5)
        }
    }, [currentPage])


    const filtered = isSearching ? searchedRegions : currentPageRegions

    return (
        <div className="min-h-screen bg-[#0d1526] p-8 font-sans">
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap'); * { font-family: 'DM Sans', sans-serif; } ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:#0d1526} ::-webkit-scrollbar-thumb{background:#2d3a52;border-radius:4px}`}</style>

            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-amber-400 mb-1.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"></span>
                        MANAGEMENT
                    </p>
                    <h1 className="text-[28px] font-bold text-slate-100 tracking-tight leading-none">
                        Master Regions
                    </h1>
                    <p className="text-sm text-gray-500 mt-1.5">
                        {pagination?.totalRecords || 0} total · {stats?.activeRegion} active · {stats?.inactiveRegion} inactive
                    </p>
                </div>
                <button
                    onClick={() => navigate('add-master-region')}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-[#0d1526] font-bold text-sm px-5 py-3 rounded-xl transition-colors duration-200"
                >
                    <span className="text-lg leading-none">+</span> Add Region
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-4 mb-7">
                {[
                    { label: 'TOTAL', value: pagination?.totalRecords, color: 'text-slate-100' },
                    { label: 'ACTIVE', value: stats?.activeRegion, color: 'text-green-400' },
                    { label: 'INACTIVE', value: stats?.inactiveRegion, color: 'text-red-400' },
                ]?.map(s => (
                    <div key={s.label} className="bg-[#111827] border border-[#1e2d45] rounded-2xl px-6 py-5">
                        <p className="text-[11px] font-semibold tracking-widest text-gray-500 uppercase mb-1">{s.label}</p>
                        <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Search + Filter */}
            <div className="flex gap-3 mb-5">
                <div className="flex-1 flex items-center gap-2 bg-[#1a2035] border border-[#2d3a52] rounded-xl px-4 py-3 focus-within:border-amber-400 transition-colors">
                    <span className="text-gray-500 text-sm">🔍</span>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by region or country..."
                        className="bg-transparent flex-1 outline-none text-slate-200 text-sm placeholder-gray-600"
                    />
                    {search && (
                        <button onClick={() => setSearch('')} className="text-gray-600 hover:text-gray-400 text-xs">✕</button>
                    )}
                </div>
                <div className="flex bg-[#1a2035] border border-[#2d3a52] rounded-xl overflow-hidden">
                    {['All', 'Active', 'Inactive'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-3 text-sm font-semibold transition-colors ${filter === f
                                ? 'bg-[#2d3a52] text-slate-100'
                                : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[2fr_2fr_1.2fr_1.5fr_140px] px-6 py-3.5 border-b border-[#1e2d45]">
                    {['Region Name', 'Country', 'Status', 'Created', 'Actions']?.map(h => (
                        <span key={h} className="text-[11px] font-bold tracking-widest uppercase text-gray-500">{h}</span>
                    ))}
                </div>

                {/* Rows */}
                {
                    loading ?
                        <MasterRegionSkeleton /> :
                        filtered?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-600">
                                <span className="text-4xl mb-3">🗺️</span>
                                <p className="font-semibold text-gray-500">No regions found</p>
                                <p className="text-sm mt-1">Try adjusting your search or filter</p>
                            </div>
                        ) : (
                            filtered?.map((region, idx) => (
                                <div
                                    key={region?._id}
                                    className={`grid grid-cols-[2fr_2fr_1.2fr_1.5fr_140px] px-6 py-4 items-center transition-colors hover:bg-white/2 ${idx !== filtered?.length - 1 ? 'border-b border-[#1a2537]' : ''
                                        }`}
                                >
                                    {/* Region Name */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-sm font-bold text-amber-400 shrink-0">
                                            {region?.name?.[0]}
                                        </div>
                                        <span className="text-slate-200 font-semibold text-sm">{region.name}</span>
                                    </div>

                                    {/* Country */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-base">🌍</span>
                                        <span className="text-gray-400 text-sm">{region.country}</span>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${region.is_active
                                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${region.is_active ? 'bg-green-400' : 'bg-red-400'}`}></span>
                                            {region.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    {/* Created Date */}
                                    <span className="text-gray-500 text-sm">{formatDate(region.createdAt)}</span>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => navigate(`update-master-region/${region._id}`)}
                                            className="flex-1 text-xs font-bold py-2 px-3 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 hover:bg-amber-400/20 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => navigate(`view-master-region/${region._id}`)}
                                            className="flex-1 text-xs font-bold py-2 px-3 rounded-lg bg-[#1a2035] border border-[#2d3a52] text-gray-400 hover:text-slate-200 hover:border-slate-500 transition-colors"
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
            </div>

            {/* Footer count */}
            {filtered?.length > 0 && (
                <p className="text-xs text-gray-600 mt-4 px-1">
                    Showing <span className="text-gray-400 font-semibold">{filtered?.length}</span> of <span className="text-gray-400 font-semibold">{pagination?.totalRecords}</span> regions
                </p>
            )}

            {/* Pagination  */}
            <div className="flex items-center justify-between mt-6 bg-[#111827] border border-[#1e2d45] rounded-xl px-5 py-3">

                {/* Left Controls */}
                <div className="flex items-center gap-3">

                    <button
                        disabled={currentPage === 1 || isSearching}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200
                            ${currentPage === 1 || isSearching
                                ? 'bg-gray-600 border-gray-500 text-gray-300 cursor-not-allowed'
                                : 'bg-blue-500 border-blue-600 text-white hover:bg-blue-600 hover:text-white cursor-pointer'
                            }`}
                    >
                        ← Prev
                    </button>

                    <p className="text-sm text-gray-400">
                        Page <span className="text-white font-semibold">{currentPage || 1}</span> of{" "}
                        <span className="text-white font-semibold">{pagination?.totalPages || 0}</span>
                    </p>

                    <button
                        disabled={currentPage === pagination?.totalPages || isSearching}
                        onClick={() => setCurrentPage(Number(currentPage + 1))}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200
                            ${currentPage === pagination?.totalPages || isSearching
                                ? 'bg-gray-600 border-gray-500 text-gray-300 cursor-not-allowed'
                                : 'bg-blue-500 border-blue-600 text-white hover:bg-blue-600 hover:text-white cursor-pointer'
                            }`}
                    >
                        Next →
                    </button>

                </div>

                {/* Go to page  */}
                <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span>Go to page</span>

                    <select
                        value={currentPage}
                        disabled={isSearching}
                        onChange={(e) => setCurrentPage(Number(e.target.value))}
                        className="bg-[#1a2035] border border-[#2d3a52] text-white text-sm px-3 py-2 rounded-lg outline-none focus:border-amber-400 cursor-pointer"
                    >
                        {Array.from({ length: pagination?.totalPages || 1 }, (_, index) => (
                            <option key={index} value={index + 1} className="text-white">
                                {index + 1}
                            </option>
                        ))}
                    </select>
                </div>

            </div>
        </div>
    )
}

export default MasterRegions