import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AddEnquiryB2B from './AddEnquiryB2B';
import AddEnquiryB2C from './AddEnquiryB2C';
import { useSelector } from 'react-redux';

const PINK = '#ED5F8D';
const BLUE = '#18305C';

function AddEnquiry() {
  const navigate = useNavigate()
  const [account, setAccount] =useState(useSelector(s=>s.enquiry.openTab));

  return (
    <div style={{  padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={()=>navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: PINK, padding: '4px', marginTop: '2px' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: BLUE }}>Add New Enquiry</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>Create a new trip request</p>
        </div>
      </div>

      {/* Card */}
      <div style={{
        background: 'white', borderRadius: '16px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: '28px',
      }}>
        {/* Tabs */}
        <div style={{
          display: 'flex', background: '#f3f4f6', borderRadius: '10px',
          padding: '4px', marginBottom: '28px',
        }}>
          {['b2b', 'b2c'].map((type) => (
            <button
              key={type}
              onClick={() => setAccount(type)}
              style={{
                flex: 1, padding: '12px 16px', border: 'none', cursor: 'pointer',
                borderRadius: '8px', fontSize: '14px', fontWeight: '600',
                transition: 'all 0.2s ease',
                background: account === type ? PINK : 'transparent',
                color: account === type ? 'white' : '#6b7280',
              }}
            >
              {type === 'b2b' ? 'B2B Accounts' : 'B2C Accounts'}
            </button>
          ))}
        </div>

        {/* Form */}
        {account === 'b2b' ? <AddEnquiryB2B /> : <AddEnquiryB2C />}
      </div>
    </div>
  );
}

export default AddEnquiry