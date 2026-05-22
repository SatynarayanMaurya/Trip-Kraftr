import { EditIcon, PlusIcon, EyeIcon, WhatsAppIcon,PencilIcon } from '../../Icons/Icons';
const PINK = '#ED5F8D';
const BLUE = '#18305C';
// ─── Status badge ─────────────────────────────────────────────────────────────
const STATUS_MAP = {
    paid:    { label: 'Paid',    bg: '#E8F5E9', color: '#388E3C', border: '#A5D6A7' },
    enquiry: { label: 'enquiry', bg: '#FFF9C4', color: '#F9A825', border: '#FFE082' },
    partial: { label: 'Partial', bg: '#FFF3E0', color: '#E65100', border: '#FFCC80' },
    unpaid:  { label: 'Unpaid',  bg: '#FFDDE6', color: PINK,      border: '#F48FB1' },
};

const actionBtnStyle = {
    background: 'none', border: 'none', cursor: 'pointer',
    padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
};



export function ParticipantCard({ p, onEdit, onView, onWhatsApp }) {
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
                        <div style={{ fontSize: '14px', fontWeight: '700', color: BLUE }}>{p?.enquiry?.accountId?.businessName ||p?.enquiry?.accountId?.fullName}</div>
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>Member : {p.totalMembers}</div>
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
                {/* <button onClick={() => onView(p)} style={actionBtnStyle}><EyeIcon /></button> */}
                <button onClick={() => onWhatsApp(p)} style={actionBtnStyle}><WhatsAppIcon /></button>
            </div>
        </div>
    );
}


export function StatusBadge({ status = 'paid' }) {
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
export function Avatar({ name, src }) {
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