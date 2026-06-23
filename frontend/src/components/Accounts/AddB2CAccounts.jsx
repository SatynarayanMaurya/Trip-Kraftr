import React, { useState, useRef, useEffect } from 'react';
import { inputStyle, labelStyle } from '../Common/CommonCss';
import { useAccountHooks } from '../../hooks/useAccountHooks';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {Save} from 'lucide-react'
import { useRegionsData } from '../../hooks/Resuable Hooks/useResuableData';
const PINK = '#ED5F8D';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const SOURCE_OPTIONS = ['Instagram', 'Referral', 'Direct'];
const TRIP_TYPES = ['Group Trip', 'Private'];
const DIETARY_OPTIONS = ['Vegetarian', 'Non-Vegetarian', 'Both (Veg & Non-Veg)', 'Vegan', 'Jain'];

const errorBorder = { border: '1.5px solid #ef4444' };

// Multi-select destination dropdown
function DestinationSelect({ selected, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef();
  const { regions, loading: regionLoading } = useRegionsData();
  const [suggestedDestinations, setSuggestedDestinations] = useState([])
  useEffect(()=>{
      if(!regions)return ;
      setSuggestedDestinations(regions?.map(val=>val?.name))
  },[regions])

  const available = suggestedDestinations?.filter(s =>
    !selected.includes(s) && s.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger box */}
      <div onClick={() => setOpen(o => !o)} style={{
        ...inputStyle, cursor: 'pointer', minHeight: '40px',
        display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center',
      }}>
        {selected.length === 0 && <span style={{ color: '#aaa' }}>Select destinations</span>}
        {selected.map(s => (
          <span key={s} style={{
            background: '#fce7ef', color: PINK, fontSize: '12px',
            padding: '2px 8px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px'
          }}>
            {s}
            <span onClick={e => { e.stopPropagation(); onChange(selected.filter(x => x !== s)); }}
              style={{ cursor: 'pointer', fontWeight: '700' }}>×</span>
          </span>
        ))}
      </div>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 100,
          background: 'white', border: '1px solid #ddd', borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxHeight: '220px',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ padding: '8px' }}>
            <input autoFocus placeholder="Search..." value={search}
              onChange={e => setSearch(e.target.value)}
              onClick={e => e.stopPropagation()}
              style={{ ...inputStyle, fontSize: '13px' }} />
          </div>
          <div style={{ overflowY: 'auto' }}>
            {available.length === 0
              ? <p style={{ padding: '10px', color: '#aaa', fontSize: '13px', textAlign: 'center' }}>No options</p>
              : available.map(s => (
                <div key={s} onClick={() => { onChange([...selected, s]); setSearch(''); }}
                  style={{ padding: '9px 14px', fontSize: '13px', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fce7ef'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  {s}
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}

function AddB2CAccounts() {

  const {addB2CAccount} = useAccountHooks()
  const isProduction = useSelector(s=>s.user.isProduction)
  const navigate = useNavigate()
  const [submitLoading, setSubmitLoading] = useState(false)

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', month: '',
    source: '', referralby: '', destinations: [],
    noOfMembers: '', state: '', tripType: 'Group Trip',
    dietaryPreference: '', assignedTo: '',gstNo:'',
  });
  const [errors, setErrors] = useState({});

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const validate = (data) => {
    const e = {};
    if (!data.fullName.trim()) e.fullName = 'Full name is required';
    else if (data.fullName.length > 30) e.fullName = 'Max 30 characters';
    if (!data.source) e.source = 'Source is required';
    if (!data.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(data.email)) e.email = 'Enter a valid email';
    if (!data.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(data.phone)) e.phone = 'Enter valid 10-digit number';
    if (data.source === 'Referral' && !data.referralby.trim()) e.referralby = 'Referral name is required';
    if (data.noOfMembers && (isNaN(data.noOfMembers) || Number(data.noOfMembers) < 1)) e.noOfMembers = 'Enter a valid number';
    return e;
  };

  const handleSubmit = async() => {
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length !== 0) {
      return ;
    }
    try{
        setSubmitLoading(true)
        const response = await addB2CAccount(form)
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
    finally{
        setSubmitLoading(false)
    }

  };


  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>

      <div>
        <label style={labelStyle}>Full Name <span style={{ color: PINK }}>*</span> <span style={{ color: PINK, fontSize: '11px' }}>B2C</span></label>
        <input style={{ ...inputStyle, ...(errors.fullName ? errorBorder : {}) }}
          placeholder="Enter Name" maxLength={30}
          value={form.fullName} onChange={e => set('fullName', e.target.value)} />
        {errors.fullName && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.fullName}</p>}
      </div>

      <div>
        <label style={labelStyle}>Email ID <span style={{ color: PINK }}>*</span></label>
        <input style={{ ...inputStyle, ...(errors.email ? errorBorder : {}) }}
          type="email" placeholder="Enter Email"
          value={form.email} onChange={e => set('email', e.target.value)} />
        {errors.email && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.email}</p>}
      </div>

      <div>
        <label style={labelStyle}>Phone Number <span style={{ color: PINK }}>*</span></label>
        <input style={{ ...inputStyle, ...(errors.phone ? errorBorder : {}) }}
          type="tel" maxLength={10} placeholder="Enter Phone Number"
          value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/, ''))} />
        {errors.phone && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.phone}</p>}
      </div>

      <div>
        <label style={labelStyle}>Month</label>
        <select style={inputStyle} value={form.month} onChange={e => set('month', e.target.value)}>
          <option value="">Select Month</option>
          {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div>
        <label style={labelStyle}>Source</label>
        <select style={inputStyle} value={form.source}
          onChange={e => { set('source', e.target.value); if (e.target.value !== 'Referral') set('referralby', ''); }}>
          <option value="">Select Source</option>
          {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.source && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.source}</p>}
      </div>

      <div>
        <label style={labelStyle}>Referral {form.source === 'Referral' && <span style={{ color: PINK }}>*</span>}</label>
        <input
          style={{ ...inputStyle, ...(errors.referralby ? errorBorder : {}), background: form.source !== 'Referral' ? '#f5f5f5' : 'white' }}
          placeholder="Enter referralby name" maxLength={50}
          disabled={form.source !== 'Referral'}
          value={form.referralby} onChange={e => set('referralby', e.target.value)} />
        {errors.referralby && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.referralby}</p>}
      </div>

      <div>
        <label style={labelStyle}>Destinations</label>
        <DestinationSelect selected={form.destinations} onChange={val => set('destinations', val)} />
      </div>

      <div>
        <label style={labelStyle}>No. of Members</label>
        <input style={{ ...inputStyle, ...(errors.noOfMembers ? errorBorder : {}) }}
          type="number" min="1" placeholder="Enter number"
          value={form.noOfMembers} onChange={e => set('noOfMembers', e.target.value)} />
        {errors.noOfMembers && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.noOfMembers}</p>}
      </div>

      <div>
        <label style={labelStyle}>State</label>
        <select style={inputStyle} value={form.state} onChange={e => set('state', e.target.value)}>
          <option value="">Select State</option>
          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label style={labelStyle}>Trip Type</label>
        <select style={inputStyle} value={form.tripType} onChange={e => set('tripType', e.target.value)}>
          {TRIP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label style={labelStyle}>Dietary Preference</label>
        <select style={inputStyle} value={form.dietaryPreference} onChange={e => set('dietaryPreference', e.target.value)}>
          <option value="">Select Preference</option>
          {DIETARY_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div>
        <label style={labelStyle}>Assigned To</label>
        <input style={inputStyle} placeholder="Enter name" maxLength={50}
          value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)} />
      </div>

      <div>
        <label style={labelStyle}>GST Number</label>
        <input style={inputStyle} placeholder="Enter name" maxLength={50}
          value={form.gstNo} onChange={e => set('gstNo', e.target.value)} />
      </div>

      {/* Buttons */}
      <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
        <button onClick={()=>navigate(-1)}
          style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontSize: '14px' }}>
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitLoading}
          className={`flex items-center gap-2 px-6 py-2.5 bg-[${PINK}] text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-pink-200
            ${submitLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {submitLoading ? (
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
            </svg>
          ) : (
            <Save size={16} />
          )}
          {submitLoading ? 'Saving...' : 'Save'}
        </button>
      </div>

    </div>
  );
}

export default AddB2CAccounts;