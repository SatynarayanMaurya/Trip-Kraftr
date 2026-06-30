import React from 'react';
import { Eye, Pencil, Trash2, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ── Constants ─────────────────────────────────────────────────────────────
const PINK = '#ED5F8D';
const BLUE = '#18305C';

// Status badge colors
const STATUS_STYLE = {
  'New': { bg: '#EFF6FF', color: '#3B82F6' },
  'In Progress': { bg: '#FEF3C7', color: '#B45309' },
  'Warm': { bg: '#FFF7ED', color: '#EA580C' },
  'Won': { bg: '#F0FDF4', color: '#16A34A' },
  'Lost': { bg: '#FFF1F2', color: '#E11D48' },
};

const getStatusStyle = (status) =>
  STATUS_STYLE[status] ?? { bg: '#F3F4F6', color: '#6B7280' };

// ── Skeleton Row ──────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr>
    {Array.from({ length: 9 }).map((_, i) => (
      <td key={i} style={{ padding: '16px 12px', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{
          height: '14px',
          borderRadius: '6px',
          background: 'linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.4s infinite',
          width: i === 0 ? '70px' : i === 8 ? '80px' : '100%',
        }} />
      </td>
    ))}
  </tr>
);

// ── Main Component ────────────────────────────────────────────────────────
/**
 * EnquiryTable
 *
 * Props:
 *  data         — array of enquiry objects
 *  fetchLoading — boolean
 *  onView       — (row) => void
 *  onEdit       — (row) => void
 *  onDelete     — (row) => void
 */
function EnquiryTable({ data = [], fetchLoading = false, onView, onEdit, onDelete }) {

  const isEmpty = !fetchLoading && data.length === 0;
  const navigate = useNavigate()

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .enq-row:hover { background: #FFF6F9; }
        .enq-row:hover td { color: ${BLUE}; }
        .enq-action-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
        }
        .enq-action-btn:hover { background: #F3F4F6; }

        /* Responsive card layout for mobile */
        @media (max-width: 768px) {
          .enq-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .enq-table { min-width: 780px; }
        }
      `}</style>

      <div className="enq-table-wrap" style={{
        background: 'white',
        borderRadius: '14px',
        border: '1.5px solid #E5E7EB',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}>
        <table className="enq-table" style={{ width: '100%', borderCollapse: 'collapse' }}>

          {/* ── Head ── */}
          <thead>
            <tr style={{ background: 'white', borderBottom: '2px solid #F3F4F6' }}>
              {[
                'Enquiry ID', 'Name', 'Phone No', 'Destination',
                'No. of Days', 'Source', 'Assigned To', 'Status', 'Actions'
              ].map((col, i) => (
                <th key={col} style={{
                  padding: '14px 12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#9CA3AF',
                  textAlign: i === 4 ? 'center' : 'left',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.01em',
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          {/* ── Body ── */}
          <tbody>
            {/* Loading skeletons */}
            {fetchLoading && Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}

            {/* Empty state */}
            {isEmpty && (
              <tr>
                <td colSpan={9} style={{
                  padding: '60px 20px',
                  textAlign: 'center',
                  color: '#9CA3AF',
                  fontSize: '14px',
                }}>
                  <div style={{ fontSize: '36px', marginBottom: '10px' }}>📋</div>
                  No enquiries found
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!fetchLoading && data.map((row, rowIdx) => {
              const account = row.accountId ?? {};
              const name = account.fullName ?? account.businessName ?? '—';
              const phone = account.phone ? `+91 ${String(account.phone).replace(/(\d{5})(\d{5})/, '$1 $2')}` : '—';
              const dest = Array.isArray(row.destinations) && row.destinations.length > 0
                ? row.destinations[0]
                : '—';
              const extraDest = Array.isArray(row.destinations) && row.destinations.length > 1
                ? `+${row.destinations.length - 1}`
                : null;
              const days = row.noOfDays != null ? String(row.noOfDays).padStart(2, '0') : '—';
              const source = account.source ?? row.source ?? '—';
              const assigned = row.assignedTo ?? '—';
              const status = row.status ?? '—';
              const { bg: sBg, color: sColor } = getStatusStyle(status);

              return (
                <tr
                  key={row._id ?? rowIdx}
                  className="enq-row"
                  style={{
                    borderBottom: rowIdx < data.length - 1 ? '1px solid #F3F4F6' : 'none',
                    transition: 'background 0.15s',
                    cursor: 'default',
                  }}
                >
                  {/* Enquiry ID */}
                  <td style={cellStyle}>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: PINK,
                    }}>
                      {row.enquiryId ?? '—'}
                    </span>
                  </td>

                  {/* Name */}
                  <td style={cellStyle}>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: BLUE }}>
                      {name}
                    </span>
                  </td>

                  {/* Phone */}
                  <td style={cellStyle}>
                    <span style={{ fontSize: '13px', color: '#4B5563', whiteSpace: 'nowrap' }}>
                      {phone}
                    </span>
                  </td>

                  {/* Destination */}
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '13px', color: '#374151' }}>{dest}</span>
                      {extraDest && (
                        <span style={{
                          fontSize: '11px', fontWeight: '600',
                          background: '#FFF6F9', color: PINK,
                          border: `1px solid #f9a8c3`,
                          borderRadius: '10px', padding: '1px 7px',
                        }}>
                          {extraDest}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* No. of Days */}
                  <td style={{ ...cellStyle, textAlign: 'center' }}>
                    <span>
                      {days}
                    </span>
                  </td>

                  {/* Source */}
                  <td style={cellStyle}>
                    <span style={{ fontSize: '13px', color: '#374151' }}>{source}</span>
                  </td>

                  {/* Assigned To */}
                  <td style={cellStyle}>
                    <span style={{ fontSize: '13px', color: '#374151' }}>{assigned}</span>
                  </td>

                  {/* Status */}
                  <td style={cellStyle}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: sBg,
                      color: sColor,
                      whiteSpace: 'nowrap',
                    }}>
                      {status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ ...cellStyle, whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      {/* View */}
                      <button
                        className="enq-action-btn"
                        title="View"
                        onClick={() => onView?.(row)}
                      >
                        <Eye size={16} color={PINK} />
                      </button>

                      {/* Copy */}
                      <button
                        className="enq-action-btn"
                        title="Copy"
                        onClick={() =>
                          navigate(`add-enquiry?id=${row._id}`)
                        }
                      >
                        <Copy size={16} color={PINK} />
                      </button>

                      {/* Edit */}
                      <button
                        className="enq-action-btn"
                        title="Edit"
                        onClick={() => onEdit?.(row)}
                      >
                        <Pencil size={15} color="#F59E0B" />
                      </button>

                      {/* Delete */}
                      <button
                        className="enq-action-btn"
                        title="Delete"
                        onClick={() => onDelete?.(row)}
                      >
                        <Trash2 size={15} color="#EF4444" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default EnquiryTable;

// ── Shared cell style ──────────────────────────────────────────────────────
const cellStyle = {
  padding: '15px 12px',
  fontSize: '13px',
  color: '#374151',
  verticalAlign: 'middle',
};