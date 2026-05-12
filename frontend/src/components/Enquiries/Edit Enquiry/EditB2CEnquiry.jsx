


import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useEnquiryHooks } from '../../../hooks/useEnquiryHooks';
import { useCommonHooks } from '../../../hooks/useCommonHooks';
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiUsers,
  FiSearch, FiX, FiCalendar, FiChevronDown, FiPlus, FiSave
} from 'react-icons/fi';
import { MdOutlineTravelExplore } from 'react-icons/md';

import { gridTwo, cardLabelStyle, cardValueStyle, saveBtn, cancelBtn, destTag, suggestionItem, suggestionBox, spinnerStyle, searchIcon, chevronIcon } from '../Add Enquiry/CommonCssForEnquiry';
import { useNavigate, useParams } from 'react-router-dom';

// ── Constants ──────────────────────────────────────────────────────────────
const PINK = '#ED5F8D';
const LIGHT_PINK = '#FFF6F9';
const BLUE = '#18305C';

const HOTEL_CATEGORIES = ['Budget', 'Premium', 'Luxury'];
const DIETARY_OPTIONS = ['Vegetarian', 'Non-Vegetarian', 'Both (Veg & Non-Veg)', 'Vegan', 'Jain'];
const TRIP_TYPES = ['Group Trip', 'Private'];
const STATUS_OPTIONS = ['New', 'In Progress', 'Warm', 'Won', 'Lost'];
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

// ── Tiny helpers ────────────────────────────────────────────────────────────
const inputStyle = (disabled = false) => ({
  width: '100%',
  padding: '10px 14px',
  border: `1.5px solid ${disabled ? '#f0d6e0' : '#e5e7eb'}`,
  borderRadius: '8px',
  fontSize: '14px',
  color: disabled ? PINK : BLUE,
  background: disabled ? LIGHT_PINK : 'white',
  outline: 'none',
  boxSizing: 'border-box',
  fontWeight: disabled ? '600' : '400',
  cursor: disabled ? 'default' : 'text',
  transition: 'border 0.2s',
});

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '600',
  color: '#374151',
  marginBottom: '6px',
};

const fieldWrap = { display: 'flex', flexDirection: 'column', gap: 0 };

// ── Component ───────────────────────────────────────────────────────────────
function EditB2CEnquiry({ onCancel }) {

  const navigate = useNavigate()
  const { enquiryId } = useParams()
  const isProduction = useSelector(s => s.user.isProduction);
  const { searchB2CAccountsForEnquiry } = useCommonHooks?.() ?? {};
  const { updateB2CEnquiryById,getb2cEnquiryById } = useEnquiryHooks()

  // ── search state ──
  const [searchInput, setSearchInput] = useState('');
  const [searchedAccounts, setSearchedAccounts] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const searchRef = useRef(null);



  const [enquiryDetails, setEnquiryDetails] = useState(null)

  const fetchEnquiry = async () => {
    try {
      setFetchLoading(true)
      const response = await getb2cEnquiryById(enquiryId)
      setEnquiryDetails(response?.data?.foundEnquiry)
    } catch (error) {
      if (!isProduction) console.log("Error:", error)
      toast.error(error?.response?.data?.message || error?.message || "Failed to fetch enquiry")
    } finally {
      setFetchLoading(false)
    }
  }

  useEffect(() => {
    if (enquiryId && !enquiryDetails) fetchEnquiry()
  }, [enquiryId])

  // ── form state ──
  const [form, setForm] = useState({
    tripType: 'Group Trip',
    status: 'New',
    assignedTo: '',
    noOfDays: '',
    totalMembers: '',
    adult: '',
    child: '',
    childAges: [],
    startDate: '',
    hotelCategory: '',
    dietaryPreference: '',
    destinations: [],
    notes: '',
  });

  useEffect(()=>{
    if(!enquiryDetails) return 
    setSearchInput(enquiryDetails?.accountId?.fullName)
    setForm({
      tripType: enquiryDetails?.tripType || 'Group Trip',
      status:  enquiryDetails?.status || 'New',
      assignedTo: enquiryDetails?.assignedTo || '',
      noOfDays:  enquiryDetails?.noOfDays || '',
      totalMembers: enquiryDetails?.totalMembers ||  '',
      adult: enquiryDetails?.adult ||  '',
      child:  enquiryDetails?.child || '',
      childAges: enquiryDetails?.childAges ||  [],
      startDate:  enquiryDetails?.startDate?.split("T")?.[0] || '',
      hotelCategory:  enquiryDetails?.hotelCategory || '',
      dietaryPreference: enquiryDetails?.dietaryPreference ||  '',
      destinations: enquiryDetails?.destinations ||  [],
      notes:  enquiryDetails?.notes || '',
    })
  },[enquiryDetails])

  const [destInput, setDestInput] = useState('');
  const [showDestDrop, setShowDestDrop] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // ── destination filtered list ──
  const filteredStates = INDIAN_STATES.filter(
    s => !form.destinations.includes(s) &&
      s.toLowerCase().includes(destInput.toLowerCase())
  );

  // ── click-outside to close suggestions ──
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current || !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── debounced search ──
  useEffect(() => {
    if (!searchInput?.trim()) {
      setSearchedAccounts([]);
      setShowSuggestions(false);
      return;
    }
    if (selectedAccount) {
      return;
    }
    fetchSuggestions()
  }, [searchInput]);

  const fetchSuggestions = async () => {
    try {
      setFetchLoading(true);
      const response = await searchB2CAccountsForEnquiry?.(searchInput);
      const accounts = response?.data?.searchedAccounts ?? [];
      setSelectedAccount(response?.data?.searchedAccounts?.[0])
      setSearchedAccounts(accounts);
      // setShowSuggestions(accounts.length > 0);
    } catch (error) {
      if (!isProduction) console.error(error);
      toast.error(error?.response?.data?.message || error?.message || 'Search failed');
    } finally {
      setFetchLoading(false);
    }
  };

  // ── select an account from suggestions ──
  const handleSelectAccount = (acc) => {
    setSelectedAccount(acc);
    setSearchInput(acc.businessName ?? '');
    setShowSuggestions(false);
    setSearchedAccounts([]);
  };

  // ── clear account selection ──
  const handleClearAccount = () => {
    setSelectedAccount(null);
    setSearchInput('');
    setSearchedAccounts([]);
    setShowSuggestions(false);
  };

  // ── child count change → sync childAges array ──
  const handleChildChange = (val) => {
    const n = Math.max(0, parseInt(val) || 0);
    setForm(f => ({
      ...f,
      child: val,
      childAges: Array.from({ length: n }, (_, i) => f.childAges[i] ?? ''),
    }));
  };

  const handleChildAge = (index, val) => {
    setForm(f => {
      const ages = [...f.childAges];
      ages[index] = val;
      return { ...f, childAges: ages };
    });
  };

  // ── destination helpers ──
  const addDestination = (state) => {
    setForm(f => ({ ...f, destinations: [...f.destinations, state] }));
    setDestInput('');
    setShowDestDrop(false);
  };

  const removeDestination = (state) => {
    setForm(f => ({ ...f, destinations: f.destinations.filter(d => d !== state) }));
  };

  // ── submit ──
  const handleSubmit = async () => {
    if (!selectedAccount) { toast.error('Please select a customer account'); return; }
    if (!form.noOfDays) { toast.error('No. of Days is required'); return; }
    if (!form.adult) { toast.error('Adult count is required'); return; }
    if (!form.startDate) { toast.error('Start Date is required'); return; }
    if (form.destinations.length === 0) { toast.error('Select at least one destination'); return; }

    const payload = {
      ...form,
      _id:enquiryDetails?._id,
      child: parseInt(form.child) || 0,
      adult: parseInt(form.adult) || 0,
      noOfDays: parseInt(form.noOfDays) || 0,
      totalMembers: parseInt(form.totalMembers) || 0,
      childAges: form.childAges.map(a => parseInt(a) || 0),
    };

    try {
      setSubmitLoading(true);
      const response = await updateB2CEnquiryById(payload)
      toast.success(response?.data?.message || 'Enquiry added successfully!');
      navigate('/enquiries')
    } catch (err) {
      if (!isProduction) console.error(err);
      toast.error(err?.response?.data?.message || err?.message || 'Failed to add enquiry');
    } finally {
      setSubmitLoading(false);
    }
  };

  // ── shared select style ──
  const selectStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    color: BLUE,
    background: 'white',
    outline: 'none',
    appearance: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box',
  };

  const childCount = parseInt(form.child) || 0;

  return (

    <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: PINK, padding: '4px', marginTop: '2px' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: BLUE }}>Update Enquiry  {enquiryDetails?.enquiryId||''}</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>Update this enquiry</p>
        </div>
      </div>

      {/* Card */}
      <div style={{
        background: 'white', borderRadius: '16px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: '28px',
      }}>

        {/* Form */}
        <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>

          {/* ── Row 1 : Trip Type + Status ── */}
          <div style={gridTwo}>
            <div style={fieldWrap}>
              <label style={labelStyle}>Trip Type</label>
              <div style={{ position: 'relative' }}>
                <select style={selectStyle} value={form.tripType}
                  onChange={e => setForm(f => ({ ...f, tripType: e.target.value }))}>
                  <option value="">Select</option>
                  {TRIP_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                <FiChevronDown style={chevronIcon} />
              </div>
            </div>

            <div style={fieldWrap}>
              <label style={labelStyle}>Status</label>
              <div style={{ position: 'relative' }}>
                <select style={selectStyle} value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="">Select</option>
                  {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
                <FiChevronDown style={chevronIcon} />
              </div>
            </div>
          </div>

          {/* ── Account Search Card ── */}
          <div style={{
            borderRadius: '12px',
            padding: '18px 20px',
            background: LIGHT_PINK,
            marginBottom: '20px',
            position: 'relative',
          }}>
            {/* B2C badge */}
            <span style={{
              position: 'absolute', top: '14px', right: '16px',
              background: PINK, color: 'white',
              fontSize: '11px', fontWeight: '700',
              borderRadius: '6px', padding: '3px 9px',
              letterSpacing: '0.5px',
            }}>B2C</span>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px 24px' }}
              className="account-grid">

              {/* Full Name (search) */}
              <div style={{ ...fieldWrap, position: 'relative' }} ref={searchRef}>
                <label style={cardLabelStyle}>
                  <FiUser style={{ color: PINK, marginRight: 5, verticalAlign: 'middle' }} />
                  Bussiness Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    readOnly
                    type="text"
                    placeholder="Search by business name or phone..."
                    value={searchInput}
                    onChange={e => {
                      setSearchInput(e.target.value);
                      if (selectedAccount) handleClearAccount();
                    }}
                    onFocus={() => searchedAccounts.length > 0 && setShowSuggestions(true)}
                    style={{
                      ...inputStyle(false),
                      paddingRight: '36px',
                      border: `1.5px solid #e5e7eb`,
                      background: 'white',
                      color: BLUE,
                      fontWeight: '600',
                    }}
                  />
                  {fetchLoading
                    ? <span style={spinnerStyle} />
                    : searchInput
                      ? <FiSearch style={{ ...searchIcon, color: '#9ca3af' }} />
                      : <FiSearch style={{ ...searchIcon, color: '#9ca3af' }} />
                  }
                </div>

                {/* Suggestions dropdown */}
                {showSuggestions && (
                  <div style={suggestionBox}>
                    {searchedAccounts?.map((acc, i) => (
                      <div
                        key={acc._id ?? i}
                        onMouseDown={() => handleSelectAccount(acc)}
                        style={suggestionItem}
                        onMouseEnter={e => e.currentTarget.style.background = LIGHT_PINK}
                        onMouseLeave={e => e.currentTarget.style.background = 'white'}
                      >
                        <div style={{ fontWeight: '600', color: BLUE, fontSize: '13px' }}>
                          {acc.businessName}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                          {acc.email} · {acc.phone}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Email Id */}
              <div style={fieldWrap}>
                <label style={cardLabelStyle}>
                  <FiMail style={{ color: PINK, marginRight: 5, verticalAlign: 'middle' }} />
                  Email Id *
                </label>
                <input
                  type="text"
                  value={selectedAccount?.email ?? ''}
                  disabled
                  placeholder="Auto filled"
                  style={cardValueStyle}
                />
              </div>

              {/* Phone */}
              <div style={fieldWrap}>
                <label style={cardLabelStyle}>
                  <FiPhone style={{ color: PINK, marginRight: 5, verticalAlign: 'middle' }} />
                  Phone no. *
                </label>
                <input
                  type="text"
                  value={selectedAccount ? `+91 ${selectedAccount.phone}` : ''}
                  disabled
                  placeholder="Auto filled"
                  style={cardValueStyle}
                />
              </div>

              {/* Source */}
              <div style={fieldWrap}>
                <label style={cardLabelStyle}>
                  <MdOutlineTravelExplore style={{ color: PINK, marginRight: 5, verticalAlign: 'middle' }} />
                  Source *
                </label>
                <input
                  type="text"
                  value={selectedAccount?.source ?? ''}
                  disabled
                  placeholder="Auto filled"
                  style={cardValueStyle}
                />
              </div>

            </div>
          </div>

          {/* ── Row 2 : Assigned To + No. of Days ── */}
          <div style={gridTwo}>
            <div style={fieldWrap}>
              <label style={labelStyle}>Total Members</label>
              <input type="number" placeholder="Total Members"
                value={form.totalMembers}
                onChange={e => setForm(f => ({ ...f, totalMembers: e.target.value }))}
                style={inputStyle()} />
            </div>

            <div style={fieldWrap}>
              <label style={labelStyle}>No. of Days *</label>
              <input type="number" min="0" placeholder="0"
                value={form.noOfDays}
                onChange={e => setForm(f => ({ ...f, noOfDays: e.target.value }))}
                style={inputStyle()} />
            </div>
          </div>

          {/* ── Row 3 : Adult + Child ── */}
          <div style={gridTwo}>
            <div style={fieldWrap}>
              <label style={labelStyle}>Adult *</label>
              <input type="number" min="0" placeholder="0"
                value={form.adult}
                onChange={e => setForm(f => ({ ...f, adult: e.target.value }))}
                style={inputStyle()} />
            </div>

            <div style={fieldWrap}>
              <label style={labelStyle}>Child *</label>
              <input type="number" min="0" placeholder="0"
                value={form.child}
                onChange={e => handleChildChange(e.target.value)}
                style={inputStyle()} />
            </div>
          </div>

          {/* ── Child Ages (dynamic) ── */}
          {childCount > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Child Ages *</label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                gap: '10px',
              }}>
                {form.childAges.map((age, i) => (
                  <div key={i} style={fieldWrap}>
                    <label style={{ ...labelStyle, fontSize: '12px', color: '#6b7280' }}>
                      Child {i + 1}
                    </label>
                    <input
                      type="number" min="0" max="17" placeholder="0"
                      value={age}
                      onChange={e => handleChildAge(i, e.target.value)}
                      style={{ ...inputStyle(), textAlign: 'center' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Row 4 : Start Date + Hotel Category ── */}
          <div style={gridTwo}>
            <div style={fieldWrap}>
              <label style={labelStyle}>Start Date *</label>
              <input type="date"
                value={form.startDate}
                onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                style={inputStyle()} />
            </div>

            <div style={fieldWrap}>
              <label style={labelStyle}>Hotel Category</label>
              <div style={{ position: 'relative' }}>
                <select style={selectStyle} value={form.hotelCategory}
                  onChange={e => setForm(f => ({ ...f, hotelCategory: e.target.value }))}>
                  <option value="">Select</option>
                  {HOTEL_CATEGORIES.map(h => <option key={h}>{h}</option>)}
                </select>
                <FiChevronDown style={chevronIcon} />
              </div>
            </div>
          </div>


          <div style={gridTwo}>
            <div style={fieldWrap}>
              <label style={labelStyle}>Assigned To</label>
              <input type="text" placeholder="Enter assignee"
                value={form.assignedTo}
                onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))}
                style={inputStyle()} />
            </div>

            <div style={{ ...fieldWrap, marginBottom: '20px' }}>
              <label style={labelStyle}>Dietary Preference</label>
              <div style={{ position: 'relative' }}>
                <select style={selectStyle} value={form.dietaryPreference}
                  onChange={e => setForm(f => ({ ...f, dietaryPreference: e.target.value }))}>
                  <option value="">Select</option>
                  {DIETARY_OPTIONS.map(d => <option key={d}>{d}</option>)}
                </select>
                <FiChevronDown style={chevronIcon} />
              </div>
            </div>
          </div>

          {/* ── Destination (multi-select) ── */}
          <div style={{ ...fieldWrap, marginBottom: '20px', position: 'relative' }}>
            <label style={labelStyle}>Destination *</label>

            {/* Selected tags */}
            {form.destinations.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                {form.destinations.map(d => (
                  <span key={d} style={destTag}>
                    <FiMapPin size={11} style={{ marginRight: 4 }} />
                    {d}
                    <FiX
                      size={13}
                      style={{ marginLeft: 6, cursor: 'pointer', flexShrink: 0 }}
                      onClick={() => removeDestination(d)}
                    />
                  </span>
                ))}
              </div>
            )}

            {/* Search input */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search & add destination..."
                value={destInput}
                onChange={e => { setDestInput(e.target.value); setShowDestDrop(true); }}
                onFocus={() => setShowDestDrop(true)}
                onBlur={() => setTimeout(() => setShowDestDrop(false), 150)}
                style={{ ...inputStyle(), paddingRight: '36px' }}
              />
              <FiMapPin style={searchIcon} />
            </div>

            {/* Dropdown */}
            {showDestDrop && filteredStates.length > 0 && (
              <div style={{ ...suggestionBox, maxHeight: '200px' }}>
                {filteredStates.map(state => (
                  <div
                    key={state}
                    onMouseDown={() => addDestination(state)}
                    style={suggestionItem}
                    onMouseEnter={e => e.currentTarget.style.background = LIGHT_PINK}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  >
                    <FiMapPin size={12} style={{ marginRight: 6, color: PINK }} />
                    {state}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Notes ── */}
          <div style={{ ...fieldWrap, marginBottom: '28px' }}>
            <label style={labelStyle}>Notes <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
            <textarea
              rows={3}
              placeholder="Any additional notes..."
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              style={{
                ...inputStyle(),
                resize: 'vertical',
                minHeight: '80px',
                fontFamily: 'inherit',
                lineHeight: '1.5',
              }}
            />
          </div>

          {/* ── Footer Buttons ── */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={onCancel} style={cancelBtn}>
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitLoading}
              style={{ ...saveBtn, opacity: submitLoading ? 0.7 : 1 }}
            >
              <FiSave size={15} style={{ marginRight: 6 }} />
              {submitLoading ? 'Saving...' : 'Save'}
            </button>
          </div>

          {/* ── Inline responsive styles ── */}
          <style>{`
            @media (max-width: 600px) {
            .account-grid {
            grid-template-columns: 1fr !important;
            }
            }
            `}</style>
        </div>
      </div>
    </div>

  );
}

export default EditB2CEnquiry