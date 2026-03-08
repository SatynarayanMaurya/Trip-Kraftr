import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useRegionHooks } from '../../hooks/useRegionHooks'
import { toast } from 'react-toastify'
import {ArrowLeft} from "lucide-react"

const INDIA_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
]

const DEFAULT_COUNTRIES = ['India', 'Thailand', 'Singapore', 'Sri Lanka', 'Nepal', 'Maldives']

function SearchDropdown({ label, placeholder, options, value, onChange, onManualInput, allowManual = true, disabled = false, error }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [isManual, setIsManual] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = options.filter(o => o.toLowerCase().startsWith(search.toLowerCase()))

  const handleSelect = (opt) => {
    onChange(opt)
    setSearch('')
    setIsManual(false)
    setOpen(false)
  }

  const handleManualChange = (e) => {
    onChange(e.target.value)
    onManualInput && onManualInput(e.target.value)
  }

  const handleSearchInput = (e) => {
    setSearch(e.target.value)
    if (!open) setOpen(true)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <label style={{
        display: 'block',
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#9ca3af',
        marginBottom: '8px',
        fontFamily: "'DM Sans', sans-serif"
      }}>
        {label} <span style={{ color: '#f59e0b' }}>*</span>
      </label>

      {isManual ? (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            value={value}
            onChange={handleManualChange}
            disabled={disabled}
            placeholder={`Type ${label.toLowerCase()}...`}
            style={{
              flex: 1,
              background: '#1a2035',
              border: `1px solid ${error ? '#ef4444' : '#2d3a52'}`,
              borderRadius: '10px',
              padding: '12px 16px',
              color: '#e2e8f0',
              fontSize: '14px',
              fontFamily: "'DM Sans', sans-serif",
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = error ? '#ef4444' : '#f59e0b'}
            onBlur={e => e.target.style.borderColor = error ? '#ef4444' : '#2d3a52'}
          />
          <button
            onClick={() => { setIsManual(false); onChange(''); setSearch('') }}
            title="Back to dropdown"
            style={{
              background: '#1a2035',
              border: '1px solid #2d3a52',
              borderRadius: '8px',
              padding: '10px',
              cursor: 'pointer',
              color: '#9ca3af',
              fontSize: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            ↩
          </button>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: disabled ? '#131d2e' : '#1a2035',
              border: `1px solid ${error ? '#ef4444' : open ? '#f59e0b' : '#2d3a52'}`,
              borderRadius: '10px',
              padding: '0 16px',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              boxShadow: open ? '0 0 0 2px rgba(245,158,11,0.15)' : 'none',
              opacity: disabled ? 0.5 : 1,
            }}
            onClick={() => !disabled && setOpen(o => !o)}
          >
            <span style={{ fontSize: '14px', marginRight: '8px', color: '#6b7280' }}>🔍</span>
            <input
              value={open ? search : value}
              onChange={handleSearchInput}
              onClick={e => { e.stopPropagation(); !disabled && setOpen(true) }}
              disabled={disabled}
              placeholder={value || placeholder}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                padding: '12px 0',
                color: open ? '#e2e8f0' : (value ? '#e2e8f0' : '#4b5563'),
                fontSize: '14px',
                fontFamily: "'DM Sans', sans-serif",
                cursor: disabled ? 'not-allowed' : 'text',
              }}
            />
            <span style={{ color: '#6b7280', fontSize: '12px', marginLeft: '4px', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'inline-block' }}>▼</span>
          </div>

          {open && !disabled && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              background: '#1a2035',
              border: '1px solid #2d3a52',
              borderRadius: '10px',
              zIndex: 100,
              maxHeight: '220px',
              overflowY: 'auto',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}>
              {filtered?.length === 0 && (
                <div style={{ padding: '12px 16px', color: '#6b7280', fontSize: '13px' }}>
                  No results. {allowManual && (
                    <button
                      onMouseDown={() => { setIsManual(true); setOpen(false); setSearch('') }}
                      style={{ color: '#f59e0b', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: '600' }}
                    >
                      + Type manually
                    </button>
                  )}
                </div>
              )}
              {filtered?.map(opt => (
                <div
                  key={opt}
                  onMouseDown={() => handleSelect(opt)}
                  style={{
                    padding: '11px 16px',
                    cursor: 'pointer',
                    color: value === opt ? '#f59e0b' : '#d1d5db',
                    fontSize: '14px',
                    fontFamily: "'DM Sans', sans-serif",
                    background: value === opt ? 'rgba(245,158,11,0.08)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = value === opt ? 'rgba(245,158,11,0.08)' : 'transparent'}
                >
                  {opt}
                  {value === opt && <span style={{ color: '#22c55e', fontSize: '12px' }}>✓</span>}
                </div>
              ))}
              {allowManual && filtered?.length > 0 && (
                <div
                  onMouseDown={() => { setIsManual(true); setOpen(false); setSearch('') }}
                  style={{
                    padding: '10px 16px',
                    cursor: 'pointer',
                    color: '#f59e0b',
                    fontSize: '13px',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: '600',
                    borderTop: '1px solid #2d3a52',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}
                >
                  <span>✏️</span> Enter manually
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {error && (
        <p style={{ marginTop: '6px', color: '#ef4444', fontSize: '12px', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
}

function AddMasterRegion() {
  const [country, setCountry] = useState('')
  const [region, setRegion] = useState('')
  const [errors, setErrors] = useState({})
  const [successMsg, setSuccessMsg] = useState('')

  const isProduction = useSelector((state)=>state.user.isProduction)
  const loading = useSelector((state)=>state.user.loading)
  const navigate = useNavigate();
  const {addMasterRegion} = useRegionHooks()

  const isIndia = country.toLowerCase() === 'india'
  const regionOptions = isIndia ? INDIA_STATES : []

  const validate = () => {
    const e = {}
    if (!country.trim()) e.country = 'Country is required'
    if (!region.trim()) e.region = 'Region name is required'
    else if (region.trim().length < 2) e.region = 'Region name must be at least 2 characters'
    return e
  }

  const handleCountryChange = (val) => {
    setCountry(val)
    setRegion('')
    setErrors(prev => ({ ...prev, country: '', region: '' }))
  }

  const handleRegionChange = (val) => {
    setRegion(val)
    if (errors.region) setErrors(prev => ({ ...prev, region: '' }))
  }

  const handleSubmit = async() => {
    try{
        const e = validate()
        if (Object.keys(e).length > 0) {
          setErrors(e)
          return
        }
        const response = await addMasterRegion({country,region})
        toast.success(response?.data?.message)
        navigate(-1)
    }
    catch(error){
        if (!isProduction) {
          console.log("========= ERROR DEBUG START =========");
          console.log("Error:", error);
          console.log("Response:", error?.response);
          console.log("========= ERROR DEBUG END =========");
        }
        toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
    }
  }

  const handleReset = () => {
    setCountry('')
    setRegion('')
    setErrors({})
    setSuccessMsg('')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d1526',
      fontFamily: "'DM Sans', sans-serif",
      padding: '32px 40px',
    }}>
      {/* Google Font import via style tag */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d1526; }
        ::-webkit-scrollbar-thumb { background: #2d3a52; border-radius: 4px; }
      `}</style>

      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ color: '#f59e0b', fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}></span>
          MANAGEMENT
        </p>
        <h1 style={{ color: '#f1f5f9', fontSize: '28px', fontWeight: '700', margin: 0, letterSpacing: '-0.02em' }}>
          Add Master Region
        </h1>
        <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 mt-2 hover:text-[#b0b3b8] cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back to List
          </button>
      </div>


      {/* Form Card */}
      <div className='mx-auto' style={{
        background: '#111827',
        border: '1px solid #1e2d45',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '640px',
    
      }}>

        {/* Form Title Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          paddingBottom: '20px',
          borderBottom: '1px solid #1e2d45',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px', height: '38px',
              background: 'rgba(245,158,11,0.12)',
              border: '1px solid rgba(245,158,11,0.25)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px',
            }}>🗺️</div>
            <div>
              <p style={{ margin: 0, color: '#f1f5f9', fontWeight: '600', fontSize: '15px' }}>Region Details</p>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '12px' }}>Both fields are required</p>
            </div>
          </div>
          <span style={{
            fontSize: '11px',
            color: '#9ca3af',
            background: '#1a2035',
            border: '1px solid #2d3a52',
            borderRadius: '6px',
            padding: '4px 10px',
          }}>
            2 Fields
          </span>
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Country Field */}
          <SearchDropdown
            label="Country"
            placeholder="Search or select country..."
            options={DEFAULT_COUNTRIES}
            value={country}
            onChange={handleCountryChange}
            allowManual={true}
            error={errors.country}
          />

          {/* Region Name Field */}
          <div>
            <SearchDropdown
              label="Region Name"
              placeholder={
                !country
                  ? 'Select a country first...'
                  : isIndia
                  ? 'Search Indian states...'
                  : 'Type region name...'
              }
              options={regionOptions}
              value={region}
              onChange={handleRegionChange}
              allowManual={true}
              disabled={!country}
              error={errors.region}
            />
            {!country && !errors.region && (
              <p style={{ marginTop: '6px', color: '#4b5563', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>ℹ️</span> Please select a country to enable this field
              </p>
            )}
            {country && isIndia && !errors.region && (
              <p style={{ marginTop: '6px', color: '#6b7280', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>💡</span> All 28 Indian states available — or type manually
              </p>
            )}
            {country && !isIndia && !errors.region && (
              <p style={{ marginTop: '6px', color: '#6b7280', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>✏️</span> No preset regions for this country — type region manually
              </p>
            )}
          </div>
        </div>

        {/* Preview Row */}
        {(country || region) && (
          <div style={{
            marginTop: '28px',
            background: '#0d1526',
            border: '1px solid #1e2d45',
            borderRadius: '10px',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <span style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Preview:</span>
            {country && (
              <span style={{
                background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.25)',
                color: '#4ade80',
                borderRadius: '6px',
                padding: '3px 10px',
                fontSize: '13px',
                fontWeight: '500',
              }}>🌍 {country}</span>
            )}
            {country && region && <span style={{ color: '#4b5563' }}>→</span>}
            {region && (
              <span style={{
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.25)',
                color: '#fbbf24',
                borderRadius: '6px',
                padding: '3px 10px',
                fontSize: '13px',
                fontWeight: '500',
              }}>📍 {region}</span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '28px', paddingTop: '24px', borderTop: '1px solid #1e2d45' }}>
          <button
            onClick={handleReset}
            style={{
              flex: 1,
              padding: '13px',
              background: 'transparent',
              border: '1px solid #2d3a52',
              borderRadius: '10px',
              color: '#9ca3af',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.target.style.borderColor = '#4b5563'; e.target.style.color = '#d1d5db' }}
            onMouseLeave={e => { e.target.style.borderColor = '#2d3a52'; e.target.style.color = '#9ca3af' }}
          >
            Reset
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
                flex: 2,
                padding: '13px',
                background: '#22c55e',
                border: 'none',
                borderRadius: '10px',
                color: '#0d1526',
                fontSize: '14px',
                fontWeight: '700',
                cursor: loading ? 'default' : 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                letterSpacing: '0.02em',
                opacity: loading ? 0.8 : 1,
            }}
            onMouseEnter={e => {
                if (!loading) e.currentTarget.style.background = '#16a34a'
            }}
            onMouseLeave={e => {
                if (!loading) e.currentTarget.style.background = '#22c55e'
            }}
            >
            {loading ? (
                <>
                <svg
                    className="animate-spin"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    opacity="0.25"
                    />
                    <path
                    fill="currentColor"
                    opacity="0.75"
                    d="M4 12a8 8 0 018-8v8z"
                    />
                </svg>
                Saving...
                </>
            ) : (
                <>
                <span>+</span> Add Region
                </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddMasterRegion