import React from 'react'

function GroupTripSkeletonCard() {
    const pulse = {
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
      borderRadius: '6px',
    };
    return (
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ ...pulse, height: '22px', width: '80px' }} />
        <div style={{ ...pulse, height: '20px', width: '70%' }} />
        <div style={{ ...pulse, height: '14px', width: '55%' }} />
        <div style={{ ...pulse, height: '14px', width: '90%' }} />
        <div style={{ ...pulse, height: '5px', width: '100%' }} />
        <div style={{ ...pulse, height: '32px', width: '110px' }} />
      </div>
    );
  }

export default GroupTripSkeletonCard