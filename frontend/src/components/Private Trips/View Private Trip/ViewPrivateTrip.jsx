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
import DaysDetails from './DaysDetails'
import PriceSection from '../Add Private Trip/PriceSection'
import { isAllDayValid } from '../../Sample Package/Add Sample Package/ValidationSimplePackage'
import { ShareIcon } from "../../Icons/Icons"
import ShareModal from '../../Share/ShareModal'
const PINK = '#ED5F8D';
const BLUE = '#18305C';
const GREEN = '#4CAF50';
const iconBtn = {
    width: '38px', height: '38px', borderRadius: '8px',
    background: GREEN, color: 'white', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
};
const STATUS_CONFIG = [
    {
        value: "created",
        label: "Created",
        color: "#F59E0B",
        bgColor: "#FEF3C7",
    },
    {
        value: "confirmed",
        label: "Confirmed",
        color: "#16A34A",
        bgColor: "#DCFCE7",
    },
    {
        value: "completed",
        label: "Completed",
        color: "#2563EB",     // Blue 600
        bgColor: "#DBEAFE",   // Blue 100
    },
    {
        value: "cancelled",
        label: "Cancelled",
        color: "#DC2626",
        bgColor: "#FEE2E2",
    },
];

function ViewPrivateTrip() {
    const { privateTripId } = useParams()
    const navigate = useNavigate()
    const { getPrivateTripById, updatePrivateTripStatus } = usePrivateTripHooks()

    const isProduction = useSelector(s => s.user.isProduction)
    const privateTripDetails = useSelector(s => s.privateTrip.privateTripById?.[privateTripId])
    const [isShare, setIsShare] = useState(false)

    const [status, setStatus] = useState(
        privateTripDetails?.status || "created"
    );

    const selectedStatus = STATUS_CONFIG.find(
        (item) => item.value === privateTripDetails?.status
    );

    const [fetchLoading, setFetchLoading] = useState(false)
    const [activeTab, setActiveTab] = useState(1);


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

    const tabs = ['Day Details', 'Policy', 'Guest Payment', 'P & L', 'Vendor Payment'];

    const changeStatus = async (val) => {
        if (val === 'confirmed' || val === 'completed') {
            const checkAllDayValid = isAllDayValid(privateTripDetails)
            if (!checkAllDayValid?.success) {
                return toast.warn(checkAllDayValid.message || "Error")
            }
        }
        try {
            setFetchLoading(true)
            if (val === status) return
            setStatus(val)
            const response = await updatePrivateTripStatus(privateTripId, val)
            toast.success(response?.data?.message)
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '24px', background: '#f5f6fa', minHeight: '100vh' }}>

            {/* Page header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '700', color: BLUE, margin: 0 }}>
                        {privateTripDetails?.itineraryBuilder?.tripName || 'Private Trip'}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                        <p className="text-sm text-gray-600">
                            {privateTripDetails?.privateTripId || "Private Trip"}
                        </p>

                        <select
                            value={privateTripDetails?.status}
                            onChange={(e) => changeStatus(e.target.value)}
                            className="rounded-lg border border-gray-300 px-2 py-1 text-sm font-medium outline-none transition "
                            style={{
                                color: selectedStatus?.color,
                                // backgroundColor: selectedStatus?.bgColor,
                            }}
                        >
                            {STATUS_CONFIG.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
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

                    <button style={iconBtn} title="Share" onClick={() => setIsShare(true)}>
                        <ShareIcon />
                    </button>
                </div>
            </div>

            <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                Step {activeTab} of 5: {tabs[activeTab - 1]}
            </p>

            <StepperTab steps={tabs} activeStep={activeTab} onStepClick={setActiveTab} />


            {activeTab === 1 && (
                <DaysDetails />
            )}

            {activeTab === 2 && (
                <div
                    style={{
                        display: "flex",
                        gap: "20px",
                        alignItems: "flex-start",
                    }}
                >
                    <div style={{ flex: 1, minWidth: 0 }}>  {/* ← add minWidth: 0 */}
                        <GroupTripPolicies
                            regionId={privateTripDetails?.regionDetails?.region1?._id}
                            regionName={privateTripDetails?.regionDetails?.region1?.name}
                            readOnly
                        />
                    </div>

                    <PriceSection
                        price={privateTripDetails?.price}
                        noOfDays={privateTripDetails?.regionDetails?.noOfDays || 3}
                        isEditable={false}
                    />
                </div>
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

            {/* Share */}
            {
                isShare && 
                <ShareModal onClose={()=>setIsShare(false)} data={privateTripDetails} tripType='privateTrip'/>
            }


        </div>
    )
}

export default ViewPrivateTrip