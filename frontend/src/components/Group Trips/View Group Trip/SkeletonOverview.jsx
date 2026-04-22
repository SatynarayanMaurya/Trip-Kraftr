import React from 'react'

function Skeleton({ w = '100%', h = '16px', radius = '6px' }) {
    return (
        <div style={{
            width: w, height: h, borderRadius: radius,
            background: 'linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.4s infinite',
        }} />
    );
}

function SkeletonOverview() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #f0f0f0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Skeleton w="140px" h="18px" />
                <Skeleton h="14px" />
                <Skeleton w="80%" h="14px" />
            </div>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 2, minWidth: '260px', background: 'white', borderRadius: '12px', border: '1px solid #f0f0f0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <Skeleton w="140px" h="18px" /><Skeleton h="28px" w="100px" /><Skeleton h="10px" radius="10px" />
                </div>
                <div style={{ flex: 1, minWidth: '200px', background: '#f5f7fc', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <Skeleton w="120px" h="18px" /><Skeleton h="38px" radius="8px" />
                </div>
            </div>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {[1, 2, 3].map(i => (
                    <div key={i} style={{ flex: 1, minWidth: '220px', background: 'white', borderRadius: '12px', border: '1px solid #f0f0f0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <Skeleton w="160px" h="18px" />
                        {[1, 2, 3].map(j => <Skeleton key={j} h="13px" />)}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SkeletonOverview