import {
    MapPin, Clock, Eye, 
  } from 'lucide-react'

const PINK = '#ED5F8D'
const BLUE = '#18305C'

export default function PackageCard({ pkg }) {
    return (
      <div style={{
        background: 'white', borderRadius: '12px',
        border: '1px solid #e5e7eb', padding: '16px',
        display: 'flex', flexDirection: 'column', gap: '10px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>{pkg.id}</span>
              <span style={{ fontSize: '12px', color: '#4CAF50', fontWeight: '600' }}>{pkg.status}</span>
            </div>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: BLUE }}>{pkg.title}</p>
          </div>
          <span style={{
            background: '#B9AEF240', color: '#7c6fcd',
            fontSize: '12px', fontWeight: '600',
            padding: '3px 10px', borderRadius: '20px', whiteSpace: 'nowrap',
          }}>
            {pkg.type}
          </span>
        </div>
  
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6b7280' }}>
            <MapPin size={13} color={PINK} /> {pkg.location}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6b7280' }}>
            <Clock size={13} color={PINK} /> {pkg.duration}
          </div>
        </div>
  
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
          <span style={{ fontSize: '16px', fontWeight: '700', color: PINK }}>₹{pkg.price}</span>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <Eye size={18} color={PINK} />
          </button>
        </div>
      </div>
    )
  }