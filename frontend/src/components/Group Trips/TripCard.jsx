import React from 'react'
import { CalendarIcon, PeopleIcon, CopyIcon, TrashIcon,FilterIcon,PlusIcon } from '../Icons/Icons';

const PINK = '#ED5F8D';
const BLUE = '#18305C';
// ─── status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  created: {
      label: 'Created',
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
  inProgress: {
      label: 'In Progress',
      color: '#2196F3',        // Blue (active/live)
      bg: '#E3F2FD',
      border: '#90CAF9'
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
  
  // ─── helpers ──────────────────────────────────────────────────────────────────
  const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };
  
  const getViabilityColor = (pct) => {
    if (pct >= 80) return '#448B47';
    if (pct >= 50) return '#FF9800';
    return '#ED5F8D';
  };

function TripCard({ trip, onDelete, onView }) {
    const status = trip?.status ?? 'created';
    const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.created;
  
    const from = formatDate(trip?.regionDetails?.fromDate);
    const to = formatDate(trip?.regionDetails?.toDate);
  
    const regionName = trip?.regionDetails?.region1?.name ?? '—';
  
    const totalSeats = trip?.tripDetails?.totalSeats ?? 0;
    const bookedSeats = trip?.tripDetails?.bookedSeats ?? 0;
    const viability = totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0;
    const viabilityColor = getViabilityColor(viability);
  
    const tripName = trip?.tripName ?? regionName;
  
    return (
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
        border: '1px solid #f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {/* Status badge */}
        <div style={{ display: 'inline-flex', alignSelf: 'flex-start' }}>
          <span style={{
            background: statusCfg.bg,
            color: statusCfg.color,
            fontSize: '12px',
            fontWeight: '600',
            padding: '3px 12px',
            borderRadius: '20px',
            border: `1px solid ${statusCfg.color}30`,
          }}>
            {statusCfg.label}
          </span>
        </div>
  
        {/* Trip name */}
        <div style={{ fontSize: '17px', fontWeight: '700', color: BLUE, lineHeight: '1.3' }}>
          {tripName}
        </div>
  
        {/* Date row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666', fontSize: '13px' }}>
          <CalendarIcon />
          <span>{from} – {to}</span>
        </div>
  
        {/* Seats + viability */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555', fontSize: '13px' }}>
              <PeopleIcon />
              <span style={{ fontWeight: '600', color: BLUE }}>{bookedSeats}</span>
              <span style={{ color: '#999' }}>/ {totalSeats} Seats</span>
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: viabilityColor }}>
              {viability}% Viability
            </span>
          </div>
  
          {/* Progress bar */}
          <div style={{ height: '5px', background: '#f0f0f0', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${viability}%`,
              background: viabilityColor,
              borderRadius: '10px',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
  
        {/* Actions row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
          <button
            onClick={() => onView?.(trip)}
            style={{
              border: `1.5px solid ${BLUE}`,
              background: 'white',
              color: BLUE,
              borderRadius: '8px',
              padding: '7px 16px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            View Details
          </button>
  
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => onDelete?.(trip)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
              title="Delete trip"
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      </div>
    );
  }

export default TripCard