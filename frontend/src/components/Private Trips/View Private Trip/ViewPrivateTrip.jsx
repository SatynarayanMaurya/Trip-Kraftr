import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { usePrivateTripHooks } from '../../../hooks/usePrivateTripHooks'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import StepperTab from '../../Group Trips/Edit Group Trip/StepperTab'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import GroupTripPolicies from '../../Group Trips/Add Group Trip/GroupTripPolicies'
import GuestPayment from './GuestPayment'
import ProfitAndLoss from './ProfitAndLoss'
import VendorPayment from './VendorPayment'
const BLUE = '#18305C';
const PINK = '#ED5F8D';



function ViewPrivateTrip() {
    const { privateTripId } = useParams()
    const navigate = useNavigate()
    const { getPrivateTripById } = usePrivateTripHooks()

    const isProduction = useSelector(s => s.user.isProduction)
    const privateTripDetails = useSelector(s => s.privateTrip.privateTripById?.[privateTripId])
    


    const [fetchLoading, setFetchLoading] = useState(false)
    const [activeTab, setActiveTab] = useState(4);

    // console.log("privateTripDetails", privateTripDetails)
    // console.log("privateTripFinanceDetails", privateTripFinanceDetails)

    const fetchPrivateTrip = async () => {
        try {
            setFetchLoading(true)
            await getPrivateTripById(privateTripId)
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
        if (privateTripId && !privateTripDetails) {
            fetchPrivateTrip()
        }
    }, [privateTripId])

    const tabs = ['Day Details', 'Policy', 'Guest Payment', 'P & L','Vendor Payment'];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '24px', background: '#f5f6fa', minHeight: '100vh' }}>

            {/* Page header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: '700', color: BLUE, margin: 0 }}>
                        {privateTripDetails?.itineraryBuilder?.tripName || 'Private Trip'}
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
                        onClick={() => navigate(`/private-trips/edit/${privateTripId}`)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '8px 18px', borderRadius: '8px', border: 'none',
                            background: BLUE, color: 'white', fontSize: '13px',
                            fontWeight: '600', cursor: 'pointer',
                        }}
                    >
                        <Pencil size={14} /> Edit
                    </button>
                </div>
            </div>

            <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                Step {activeTab} of 3: {tabs[activeTab - 1]}
            </p>

            <StepperTab steps={tabs} activeStep={activeTab} onStepClick={setActiveTab} />

            {activeTab === 2 && (
                <GroupTripPolicies
                    regionId={privateTripDetails?.regionDetails?.region1?._id}
                    regionName={privateTripDetails?.regionDetails?.region1?.name}
                    readOnly
                />
            )}

            {activeTab === 3 && (
                <GuestPayment />
            )}

            {activeTab === 4 && (
                <ProfitAndLoss />
            )}

            {activeTab === 5 && (
                <VendorPayment />
            )}


        </div>
    )
}

export default ViewPrivateTrip