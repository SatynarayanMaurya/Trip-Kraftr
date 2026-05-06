import React, { useState } from 'react';
import { inputStyle, labelStyle } from '../Common/CommonCss';
import { useAccountHooks } from '../../hooks/useAccountHooks';
import { useSelector } from 'react-redux';
import {toast} from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import {Save} from 'lucide-react'

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

const SOURCE_OPTIONS = ['Instagram', 'Referral', 'Direct'];

const errorBorder = { border: '1.5px solid #ef4444' };

function AddB2BAccounts() {

    const {addB2BAccount} = useAccountHooks();
    const navigate = useNavigate()

    const isProduction = useSelector((state)=>state.user.isProduction)


  const [form, setForm] = useState({
    businessName: '', email: '', phone: '', secondaryPhone: '',
    source: '', referralBy: '', gstNo: '', state: '', address: '',
  });
  const [errors, setErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false)

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const validate = (data) => {
    const e = {};
    if (!data.businessName.trim()) e.businessName = 'Business name is required';
    if (!data.source) e.source = 'Source is required';
    else if (data.businessName.length > 30) e.businessName = 'Max 30 characters';
    if (!data.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(data.email)) e.email = 'Enter a valid email';
    if (!data.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(data.phone)) e.phone = 'Enter valid 10-digit number';
    if (data.secondaryPhone && !/^\d{10}$/.test(data.secondaryPhone)) e.secondaryPhone = 'Enter valid 10-digit number';
    if (data.source === 'Referral' && !data.referralBy.trim()) e.referralBy = 'Referral name is required';
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
        const response = await addB2BAccount(form)
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
        <label style={labelStyle}>Business Name <span style={{ color: PINK }}>*</span> <span style={{ color: PINK, fontSize: '11px' }}>B2B</span></label>
        <input style={{ ...inputStyle, ...(errors.businessName ? errorBorder : {}) }}
          placeholder="Enter Name" maxLength={30}
          value={form.businessName} onChange={e => set('businessName', e.target.value)} />
        {errors.businessName && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.businessName}</p>}
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
        <label style={labelStyle}>Secondary Number</label>
        <input style={{ ...inputStyle, ...(errors.secondaryPhone ? errorBorder : {}) }}
          type="tel" maxLength={10} placeholder="Enter Secondary Number"
          value={form.secondaryPhone} onChange={e => set('secondaryPhone', e.target.value.replace(/\D/, ''))} />
        {errors.secondaryPhone && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.secondaryPhone}</p>}
      </div>

      <div>
        <label style={labelStyle}>Source</label>
        <select style={inputStyle} value={form.source}
          onChange={e => { set('source', e.target.value); if (e.target.value !== 'Referral') set('referralBy', ''); }}>
          <option value="">Select Source</option>
          {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.source && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.source}</p>}
      </div>

      <div>
        <label style={labelStyle}>Referral By {form.source === 'Referral' && <span style={{ color: PINK }}>*</span>}</label>
        <input
          style={{ ...inputStyle, ...(errors.referralBy ? errorBorder : {}), background: form.source !== 'Referral' ? '#f5f5f5' : 'white' }}
          placeholder="Enter referral name" maxLength={50}
          disabled={form.source !== 'Referral'}
          value={form.referralBy} onChange={e => set('referralBy', e.target.value)} />
        {errors.referralBy && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.referralBy}</p>}
      </div>

      <div>
        <label style={labelStyle}>GST No</label>
        <input style={inputStyle} placeholder="Enter GST Number" maxLength={15}
          value={form.gstNo} onChange={e => set('gstNo', e.target.value.toUpperCase())} />
      </div>

      <div>
        <label style={labelStyle}>State</label>
        <select style={inputStyle} value={form.state} onChange={e => set('state', e.target.value)}>
          <option value="">Select State</option>
          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Address full width */}
      <div style={{ gridColumn: '1 / -1' }}>
        <label style={labelStyle}>Address</label>
        <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '70px' }}
          placeholder="Enter Address" maxLength={200}
          value={form.address} onChange={e => set('address', e.target.value)} />
      </div>

      {/* Buttons */}
      <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
        <button onClick={()=>navigate(-1)} disabled={submitLoading}
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

export default AddB2BAccounts;