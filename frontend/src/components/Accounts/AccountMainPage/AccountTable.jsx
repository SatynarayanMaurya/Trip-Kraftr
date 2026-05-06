import React, { useState } from 'react';
import { Search, Eye, MessageCircle } from 'lucide-react';
import TableSkeleton from './TableSkeleton';

const PINK = '#ED5F8D';
const SOURCE_OPTIONS = ['Instagram', 'Referral', 'Direct'];

function Toggle({ value, onChange }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: '40px', height: '22px', borderRadius: '11px', cursor: 'pointer',
        background: value ? PINK : '#d1d5db',
        position: 'relative', transition: 'background 0.2s',
      }}
    >
      <div style={{
        width: '16px', height: '16px', borderRadius: '50%', background: 'white',
        position: 'absolute', top: '3px',
        left: value ? '21px' : '3px',
        transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </div>
  );
}

export default function AccountTable({ data = [], columns, fetchLoading, onView, onToggleActive }) {



  return (
    <div>


      {/* Table */}
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflowX: 'auto' }}>
        {fetchLoading ? (
          <TableSkeleton columns={columns} rows={5} />
        ) : data.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>No accounts found</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                {columns.map(col => (
                  <th key={col.key} style={{
                    padding: '14px 16px', textAlign: 'left', fontSize: '13px',
                    fontWeight: '600', color: '#6b7280', whiteSpace: 'nowrap',
                  }}>
                    {col?.label}
                  </th>
                ))}
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.map((row, i) => (
                <tr key={row._id} style={{ borderBottom: i < data?.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  {columns.map(col => (
                    <td key={col.key} style={{ padding: '14px 16px', fontSize: '14px', color: '#374151', whiteSpace: 'nowrap' }}>
                      {col.render ? col.render(row) : (row[col.key] || '—')}
                    </td>
                  ))}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button onClick={() => onView?.(row)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                        <Eye size={18} color={PINK} />
                      </button>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                        <MessageCircle size={18} color={PINK} />
                      </button>
                      <Toggle
                        value={row.isActive ?? true}
                        onChange={(val) => onToggleActive?.(row._id, val)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}