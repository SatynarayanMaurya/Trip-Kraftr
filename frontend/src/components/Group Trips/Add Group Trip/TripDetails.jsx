import React from 'react';
import { inputStyle, labelStyle, cardStyle } from '../../Common/CommonCss';
const PINK = '#ED5F8D';
const BLUE = '#18305C';


function TripDetails({
    formData,
    vehicleData,
    allVehicles,
    vehicleLoading,
    regions,
    numDays,
    handleChange,
    handleSave,
}) {
    const { regionDetails } = formData ?? {};

    const selectedRegionNames = [
        regionDetails?.region1,
        regionDetails?.region2,
        regionDetails?.region3,
    ]
        .filter(Boolean)
        .map((id) => regions?.find((r) => r._id === id)?.name)
        .filter(Boolean)
        .join(', ');

    const fromDate = regionDetails?.fromDate ?? '';
    const toDate = regionDetails?.toDate ?? '';

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };

    const getMonth = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleString('default', { month: 'long' });
    };

    const selectedVehicle = allVehicles?.find(
        (v) => v._id === vehicleData?.selectedVehicleId
    );

    const handleQuantityChange = (delta) => {
        const current = vehicleData?.quantity ?? 1;
        const next = current + delta;
        if (next >= 1) handleChange('quantity', next);
    };

    const handleOccupancyChange = (key, value) => {
        handleChange('occupancy', {
            ...vehicleData?.occupancy,
            [key]: value,
        });
    };

    const twoColGrid = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px 32px',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* ── Summary Card: 2 rows ── */}
            <div style={cardStyle}>
                {/* Row 1: Region (left) | Month (right) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: BLUE }}>Region :</span>
                        <span style={{ fontSize: '14px', color: BLUE }}>{selectedRegionNames || '—'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: BLUE }}>Month :</span>
                        <span style={{ fontSize: '14px', color: BLUE }}>{getMonth(fromDate)}</span>
                    </div>
                </div>

                <div style={{ height: '1px', background: '#eee', margin: '12px 0' }} />

                {/* Row 2: From (left) | To (center) | No. of days (right) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: BLUE }}>From :</span>
                        <span style={{ fontSize: '14px', color: BLUE }}>{formatDate(fromDate)}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: BLUE }}>To :</span>
                        <span style={{ fontSize: '14px', color: BLUE }}>{formatDate(toDate)}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: BLUE }}>No. of days :</span>
                        <span style={{ fontSize: '14px', color: BLUE }}>{numDays || '—'}</span>
                    </div>
                </div>
            </div>

            {/* ── Form Card: strict 2-column grid ── */}
            <div style={cardStyle}>
                <div style={twoColGrid}>

                    {/* Row 1 left: Assigned To */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={labelStyle}>
                            Assigned To <span style={{ color: PINK }}>*</span>
                        </label>
                        <input
                            type="text"
                            style={inputStyle}
                            placeholder="Enter name"
                            value={vehicleData?.assignedTo ?? ''}
                            onChange={(e) => handleChange('assignedTo', e.target.value)}
                        />
                    </div>

                    {/* Row 1 right: Total Seats */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={labelStyle}>
                            Total Seats <span style={{ color: PINK }}>*</span>
                        </label>
                        <input
                            type="number"
                            style={inputStyle}
                            placeholder="0"
                            min={0}
                            value={vehicleData?.totalSeats ?? ''}
                            onChange={(e) => handleChange('totalSeats', e.target.value)}
                        />
                    </div>

                    {/* Row 2 left: Min Seats Required */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={labelStyle}>
                            Min Seats Required <span style={{ color: PINK }}>*</span>
                        </label>
                        <input
                            type="number"
                            style={inputStyle}
                            placeholder="0"
                            min={0}
                            value={vehicleData?.minSeats ?? ''}
                            onChange={(e) => handleChange('minSeats', e.target.value)}
                        />
                    </div>

                    {/* Row 3 left: Single Occupancy */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={labelStyle}>Single Occupancy</label>
                        <input
                            type="number"
                            style={inputStyle}
                            placeholder="0"
                            min={0}
                            value={vehicleData?.occupancy?.single ?? 0}
                            onChange={(e) => handleOccupancyChange('single', e.target.value)}
                        />
                    </div>

                    {/* Row 3 right: Double Occupancy */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={labelStyle}>Double Occupancy</label>
                        <input
                            type="number"
                            style={inputStyle}
                            placeholder="0"
                            min={0}
                            value={vehicleData?.occupancy?.double ?? 0}
                            onChange={(e) => handleOccupancyChange('double', e.target.value)}
                        />
                    </div>

                    {/* Row 4 left: Triple Occupancy */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={labelStyle}>Triple Occupancy</label>
                        <input
                            type="number"
                            style={inputStyle}
                            placeholder="0"
                            min={0}
                            value={vehicleData?.occupancy?.triple ?? 0}
                            onChange={(e) => handleOccupancyChange('triple', e.target.value)}
                        />
                    </div>

                    {/* Row 4 right: Save button — bottom-aligned */}
                    <div style={{
                        gridColumn: '1 / -1', // 🔥 span all columns
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}>
                        <button
                            onClick={handleSave}
                            style={{
                                background: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '10px 28px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                height: '40px',
                            }}
                        >
                            &#128190; Save
                        </button>
                    </div>

                </div>
            </div>

            {/* ── Vehicle Selection Card ── */}
            <div style={cardStyle}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '20px',
                    alignItems: 'end',
                }}>

                    {/* Vehicle Dropdown */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2">
                                <rect x="1" y="8" width="22" height="10" rx="3" />
                                <path d="M5 8V6a2 2 0 012-2h10a2 2 0 012 2v2" />
                                <circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" />
                            </svg>
                            Vehicle Selection <span style={{ color: PINK }}>*</span>
                        </label>
                        <div style={{ position: 'relative' }}>
                            <select
                                style={{ ...inputStyle, appearance: 'none', paddingRight: '36px' }}
                                value={vehicleData?.selectedVehicleId ?? ''}
                                onChange={(e) => handleChange('selectedVehicleId', e.target.value)}
                                disabled={vehicleLoading}
                            >
                                <option value="">
                                    {vehicleLoading ? 'Loading...' : 'Select Vehicle'}
                                </option>
                                {!vehicleLoading && allVehicles?.map((v) => (
                                    <option key={v._id} value={v._id}>
                                        {v.vehicleModel} ({v.regionId?.name})
                                    </option>
                                ))}
                            </select>
                            <div style={{
                                position: 'absolute', right: '12px', top: '50%',
                                transform: 'translateY(-50%)', pointerEvents: 'none',
                            }}>
                                {vehicleLoading
                                    ? <div style={{
                                        width: '13px', height: '13px',
                                        border: `2px solid ${PINK}`,
                                        borderTopColor: 'transparent',
                                        borderRadius: '50%',
                                        animation: 'vd-spin 0.7s linear infinite',
                                    }} />
                                    : <span style={{ fontSize: '11px', color: '#888' }}>▼</span>
                                }
                            </div>
                        </div>
                    </div>

                    {/* Quantity stepper */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2">
                                <rect x="1" y="8" width="22" height="10" rx="3" />
                                <path d="M5 8V6a2 2 0 012-2h10a2 2 0 012 2v2" />
                                <circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" />
                            </svg>
                            Quantity
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                                onClick={() => handleQuantityChange(-1)}
                                disabled={(vehicleData?.quantity ?? 1) <= 1}
                                style={{
                                    width: '34px', height: '34px', borderRadius: '50%',
                                    border: '1.5px solid #ddd', background: 'white',
                                    fontSize: '18px', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#555', opacity: (vehicleData?.quantity ?? 1) <= 1 ? 0.35 : 1,
                                }}
                            >−</button>
                            <div style={{
                                width: '44px', height: '36px', border: '1.5px solid #ddd',
                                borderRadius: '6px', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', fontWeight: '600', fontSize: '15px', color: BLUE,
                            }}>
                                {vehicleData?.quantity ?? 1}
                            </div>
                            <button
                                onClick={() => handleQuantityChange(1)}
                                style={{
                                    width: '34px', height: '34px', borderRadius: '50%',
                                    border: '1.5px solid #ddd', background: 'white',
                                    fontSize: '18px', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#555',
                                }}
                            >+</button>
                        </div>
                    </div>

                    {/* Vehicle image */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={labelStyle}>&nbsp;</label>
                        <div style={{
                            width: '100%', height: '100px', borderRadius: '8px',
                            border: '1.5px solid #eee', overflow: 'hidden',
                            background: '#f5f5f5', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                        }}>
                            {selectedVehicle?.vehicleImageUrl
                                ? <img
                                    src={selectedVehicle.vehicleImageUrl}
                                    alt={selectedVehicle?.vehicleModel ?? 'Vehicle'}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                                : <span style={{ fontSize: '12px', color: '#aaa' }}>No image</span>
                            }
                        </div>
                    </div>

                    {/* Capacity + Type pills */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={labelStyle}>&nbsp;</label>
                        <div style={{
                            border: '1.5px solid #ddd', borderRadius: '20px',
                            padding: '6px 14px', fontSize: '13px', color: BLUE,
                            fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '4px',
                        }}>
                            <strong>Capacity :</strong>
                            <span>{selectedVehicle?.capacity ? `${selectedVehicle.capacity} pax` : '—'}</span>
                        </div>
                        <div style={{
                            border: '1.5px solid #ddd', borderRadius: '20px',
                            padding: '6px 14px', fontSize: '13px', color: BLUE,
                            fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '4px',
                        }}>
                            <strong>Type :</strong>
                            <span>{selectedVehicle?.vehicleType ?? '—'}</span>
                        </div>
                    </div>

                </div>
            </div>

            <style>{`
                @keyframes vd-spin { to { transform: rotate(360deg); } }
                @media (max-width: 600px) {
                    .vd-two-col { grid-template-columns: 1fr !important; }
                }
            `}</style>

        </div>
    );
}

export default TripDetails;