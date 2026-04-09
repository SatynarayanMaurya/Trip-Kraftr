import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePlaceHooks } from "../hooks/usePlaceHooks";
import { toast } from "react-toastify";
import { clearPlaces, setPlacePageLimit } from "../redux/slices/placeSlice";
import { useNavigate } from "react-router-dom";
import { useCommonHooks } from "../hooks/useCommonHooks";
import { useRegionHooks } from "../hooks/useRegionHooks";
import DeleteModal from "../components/DeleteModals/DeleteModal";

const dummyPlaces = [
  { id: 1, placeName: "Nichiphula Waterfall", notes: "Nichiphula Waterfall", region: "Assam", subRegion: "Guwahati", category: "Leisure" },
  { id: 2, placeName: "Nichiphula Waterfall", notes: "Nichiphula Waterfall", region: "Assam", subRegion: "Guwahati", category: "Leisure" },
  { id: 3, placeName: "Nichiphula Waterfall", notes: "Nichiphula Waterfall", region: "Assam", subRegion: "Guwahati", category: "Leisure" },
  { id: 4, placeName: "Nichiphula Waterfall", notes: "Nichiphula Waterfall", region: "Assam", subRegion: "Guwahati", category: "Leisure" },
  { id: 5, placeName: "Nichiphula Waterfall", notes: "Nichiphula Waterfall", region: "Assam", subRegion: "Guwahati", category: "Leisure" },
  { id: 6, placeName: "Nichiphula Waterfall", notes: "Nichiphula Waterfall", region: "Assam", subRegion: "Guwahati", category: "Leisure" },
];

const subRegionOptions = ["All", "Guwahati", "Delhi", "Mumbai"];
const regionOptions = ["All", "Assam", "Asia", "Europe"];

const BLUE = "#08255B";
const PINK = "#ED5F8D";

function Places() {

  const { getPlaces, deletePlaceById } = usePlaceHooks()
  
  const [isGlobal, setIsGlobal] = useState(true);
  const { searchPlaces } = useCommonHooks()
  const { getRegionsForOrg } = useRegionHooks()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [search, setSearch] = useState("");
  const [selectedSubRegion, setSelectedSubRegion] = useState("Sub-Region");
  const [selectedRegion, setSelectedRegion] = useState("Region");

  const [subRegionOpen, setSubRegionOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1)
  const [isSearching, setIsSearching] = useState(false)
  const [searchedPlaces, setSearchedPlaces] = useState([])

  const [deletePlaceDetails, setDeletePlaceDetails] = useState(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false)

  const pagination = useSelector((state) => state.place.paginationPlaces)

  const [fetchLoading, setFetchLoading] = useState(false)

  const isProduction = useSelector((state) => state.user.isProduction)
  const currentPagePlaces = useSelector((state) => state.place.placesPages?.[currentPage]);
  const pageLimit = useSelector((state) => state.place.placesPageLimit)

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

  // console.log("All Regions : ",allRegions)

  useEffect(() => {
    if (!allRegionsForSuggestions) return;

    const regions = allRegionsForSuggestions
      .flatMap((val) => val?.name || [])
      .filter(Boolean);

    setAllRegions(['Region', ...regions]);
  }, [allRegionsForSuggestions]);


  const fetchSearchPlace = async () => {
    try {
      setIsSearching(true)
      setFetchLoading(true)
      const regionId = allRegionsForSuggestions?.find((region) => region?.name === selectedRegion)?._id
      const response = await searchPlaces(search, regionId || null, pageLimit,isGlobal)
      setSearchedPlaces(response?.data?.searchedPlaces)
      setFetchLoading(false)
    }
    catch (error) {
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


  const fetchPlaces = async () => {
    try {
      setFetchLoading(true)
      await getPlaces(currentPage, pageLimit)
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
    if (!currentPagePlaces) {
      fetchPlaces()
    }

  }, [currentPage, pageLimit])

  useEffect(() => {
    if (search !== "" || selectedRegion !== 'Region') {
      fetchSearchPlace()
    }
    else {
      setIsSearching(false)
    }
  }, [search, pageLimit, selectedRegion])

  // const pageLimit = 10

  const filtered = isSearching ? searchedPlaces : currentPagePlaces

  const handleDelete = (placeDetails) => {
    setDeletePlaceDetails(placeDetails)
    setIsDeleteModal(true)
  }

  const handleEdit = (id) => console.log("Edit place id:", id);

  const changePageLimit = (e) => {
    const val = Number(e.target.value)
    setCurrentPage(1)
    dispatch(setPlacePageLimit(val))
    dispatch(clearPlaces())
  }

  const deletePlace = async () => {
    try {
      setFetchLoading(true)
      const response = await deletePlaceById(deletePlaceDetails?._id)
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
    <div style={{ padding: "28px 32px", backgroundColor: "#f5f6fa", minHeight: "100vh", }}>

      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: "700", color: BLUE, margin: 0, lineHeight: 1.2 }}>Places</h1>
          <p style={{ fontSize: "13px", color: "#8a94a6", marginTop: "5px", marginBottom: 0 }}>Manage your travel destinations</p>
        </div>
        <button
          onClick={() => navigate("add-place")}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            backgroundColor: PINK, color: "#fff",
            border: "none", borderRadius: "10px",
            padding: "10px 18px", fontSize: "14px", fontWeight: "600",
            cursor: "pointer", boxShadow: "0 4px 14px rgba(237,95,141,0.35)",
            whiteSpace: "nowrap"
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Place
        </button>
      </div>

      {/* Filters Row */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px", flexWrap: "wrap" }}>

        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          backgroundColor: "#fff", borderRadius: "10px",
          padding: "10px 16px", flex: 1, minWidth: "220px", maxWidth: "440px",
          boxShadow: "0 2px 8px rgba(8,37,91,0.07)", border: "1px solid #eaecf0"
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#adb5bd" strokeWidth={2} style={{ flexShrink: 0 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by Place Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: "none", outline: "none", fontSize: "13.5px",
              color: "#495057", backgroundColor: "transparent", width: "100%"
            }}
          />
        </div>

        {/* Sub-Region Dropdown */}
        {/* <div style={{ position: "relative" }}>
          <button
            onClick={() => { setSubRegionOpen(!subRegionOpen); setRegionOpen(false); }}
            style={{
              display: "flex", alignItems: "center", gap: "32px",
              backgroundColor: "#fff", border: "1px solid #eaecf0",
              borderRadius: "10px", padding: "10px 14px",
              fontSize: "13.5px", color: "#495057", fontWeight: "500",
              cursor: "pointer", boxShadow: "0 2px 8px rgba(8,37,91,0.07)",
              minWidth: "148px", justifyContent: "space-between"
            }}
          >
            {selectedSubRegion}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#adb5bd" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {subRegionOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 6px)", left: 0,
              backgroundColor: "#fff", border: "1px solid #eaecf0",
              borderRadius: "10px", boxShadow: "0 8px 24px rgba(8,37,91,0.12)",
              zIndex: 30, minWidth: "148px", overflow: "hidden"
            }}>
              {subRegionOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setSelectedSubRegion(opt); setSubRegionOpen(false); }}
                  style={{
                    width: "100%", textAlign: "left", padding: "9px 14px",
                    fontSize: "13px", color: selectedSubRegion === opt ? PINK : "#495057",
                    backgroundColor: selectedSubRegion === opt ? "#fff5f8" : "transparent",
                    border: "none", cursor: "pointer", fontWeight: selectedSubRegion === opt ? 600 : 400
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fff5f8"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = selectedSubRegion === opt ? "#fff5f8" : "transparent"}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div> */}

        {/* Region Dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => { setRegionOpen(!regionOpen); setSubRegionOpen(false); }}
            style={{
              display: "flex", alignItems: "center", gap: "28px",
              backgroundColor: "#fff", border: "1px solid #eaecf0",
              borderRadius: "10px", padding: "10px 14px",
              fontSize: "13.5px", color: "#495057", fontWeight: "500",
              cursor: "pointer", boxShadow: "0 2px 8px rgba(8,37,91,0.07)",
              minWidth: "128px", justifyContent: "space-between"
            }}
          >
            {selectedRegion}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#adb5bd" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {regionOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 6px)", left: 0,
              backgroundColor: "#fff", border: "1px solid #eaecf0",
              borderRadius: "10px", boxShadow: "0 8px 24px rgba(8,37,91,0.12)",
              zIndex: 30, minWidth: "128px", overflow: "hidden"
            }}>
              {allRegions?.map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setSelectedRegion(opt); setRegionOpen(false); }}
                  style={{
                    width: "100%", textAlign: "left", padding: "9px 14px",
                    fontSize: "13px", color: selectedRegion === opt ? PINK : "#495057",
                    backgroundColor: selectedRegion === opt ? "#fff5f8" : "transparent",
                    border: "none", cursor: "pointer", fontWeight: selectedRegion === opt ? 600 : 400
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fff5f8"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = selectedRegion === opt ? "#fff5f8" : "transparent"}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isGlobal}
            onChange={(e) => setIsGlobal(e.target.checked)}
            className="w-4 h-4"
          />
          <label>Global Search</label>
        </div>

        {/* Filter sliders icon */}
        <button style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          backgroundColor: "#fff", border: "1px solid #eaecf0",
          borderRadius: "10px", padding: "10px 12px",
          cursor: "pointer", boxShadow: "0 2px 8px rgba(8,37,91,0.07)"
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#6c757d" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>
      </div>

      {/* Table Card */}
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(8,37,91,0.10)",
        overflow: "hidden"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
          <thead>
            <tr style={{ borderBottom: "1.5px solid #f0f2f5" }}>
              <th style={{ textAlign: "left", padding: "16px 24px", color: BLUE, fontWeight: "700", fontSize: "13px", letterSpacing: "0.01em" }}>Place Name</th>
              <th style={{ textAlign: "left", padding: "16px 20px", color: BLUE, fontWeight: "700", fontSize: "13px" }}>Notes</th>
              <th style={{ textAlign: "left", padding: "16px 20px", color: BLUE, fontWeight: "700", fontSize: "13px" }}>Region</th>
              <th style={{ textAlign: "left", padding: "16px 20px", color: BLUE, fontWeight: "700", fontSize: "13px" }}>Sub-Region</th>
              <th style={{ textAlign: "left", padding: "16px 20px", color: BLUE, fontWeight: "700", fontSize: "13px" }}>Category</th>
              <th style={{ textAlign: "right", padding: "16px 24px", color: BLUE, fontWeight: "700", fontSize: "13px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered?.length > 0 ? filtered?.map((place, index) => (
              <tr
                key={place._id}
                style={{
                  borderBottom: index === filtered.length - 1 ? "none" : "1px solid #f5f6fa",
                  transition: "background 0.15s"
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fafbff"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <td style={{ padding: "15px 24px", color: BLUE, fontWeight: "600", fontSize: "13.5px" }}>{place.placeName}</td>
                <td style={{ padding: "15px 20px", color: "#8a94a6", fontSize: "13px" }}>{place.notes}</td>
                <td style={{ padding: "15px 20px", color: "#6c757d", fontSize: "13px" }}>{place.regionId?.name}</td>
                <td style={{ padding: "15px 20px", color: "#6c757d", fontSize: "13px" }}>{place.subRegionId?.name}</td>
                <td style={{ padding: "15px 20px", color: "#6c757d", fontSize: "13px" }}>{place.category}</td>
                <td style={{ padding: "15px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px" }}>
                    {/* Edit icon */}
                    <button
                      onClick={() =>
                        navigate(`update-place/${place?._id}`, {
                          state: { place: place }
                        })
                      }
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        padding: "4px", display: "flex", alignItems: "center",
                        borderRadius: "6px"
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fff5f8"}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={PINK} strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    {/* Delete icon */}
                    <button
                      onClick={() => handleDelete(place)}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        padding: "4px", display: "flex", alignItems: "center",
                        borderRadius: "6px"
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fff5f8"}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={PINK} strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} style={{ padding: "48px 24px", textAlign: "center", color: "#adb5bd", fontSize: "13.5px" }}>
                  No places found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


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
            <span className="text-gray-800 font-semibold">{pagination?.totalPages || 1}</span>
          </p>
          <button
            disabled={currentPage === pagination.totalPages || isSearching}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${currentPage === pagination?.totalPages || isSearching
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


      {/* Delete Modal  */}
      {
        isDeleteModal &&
        <DeleteModal onClose={() => setIsDeleteModal(false)} onDelete={deletePlace} itemName={deletePlaceDetails?.placeName} confirmText={deletePlaceDetails?.placeName} />
      }
    </div>
  );
}

export default Places;