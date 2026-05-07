
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useAccountHooks } from '../../../hooks/useAccountHooks'
import AccountTable from './AccountTable'
import { clearB2CAccounts, setB2CAccountPageLimit } from '../../../redux/slices/accountSlice'
import { Search, Eye, MessageCircle, Filter } from 'lucide-react';
import { useCommonHooks } from '../../../hooks/useCommonHooks'
import { useNavigate } from 'react-router-dom'
const SOURCE_OPTIONS = ['Instagram', 'Referral', 'Direct'];

const COLUMNS = [
  { key: 'accountId', label: 'Acc ID' },
  { key: 'fullName', label: 'Name' },
  {
    key: 'phone', label: 'Ph.no',
    render: row => row.phone ? `+91${row.phone}` : '—'
  },
  { key: 'email', label: 'Email' },
  {
    key: 'source', label: 'Source',
    render: row => {
      const colors = {
        Instagram: { bg: '#fce7ef', color: '#ED5F8D' },
        Referral:  { bg: '#e0f2fe', color: '#0369a1' },
        Direct:    { bg: '#dcfce7', color: '#15803d' },
      };
      const s = colors[row.source] || { bg: '#f3f4f6', color: '#6b7280' };
      return (
        <span style={{ background: s.bg, color: s.color, fontSize: '12px', fontWeight: '500', padding: '3px 10px', borderRadius: '20px' }}>
          {row.source || '—'}
        </span>
      );
    }
  },
  {
    key: 'destinations', label: 'Destinations',
    render: row => {
      const dests = row.destinations || [];
      if (dests.length === 0) return <span style={{ color: '#9ca3af' }}>unassigned</span>;
      return (
        <span style={{ fontSize: '13px', color: '#374151' }}>
          {dests.slice(0, 2).join(', ')}{dests.length > 2 ? ` +${dests.length - 2}` : ''}
        </span>
      );
    }
  },
];

function B2CAccounts() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {searchB2CAccounts} = useCommonHooks()
  const { getb2cAccounts } = useAccountHooks()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchedCurrentPage, setSearchedCurrentPage] = useState(1)
  const [isSearching, setIsSearching] = useState(false)
  const [search, setSearch] = useState('');
  const [searchedAccounts, setSearchedAccounts] = useState([])
  const [sourceFilter, setSourceFilter] = useState('');
  const [fetchLoading, setFetchLoading] = useState(false)
  const isProduction = useSelector(s => s.user.isProduction)
  const pageLimit = useSelector(s => s.account.b2cAccountPerPages)
  const currentPageData = useSelector(s => s.account.b2cAccountsByPage?.[currentPage])
  const pagination = useSelector(s => s.account.paginationB2C)
  const [showSearchedAccount, setShowSearchedAccount] = useState(searchedAccounts?.slice(0,pageLimit))
  const [totalPages,setTotalPages] = useState(1)
  const fetchB2CAccounts = async () => {
    try {
      setFetchLoading(true)
      await getb2cAccounts(currentPage, pageLimit)
    } catch (error) {
      if (!isProduction) {
        console.log("Error:", error)
        console.log("Response:", error?.response)
      }
      toast.error(error?.response?.data?.message || error?.message || "Error fetching B2C accounts")
    } finally {
      setFetchLoading(false)
    }
  }

  useEffect(()=>{
    const skip = (searchedCurrentPage-1) * pageLimit
    setShowSearchedAccount(searchedAccounts?.slice(skip, skip + pageLimit))
    setTotalPages(Math.ceil(searchedAccounts?.length/pageLimit))
  },[searchedAccounts,searchedCurrentPage])

  useEffect(() => {
    if (!currentPageData) fetchB2CAccounts()
  }, [currentPage, pageLimit])

  const changePageLimit = (val) => {
    dispatch(clearB2CAccounts())
    setCurrentPage(1)
    dispatch(setB2CAccountPageLimit(Number(val)))
  }


  const searchAccounts = async()=>{
    try{  
      setFetchLoading(true)
      setIsSearching(true)
      const response = await searchB2CAccounts(search,sourceFilter,pageLimit)
      setSearchedAccounts(response?.data?.searchedAccounts)
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
    if(search?.trim() || sourceFilter){
      searchAccounts()
    }
    else{
      setIsSearching(false)
    }
  },[search,sourceFilter,pageLimit])


  const filtered = isSearching ? showSearchedAccount : currentPageData;

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
                value={sourceFilter}
                onChange={e => setSourceFilter(e.target.value)}
                style={{
                  padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px',
                  fontSize: '14px', color: '#374151', background: 'white',
                  cursor: 'pointer', outline: 'none', minWidth: '140px',
                }}
              >
                <option value="">All Sources</option>
                {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              </div>

      <AccountTable
        data={filtered || []}
        columns={COLUMNS}
        fetchLoading={fetchLoading}
        onView={(row) => navigate(`view-b2c/${row?._id}`)}
        onToggleActive={(id, val) => console.log('Toggle B2C:', id, val)}
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
              disabled={isSearching ? searchedCurrentPage ===1 :currentPage === 1}
              onClick={() => {
                isSearching ? setSearchedCurrentPage(searchedCurrentPage-1) : setCurrentPage(Number(currentPage - 1))
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 w-full sm:w-auto
        ${(isSearching ? searchedCurrentPage ===1 :currentPage === 1)
                  ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#ED5F8D] border-[#E91E8C] text-white hover:bg-[#C81878] cursor-pointer'
                }`}
            >
              ← Prev
            </button>

            {/* Page Info */}
            <p className="text-sm text-gray-400 whitespace-nowrap">
              Page <span className="text-[#18305C] font-semibold">{isSearching ? searchedCurrentPage:currentPage || 1}</span> of{" "}
              <span className="text-[#18305C] font-semibold">{isSearching ? totalPages : pagination?.totalPages || 0}</span>
            </p>

            {/* Next */}
            <button
              disabled={isSearching ? totalPages===searchedCurrentPage :currentPage === pagination?.totalPages}
              onClick={() => {
                isSearching ? setSearchedCurrentPage(searchedCurrentPage+1) : setCurrentPage(Number(currentPage + 1))}}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 w-full sm:w-auto
        ${(isSearching ? totalPages===searchedCurrentPage :currentPage === pagination?.totalPages)
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
    </div>
  )
}

export default B2CAccounts



















// import React, { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'
// import { useAccountHooks } from '../../../hooks/useAccountHooks'

// function B2CAccounts() {

//     const {getb2cAccounts} = useAccountHooks()

//     const [currentPage, setCurrentPage] = useState(1)

//     const [fetchLoading, setFetchLoading] = useState(false)

    
//     const pageLimit = useSelector(s=>s.account.b2cAccountPerPages)
//     const currentPageData = useSelector(s=>s.account.b2cAccountsByPage?.[currentPage]);
//     console.log("currentPageData : ",currentPageData)

//     const fetchB2BAccounts = async()=>{
//         try{
//             setFetchLoading(true)
//             await getb2cAccounts(currentPage,pageLimit)
//         }
//         catch(error){
//           if (!isProduction) {
//             console.log("========= ERROR DEBUG START =========");
//             console.log("Error:", error);
//             console.log("Response:", error?.response);
//             console.log("========= ERROR DEBUG END =========");
//           }
//           toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
//         }
//         finally{
//             setFetchLoading(false)
//         }
//     }

//     useEffect(()=>{
//         if(!currentPageData){
//             fetchB2BAccounts()
//         }
//     },[currentPage,pageLimit])

//   return (
//     <div>B2BAccounts</div>
//   )
// }


// export default B2CAccounts