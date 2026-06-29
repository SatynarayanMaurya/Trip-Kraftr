
import React, { useEffect, useState } from 'react'
import { useAccountHooks } from '../../../hooks/useAccountHooks'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  ArrowLeft, Phone, Mail, Pencil, Trash2,
   Package
} from 'lucide-react'

import PackageCard from './PackageCard'

const PINK = '#ED5F8D'
const BLUE = '#18305C'

// ── Dummy packages ────────────────────────────────────────────────────────────
const DUMMY_PACKAGES = [
  { id: 'TRIP-101', title: 'Luxury Maldives Escape', status: 'Active', type: 'Private', location: 'Maldives', duration: '5D/4N', price: '2,45,000' },
  { id: 'TRIP-102', title: 'Golden Triangle Tour', status: 'Active', type: 'Group',   location: 'Delhi, Agra, Jaipur', duration: '6D/5N', price: '1,85,000' },
  { id: 'TRIP-103', title: 'Kerala Backwaters',    status: 'Active', type: 'Private', location: 'Kerala', duration: '4D/3N', price: '98,000' },
//   { id: 'TRIP-104', title: 'Himalayan Adventure',  status: 'Active', type: 'Group',   location: 'Manali', duration: '7D/6N', price: '1,20,000' },
]

// ── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ value }) {
  return (
    <div style={{
      width: '44px', height: '24px', borderRadius: '12px',
      background: value ? PINK : '#d1d5db',
      position: 'relative', cursor: 'pointer',
    }}>
      <div style={{
        width: '18px', height: '18px', borderRadius: '50%', background: 'white',
        position: 'absolute', top: '3px',
        left: value ? '23px' : '3px',
        transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </div>
  )
}

// ── Info row inside cards ─────────────────────────────────────────────────────
function InfoRow({ label, value }) {
  return (
    <div>
      <p style={{ margin: '0 0 2px', fontSize: '12px', color: '#9ca3af' }}>{label}</p>
      <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: BLUE }}>{value || '—'}</p>
    </div>
  )
}

// ── Contact row ───────────────────────────────────────────────────────────────
function ContactRow({ icon: Icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%',
        background: '#fce7ef', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={15} color={PINK} />
      </div>
      <div>
        <p style={{ margin: '0 0 2px', fontSize: '12px', color: '#9ca3af' }}>{label}</p>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: BLUE }}>{value || '—'}</p>
      </div>
    </div>
  )
}

// ── Package card ──────────────────────────────────────────────────────────────


// ── Main Component ────────────────────────────────────────────────────────────
function ViewB2BAccount() {
  const { getB2BAccountById } = useAccountHooks()
  const isProduction = useSelector(s => s.user.isProduction)
  const [fetchLoading, setFetchLoading] = useState(false)
  const { accountId } = useParams()
  const navigate = useNavigate()
  const accountDetails = useSelector(s => s.account.b2bAccountsByIds?.[accountId])

  const fetchAccountDetails = async () => {
    try {
      setFetchLoading(true)
      await getB2BAccountById(accountId)
    } catch (error) {
      if (!isProduction) {
        console.log("Error:", error)
        console.log("Response:", error?.response)
      }
      toast.error(error?.response?.data?.message || error?.message || "Error fetching account details")
    } finally {
      setFetchLoading(false)
    }
  }

  useEffect(() => {
    if (accountId) fetchAccountDetails()
  }, [accountId])

  if (fetchLoading) {
    return <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>Loading...</div>
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1100px' }}>

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'none', border: 'none', cursor: 'pointer',
          color: BLUE, fontSize: '14px', fontWeight: '600', marginBottom: '20px', padding: 0,
        }}
      >
        <ArrowLeft size={16} color={PINK} /> Back to List
      </button>

      {/* Header Card */}
      <div style={{
        background: 'white', borderRadius: '14px',
        border: '1px solid #e5e7eb', padding: '20px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '12px', marginBottom: '20px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: BLUE }}>
              {accountDetails?.businessName || 'Business Name'}
            </h2>
            <span style={{
              background: '#e0f2fe', color: '#0369a1',
              fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px',
            }}>B2B</span>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: PINK, fontWeight: '500' }}>
            {accountDetails?.accountId || '—'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button  onClick={()=>navigate(`/accounts/update-b2b/${accountId}`)}  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <Pencil size={18} color={PINK} />
          </button>
        </div>
      </div>

      {/* Info + Contact Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '4fr 2fr', gap: '16px', marginBottom: '28px' }}>

        {/* Account Information */}
        <div style={{
          background: 'linear-gradient(135deg, #ffffff, #FFF5F8)',
          borderRadius: '14px', border: '1px solid #fce7ef', padding: '20px',
        }}>
          <h3 style={{ margin: '0 0 18px', fontSize: '15px', fontWeight: '700', color: BLUE }}>Account Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            <InfoRow label="Source" value={accountDetails?.source} />
            <InfoRow label="State" value={accountDetails?.state} />
            {accountDetails?.source === 'Referral' && (
              <InfoRow label="Referral By" value={accountDetails?.referralBy} />
            )}
            <InfoRow label="GST Number" value={accountDetails?.gstNo} />
            <div style={{ gridColumn: '1 / -1' }}>
              <InfoRow label="Address" value={accountDetails?.address} />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div style={{
          background: 'white', borderRadius: '14px',
          border: '1px solid #e5e7eb', padding: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: BLUE }}>Contact Information</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ContactRow icon={Phone} label="Phone Number" value={accountDetails?.phone ? `+91 ${accountDetails.phone}` : '—'} />
            <ContactRow icon={Phone} label="Whatsapp Number" value={accountDetails?.whatsappNo ? `+91 ${accountDetails.whatsappNo}` : '—'} />
            <ContactRow icon={Phone} label="Secondary No." value={accountDetails?.secondaryPhone ? `+91 ${accountDetails.secondaryPhone}` : '—'} />
            <ContactRow icon={Mail} label="Email Address" value={accountDetails?.email} />
          </div>
        </div>
      </div>

      {/* Packages */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: '#B9AEF240', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Package size={18} color="#7c6fcd" />
          </div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: BLUE }}>Linked Packages</h3>
          <button style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: PINK, fontSize: '22px', fontWeight: '300', lineHeight: 1, padding: '0 4px',
          }}>+</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {DUMMY_PACKAGES.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
        </div>
      </div>

    </div>
  )
}

export default ViewB2BAccount










