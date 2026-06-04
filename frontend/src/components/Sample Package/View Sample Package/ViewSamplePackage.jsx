

// ─────────────────────────────────────────────────────────────────────────────
// ViewSamplePackage.jsx  — main page (replace the stub)
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useSamplePackageHooks } from '../../../hooks/useSamplePackageHooks';
import StepperTab from '../../Group Trips/Edit Group Trip/StepperTab';
import ViewItineraryBuilder from './ViewItineraryBuilder';
import GroupTripPolicies from '../../Group Trips/Add Group Trip/GroupTripPolicies';
import ViewRegionSamplePackage from './ViewRegionSamplePackage';
const BLUE = '#18305C';
const PINK = '#ED5F8D';

function ViewSamplePackage() {
    const { samplePackageId } = useParams();
    const navigate = useNavigate();
    const { getSamplePackageById, deleteSamplePackage } = useSamplePackageHooks();
    const isProduction = useSelector(s => s.user.isProduction);
    const data = useSelector(s => s.samplePackage.samplePackageById?.[samplePackageId]);

    const [fetchLoading, setFetchLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(1);
    const [activeDay, setActiveDay] = useState(1);

    useEffect(() => {
        if (!samplePackageId) return;
        (async () => {
            try {
                setFetchLoading(true);
                await getSamplePackageById(samplePackageId);
            } catch (err) {
                if (!isProduction) console.error(err);
                toast.error(err?.response?.data?.message || err?.message || 'Failed to load package');
            } finally {
                setFetchLoading(false);
            }
        })();
    }, [samplePackageId]);

    const handleDelete = async () => {
        if (!window.confirm('Delete this sample package?')) return;
        try {
            setDeleteLoading(true);
            await deleteSamplePackage(samplePackageId);
            toast.success('Package deleted');
            navigate(-1);
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Delete failed');
        } finally {
            setDeleteLoading(false);
        }
    };

    const tabs = ['Basic Details', 'Itinerary Builder', 'Policies'];

    if (fetchLoading) {
        return (
            <div style={{ minHeight: '100vh', background: '#f5f6fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: '#888' }}>
                    <div style={{ width: '36px', height: '36px', border: `3px solid ${PINK}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                    <p style={{ fontSize: '14px' }}>Loading package...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const { regionDetails, itineraryBuilder, price, vendorDetails } = data;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '24px', background: '#f5f6fa', minHeight: '100vh' }}>

            {/* Page header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: '700', color: BLUE, margin: 0 }}>
                        {itineraryBuilder?.tripName || 'Sample Package'}
                    </h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#18305C] mt-1 transition-colors cursor-pointer"
                    >
                        <ArrowLeft size={15} /> Back to List
                    </button>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                        onClick={() => navigate(`/sample-packages/edit/${samplePackageId}`)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '8px 18px', borderRadius: '8px', border: 'none',
                            background: BLUE, color: 'white', fontSize: '13px',
                            fontWeight: '600', cursor: 'pointer',
                        }}
                    >
                        <Pencil size={14} /> Edit
                    </button>
                    {/* <button
                        onClick={handleDelete}
                        disabled={deleteLoading}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '8px 18px', borderRadius: '8px', border: 'none',
                            background: '#ef4444', color: 'white', fontSize: '13px',
                            fontWeight: '600', cursor: deleteLoading ? 'not-allowed' : 'pointer',
                            opacity: deleteLoading ? 0.7 : 1,
                        }}
                    >
                        <Trash2 size={14} /> {deleteLoading ? 'Deleting…' : 'Delete'}
                    </button> */}
                </div>
            </div>

            <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                Step {activeTab} of 3: {tabs[activeTab - 1]}
            </p>

            <StepperTab steps={tabs} activeStep={activeTab} onStepClick={setActiveTab} />

            {activeTab === 1 && (
                <ViewRegionSamplePackage regionDetails={regionDetails} price={price} vendorDetails={vendorDetails} />
            )}

            {activeTab === 2 && (
                <ViewItineraryBuilder
                    itineraryBuilder={itineraryBuilder}
                    regionDetails={regionDetails}
                    activeDay={activeDay}
                    setActiveDay={setActiveDay}
                    price={price}
                    vendorDetails={vendorDetails} 
                />
            )}

            {activeTab === 3 && (
                <GroupTripPolicies
                    regionId={regionDetails?.region1?._id}
                    regionName={regionDetails?.region1?.name}
                    readOnly
                />
            )}
        </div>
    );
}

export default ViewSamplePackage;



















// import React, { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'
// import { useParams } from 'react-router-dom'
// import { toast } from 'react-toastify'
// import { useSamplePackageHooks } from '../../../hooks/useSamplePackageHooks'

// function ViewSamplePackage() {

//     const {samplePackageId} = useParams()
//     const {getSamplePackageById} = useSamplePackageHooks()

//     const isProduction = useSelector(s=>s.user.isProduction)
//     const samplePackageDetails = useSelector(s=>s.samplePackage.samplePackageById?.[samplePackageId])

//     const [fetchLoading, setFetchLoading] = useState(false)
//     console.log("samplePackageDetails ",samplePackageDetails)

//     const fetchSamplePackage = async()=>{
//         try{
//             setFetchLoading(true)
//             await getSamplePackageById(samplePackageId)
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
//         if(samplePackageId){
//             fetchSamplePackage()
//         }
//     },[samplePackageId])
//   return (
//     <div>ViewSamplePackage</div>
//   )
// }

// export default ViewSamplePackage