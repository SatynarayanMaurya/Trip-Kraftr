
import React, { useState, lazy, Suspense } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { setOpenTab } from '../redux/slices/accountSlice';

const B2BAccounts = lazy(() => import("../components/Accounts/AccountMainPage/B2BAccounts"));
const B2CAccounts = lazy(() => import("../components/Accounts/AccountMainPage/B2CAccounts"));

const PINK = '#ED5F8D';
const BLUE = '#18305C';

function Accounts() {
  const dispatch = useDispatch()
  const account = useSelector(s=>s.account.openTab)
  const navigate = useNavigate();

  const changeTab = (tab)=>{
    dispatch(setOpenTab(tab))
  }
  return (
    <div style={{ padding: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: BLUE }}>Accounts</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>Manage your customer database</p>
        </div>
        <button
          onClick={() => navigate('add-account')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 20px', background: PINK, color: 'white',
            border: 'none', borderRadius: '10px', fontSize: '14px',
            fontWeight: '600', cursor: 'pointer',
          }}
        >
          + Add Account
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
            {type === 'b2b' ? 'B2B Accounts' : 'B2C Accounts'}
          </button>
        ))}
      </div>

      {/* Content */}
      <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Loading accounts...</div>}>
        {account === 'b2b' ? <B2BAccounts /> : <B2CAccounts />}
      </Suspense>

    </div>
  );
}

export default Accounts;


















// import React, { useState,lazy ,Suspense} from 'react'
// import {useNavigate} from 'react-router-dom'
// const B2BAccounts = lazy(() => import("../components/Accounts/AccountMainPage/B2BAccounts"));
// const B2CAccounts = lazy(() => import("../components/Accounts/AccountMainPage/B2CAccounts"));

// const PINK = '#ED5F8D';
// const BLUE = '#18305C';

// function Accounts() {
//   const [account, setAccount] = useState('b2b');
//   const navigate = useNavigate()

//   return (
//     <div style={{  padding: '14px', margin: '0 auto' }}>

//       {/* Header */}
//       <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px' }}>
//         <div>
//           <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: BLUE }}>Accounts</h2>
//           <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>Manage your customer database</p>
//         </div>

//         <div onClick={()=>navigate('add-account')}>Add Account</div>
//       </div>

//       {/* Card */}
//       <div style={{
//         background: 'white', borderRadius: '16px',
//         boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: '28px',
//       }}>
//         {/* Tabs */}
//         <div style={{
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
//         </div>


//       </div>
//       <div>
//       <Suspense fallback={<div>Loading accounts...</div>}>
//         {account === 'b2b' ? <B2BAccounts /> : <B2CAccounts />}
//       </Suspense>
//       </div>
//     </div>
//   );
// }

// export default Accounts