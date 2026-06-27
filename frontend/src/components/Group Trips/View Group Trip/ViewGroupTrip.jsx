

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGroupTripHooks } from '../../../hooks/useGroupTripHooks';
import ViewGroupTripOverview from './ViewGroupTripOverview';
import { BackIcon, DownloadIcon, CopyIcon, EditIcon, ShareIcon, ChevronDown } from '../../Icons/Icons';
import SkeletonOverview from './SkeletonOverview';
import Participants from './Participants';
import ViewItineraryBuilder from './ViewItineraryBuilder';
import FinancialCloseup from './FinancialCloseup';
import GroupTripPolicies from '../Add Group Trip/GroupTripPolicies';

const PINK = '#ED5F8D';
const BLUE = '#18305C';
const GREEN = '#4CAF50';


const STATUS_CONFIG = {
    new: {
        label: 'New',
        color: '#9C27B0',        // Purple (initial state)
        bg: '#F3E5F5',
        border: '#CE93D8'
    },
    planning: {
        label: 'Planning',
        color: '#FF9800',        // Orange (preparation)
        bg: '#FFF3E0',
        border: '#FFCC80'
    },
    confirmed: {
        label: 'Confirmed',
        color: '#4CAF50',        // Green (approved)
        bg: '#E8F5E9',
        border: '#A5D6A7'
    },
    completed: {
        label: 'Completed',
        color: '#2E7D32',        // Dark green (finished)
        bg: '#E8F5E9',
        border: '#81C784'
    },
    cancelled: {
        label: 'Cancelled',
        color: '#F44336',        // Red (terminated)
        bg: '#FFEBEE',
        border: '#EF9A9A'
    },
};

const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};


// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = ['Overview', 'Itinerary Details', 'Participants', 'Policies'];

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function Skeleton({ w = '100%', h = '16px', radius = '6px' }) {
    return (
        <div style={{
            width: w, height: h, borderRadius: radius,
            background: 'linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.4s infinite',
        }} />
    );
}

const NON_EDITABLE_STATUS = ['completed', 'confirmed']



// ─── Main component ───────────────────────────────────────────────────────────
function ViewGroupTrip() {
    const { getGroupTripById, updateGroupTripStatusById } = useGroupTripHooks();
    const { groupTripId } = useParams();
    const navigate = useNavigate();

    const isProduction = useSelector(s => s.user.isProduction);
    const groupTripDetails = useSelector(s => s.groupTrip.groupTripById?.[groupTripId]);
    const groupTripSummary = useSelector(s => s.groupTrip.groupTripSummaryById?.[groupTripId]);
    const isEditable = !NON_EDITABLE_STATUS?.includes(groupTripDetails?.status)
    const [fetchLoading, setFetchLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [showStatusDrop, setShowStatusDrop] = useState(false);
    const [isFinancialPopup, setIsFinancialPopup] = useState(false)


    const fetchGroupTrip = async () => {
        try {
            setFetchLoading(true);
            await getGroupTripById(groupTripId);
        } catch (error) {
            if (!isProduction) {
                console.log('========= ERROR DEBUG START =========');
                console.log('Error:', error);
                console.log('Response:', error?.response);
                console.log('========= ERROR DEBUG END =========');
            }
            toast.error(error?.response?.data?.message || error?.message || 'Error fetching group trip');
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => { fetchGroupTrip(); }, [groupTripDetails]);

    // ── derived ───────────────────────────────────────────────────────────────
    const status = groupTripDetails?.status ?? 'new';
    const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.new;

    const fromDate = formatDate(groupTripDetails?.regionDetails?.fromDate);
    const toDate = formatDate(groupTripDetails?.regionDetails?.toDate);
    const tripName = groupTripDetails?.tripDetails?.tripName ?? groupTripDetails?.tripId ?? 'Group Trip';

    // Icon button style
    const iconBtn = {
        width: '38px', height: '38px', borderRadius: '8px',
        background: GREEN, color: 'white', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    };

    const updateStatus = async (key) => {
        try {
            setFetchLoading(true)
            const response = await updateGroupTripStatusById(key, groupTripId)
            toast.success(response?.data?.message)
            setShowStatusDrop(false)
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
        <div style={{ padding: '24px 28px', background: '#f5f6fa', minHeight: '100vh' }}>

            {/* ── Header ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>

                {/* Left: back + title + date */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <button
                            onClick={() => navigate(-1)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                        >
                            <BackIcon />
                        </button>
                        {fetchLoading
                            ? <Skeleton w="220px" h="26px" />
                            : <h1 style={{ fontSize: '22px', fontWeight: '800', color: BLUE, margin: 0 }}>{tripName}</h1>
                        }
                    </div>
                    {fetchLoading
                        ? <Skeleton w="140px" h="14px" />
                        : <p style={{ fontSize: '14px', color: '#777', margin: '0 0 0 26px' }}>{fromDate} – {toDate}</p>
                    }
                </div>

                {/* Right: status dropdown + action buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>

                    {/* Status dropdown */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowStatusDrop(p => !p)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                background: 'white', border: `1.5px solid ${statusCfg?.border||'red'}`,
                                borderRadius: '8px', padding: '8px 16px',
                                fontSize: '13px', fontWeight: '600', color: (statusCfg.color||'red'),
                                cursor: 'pointer',
                            }}
                        >
                            {statusCfg.label} <ChevronDown />
                        </button>

                        {showStatusDrop && (
                            <div style={{
                                position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 100,
                                background: 'white', border: '1px solid #eee', borderRadius: '8px',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.1)', minWidth: '170px', overflow: 'hidden',
                            }}>
                                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                                    <button
                                        key={key}
                                        value={groupTripDetails?.status}
                                        onClick={() => updateStatus(key)}
                                        style={{
                                            display: 'block', width: '100%', textAlign: 'left',
                                            padding: '10px 16px', border: 'none',
                                            background: status === key ? cfg.bg : 'white',
                                            fontSize: '13px', color: cfg.color,
                                            fontWeight: status === key ? '700' : '500',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {cfg.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Icon buttons */}
                    <button style={iconBtn} title="Download" onClick={() => toast.info('Downloading...')}>
                        <DownloadIcon />
                    </button>
                    <button style={iconBtn} title="Share" onClick={() => toast.info('Sharing...')}>
                        <ShareIcon />
                    </button>
                    <button style={iconBtn} title="Copy" onClick={() => toast.info('Copied!')}>
                        <CopyIcon />
                    </button>

                    <button
                        onClick={() => {
                            if (isEditable) {
                                navigate(`/group-trips/edit/${groupTripId}`);
                            } else {
                                alert("This trip cannot be edited in its current status.");
                            }
                        }}
                        // disabled={!isEditable}
                        title={!isEditable ? "This trip cannot be edited in its current status." : ""}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: isEditable ? GREEN : '#ccc',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '9px 18px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: isEditable ? 'pointer' : 'not-allowed',
                            opacity: isEditable ? 1 : 0.7,
                        }}
                    >
                        <EditIcon /> Edit Trip
                    </button>
                </div>
            </div>

            {/* ── Tabs ── */}
            <div style={{
                display: 'flex', gap: '0', borderBottom: '2px solid #eee',
                marginBottom: '28px',
            }}>
                {TABS.map((tab, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveTab(i)}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            padding: '10px 24px', fontSize: '15px', fontWeight: activeTab === i ? '700' : '500',
                            color: activeTab === i ? PINK : '#888',
                            borderBottom: activeTab === i ? `2.5px solid ${PINK}` : '2.5px solid transparent',
                            marginBottom: '-2px',
                            whiteSpace: 'nowrap',
                            transition: 'color 0.15s ease',
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* ── Tab content ── */}
            {activeTab === 0 && (
                fetchLoading
                    ? <SkeletonOverview />
                    : <ViewGroupTripOverview
                        groupTripDetails={groupTripDetails}
                        groupTripSummary={groupTripSummary}
                        setIsFinancialPopup={() => setIsFinancialPopup(true)}
                    />
            )}
            {activeTab === 1 && (
                <ViewItineraryBuilder
                    groupTripDetails={groupTripDetails}
                    groupTripSummary={groupTripSummary}
                />
            )}

            {activeTab === 2 && (
                <Participants />
            )}

            {activeTab === 3 && (
                <GroupTripPolicies regionId={groupTripDetails?.regionDetails?.region1?._id} regionName={groupTripDetails?.regionDetails?.region1?.name} />
            )}


            {/* Click outside status dropdown */}
            {showStatusDrop && (
                <div onClick={() => setShowStatusDrop(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />
            )}

            <style>{`
                @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
                @media (max-width: 640px) {
                    .vgt-header-right { flex-direction: column !important; align-items: flex-start !important; }
                }
            `}</style>


            {/* Add financial  */}
            {
                isFinancialPopup &&
                <FinancialCloseup groupTripSummary={groupTripSummary} isOpen={isFinancialPopup} onClose={() => setIsFinancialPopup(false)} />
            }
        </div>
    );
}

export default ViewGroupTrip;

