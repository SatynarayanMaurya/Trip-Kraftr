import React, { useState, useEffect } from 'react';
import { Lock, TrendingUp, IndianRupee, X } from 'lucide-react';
import { useGroupTripHooks } from '../../../hooks/useGroupTripHooks';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const PINK = '#ED5F8D';
const BLUE = '#18305C';

const inputStyle = {
    border: '1.5px solid #e0e0e0',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '14px',
    color: '#333',
    outline: 'none',
    width: '100%',
    background: 'white',
    boxSizing: 'border-box',
};

// ─── Rupee prefixed input ─────────────────────────────────────────────────────
function RupeeInput({ label, value, onChange, disabled }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#777' }}>{label}</label>
            <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                border: '1.5px solid #e0e0e0', borderRadius: '8px',
                padding: '0 12px', background: disabled ? '#f9f9f9' : 'white',
                transition: 'border-color 0.15s',
            }}
                onFocus={() => { }}
            >
                <IndianRupee size={14} color="#aaa" />
                <input
                    type="number"
                    placeholder='Enter your amount'
                    min={0}
                    value={value}
                    onChange={e => onChange(Number(e.target.value))}
                    disabled={disabled}
                    style={{
                        border: 'none', outline: 'none', width: '100%',
                        fontSize: '14px', color: '#333', padding: '10px 0',
                        background: 'transparent',
                    }}
                />
            </div>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────
function FinancialCloseup({ groupTripSummary, isOpen, onClose }) {

    const isProduction = useSelector((state)=>state.user.isProduction)
    const { groupTripId } = useParams();
    const {updateGroupTripSummaryById} = useGroupTripHooks()
    const closeup     = groupTripSummary?.financialCloseup   ?? {};
    const totalRevenue = groupTripSummary?.financialOverview?.totalRevenue ?? 0;

    const [hotelCost,   setHotelCost]   = useState(closeup?.totalHotelCost   ?? 0);
    const [vehicleCost, setVehicleCost] = useState(closeup?.totalVehicleCost ?? 0);
    const [otherCost,   setOtherCost]   = useState(closeup?.totalOtherCost   ?? 0);
    const [netProfit,   setNetProfit]   = useState(null);  // null = not yet calculated
    const [updating,    setUpdating]    = useState(false);

    // Sync if groupTripSummary changes
    useEffect(() => {
        setHotelCost(closeup?.totalHotelCost   ?? 0);
        setVehicleCost(closeup?.totalVehicleCost ?? 0);
        setOtherCost(closeup?.totalOtherCost   ?? 0);
        setNetProfit(null);
    }, [groupTripSummary]);

    const handleCalculate = () => {
        const totalCost = hotelCost + vehicleCost + otherCost;
        setNetProfit(totalRevenue - totalCost);
    };

    // useEffect(()=>{
    //     const totalCost = hotelCost + vehicleCost + otherCost;
    //     setNetProfit(totalRevenue - totalCost);
    // },[groupTripSummary])

    const handleUpdate =async () => {
        try{

            setUpdating(true)
            const payload = {
                totalHotelCost:   hotelCost,
                totalVehicleCost: vehicleCost,
                totalOtherCost:   otherCost,
                netProfit:        netProfit ?? (totalRevenue - hotelCost - vehicleCost - otherCost),
                _id:groupTripSummary?._id
            };
            const response = await updateGroupTripSummaryById(groupTripId,payload)
            toast.success(response?.data?.message)
            onClose()
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
            setUpdating(false)
        }
    };

    if (!isOpen) return null;

    const isNetLoss = netProfit !== null && netProfit < 0;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0, zIndex: 200,
                    background: 'rgba(0,0,0,0.35)',
                    backdropFilter: 'blur(2px)',
                }}
            />

            {/* Modal */}
            <div style={{
                position: 'fixed', zIndex: 201,
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'white', borderRadius: '14px',
                boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
                width: '90%', maxWidth: '780px',
                maxHeight: '90vh', overflowY: 'auto',
                padding: '28px',
                boxSizing: 'border-box',
            }}>

                {/* ── Header ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '16px', fontWeight: '800', color: BLUE }}>
                            Financial Close-out (Post-Trip)
                        </span>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            background: '#F5F5F5', border: '1px solid #e0e0e0',
                            borderRadius: '20px', padding: '4px 12px',
                        }}>
                            <Lock size={11} color="#999" />
                            <span style={{ fontSize: '11px', color: '#999', fontWeight: '500' }}>
                                Editable on 'Completed' Status
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                    >
                        <X size={20} color="#aaa" />
                    </button>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: '#eee', margin: '16px 0 22px' }} />

                {/* ── Content: inputs left + summary right ── */}
                <div style={{
                    display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start',
                }}>

                    {/* Left: cost inputs */}
                    <div style={{ flex: 2, minWidth: '260px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Row 1: Hotel + Vehicle */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <RupeeInput
                                label="Total Hotel Cost"
                                value={hotelCost || ''}
                                onChange={v => { setHotelCost(v); setNetProfit(null); }}
                            />
                            <RupeeInput
                                label="Total Vehicle Cost"
                                value={vehicleCost||''}
                                onChange={v => { setVehicleCost(v); setNetProfit(null); }}
                            />
                        </div>

                        {/* Row 2: Other + Calculate button */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'flex-end' }}>
                            <RupeeInput
                                label="Other Costs"
                                value={otherCost || ''}
                                onChange={v => { setOtherCost(v); setNetProfit(null); }}
                            />
                            <button
                                onClick={handleCalculate}
                                style={{
                                    border: `1.5px solid ${BLUE}`,
                                    background: 'white', color: BLUE,
                                    borderRadius: '8px', padding: '11px 16px',
                                    fontSize: '13px', fontWeight: '700',
                                    cursor: 'pointer', whiteSpace: 'nowrap',
                                    transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = BLUE; e.currentTarget.style.color = 'white'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = BLUE; }}
                            >
                                Calculate Net P/L
                            </button>
                        </div>

                        {/* Update button */}
                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '4px' }}>
                            <button
                                onClick={handleUpdate}
                                disabled={updating}
                                style={{
                                    background: PINK, color: 'white',
                                    border: 'none', borderRadius: '8px',
                                    padding: '10px 26px', fontSize: '14px',
                                    fontWeight: '600', cursor: updating ? 'not-allowed' : 'pointer',
                                    opacity: updating ? 0.7 : 1,
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    transition: 'opacity 0.15s',
                                }}
                            >
                                {updating ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </div>

                    {/* Right: Profit / Loss summary panel */}
                    <div style={{
                        flex: 1, minWidth: '200px',
                        background: '#F5F7FA', borderRadius: '12px',
                        padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px',
                    }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: BLUE }}>
                            Profit / Loss Summary
                        </span>

                        {/* Total Revenue row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', color: '#666' }}>Total Revenue</span>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: BLUE }}>
                                {totalRevenue.toLocaleString()}
                            </span>
                        </div>

                        {/* Divider */}
                        <div style={{ height: '1px', background: '#e0e0e0' }} />

                        {/* Net Profit / Loss pill */}
                        <div style={{
                            background: netProfit === null
                                ? '#F0F0F0'
                                : isNetLoss ? '#FFDDE6' : '#E8F5E9',
                            borderRadius: '10px',
                            padding: '14px 16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            transition: 'background 0.3s ease',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <TrendingUp
                                    size={16}
                                    color={netProfit === null ? '#aaa' : isNetLoss ? PINK : '#388E3C'}
                                />
                                <span style={{
                                    fontSize: '14px', fontWeight: '700',
                                    color: netProfit === null ? '#aaa' : isNetLoss ? PINK : '#2E7D32',
                                }}>
                                    {netProfit === null ? 'Net P/L' : isNetLoss ? 'Net Loss' : 'Net Profit'}
                                </span>
                            </div>
                            <span style={{
                                fontSize: '16px', fontWeight: '800',
                                color: netProfit === null ? '#ccc' : isNetLoss ? PINK : '#2E7D32',
                            }}>
                                {netProfit === null
                                    ? '—'
                                    : `${isNetLoss ? '-' : ''}${Math.abs(netProfit).toLocaleString()}`
                                }
                            </span>
                        </div>

                        {/* Cost breakdown (shown after calculate) */}
                        {/* {netProfit !== null && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ height: '1px', background: '#e8e8e8' }} />
                                {[
                                    { label: 'Hotel Cost',   value: hotelCost   },
                                    { label: 'Vehicle Cost', value: vehicleCost },
                                    { label: 'Other Costs',  value: otherCost   },
                                    { label: 'Total Costs',  value: hotelCost + vehicleCost + otherCost, bold: true },
                                ].map(({ label, value, bold }) => (
                                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '12px', color: bold ? '#444' : '#999', fontWeight: bold ? '700' : '400' }}>{label}</span>
                                        <span style={{ fontSize: '12px', color: bold ? BLUE : '#888', fontWeight: bold ? '700' : '500' }}>
                                            ₹ {value.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )} */}
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 540px) {
                    .fc-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </>
    );
}

export default FinancialCloseup;