
import React from 'react';
import { Zap, Trash2, Plus } from 'lucide-react';
import { inputStyle } from '../../Common/CommonCss';

const PINK  = '#ED5F8D';
const BLUE  = '#18305C';

// ─── blank activity template ──────────────────────────────────────────────────
export const blankActivity = () => ({
    activityType:    'inventory',
    activityId:      null,
    activityName:    '',
    isComplimentary: false,
    quantity:        1,
    price:           0,
});

// ─── shared style helpers ─────────────────────────────────────────────────────
const sectionHeaderStyle = {
    display: 'flex', justifyContent: 'center', marginBottom: '16px',
};
const sectionHeaderInner = {
    background: BLUE, color: 'white', borderRadius: '8px',
    padding: '8px 28px', display: 'flex', alignItems: 'center',
    gap: '8px', fontSize: '14px', fontWeight: '700',
};
const entryCardStyle = {
    border: '1px solid #f0f0f0', borderRadius: '12px',
    padding: '14px 16px', background: '#fff',
};
const labelStyle = {
    display: 'block', fontSize: '12px',
    fontWeight: '600', color: BLUE, marginBottom: '5px',
};
const priceBoxStyle = {
    display: 'flex', alignItems: 'center', gap: '6px',
    border: '1px solid #e5e7eb', borderRadius: '8px',
    padding: '0 10px', height: '38px', background: 'white',
    width: '100%',
};
const addBtnStyle = (enabled) => ({
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '5px 14px', borderRadius: '9999px',
    fontSize: '12px', fontWeight: '600', border: 'none',
    cursor: enabled ? 'pointer' : 'not-allowed',
    background: enabled ? PINK : '#f3f4f6',
    color:      enabled ? 'white' : '#9ca3af',
    transition: 'all 0.15s',
});
const qtySelectStyle = {
    border: '1px solid #e5e7eb', borderRadius: '8px',
    padding: '7px 28px 7px 10px', fontSize: '13px',
    outline: 'none', appearance: 'none',
    background: '#fff', cursor: 'pointer',
    color: BLUE, fontWeight: '600', width: '100%',
};

// ─── single activity row ──────────────────────────────────────────────────────
function ActivityEntry({ act, index, total, activitiesForActiveDay, onUpdate, onDelete }) {

    const handleNameChange = (value) => {
        const found = activitiesForActiveDay?.find(
            a => a.activityName.toLowerCase() === value.toLowerCase()
        );
        if (found) {
            onUpdate(index, {
                activityName:    found.activityName,
                activityId:      found._id,
                activityType:    'inventory',
                price:           act.isComplimentary ? 0 : (found.price ?? 0),
            });
        } else {
            onUpdate(index, {
                activityName: value,
                activityId:   null,
                activityType: 'manual',
            });
        }
    };

    const handleComplimentary = (checked) => {
        onUpdate(index, {
            isComplimentary: checked,
            price:           checked ? 0 : (act.price ?? 0),
        });
    };

    return (
        <div style={entryCardStyle}>

            {/* ── Row 1: Name | Quantity | Price | Delete ── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,1fr) 100px auto 36px',
                gap: '10px',
                alignItems: 'end',
            }}
                className="activity-grid"
            >
                {/* Activity name */}
                <div>
                    <label style={labelStyle}>Activity Name</label>
                    <input
                        type="text"
                        list={`activity-list-${index}`}
                        style={{ ...inputStyle }}
                        placeholder="Enter activity name"
                        value={act.activityName}
                        onChange={e => handleNameChange(e.target.value)}
                    />
                    <datalist id={`activity-list-${index}`}>
                        {(activitiesForActiveDay ?? []).map(a => (
                            <option key={a._id} value={a.activityName} />
                        ))}
                    </datalist>
                </div>

                {/* Quantity dropdown 1–10 */}
                <div>
                    <label style={labelStyle}>Qty</label>
                    <div style={{ position: 'relative' }}>
                        <select
                            style={qtySelectStyle}
                            value={act.quantity ?? 1}
                            onChange={e => onUpdate(index, { quantity: Number(e.target.value) })}
                        >
                            {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                        <span style={{
                            position: 'absolute', right: '8px', top: '50%',
                            transform: 'translateY(-50%)', fontSize: '10px',
                            color: '#9ca3af', pointerEvents: 'none',
                        }}>▼</span>
                    </div>
                </div>

                {/* Price — hidden when complimentary */}
                <div style={{ minWidth: '110px' }}>
                    {!act.isComplimentary ? (
                        <>
                            <label style={labelStyle}>Price (₹)</label>
                            <div style={priceBoxStyle}>
                                <span style={{ fontSize: '14px', color: '#555', flexShrink: 0 }}>₹</span>
                                <input
                                    type="number"
                                    min={0}
                                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', color: '#333' }}
                                    value={act.price ?? 0}
                                    onChange={e => onUpdate(index, { price: Number(e.target.value) })}
                                />
                            </div>
                        </>
                    ) : (
                        <div style={{ height: '38px', display: 'flex', alignItems: 'center' }}>
                            <span style={{
                                background: '#f0fdf4', color: '#16a34a',
                                fontSize: '11px', fontWeight: '600',
                                padding: '4px 10px', borderRadius: '9999px',
                                border: '1px solid #bbf7d0', whiteSpace: 'nowrap',
                            }}>
                                Complimentary
                            </span>
                        </div>
                    )}
                </div>

                {/* Delete */}
                <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '2px' }}>
                    <button
                        type="button"
                        onClick={() => onDelete(index)}
                        // disabled={total === 1}
                        title={total === 1 ? 'At least one activity required' : 'Remove activity'}
                        style={{
                            background: 'none', border: 'none',
                            cursor: total === 1 ? 'not-allowed' : 'pointer',
                            opacity: total === 1 ? 0.3 : 1,
                            color: '#ef4444', padding: '6px',
                            borderRadius: '6px', display: 'flex', alignItems: 'center',
                        }}
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            </div>

            {/* ── Row 2: Complimentary toggle + Paid badge ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px', flexWrap: 'wrap' }}>
                <label style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    fontSize: '13px', color: '#444', cursor: 'pointer', userSelect: 'none',
                }}>
                    <input
                        type="checkbox"
                        checked={act.isComplimentary ?? false}
                        onChange={e => handleComplimentary(e.target.checked)}
                        style={{ accentColor: PINK, width: '14px', height: '14px', cursor: 'pointer' }}
                    />
                    Complimentary
                </label>

                {!act.isComplimentary && (
                    <span style={{
                        background: '#e3f2fd', color: '#1565c0',
                        fontSize: '12px', fontWeight: '600',
                        padding: '3px 12px', borderRadius: '12px',
                    }}>
                        Paid Activity
                    </span>
                )}
            </div>
        </div>
    );
}

// ─── ActivitiesSection — main export ─────────────────────────────────────────
function ActivitySectionPrivateTrip({ dayData, activitiesForActiveDay, onDayChange }) {
    const activities = dayData?.activities?.length
        ? dayData.activities
        : [blankActivity()];

    // last activity must have a name before adding more
    const lastActivity = activities[activities.length - 1];
    const canAdd       = !!(lastActivity?.activityName?.trim());

    const updateActivity = (index, patch) => {
        onDayChange('activities', activities.map((a, i) => i === index ? { ...a, ...patch } : a));
    };

    const addActivity = () => {
        if (!canAdd) return;
        onDayChange('activities', [...activities, blankActivity()]);
    };

    const removeActivity = (index) => {
        if (activities.length === 1) return;
        onDayChange('activities', activities.filter((_, i) => i !== index));
    };

    return (
        <div style={{ marginBottom: '8px' }}>

            {/* Section header */}
            <div style={sectionHeaderStyle}>
                <div style={sectionHeaderInner}>
                    <Zap size={16} /> Activities
                </div>
            </div>

            {/* Add button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                <button
                    type="button"
                    onClick={addActivity}
                    disabled={!canAdd}
                    title={canAdd ? 'Add another activity' : 'Fill current activity name first'}
                    style={addBtnStyle(canAdd)}
                >
                    <Plus size={13} /> Add Activity
                </button>
            </div>

            {/* Activity entries */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activities.map((act, index) => (
                    <ActivityEntry
                        key={index}
                        act={act}
                        index={index}
                        total={activities.length}
                        activitiesForActiveDay={activitiesForActiveDay}
                        onUpdate={updateActivity}
                        onDelete={removeActivity}
                    />
                ))}
            </div>

            {/* Responsive grid fix for narrow screens */}
            <style>{`
                @media (max-width: 500px) {
                    .activity-grid {
                        grid-template-columns: 1fr 80px !important;
                        grid-template-rows: auto auto;
                    }
                    .activity-grid > *:nth-child(3) { grid-column: 1; }
                    .activity-grid > *:nth-child(4) { grid-column: 2; grid-row: 1; align-self: start; padding-top: 24px; }
                }
            `}</style>
        </div>
    );
}

export default ActivitySectionPrivateTrip