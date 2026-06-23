

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useAccountHooks } from '../../../hooks/useAccountHooks'
// import AccountTable from './AccountTable'
import { Search, Eye, MessageCircle } from 'lucide-react';
import { clearB2BAccounts, setB2BAccountPageLimit } from '../../../redux/slices/accountSlice'
import { useCommonHooks } from '../../../hooks/useCommonHooks'
import { useNavigate } from 'react-router-dom'
import { useEnquiryHooks } from '../../../hooks/useEnquiryHooks';
import EnquiryTable from './EnquiryTable';
import DeleteModal from '../../DeleteModals/DeleteModal';
import { useRegionsData } from '../../../hooks/Resuable Hooks/useResuableData';

// const SOURCE_OPTIONS = ['Instagram', 'Referral', 'Direct'];
const STATUS_OPTIONS = ['New', 'In Progress', 'Warm' ,'Won', 'Lost'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];


function B2BEnquiries() {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { searchB2BEnquiry } = useCommonHooks()
      const {regions,loading:regionLoading} = useRegionsData()
      const regionsDropdown = regions?.map(val=>val?.name)
    const [isUpdated, setIsUpdated] = useState(false)
    const { getb2bEnquiries ,deleteB2BEnquiryById} = useEnquiryHooks()
    const [currentPage, setCurrentPage] = useState(1)
    const [searchedCurrentPage, setSearchedCurrentPage] = useState(1)
    const [isSearching, setIsSearching] = useState(false)
    const [fetchLoading, setFetchLoading] = useState(false)
    const [search, setSearch] = useState('');
    const [searchedEnquiries, setSearchedEnquiries] = useState([])
    const pageLimit = useSelector(s => s.enquiry.b2bEnquiryPerPages)
    const [showSearchedEnquiry, setShowSearchedEnquiry] = useState(searchedEnquiries?.slice(0, pageLimit))
    const [sourceFilter, setSourceFilter] = useState('');
    const [region, setRegion] = useState('')
    const [month, setMonth] = useState('')
    const isProduction = useSelector(s => s.user.isProduction)
    const currentPageData = useSelector(s => s.enquiry.b2bEnquiriesByPage?.[currentPage])
    // console.log("currentPageData : ", currentPageData)
    const pagination = useSelector(s => s.enquiry.paginationB2B)
    const [totalPages, setTotalPages] = useState(1)

    const fetchB2BEnquiries = async () => {
        try {
            setFetchLoading(true)
            await getb2bEnquiries(currentPage, pageLimit)
        } catch (error) {
            if (!isProduction) {
                console.log("Error:", error)
                console.log("Response:", error?.response)
            }
            toast.error(error?.response?.data?.message || error?.message || "Error fetching B2B accounts")
        } finally {
            setFetchLoading(false)
        }
    }

    useEffect(() => {
        const skip = (searchedCurrentPage - 1) * pageLimit
        setShowSearchedEnquiry(searchedEnquiries?.slice(skip, skip + pageLimit))
        setTotalPages(Math.ceil(searchedEnquiries?.length / pageLimit))
    }, [searchedEnquiries, searchedCurrentPage])

    useEffect(() => {
        if (!currentPageData) fetchB2BEnquiries()
    }, [currentPage, pageLimit, isUpdated])

    const changePageLimit = (val) => {
        dispatch(clearB2BAccounts())
        setCurrentPage(1)
        dispatch(setB2BAccountPageLimit(Number(val)))
    }

    // The source is working as statsu filter
    const searchEnquiry = async () => {
        try {
            setFetchLoading(true)
            setIsSearching(true)
            const response = await searchB2BEnquiry(search, sourceFilter,region, month);
            setSearchedEnquiries(response?.data?.searchedEnquiries)
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
        finally {
            setFetchLoading(false)
        }
    }

    useEffect(() => {
        if (search?.trim() || sourceFilter || region || month) {
            searchEnquiry()
        }
        else {
            setIsSearching(false)
        }
    }, [search, sourceFilter, region, month])


    const filtered = isSearching ? showSearchedEnquiry : currentPageData;


    const [deleteEnquiryDetails, setDeleteEnquiryDetails] = useState(null)
    const [isDeleteModal, setIsDeleteModal] = useState(false)
    const handleDelete = (row)=>{
        setDeleteEnquiryDetails(row)
        setIsDeleteModal(true)
    }


    const deleteEnquiry = async()=>{
        try{
            setFetchLoading(true)
            const response = await deleteB2BEnquiryById(deleteEnquiryDetails?._id)
            toast.success(response?.data?.message)
            setIsUpdated(!isUpdated)
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

    return (
        <div>

            {/* Search + Filter Row */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>

                <div style={{
                    flex: 1, minWidth: '220px', display: 'flex', alignItems: 'center', gap: '8px',
                    border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '0 14px',
                    background: 'white',
                }}>
                    <Search size={16} color="#9ca3af" />
                    <input
                        placeholder="Search by Name and Phone"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            border: 'none', outline: 'none', fontSize: '14px',
                            color: '#374151', width: '100%', padding: '11px 0', background: 'transparent'
                        }}
                    />
                </div>

                <select
                    value={region}
                    onChange={e => setRegion(e.target.value)}
                    style={{
                        padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px',
                        fontSize: '14px', color: '#374151', background: 'white',
                        cursor: 'pointer', outline: 'none', minWidth: '140px',
                    }}
                >
                    <option value="">All Region</option>
                    {regionsDropdown?.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <select
                    value={month}
                    onChange={e => setMonth(e.target.value)}
                    style={{
                        padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px',
                        fontSize: '14px', color: '#374151', background: 'white',
                        cursor: 'pointer', outline: 'none', minWidth: '140px',
                    }}
                >
                    <option value="">Month</option>
                    {MONTHS?.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <select
                    value={sourceFilter}
                    onChange={e => setSourceFilter(e.target.value)}
                    style={{
                        padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px',
                        fontSize: '14px', color: '#374151', background: 'white',
                        cursor: 'pointer', outline: 'none', minWidth: '140px',
                    }}
                >
                    <option value="">All Status</option>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <EnquiryTable
                data={filtered || []}
                fetchLoading={fetchLoading}
                onView={(row) => navigate(`view-b2b/${row?._id}`)}
                onEdit={(row) => navigate(`edit-b2b/${row?._id}`)}
                onDelete={(row) => {
                    // wire your delete handler here
                    handleDelete(row);
                }}
            />

            {/* Pagination */}
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
                            disabled={isSearching ? searchedCurrentPage === 1 : currentPage === 1}
                            onClick={() => {
                                isSearching ? setSearchedCurrentPage(searchedCurrentPage - 1) : setCurrentPage(Number(currentPage - 1))
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 w-full sm:w-auto
        ${(isSearching ? searchedCurrentPage === 1 : currentPage === 1)
                                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#ED5F8D] border-[#E91E8C] text-white hover:bg-[#C81878] cursor-pointer'
                                }`}
                        >
                            ← Prev
                        </button>

                        {/* Page Info */}
                        <p className="text-sm text-gray-400 whitespace-nowrap">
                            Page <span className="text-[#18305C] font-semibold">{isSearching ? searchedCurrentPage : currentPage || 1}</span> of{" "}
                            <span className="text-[#18305C] font-semibold">{isSearching ? totalPages : pagination?.totalPages || 0}</span>
                        </p>

                        {/* Next */}
                        <button
                            disabled={isSearching ? totalPages === searchedCurrentPage : currentPage === pagination?.totalPages}
                            onClick={() => {
                                isSearching ? setSearchedCurrentPage(searchedCurrentPage + 1) : setCurrentPage(Number(currentPage + 1))
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 w-full sm:w-auto
        ${(isSearching ? totalPages === searchedCurrentPage : currentPage === pagination?.totalPages)
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
                            disabled
                            onChange={(e) => changePageLimit(Number(e.target.value))}
                            className="w-[100px] bg-white border border-gray-200 text-[#18305C] text-sm px-3 py-2 rounded-lg outline-none focus:border-[#E91E8C] cursor-pointer"
                            style={{
                                boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                            }}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
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

            {/* Delete Modal  */}
            <>
                {
                    isDeleteModal && 
                    <DeleteModal onClose={()=>setIsDeleteModal(false)} onDelete={deleteEnquiry} itemName = {deleteEnquiryDetails?.enquiryId} confirmText = {deleteEnquiryDetails?.enquiryId} />
                }
            </>
        </div>
    )
}

export default B2BEnquiries