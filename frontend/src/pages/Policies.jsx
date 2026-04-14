

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePolicyHooks } from '../hooks/usePolicyHooks';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify'
import { useRegionHooks } from '../hooks/useRegionHooks';
import { Plus, ChevronDown, Pencil, Trash2, Save, X } from 'lucide-react';

const BLUE = "#18305C";
const PINK = "#ED5F8D";
// const PINK = "#FA3877";

const policiesTab = ["Cancellation", "Payment", "Inclusion", "Exclusion", "Things To Pack"];

function Policies() {
  const navigate = useNavigate();
  const { getPolicies,updatePolicy,deletePolicy } = usePolicyHooks();
  const { getRegionsForOrg } = useRegionHooks();

  const [regionLoading, setRegionLoading] = useState(false);
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null); // null = all / not selected
  const [activePolicyTab, setActivePolicyTab] = useState("Cancellation");

  const policies = useSelector((state) => state.policy.policiesByRegion?.[activePolicyTab]?.[selectedRegion?._id]);
  const allRegionsForSuggestions = useSelector((state) => state.user.allRegionsForSuggestions);
  const isProduction = useSelector((state) => state.user.isProduction);

  // ─── Fetch policies ───────────────────────────────────────────────────────
  const fetchPolicies = async () => {
    try {
      await getPolicies(activePolicyTab, selectedRegion?._id);
    } catch (error) {
      if (!isProduction) {
        console.log("========= ERROR DEBUG START =========");
        console.log("Error:", error);
        console.log("Response:", error?.response);
        console.log("========= ERROR DEBUG END =========");
      }
      toast.error(error?.response?.data?.message || error?.message || "Error fetching policies");
    }
  };

  useEffect(() => {
    if(selectedRegion){
        fetchPolicies();
    }
  }, [selectedRegion, activePolicyTab]);

  // ─── Fetch regions ────────────────────────────────────────────────────────
  const fetchRegionsForSuggestion = async () => {
    try {
      if (allRegionsForSuggestions && allRegionsForSuggestions?.length > 0) return;
      setRegionLoading(true);
      await getRegionsForOrg();
      setRegionLoading(false);
    } catch (error) {
      setRegionLoading(false);
      if (!isProduction) {
        console.log("========= ERROR DEBUG START =========");
        console.log("Error:", error);
        console.log("Response:", error?.response);
        console.log("========= ERROR DEBUG END =========");
      }
      toast.error(error?.response?.data?.message || error?.message || "Error fetching regions");
    }
  };

  useEffect(() => {
    if (allRegionsForSuggestions && allRegionsForSuggestions?.length > 0) return;
    fetchRegionsForSuggestion();
  }, []);


  const handleDelete =async (index, regionId) => {
    try{
        const response = await deletePolicy(regionId,index,activePolicyTab)
        toast.success(response?.data?.message)
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
   
  };

  // ─── Inline edit state ────────────────────────────────────────────────────
  const [editingIndex, setEditingIndex] = useState(null);   // which row is being edited
  const [editingValue, setEditingValue] = useState("");      // current textarea value

  const handleStartEdit = (index, currentValue) => {
    setEditingIndex(index);
    setEditingValue(currentValue);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue("");
  };

  const handleSaveEdit = async(index) => {

    try{
        const payload = {
            regionId:        regionId,
            policyCategory:  activePolicyTab,
            updatedPolicy:   editingValue?.trim(),
            updatedIndex:    index,
          };
          const response = await updatePolicy(payload)
          toast.success(response?.data?.message)
          setEditingIndex(null);
          setEditingValue("");
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

  };

  const regionName = policies?.regionId?.name || "—";
  const regionId   = policies?.regionId?._id  || policies?.regionId;
  const policyList = policies?.policies || []; // array of strings

  // Close dropdown when clicking outside
  useEffect(() => {
    const close = () => setRegionDropdownOpen(false);
    if (regionDropdownOpen) document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [regionDropdownOpen]);

  return (
    <div
      className="p-6 bg-gray-50 min-h-screen"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: BLUE }}>
          Policy Management
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage region-specific travel policies for TripKraftr
        </p>
      </div>

      {/* ── Policy Type Tabs ─────────────────────────────────────────────── */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex items-center gap-1">
          {policiesTab?.map((tab) => {
            const isActive = activePolicyTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActivePolicyTab(tab)}
                className="relative px-5 py-2.5 text-sm font-semibold rounded-t-xl transition-all"
                style={{
                  backgroundColor: isActive ? PINK : "transparent",
                  color: isActive ? "#fff" : BLUE,
                  borderBottom: isActive ? `2px solid ${PINK}` : "2px solid transparent",
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Filter Row ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        {/* Region Dropdown */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm hover:border-gray-300 transition-colors min-w-[150px] justify-between"
            style={{ color: selectedRegion ? BLUE : "#9ca3af" }}
          >
            {regionDropdownOpen && regionLoading ? (
              <span className="text-gray-400">Loading...</span>
            ) : (
              <span>{selectedRegion?.name || "Region"}</span>
            )}
            <ChevronDown
              size={16}
              className="text-gray-400 transition-transform"
              style={{ transform: regionDropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>

          {regionDropdownOpen && (
            <div
              className="absolute top-full mt-1.5 left-0 bg-white border border-gray-200 rounded-xl shadow-lg z-30 min-w-[160px] overflow-hidden"
              style={{ boxShadow: "0 8px 24px rgba(24,48,92,0.12)" }}
            >
              {/* All option */}
              <button
                onClick={() => { setSelectedRegion(null); setRegionDropdownOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                style={{
                  color: !selectedRegion ? PINK : BLUE,
                  fontWeight: !selectedRegion ? 600 : 400,
                  backgroundColor: !selectedRegion ? "#fff0f5" : "transparent",
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fff0f5"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = !selectedRegion ? "#fff0f5" : "transparent"}
              >
                All Regions
              </button>
              {allRegionsForSuggestions?.map((r) => (
                <button
                  key={r?._id}
                  onClick={() => { setSelectedRegion(r); setRegionDropdownOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                  style={{
                    color: selectedRegion?._id === r?._id ? PINK : BLUE,
                    fontWeight: selectedRegion?._id === r?._id ? 600 : 400,
                    backgroundColor: selectedRegion?._id === r?._id ? "#fff0f5" : "transparent",
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fff0f5"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = selectedRegion?._id === r?._id ? "#fff0f5" : "transparent"}
                >
                  {r?.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Add Policy Button */}
        <button
          onClick={() => navigate("add-policy")}
          className="flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-xl transition-all hover:opacity-90"
          style={{
            backgroundColor: PINK,
            boxShadow: "0 4px 14px rgba(250,56,119,0.30)"
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
          {activePolicyTab !=="Things To Pack"?"Add Policy":"Add Things"}
        </button>
      </div>

      {/* ── Table Card ───────────────────────────────────────────────────── */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 4px 24px rgba(24,48,92,0.10)" }}
      >
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          {/* Table Header */}
          <thead>
            <tr style={{ backgroundColor: "#f5f7fa" }}>
              <th
                className="text-left px-6 py-4 text-sm font-bold"
                style={{ color: BLUE, width: "22%" }}
              >
                Region Name
              </th>
              <th
                className="text-left px-6 py-4 text-sm font-bold"
                style={{
                  color: BLUE,
                  borderLeft: "1.5px solid #e5e7eb",
                  width: "62%"
                }}
              >
                {activePolicyTab !=="Things To Pack"?"Policies":"Things To Pack"}
              </th>
              <th
                className="text-right px-6 py-4 text-sm font-bold"
                style={{ color: BLUE, width: "16%" }}
              >
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {policies && policyList?.length > 0 ? (
              policyList?.map((policy, pIdx) => {
                const isEditing = editingIndex === pIdx;
                return (
                  <tr
                    key={pIdx}
                    style={{ borderTop: "1px solid #f0f2f5" }}
                    onMouseEnter={e => { if (!isEditing) e.currentTarget.style.backgroundColor = "#fafbff"; }}
                    onMouseLeave={e => { if (!isEditing) e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    {/* Region Name — rendered ONLY on the first row, spans all rows */}
                    {pIdx === 0 && (
                      <td
                        rowSpan={policyList?.length}
                        className="px-6 text-sm font-bold"
                        style={{
                          color: BLUE,
                          verticalAlign: "middle",
                          textAlign: "center",
                          width: "22%",
                        }}
                      >
                        {regionName}
                      </td>
                    )}

                    {/* Policy text / inline edit textarea */}
                    <td
                      className="px-6 py-3 text-sm"
                      style={{ borderLeft: "1.5px solid #e5e7eb", width: "62%" }}
                    >
                      {isEditing ? (
                        <textarea
                          autoFocus
                          rows={2}
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2"
                          style={{
                            color: BLUE,
                            borderColor: PINK,
                            boxShadow: `0 0 0 2px rgba(250,56,119,0.15)`,
                          }}
                        />
                      ) : (
                        <span className="text-gray-500">{policy}</span>
                      )}
                    </td>

                    {/* Actions — swap to Save/Cancel when editing */}
                    <td className="px-6 py-3" style={{ width: "16%" }}>
                      <div className="flex items-center justify-end gap-2">
                        {isEditing ? (
                          <>
                            {/* Save */}
                            <button
                              onClick={() => handleSaveEdit(pIdx)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
                              style={{ backgroundColor: PINK }}
                              title="Save"
                            >
                              <Save size={13} />
                              Save
                            </button>
                            {/* Cancel */}
                            <button
                              onClick={handleCancelEdit}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors"
                              title="Cancel"
                            >
                              <X size={13} />
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            {/* Edit */}
                            <button
                              onClick={() => handleStartEdit(pIdx, policy)}
                              className="p-1.5 rounded-lg transition-colors"
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fff0f5"}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                              title="Edit"
                            >
                              <Pencil size={15} color={PINK} />
                            </button>
                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(pIdx, regionId)}
                              className="p-1.5 rounded-lg transition-colors"
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fff0f5"}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                              title="Delete"
                            >
                              <Trash2 size={15} color={PINK} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              /* Empty state */
              <tr>
                <td colSpan={3}>
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#fff0f5" }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={PINK} strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    {
                        selectedRegion ?
                        <>  
                            <p className="text-sm font-semibold" style={{ color: BLUE }}>No policies found</p>
                            <p className="text-xs text-gray-400">
                            {selectedRegion
                                ? `No ${activePolicyTab} policies for ${selectedRegion?.name}`
                                : `No ${activePolicyTab} policies yet. Add one to get started.`}
                            </p>
                            <button
                            onClick={() => navigate("add-policy")}
                            className="mt-1 flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
                            style={{ backgroundColor: PINK }}
                            >
                            <Plus size={13} />
                            Add Policy
                            </button>
                        </>:
                        <>
                            <p className="text-sm font-semibold" style={{ color: BLUE }}>Select a Region First</p>
                            <p className="text-xs text-gray-400">No Region select for policies</p>
                        </>
                    }
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Policies;




















// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { usePolicyHooks } from '../hooks/usePolicyHooks';
// import { useSelector } from 'react-redux';
// import { toast } from 'react-toastify'
// import { useRegionHooks } from '../hooks/useRegionHooks';
// import { Plus, ChevronDown, Pencil, Trash2 } from 'lucide-react';

// const BLUE = "#18305C";
// const PINK = "#FA3877";

// const policiesTab = ["Cancellation", "Payment", "Inclusion", "Exclusion", "Things To Pack"];

// function Policies() {
//   const navigate = useNavigate();
//   const { getPolicies } = usePolicyHooks();
//   const { getRegionsForOrg } = useRegionHooks();

//   const [regionLoading, setRegionLoading] = useState(false);
//   const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
//   const [selectedRegion, setSelectedRegion] = useState(null); // null = all / not selected
//   const [activePolicyTab, setActivePolicyTab] = useState("Cancellation");

//   const policies = useSelector((state) => state.policy.policiesByRegion?.[activePolicyTab]?.[selectedRegion?._id]);
//   const allRegionsForSuggestions = useSelector((state) => state.user.allRegionsForSuggestions);
//   const isProduction = useSelector((state) => state.user.isProduction);

//   // ─── Fetch policies ───────────────────────────────────────────────────────
//   const fetchPolicies = async () => {
//     try {
//       await getPolicies(activePolicyTab, selectedRegion?._id);
//     } catch (error) {
//       if (!isProduction) {
//         console.log("========= ERROR DEBUG START =========");
//         console.log("Error:", error);
//         console.log("Response:", error?.response);
//         console.log("========= ERROR DEBUG END =========");
//       }
//       toast.error(error?.response?.data?.message || error?.message || "Error fetching policies");
//     }
//   };

//   useEffect(() => {
//     if(selectedRegion){

//         fetchPolicies();
//     }
//   }, [selectedRegion, activePolicyTab]);

//   // ─── Fetch regions ────────────────────────────────────────────────────────
//   const fetchRegionsForSuggestion = async () => {
//     try {
//       if (allRegionsForSuggestions && allRegionsForSuggestions?.length > 0) return;
//       setRegionLoading(true);
//       await getRegionsForOrg();
//       setRegionLoading(false);
//     } catch (error) {
//       setRegionLoading(false);
//       if (!isProduction) {
//         console.log("========= ERROR DEBUG START =========");
//         console.log("Error:", error);
//         console.log("Response:", error?.response);
//         console.log("========= ERROR DEBUG END =========");
//       }
//       toast.error(error?.response?.data?.message || error?.message || "Error fetching regions");
//     }
//   };

//   useEffect(() => {
//     if (allRegionsForSuggestions && allRegionsForSuggestions?.length > 0) return;
//     fetchRegionsForSuggestion();
//   }, []);

//   // ─── Action handlers ──────────────────────────────────────────────────────
//   const handleEdit = (policy, regionId) => {
//     console.log("Edit policy:", policy, "regionId:", regionId);
//     // navigate(`edit-policy/${policy?._id}`)
//   };

//   const handleDelete = (policy, regionId) => {
//     console.log("Delete policy:", policy, "regionId:", regionId);
//   };

//   // ─── Derive display data ──────────────────────────────────────────────────
//   // `policies` from redux is a single object:
//   // { _id, regionId: { _id, name }, policyCategory, policies: [...strings], ... }
//   const regionName = policies?.regionId?.name || "—";
//   const regionId   = policies?.regionId?._id  || policies?.regionId;
//   const policyList = policies?.policies || []; // array of strings

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const close = () => setRegionDropdownOpen(false);
//     if (regionDropdownOpen) document.addEventListener("click", close);
//     return () => document.removeEventListener("click", close);
//   }, [regionDropdownOpen]);

//   return (
//     <div
//       className="p-6 bg-gray-50 min-h-screen"
//     >
//       {/* ── Page Header ─────────────────────────────────────────────────── */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold" style={{ color: BLUE }}>
//           Policy Management
//         </h1>
//         <p className="text-sm text-gray-400 mt-1">
//           Manage region-specific travel policies for TripKraftr
//         </p>
//       </div>

//       {/* ── Policy Type Tabs ─────────────────────────────────────────────── */}
//       <div className="border-b border-gray-200 mb-6">
//         <div className="flex items-center gap-1">
//           {policiesTab?.map((tab) => {
//             const isActive = activePolicyTab === tab;
//             return (
//               <button
//                 key={tab}
//                 onClick={() => setActivePolicyTab(tab)}
//                 className="relative px-5 py-2.5 text-sm font-semibold rounded-t-xl transition-all"
//                 style={{
//                   backgroundColor: isActive ? PINK : "transparent",
//                   color: isActive ? "#fff" : BLUE,
//                   borderBottom: isActive ? `2px solid ${PINK}` : "2px solid transparent",
//                 }}
//               >
//                 {tab}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* ── Filter Row ───────────────────────────────────────────────────── */}
//       <div className="flex items-center justify-between mb-5">
//         {/* Region Dropdown */}
//         <div className="relative" onClick={(e) => e.stopPropagation()}>
//           <button
//             onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}
//             className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm hover:border-gray-300 transition-colors min-w-[150px] justify-between"
//             style={{ color: selectedRegion ? BLUE : "#9ca3af" }}
//           >
//             {regionDropdownOpen && regionLoading ? (
//               <span className="text-gray-400">Loading...</span>
//             ) : (
//               <span>{selectedRegion?.name || "Region"}</span>
//             )}
//             <ChevronDown
//               size={16}
//               className="text-gray-400 transition-transform"
//               style={{ transform: regionDropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
//             />
//           </button>

//           {regionDropdownOpen && (
//             <div
//               className="absolute top-full mt-1.5 left-0 bg-white border border-gray-200 rounded-xl shadow-lg z-30 min-w-[160px] overflow-hidden"
//               style={{ boxShadow: "0 8px 24px rgba(24,48,92,0.12)" }}
//             >
//               {/* All option */}
//               <button
//                 onClick={() => { setSelectedRegion(null); setRegionDropdownOpen(false); }}
//                 className="w-full text-left px-4 py-2.5 text-sm transition-colors"
//                 style={{
//                   color: !selectedRegion ? PINK : BLUE,
//                   fontWeight: !selectedRegion ? 600 : 400,
//                   backgroundColor: !selectedRegion ? "#fff0f5" : "transparent",
//                 }}
//                 onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fff0f5"}
//                 onMouseLeave={e => e.currentTarget.style.backgroundColor = !selectedRegion ? "#fff0f5" : "transparent"}
//               >
//                 All Regions
//               </button>
//               {allRegionsForSuggestions?.map((r) => (
//                 <button
//                   key={r?._id}
//                   onClick={() => { setSelectedRegion(r); setRegionDropdownOpen(false); }}
//                   className="w-full text-left px-4 py-2.5 text-sm transition-colors"
//                   style={{
//                     color: selectedRegion?._id === r?._id ? PINK : BLUE,
//                     fontWeight: selectedRegion?._id === r?._id ? 600 : 400,
//                     backgroundColor: selectedRegion?._id === r?._id ? "#fff0f5" : "transparent",
//                   }}
//                   onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fff0f5"}
//                   onMouseLeave={e => e.currentTarget.style.backgroundColor = selectedRegion?._id === r?._id ? "#fff0f5" : "transparent"}
//                 >
//                   {r?.name}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Add Policy Button */}
//         <button
//           onClick={() => navigate("add-policy")}
//           className="flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-xl transition-all hover:opacity-90"
//           style={{
//             backgroundColor: PINK,
//             boxShadow: "0 4px 14px rgba(250,56,119,0.30)"
//           }}
//         >
//           <Plus size={16} strokeWidth={2.5} />
//           Add Policy
//         </button>
//       </div>

//       {/* ── Table Card ───────────────────────────────────────────────────── */}
//       <div
//         className="bg-white rounded-2xl overflow-hidden"
//         style={{ boxShadow: "0 4px 24px rgba(24,48,92,0.10)" }}
//       >
//         <table className="w-full" style={{ borderCollapse: "collapse" }}>
//           {/* Table Header */}
//           <thead>
//             <tr style={{ backgroundColor: "#f5f7fa" }}>
//               <th
//                 className="text-left px-6 py-4 text-sm font-bold"
//                 style={{ color: BLUE, width: "22%" }}
//               >
//                 Region Name
//               </th>
//               <th
//                 className="text-left px-6 py-4 text-sm font-bold"
//                 style={{
//                   color: BLUE,
//                   borderLeft: "1.5px solid #e5e7eb",
//                   width: "62%"
//                 }}
//               >
//                 Policies
//               </th>
//               <th
//                 className="text-right px-6 py-4 text-sm font-bold"
//                 style={{ color: BLUE, width: "16%" }}
//               >
//                 Actions
//               </th>
//             </tr>
//           </thead>

//           {/* Table Body */}
//           <tbody>
//             {policies && policyList?.length > 0 ? (
//               // Each policy string gets its own row.
//               // Region Name cell uses rowSpan to span all rows — centered vertically.
//               policyList?.map((policy, pIdx) => (
//                 <tr
//                   key={pIdx}
//                   style={{ borderTop: "1px solid #f0f2f5" }}
//                   onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fafbff"}
//                   onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
//                 >
//                   {/* Region Name — rendered ONLY on the first row, spans all rows */}
//                   {pIdx === 0 && (
//                     <td
//                       rowSpan={policyList?.length}
//                       className="px-6 text-sm font-bold"
//                       style={{
//                         color: BLUE,
//                         verticalAlign: "middle",
//                         textAlign: "center",
//                         width: "22%",
//                       }}
//                     >
//                       {regionName}
//                     </td>
//                   )}

//                   {/* Policy text */}
//                   <td
//                     className="px-6 py-4 text-sm text-gray-500"
//                     style={{ borderLeft: "1.5px solid #e5e7eb", width: "62%" }}
//                   >
//                     {policy}
//                   </td>

//                   {/* Actions */}
//                   <td className="px-6 py-4" style={{ width: "16%" }}>
//                     <div className="flex items-center justify-end gap-2">
//                       <button
//                         onClick={() => handleEdit(policy, regionId)}
//                         className="p-1.5 rounded-lg transition-colors"
//                         onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fff0f5"}
//                         onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
//                       >
//                         <Pencil size={15} color={PINK} />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(policy, regionId)}
//                         className="p-1.5 rounded-lg transition-colors"
//                         onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fff0f5"}
//                         onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
//                       >
//                         <Trash2 size={15} color={PINK} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               /* Empty state */
//               <tr>
//                 <td colSpan={3}>
//                   <div className="flex flex-col items-center justify-center py-16 gap-3">
//                     <div
//                       className="w-12 h-12 rounded-full flex items-center justify-center"
//                       style={{ backgroundColor: "#fff0f5" }}
//                     >
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={PINK} strokeWidth={1.8}>
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                       </svg>
//                     </div>
//                     {
//                         selectedRegion ? 
//                         <>
//                             <p className="text-sm font-semibold" style={{ color: BLUE }}>No policies found</p>
//                             <p className="text-xs text-gray-400">
//                             {selectedRegion
//                                 ? `No ${activePolicyTab} policies for ${selectedRegion?.name}`
//                                 : `No ${activePolicyTab} policies yet. Add one to get started.`}
//                             </p>
//                             <button
//                             onClick={() => navigate("add-policy")}
//                             className="mt-1 flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
//                             style={{ backgroundColor: PINK }}
//                             >
//                             <Plus size={13} />
//                             Add Policy
//                             </button>
//                         </>:
//                         <>
//                         <p className="text-sm font-semibold" style={{ color: BLUE }}>Select a Region First</p>
//                             <p className="text-xs text-gray-400">No Region select for policies</p></>
//                     }

//                   </div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default Policies;
















// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { usePolicyHooks } from '../hooks/usePolicyHooks';
// import { useSelector } from 'react-redux';
// import {toast} from 'react-toastify'
// import { useRegionHooks } from '../hooks/useRegionHooks';
// function Policies() {

//     const navigate = useNavigate();

//     const {getPolicies} = usePolicyHooks()
//     const {getRegionsForOrg} = useRegionHooks()

    
//     const policiesTab = ["Cancellation", "Payment","Inclusion","Exclusion","Things To Pack"]
    
//     const [regionLoading, setRegionLoading] = useState(false)
//     const [selectedRegion, setSelectedRegion] = useState("Select Region")
//     const [actionPolicyTab, setActivePolicyTab] = useState("Exclusion")


//     const policies = useSelector((state)=>state.policy.policiesByRegion?.[actionPolicyTab]?.[selectedRegion?._id])
//     const allRegionsForSuggestions = useSelector((state)=>state.user.allRegionsForSuggestions)
//     const isProduction = useSelector((state)=>state.user.isProduction)
//     console.log("policies : ",policies)

//     const fetchPolicies = async()=>{
//         try{
//             await getPolicies(actionPolicyTab,selectedRegion?._id)
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

//     }

//     useEffect(()=>{
//         fetchPolicies()
//     },[selectedRegion, actionPolicyTab])

//         // ─── Fetch regions ────────────────────────────────────────────────────────
//         const fetchRegionsForSuggestion = async () => {
//             try {
//                 if (allRegionsForSuggestions && allRegionsForSuggestions?.length > 0) return;
//                 setRegionLoading(true);
//                 await getRegionsForOrg();
//                 setRegionLoading(false);
//             } catch (error) {
//                 setRegionLoading(false);
//                 if (!isProduction) {
//                     console.log("========= ERROR DEBUG START =========");
//                     console.log("Error:", error);
//                     console.log("Response:", error?.response);
//                     console.log("========= ERROR DEBUG END =========");
//                 }
//                 toast.error(
//                     error?.response?.data?.message ||
//                     error?.message ||
//                     "Error fetching regions"
//                 );
//             }
//         };
    
//         useEffect(() => {
//             if (allRegionsForSuggestions && allRegionsForSuggestions?.length > 0) return;
//             fetchRegionsForSuggestion();
//         }, []);


//   return (
//     <div>Policies
//         <button onClick={()=>navigate("add-policy")} className='px-4 py-2font-semibold text-white bg-blue-400 rounded-lg'>Add Policy </button>
//     </div>
//   )
// }

// export default Policies