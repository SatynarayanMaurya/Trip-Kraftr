
import React, { useState, lazy, Suspense } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { setOpenTab } from '../redux/slices/enquirySlice';

const B2BEnquiries = lazy(() => import("../components/Enquiries/Enquiry Main Page/B2BEnquiries"));
const B2CEnquries = lazy(() => import("../components/Enquiries/Enquiry Main Page/B2CEnquries"));

const PINK = '#ED5F8D';
const BLUE = '#18305C';

function Enquiries() {
  const dispatch = useDispatch()
  const account = useSelector(s=>s.enquiry.openTab)
  const navigate = useNavigate();

  const changeTab = (tab)=>{
    dispatch(setOpenTab(tab))
  }
  return (
    <div style={{ padding: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: BLUE }}>Enquiries</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>Manage your customer database</p>
        </div>
        <button
          onClick={() => navigate('add-enquiry')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 20px', background: PINK, color: 'white',
            border: 'none', borderRadius: '10px', fontSize: '14px',
            fontWeight: '600', cursor: 'pointer',
          }}
        >
          + Add Enquiry
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'inline-flex', background: '#f3f4f6', borderRadius: '10px',
        padding: '4px', marginBottom: '20px',
      }}>
        {['b2b', 'b2c'].map((type) => (
          <button
            key={type}
            onClick={() => changeTab(type)}
            style={{
              padding: '10px 32px', border: 'none', cursor: 'pointer',
              borderRadius: '8px', fontSize: '14px', fontWeight: '600',
              transition: 'all 0.2s ease',
              background: account === type ? PINK : 'transparent',
              color: account === type ? 'white' : '#6b7280',
            }}
          >
            {type === 'b2b' ? 'B2B Enquiries' : 'B2C Enquiries'}
          </button>
        ))}
      </div>

      {/* Content */}
      <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Loading accounts...</div>}>
        {account === 'b2b' ? <B2BEnquiries /> : <B2CEnquries />}
      </Suspense>

    </div>
  );
}

export default Enquiries