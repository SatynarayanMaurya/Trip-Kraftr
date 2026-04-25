

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

const PINK = '#ED5F8D';
const BLUE = '#18305C';
const GREEN = '#4CAF50';

// ─── status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    confirmed: { label: 'Trip Confirmed', color: GREEN, bg: '#E8F5E9', border: '#A5D6A7' },
    planning: { label: 'Planning', color: '#FF9800', bg: '#FFF3E0', border: '#FFCC80' },
    created: { label: 'Created', color: PINK, bg: '#FFDDE6', border: '#F48FB1' },
};

const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};


// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = ['Overview', 'Itinerary Details', 'Participants'];

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

// ─── Main component ───────────────────────────────────────────────────────────
function ViewGroupTrip() {
    const { getGroupTripById } = useGroupTripHooks();
    const { groupTripId } = useParams();
    const navigate = useNavigate();

    const isProduction = useSelector(s => s.user.isProduction);
    const groupTripDetails = useSelector(s => s.groupTrip.groupTripById?.[groupTripId]);
    const groupTripSummary = useSelector(s => s.groupTrip.groupTripSummaryById?.[groupTripId]);

    const [fetchLoading, setFetchLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [showStatusDrop, setShowStatusDrop] = useState(false);

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

    useEffect(() => { fetchGroupTrip(); }, []);

    // ── derived ───────────────────────────────────────────────────────────────
    const status = groupTripDetails?.status?.toLowerCase() ?? 'created';
    const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.created;

    const fromDate = formatDate(groupTripDetails?.regionDetails?.fromDate);
    const toDate = formatDate(groupTripDetails?.regionDetails?.toDate);
    const tripName = groupTripDetails?.tripDetails?.tripName ?? groupTripDetails?.tripId ?? 'Group Trip';

    // Icon button style
    const iconBtn = {
        width: '38px', height: '38px', borderRadius: '8px',
        background: GREEN, color: 'white', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    };

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
                                background: 'white', border: `1.5px solid ${statusCfg.border}`,
                                borderRadius: '8px', padding: '8px 16px',
                                fontSize: '13px', fontWeight: '600', color: statusCfg.color,
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
                                        onClick={() => { setShowStatusDrop(false); /* call update status */ }}
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

                    {/* Edit Trip */}
                    <button
                        onClick={() => navigate(`/group-trips/edit/${groupTripId}`)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: GREEN, color: 'white', border: 'none',
                            borderRadius: '8px', padding: '9px 18px',
                            fontSize: '13px', fontWeight: '600', cursor: 'pointer',
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
        </div>
    );
}

export default ViewGroupTrip;

