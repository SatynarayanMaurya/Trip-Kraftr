import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { usePolicyHooks } from '../../../hooks/usePolicyHooks';
import { toast } from 'react-toastify';

const PINK = '#ED5F8D';
const BLUE = '#18305C';

function GroupTripPolicies({ regionId, regionName }) {
    const { getPolicies } = usePolicyHooks()
    const tabs = ["Cancellation", "Payment", "Inclusion", "Exclusion", "Things To Pack"];
    const [activeTab, setActiveTab] = useState(1)

    const tabClick = (i) => { setActiveTab(i + 1) }

    const activeTabPolicy = useSelector((state) =>
        state.policy.policiesByRegion?.[tabs?.[activeTab - 1]]?.[regionId]
    )

    const isProduction = useSelector((state) => state.user.isProduction);

    const fetchPolicies = async () => {
        try {
            await getPolicies(tabs?.[activeTab - 1], regionId);
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
        if (regionId) {
            if (!activeTabPolicy) {
                fetchPolicies();
            }
        }
    }, [regionId, activeTab]);

    return (
        <div style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}>
            {/* Tab Bar */}
            <div style={{
                display: 'flex',
                background: '#EEF0F5',
                borderRadius: '10px',
                padding: '4px',
                marginTop: '1rem',
                marginBottom: '8px',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
            }}>
                {tabs.map((label, i) => (
                    <button
                        key={i}
                        onClick={() => tabClick(i)}
                        style={{
                            flex: '0 0 auto',
                            minWidth: '110px',
                            padding: '10px 16px',
                            textAlign: 'center',
                            fontSize: '14px',
                            fontWeight: activeTab === i + 1 ? '600' : '400',
                            cursor: 'pointer',
                            background: activeTab === i + 1 ? PINK : 'transparent',
                            border: 'none',
                            color: activeTab === i + 1 ? 'white' : '#666',
                            borderRadius: '8px',
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Region Button */}
            <button className="inline-flex items-center gap-2 px-4 py-2 my-4 rounded-full bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 text-sm font-medium shadow-sm">
                <span className="text-base">📍</span>
                {regionName || "Unknown Region"}
            </button>

            {/* Policies Table */}
            {activeTabPolicy?.policies?.length > 0 ? (
                <div style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    marginTop: '8px',
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                }}>
                    <div style={{
                        background: '#EEF0F5',
                        padding: '12px 16px',
                        fontWeight: '600',
                        fontSize: '15px',
                        color: BLUE,
                        textAlign: 'center',
                    }}>
                        Policies
                    </div>
                    {/* No whitespace between <table> and <tbody> to avoid hydration warning */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}><tbody>
                        {activeTabPolicy.policies.map((policy, index) => (
                            <tr key={index} style={{ borderTop: '1px dashed #d1d5db' }}>
                                <td style={{
                                    padding: '14px 16px',
                                    width: '48px',
                                    color: '#6b7280',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    verticalAlign: 'top',
                                    borderRight: '1px dashed #d1d5db',
                                }}>
                                    {index + 1}
                                </td>
                                <td style={{
                                    padding: '14px 16px',
                                    fontSize: '14px',
                                    color: '#374151',
                                    verticalAlign: 'top',
                                    wordBreak: 'break-word',
                                }}>
                                    {policy}
                                </td>
                            </tr>
                        ))}
                    </tbody></table>
                </div>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '24px',
                    color: '#9ca3af',
                    fontSize: '14px',
                }}>
                    No policies available for this category.
                </div>
            )}
        </div>
    )
}

export default GroupTripPolicies
















// import React, { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux';
// import { usePolicyHooks } from '../../../hooks/usePolicyHooks';
// import { toast } from 'react-toastify';

// const PINK = '#ED5F8D';
// const BLUE = '#18305C';

// function GroupTripPolicies({ regionId ,regionName}) {
//     const { getPolicies } = usePolicyHooks()
//     const tabs = ["Cancellation", "Payment", "Inclusion", "Exclusion", "Things To Pack"];
//     const [activeTab, setActiveTab] = useState(1)

//     const tabClick = (i) => {
//         setActiveTab(i + 1)
//     }

//     const activeTabPolicy = useSelector((state) =>
//         state.policy.policiesByRegion?.[tabs?.[activeTab - 1]]?.[regionId]
//     )

//     const isProduction = useSelector((state) => state.user.isProduction);

//     const fetchPolicies = async () => {
//         try {
//             await getPolicies(tabs?.[activeTab - 1], regionId);
//         } catch (error) {
//             if (!isProduction) {
//                 console.log("========= ERROR DEBUG START =========");
//                 console.log("Error:", error);
//                 console.log("Response:", error?.response);
//                 console.log("========= ERROR DEBUG END =========");
//             }
//             toast.error(error?.response?.data?.message || error?.message || "Error fetching policies");
//         }
//     };

//     useEffect(() => {
//         if (regionId) {
//             if (!activeTabPolicy) {
//                 fetchPolicies();
//             }
//         }
//     }, [regionId, activeTab]);

//     return (
//         <div>
//             {/* Tab Bar */}
//             <div style={{
//                 display: 'flex', background: '#EEF0F5', borderRadius: '10px',
//                 padding: '4px', marginTop: '1rem', marginBottom: '8px'
//             }}>
//                 {tabs.map((label, i) => (
//                     <button
//                         key={i}
//                         onClick={() => tabClick(i)}
//                         style={{
//                             flex: 1, padding: '10px 16px', textAlign: 'center',
//                             fontSize: '14px', fontWeight: activeTab === i + 1 ? '600' : '400',
//                             cursor: 'pointer',
//                             background: activeTab === i + 1 ? PINK : 'transparent',
//                             border: 'none',
//                             color: activeTab === i + 1 ? 'white' : '#666',
//                             borderRadius: '8px', transition: 'all 0.2s ease',
//                         }}
//                     >
//                         {label}
//                     </button>
//                 ))}
//             </div>

//             {/* Region Button */}
//             <button className="inline-flex items-center gap-2 px-4 py-2 my-4 rounded-full 
//                 bg-blue-50 text-blue-700 border border-blue-200 
//                 hover:bg-blue-100 hover:border-blue-300 
//                 transition-all duration-200 text-sm font-medium shadow-sm">
                
//                 {/* Optional icon */}
//                 <span className="text-base">📍</span>

//                 {/* {activeTabPolicy?.regionId?.name || "Unknown Region"} */}
//                 {regionName || "Unknown Region"}
//             </button>

//             {/* Policies Table */}
//             {activeTabPolicy?.policies?.length > 0 ? (
//                 <div style={{
//                     border: '1px solid #e5e7eb',
//                     borderRadius: '10px',
//                     overflow: 'hidden',
//                     marginTop: '8px'
//                 }}>
//                     {/* Table Header */}
//                     <div style={{
//                         background: '#EEF0F5',
//                         padding: '12px 16px',
//                         fontWeight: '600',
//                         fontSize: '15px',
//                         color: BLUE,
//                         textAlign: 'center'
//                     }}>
//                         Policies
//                     </div>

//                     {/* Table Rows */}
//                     <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                         <tbody>
//                             {activeTabPolicy.policies.map((policy, index) => (
//                                 <tr
//                                     key={index}
//                                     style={{
//                                         borderTop: '1px dashed #d1d5db',
//                                     }}
//                                 >
//                                     <td style={{
//                                         padding: '14px 16px',
//                                         width: '48px',
//                                         color: '#6b7280',
//                                         fontSize: '14px',
//                                         fontWeight: '500',
//                                         verticalAlign: 'top',
//                                         borderRight: '1px dashed #d1d5db'
//                                     }}>
//                                         {index + 1}
//                                     </td>
//                                     <td style={{
//                                         padding: '14px 16px',
//                                         fontSize: '14px',
//                                         color: '#374151',
//                                         verticalAlign: 'top'
//                                     }}>
//                                         {policy}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 <div style={{
//                     textAlign: 'center', padding: '24px',
//                     color: '#9ca3af', fontSize: '14px'
//                 }}>
//                     No policies available for this category.
//                 </div>
//             )}
//         </div>
//     )
// }

// export default GroupTripPolicies
