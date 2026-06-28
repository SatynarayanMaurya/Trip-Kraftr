// ─────────────────────────────────────────────────────────────────────────────
// ViewRegionDetails.jsx  — Tab 1: Basic Details + Calculation Card (read-only)
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { MapPin, Users, Baby, Calendar, Hash } from 'lucide-react';

const BLUE = '#18305C';
const PINK = '#ED5F8D';

// ── tiny shared helpers ───────────────────────────────────────────────────────
const card = {
    background: 'white', borderRadius: '12px',
    padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
};
const fieldLabel = {
    fontSize: '11px', fontWeight: '600', color: '#888',
    textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px',
};
const fieldValue = {
    fontSize: '14px', fontWeight: '600', color: BLUE,
};
const pill = {
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    border: '1px solid #e5e7eb', borderRadius: '9999px',
    padding: '5px 14px', fontSize: '13px', fontWeight: '500', color: BLUE,
    background: '#f8fafc',
};
const sectionTitle = {
    fontSize: '15px', fontWeight: '700', color: BLUE,
    marginBottom: '16px', paddingBottom: '8px',
    borderBottom: '1px solid #f0f0f0',
};

function InfoField({ label, value, icon }) {
    return (
        <div>
            <div style={fieldLabel}>{label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', ...fieldValue }}>
                {icon && <span style={{ color: PINK }}>{icon}</span>}
                {value || <span style={{ color: '#bbb', fontWeight: '400' }}>—</span>}
            </div>
        </div>
    );
}

function ViewRegionSamplePackage({ regionDetails, price, vendorDetails }) {
    const { region1, region2, region3, startDate, noOfDays, adults, children, childAges } = regionDetails ?? {};

    const fmt = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const regions = [region1, region2, region3].filter(r => r?.name);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* ── Region + Trip Info ── */}
            <div style={card}>
                <div style={sectionTitle}>Trip Information</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* Row 1 - Regions */}
                    <div>
                        <div style={fieldLabel}>Regions</div>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '6px',
                                marginTop: '4px'
                            }}
                        >
                            {regions.length > 0
                                ? regions.map((r, i) => (
                                    <span key={i} style={pill}>
                                        <MapPin size={12} style={{ color: PINK }} /> {r.name}
                                    </span>
                                ))
                                : <span style={{ color: '#bbb', fontSize: '13px' }}>—</span>
                            }
                        </div>
                    </div>

                    {/* Row 2 - Details */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                            gap: '16px'
                        }}
                    >
                        <InfoField
                            label="Start Date"
                            value={fmt(startDate)}
                            icon={<Calendar size={14} />}
                        />

                        <InfoField
                            label="No. of Days"
                            value={noOfDays ? `${noOfDays} days` : '—'}
                            icon={<Hash size={14} />}
                        />

                        <InfoField
                            label="Adults"
                            value={adults ? `${adults} adults` : '—'}
                            icon={<Users size={14} />}
                        />

                        <InfoField
                            label="Children"
                            value={children ? `${children} children` : '0 children'}
                            icon={<Baby size={14} />}
                        />
                    </div>

                </div>

                {/* Child ages */}
                {childAges?.length > 0 && (
                    <div style={{ marginTop: '16px' }}>
                        <div style={fieldLabel}>Child Ages</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                            {childAges.map((age, i) => (
                                <span key={i} style={{ ...pill, background: '#fdf2f8', borderColor: '#f9a8d4' }}>
                                    Child {i + 1}: {age} yrs
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}

export default ViewRegionSamplePackage