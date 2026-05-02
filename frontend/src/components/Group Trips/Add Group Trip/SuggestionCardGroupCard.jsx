

import React from 'react';
import { Eye, RefreshCw } from 'lucide-react';

const STATUS_STYLES = {
  new:       { bg: '#e0f2fe', color: '#0369a1', icon: '●' },
  planning:  { bg: '#fff7ed', color: '#c2410c', icon: '●' },
  confirmed: { bg: '#dcfce7', color: '#15803d', icon: '✓' },
  completed: { bg: '#dcfce7', color: '#166534', icon: '✓' },
  cancelled: { bg: '#fee2e2', color: '#b91c1c', icon: '✕' },
  created:   { bg: '#f3e8ff', color: '#7e22ce', icon: '●' },
};

function getDays(itineraryBuilder) {
  const days = itineraryBuilder?.daysDetails?.length;
  if (!days) return null;
  return `${days}N / ${days + 1}D`;
}

const images = [
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG5hdHVyZXxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG5hdHVyZXxlbnwwfHwwfHx8MA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1711434824963-ca894373272e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bmF0dXJlfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dHJhdmVsaW5nfGVufDB8fDB8fHww",
]
function Card({ val, cardClick,index }) {
  const status = val?.status || 'new';
  const style = STATUS_STYLES[status] || STATUS_STYLES.created;
  const days = getDays(val?.itineraryBuilder);

  return (
    <div
      style={{
        width: '260px',
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '2px solid #b2d8f7',
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s, transform 0.2s',
        fontFamily: 'sans-serif',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.13)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative' }}>
        <img
          src={images?.[index] || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJo7n7XXByw40QwFnGILGMq2BxD55PkKl8yA&s"}
          alt="trip"
          style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }}
        />

        {/* Trip ID — top left */}
        <span style={{
          position: 'absolute', top: '10px', left: '10px',
          background: 'rgba(255,255,255,0.18)',
          backdropFilter: 'blur(6px)',
          color: 'white',
          fontSize: '12px', fontWeight: '700',
          padding: '4px 10px', borderRadius: '20px',
          letterSpacing: '0.5px',
          textShadow: '0 1px 4px rgba(0,0,0,0.4)',
        }}>
          {val?.tripId || '—'}
        </span>

        {/* Status Badge — top right */}
        <span style={{
          position: 'absolute', top: '10px', right: '10px',
          background: style.bg,
          color: style.color,
          fontSize: '11px', fontWeight: '600',
          padding: '4px 10px', borderRadius: '20px',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}>
          <span style={{ fontSize: '10px' }}>{style.icon}</span>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      {/* Bottom Content */}
      <div style={{ padding: '12px 14px' }}>
        {/* Name row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontWeight: '700', fontSize: '15px', color: '#1a1a2e' }}>
              {val?.tripId || '—'}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
              {val?.itineraryBuilder?.tripOverview || 'Group Trip'}
            </div>
          </div>

          {/* Days */}
          {days && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              fontSize: '12px', color: '#374151', fontWeight: '500',
              marginTop: '2px',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {days}
            </div>
          )}
        </div>

        {/* Action Icons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '2px' }}>
          <a
            href={`/group-trips/view/${val?._id}`}
            target='_blank'
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#ED5F8D', padding: '4px',
              display: 'flex', alignItems: 'center',
            }}
            title="View"
          >
            <Eye size={20} />
          </a>
          <button
            onClick={()=>cardClick(val)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#ED5F8D', padding: '4px',
              display: 'flex', alignItems: 'center',
            }}
            title="Reassign"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SuggestionCardGroupCard({ data, closeSuggestion, setSelectedGroupTripDetails }) {
  const cardClick = (val) => {
    setSelectedGroupTripDetails(val);
    closeSuggestion();
  };

  return (
    <div style={{ width: '100%', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a2e', margin: 0 }}>
          Suggested Group Trips
        </h2>
        <button
          onClick={closeSuggestion}
          style={{
            fontSize: '13px', color: '#6b7280', background: 'none',
            border: 'none', cursor: 'pointer', fontWeight: '500',
          }}
        >
          Skip
        </button>
      </div>

      {/* Cards */}
      {!data?.length ? (
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '40px 0' }}>
          No matching group trips found. Proceed manually.
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {data.map((val,idx) => (
            <Card key={val._id} val={val} cardClick={cardClick} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SuggestionCardGroupCard;

























// import React from 'react'


// function Card({ val }) {
//   const status = val?.status || "created";

//   const STATUS_STYLES = {
//     new: "bg-purple-100 text-purple-700",
//     planning: "bg-orange-100 text-orange-700",
//     confirmed: "bg-green-100 text-green-700",
//     completed: "bg-green-200 text-green-800",
//     cancelled: "bg-red-100 text-red-700",
//   };

//   return (
//     <div className="w-full sm:w-[260px] bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer">
      
//       {/* Image Section */}
//       <div className="relative">
//         <img
//           src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJo7n7XXByw40QwFnGILGMq2BxD55PkKl8yA&s"
//           alt="trip"
//           className="w-full h-[150px] object-cover"
//         />

//         {/* Status Badge */}
//         <span
//           className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full font-medium ${STATUS_STYLES[status]}`}
//         >
//           {status}
//         </span>
//       </div>

//       {/* Content */}
//       <div className="p-3 flex flex-col gap-2">
//         <div className="flex justify-between text-sm">
//           <span className="text-gray-500">Trip ID</span>
//           <span className="font-medium text-gray-800">
//             {val?.tripId || "—"}
//           </span>
//         </div>

//         {/* Optional extra info (future ready) */}
//         <div className="text-xs text-gray-400">
//           Click to view details →
//         </div>
//       </div>
//     </div>
//   );
// }
// function SuggestionCardGroupCard({ data, closeSuggestion, setSelectedGroupTripDetails }) {

//   const cardClick = (val) => {
//     setSelectedGroupTripDetails(val);
//     closeSuggestion();
//   };

//   console.log("data : ",data)


//   return (
//     <div className="w-full">
      
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-lg font-semibold text-gray-800">
//           Suggested Group Trips
//         </h2>
//         <button
//           onClick={closeSuggestion}
//           className="text-sm text-gray-500 hover:text-black transition"
//         >
//           Skip
//         </button>
//       </div>

//       {/* Content */}
//       {data?.length === 0 ? (
//         <div className="text-center text-gray-500 py-10">
//           No matching group trips found. Proceed manually.
//         </div>
//       ) : (
//         <div className="flex flex-wrap gap-6">
//           {data?.map((val) => (
//             <div key={val?._id} onClick={() => cardClick(val)}>
//               <Card val={val} />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default SuggestionCardGroupCard