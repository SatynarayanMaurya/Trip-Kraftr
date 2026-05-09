
import React, { useEffect, useState } from 'react';
import { inputStyle, labelStyle } from '../../Common/CommonCss';
import { useAccountHooks } from '../../../hooks/useAccountHooks';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom';
import { Save } from 'lucide-react'

const PINK = '#ED5F8D';
const BLUE = '#18305C';

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

function EditB2BAccount() {

    const { getB2BAccountById,updateB2BAccountById } = useAccountHooks();
    const [fetchLoading, setFetchLoading] = useState(false)
    const navigate = useNavigate()
    const {accountId} = useParams();

    const isProduction = useSelector((state) => state.user.isProduction)
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

    const [form, setForm] = useState({
        businessName: '', email: '', phone: '', secondaryPhone: '',
        source: '', referralBy: '', gstNo: '', state: '', address: '',
    });
    const [errors, setErrors] = useState({});
    const [submitLoading, setSubmitLoading] = useState(false)

    useEffect(() => {
        if (accountDetails) {
            setForm({
                businessName: accountDetails.businessName || '',
                email: accountDetails.email || '',
                phone: accountDetails.phone || '',
                secondaryPhone: accountDetails.secondaryPhone || '',
                source: accountDetails.source || '',
                referralBy: accountDetails.referralBy || '',
                gstNo: accountDetails.gstNo || '',
                state: accountDetails.state || '',
                address: accountDetails.address || '',
            });
        }
    }, [accountDetails]);

    const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

    const validate = (data) => {
        const e = {};
        if (!data.businessName.trim()) e.businessName = 'Business name is required';
        if (!data.source) e.source = 'Source is required';
        else if (data.businessName.length > 30) e.businessName = 'Max 30 characters';
        if (!data.email.trim()) e.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(data.email)) e.email = 'Enter a valid email';
        if (!data?.phone) e.phone = 'Phone number is required';
        else if (!/^\d{10}$/.test(data.phone)) e.phone = 'Enter valid 10-digit number';
        if (data.secondaryPhone && !/^\d{10}$/.test(data.secondaryPhone)) e.secondaryPhone = 'Enter valid 10-digit number';
        if (data.source === 'Referral' && !data.referralBy.trim()) e.referralBy = 'Referral name is required';
        return e;
    };

    const handleSubmit = async () => {
        const e = validate(form);
        setErrors(e);
        if (Object.keys(e).length !== 0) {
            return;
        }
        try {
            setSubmitLoading(true)
            const payload ={
                ...form,
                _id : accountDetails?._id
            }
            const response = await updateB2BAccountById(payload)
            toast.success(response?.data?.message)
            navigate(-1)
        }
        catch (error) {
            if (!isProduction) {
                console.log("========= ERROR DEBUG START =========");
                console.log("Error:", error);
                console.log("Response:", error?.response);
                console.log("========= ERROR DEBUG END =========");
            }
            toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
        }
        finally {
            setSubmitLoading(false)
        }

    };


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
                    <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: BLUE }}>Update Account</h2>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>Create a new customer profile</p>
                </div>
            </div>

            <div style={{
                background: 'white', borderRadius: '16px',
                boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: '28px',
            }}>
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
                            type="number" maxLength={10} placeholder="Enter Phone Number"
                            value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/, ''))} />
                        {errors.phone && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.phone}</p>}
                    </div>

                    <div>
                        <label style={labelStyle}>Secondary Number</label>
                        <input style={{ ...inputStyle, ...(errors.secondaryPhone ? errorBorder : {}) }}
                            type="number" maxLength={10} placeholder="Enter Secondary Number"
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
                        <button onClick={() => navigate(-1)} disabled={submitLoading}
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
            </div>

        </div>
    );
}

export default EditB2BAccount;










// import React, { useState } from 'react'
// import AddB2BAccounts from '.././AddB2BAccounts';
// import AddB2CAccounts from '.././AddB2CAccounts';
// import { useNavigate } from 'react-router-dom';

// const PINK = '#ED5F8D';
// const BLUE = '#18305C';

// function EditB2BAccount() {
//   const navigate = useNavigate()
//   const [account, setAccount] = useState('b2b');

//   return (
//     <div style={{  padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>

//       {/* Header */}
//       <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px' }}>
//         <button
//           onClick={()=>navigate(-1)}
//           style={{ background: 'none', border: 'none', cursor: 'pointer', color: PINK, padding: '4px', marginTop: '2px' }}
//         >
//           <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//             <line x1="19" y1="12" x2="5" y2="12" />
//             <polyline points="12 19 5 12 12 5" />
//           </svg>
//         </button>
//         <div>
//           <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: BLUE }}>Update Account</h2>
//           <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>Create a new customer profile</p>
//         </div>
//       </div>

//       {/* Card */}
//       <div style={{
//         background: 'white', borderRadius: '16px',
//         boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: '28px',
//       }}>
//         {/* Tabs */}
//         {/* <div style={{
//           display: 'flex', background: '#f3f4f6', borderRadius: '10px',
//           padding: '4px', marginBottom: '28px',
//         }}>
//           {['b2b', 'b2c'].map((type) => (
//             <button
//               key={type}
//               onClick={() => setAccount(type)}
//               style={{
//                 flex: 1, padding: '12px 16px', border: 'none', cursor: 'pointer',
//                 borderRadius: '8px', fontSize: '14px', fontWeight: '600',
//                 transition: 'all 0.2s ease',
//                 background: account === type ? PINK : 'transparent',
//                 color: account === type ? 'white' : '#6b7280',
//               }}
//             >
//               {type === 'b2b' ? 'B2B Accounts' : 'B2C Accounts'}
//             </button>
//           ))}
//         </div> */}

//         {/* Form */}
//         {account === 'b2b' ? <AddB2BAccounts /> : <AddB2CAccounts />}
//       </div>
//     </div>
//   );
// }

// export default EditB2BAccount