import React, { useState } from 'react';
import { EditIcon, PlusIcon, EyeIcon, WhatsAppIcon,PencilIcon } from '../../Icons/Icons';
import AddParticipant from './AddParticipant';

const PINK = '#ED5F8D';
const BLUE = '#18305C';



// ─── Status badge ─────────────────────────────────────────────────────────────
const STATUS_MAP = {
    paid:    { label: 'Paid',    bg: '#E8F5E9', color: '#388E3C', border: '#A5D6A7' },
    pending: { label: 'Pending', bg: '#FFF9C4', color: '#F9A825', border: '#FFE082' },
    partial: { label: 'Partial', bg: '#FFF3E0', color: '#E65100', border: '#FFCC80' },
    unpaid:  { label: 'Unpaid',  bg: '#FFDDE6', color: PINK,      border: '#F48FB1' },
};

function StatusBadge({ status = 'paid' }) {
    const cfg = STATUS_MAP[status] ?? STATUS_MAP.paid;
    return (
        <span style={{
            background: cfg.bg, color: cfg.color,
            border: `1px solid ${cfg.border}`,
            fontSize: '12px', fontWeight: '700',
            padding: '4px 14px', borderRadius: '20px',
            whiteSpace: 'nowrap',
        }}>
            {cfg.label}
        </span>
    );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ name, src }) {
    const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? 'U';
    // const colors = ['#ED5F8D', '#4C78CA', '#2E7D32', '#FF9800', '#7B1FA2'];
    const colors = ['#ED5F8D', '#4C78CA', '#4CAF50', '#FF9800', '#7B1FA2'];
    const colorIdx = (name?.charCodeAt(0) ?? 0) % colors.length;

    if (src) return (
        <img src={src} alt={name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
    );
    return (
        <div style={{
            width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
            background: colors[colorIdx], display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: 'white',
        }}>
            {initials}
        </div>
    );
}

// ─── Dummy data ───────────────────────────────────────────────────────────────
const DUMMY_PARTICIPANTS = [
    { id: 1, name: 'John Smith',   members: 2, contact: '9821014091', dietary: 'Vegetarian', occupancy: 'Single room', saleAmount: 5000, paidAmount: 5000, status: 'paid'    },
    { id: 2, name: 'Priya Sharma', members: 2, contact: '9821014091', dietary: 'None',       occupancy: 'Single room', saleAmount: 5000, paidAmount: 5000, status: 'paid'    },
    { id: 3, name: 'Rahul Verma',  members: 2, contact: '9821014091', dietary: 'Vegetarian', occupancy: 'Single room', saleAmount: 5000, paidAmount: 5000, status: 'paid'    },
    { id: 4, name: 'Anita Roy',    members: 2, contact: '9821014091', dietary: 'None',       occupancy: 'Single room', saleAmount: 5000, paidAmount: 2500, status: 'partial'  },
    { id: 5, name: 'Karan Mehta',  members: 2, contact: '9821014091', dietary: 'Vegetarian', occupancy: 'Single room', saleAmount: 5000, paidAmount: 5000, status: 'paid'    },
    { id: 6, name: 'Sneha Patel',  members: 2, contact: '9821014091', dietary: 'None',       occupancy: 'Single room', saleAmount: 5000, paidAmount: 0,    status: 'pending'  },
];

// ─── Table header cell ────────────────────────────────────────────────────────
const TH = ({ children, align = 'left', minW }) => (
    <th style={{
        padding: '14px 16px', fontSize: '13px', fontWeight: '600',
        color: '#555', textAlign: align, whiteSpace: 'nowrap',
        borderBottom: '1.5px solid #f0f0f0', minWidth: minW,
        background: 'white',
    }}>
        {children}
    </th>
);

// ─── Table data cell ──────────────────────────────────────────────────────────
const TD = ({ children, align = 'left' }) => (
    <td style={{
        padding: '16px 16px', fontSize: '13px', color: '#444',
        textAlign: align, borderBottom: '1px solid #f5f5f5', verticalAlign: 'middle',
    }}>
        {children}
    </td>
);

// ─── Mobile card view ─────────────────────────────────────────────────────────
function ParticipantCard({ p, onEdit, onView, onWhatsApp }) {
    return (
        <div style={{
            background: 'white', borderRadius: '12px', border: '1px solid #f0f0f0',
            padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            display: 'flex', flexDirection: 'column', gap: '12px',
        }}>
            {/* Top row: avatar + name + status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Avatar name={p.name} />
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: BLUE }}>{p.name}</div>
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>Member : {p.members}</div>
                    </div>
                </div>
                <StatusBadge status={p.status} />
            </div>

            {/* Info grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                    { label: 'Contact',   value: p.contact },
                    { label: 'Dietary',   value: p.dietary },
                    { label: 'Occupancy', value: p.occupancy },
                    { label: 'Sale Amt',  value: `₹ ${p.saleAmount.toLocaleString()}` },
                    { label: 'Paid Amt',  value: `₹ ${p.paidAmount.toLocaleString()}` },
                ].map(({ label, value }) => (
                    <div key={label}>
                        <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '2px' }}>{label}</div>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: '#333' }}>{value}</div>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid #f5f5f5', paddingTop: '10px' }}>
                <button onClick={() => onEdit(p)} style={actionBtnStyle}><PencilIcon /></button>
                <button onClick={() => onView(p)} style={actionBtnStyle}><EyeIcon /></button>
                <button onClick={() => onWhatsApp(p)} style={actionBtnStyle}><WhatsAppIcon /></button>
            </div>
        </div>
    );
}

const actionBtnStyle = {
    background: 'none', border: 'none', cursor: 'pointer',
    padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
};

// ─── Main component ───────────────────────────────────────────────────────────
function Participants({ participants = DUMMY_PARTICIPANTS }) {
    const [isMobile, setIsMobile] = useState(false);
    const [isAddParticipant, setIsAddParticipant] = useState(false)

    React.useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const handleEdit     = (p) => console.log('Edit',      p);
    const handleView     = (p) => console.log('View',      p);
    const handleWhatsApp = (p) => window.open(`https://wa.me/${p.contact}`, '_blank');
    // const handleAdd      = ()  => setIsAddParticipant(true);
    const handleAdd      = ()  => console.log("Add");

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* ── Section header ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: BLUE, margin: 0 }}>Participants</h2>
                <button
                    onClick={handleAdd}
                    style={{
                        background: PINK, color: 'white', border: 'none',
                        borderRadius: '8px', padding: '9px 18px',
                        fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px',
                    }}
                >
                    <span style={{ fontSize: '16px', lineHeight: 1 }}>+</span> Add Participants
                </button>
            </div>

            {/* ── Desktop table ── */}
            {!isMobile && (
                <div style={{
                    background: 'white', borderRadius: '12px',
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
                    overflowX: 'auto',
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                        <thead>
                            <tr>
                                <TH minW="200px">Name</TH>
                                <TH>Contact</TH>
                                <TH>Dietary</TH>
                                <TH>Occupancy</TH>
                                <TH align="right">Sale Amount</TH>
                                <TH align="right">Paid Amount</TH>
                                <TH align="center">Status</TH>
                                <TH align="center">Actions</TH>
                            </tr>
                        </thead>
                        <tbody>
                            {participants.map((p) => (
                                <tr key={p.id} style={{ transition: 'background 0.1s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                                >
                                    {/* Name cell */}
                                    <TD>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Avatar name={p.name} />
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: '700', color: BLUE }}>{p.name}</div>
                                                <div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>Member : {p.members}</div>
                                            </div>
                                        </div>
                                    </TD>

                                    <TD><span style={{ color: '#555' }}>{p.contact}</span></TD>

                                    <TD><span style={{ color: p.dietary === 'None' ? '#aaa' : '#444' }}>{p.dietary}</span></TD>

                                    <TD>{p.occupancy}</TD>

                                    {/* Sale Amount */}
                                    <TD align="right">
                                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                                            <span style={{ fontSize: '13px', color: '#555' }}>₹</span>
                                            <span style={{ fontWeight: '600', color: BLUE }}>{p.saleAmount.toLocaleString()}</span>
                                        </span>
                                    </TD>

                                    {/* Paid Amount */}
                                    <TD align="right">
                                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                                            <span style={{ fontSize: '13px', color: '#555' }}>₹</span>
                                            <span style={{ fontWeight: '600', color: BLUE }}>{p.paidAmount.toLocaleString()}</span>
                                        </span>
                                    </TD>

                                    {/* Status */}
                                    <TD align="center">
                                        <StatusBadge status={p.status} />
                                    </TD>

                                    {/* Actions */}
                                    <TD align="center">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                            <button onClick={() => handleEdit(p)} style={actionBtnStyle} title="Edit">
                                                <PencilIcon />
                                            </button>
                                            <button onClick={() => handleView(p)} style={actionBtnStyle} title="View">
                                                <EyeIcon />
                                            </button>
                                            <button onClick={() => handleWhatsApp(p)} style={actionBtnStyle} title="WhatsApp">
                                                <WhatsAppIcon />
                                            </button>
                                        </div>
                                    </TD>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {participants.length === 0 && (
                        <div style={{ padding: '60px', textAlign: 'center', color: '#bbb' }}>
                            <div style={{ fontSize: '32px', marginBottom: '10px' }}>👥</div>
                            <div style={{ fontSize: '15px', fontWeight: '600' }}>No participants yet</div>
                            <div style={{ fontSize: '13px', marginTop: '4px' }}>Add participants to get started</div>
                        </div>
                    )}
                </div>
            )}

            {/* ── Mobile card grid ── */}
            {isMobile && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {participants.length === 0 ? (
                        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#bbb' }}>
                            <div style={{ fontSize: '32px', marginBottom: '10px' }}>👥</div>
                            <div style={{ fontSize: '15px', fontWeight: '600' }}>No participants yet</div>
                        </div>
                    ) : participants.map(p => (
                        <ParticipantCard
                            key={p.id}
                            p={p}
                            onEdit={handleEdit}
                            onView={handleView}
                            onWhatsApp={handleWhatsApp}
                        />
                    ))}
                </div>
            )}

            {/* Add Participant */}
            <>
                {
                    isAddParticipant && 
                    <AddParticipant closeModal = {()=>setIsAddParticipant(false)}/>
                }
            </>
        </div>
    );
}

export default Participants;