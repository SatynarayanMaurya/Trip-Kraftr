import React from 'react';

const shimmer = {
  background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%)',
  backgroundSize: '400% 100%',
  animation: 'shimmer 1.4s ease infinite',
};

const SkeletonCell = ({ width = '100%' }) => (
  <div
    style={{
      ...shimmer,
      height: '14px',
      width,
      borderRadius: '6px',
    }}
  />
);

export default function TableSkeleton({ columns = [], rows = 5 }) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        overflowX: 'auto',
      }}
    >
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -400px 0; }
            100% { background-position: 400px 0; }
          }
        `}
      </style>

      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
            {columns.map(col => (
              <th key={col.key} style={{
                padding: '14px 16px',
                textAlign: 'left',
                fontSize: '13px',
                fontWeight: '600',
                color: '#6b7280',
              }}>
                {col.label}
              </th>
            ))}
            <th style={{ padding: '14px 16px' }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
              
              {columns.map(col => (
                <td key={col.key} style={{ padding: '14px 16px' }}>
                  <SkeletonCell width="100%" />
                </td>
              ))}

              {/* Actions Skeleton */}
              <td style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <SkeletonCell width="40px" />
                  <SkeletonCell width="24px" />
                  <SkeletonCell width="40px" />
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}