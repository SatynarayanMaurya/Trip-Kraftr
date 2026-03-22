


import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useRegionHooks } from '../hooks/useRegionHooks'
import { toast } from 'react-toastify'

import RegionsSkeleton from '../components/Regions/RegionsSkeleton'
import RegionDropDown from '../components/Common/RegionDropDown'


const placeholderImages = [
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=80',
  'https://assets.indiaonline.in/cg/up/About/Tourism/UP-varanasi.jpg',
  'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/1896345/628734_116385.jpeg',
]

function RegionCard({ region, index }) {
  const navigate = useNavigate()
  const imgSrc = region?.region_images?.[0] || placeholderImages?.[index % placeholderImages?.length]

  return (
    <div
      style={{
        background: 'linear-gradient(145deg, #1e2535, #1a2030)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
        <img
          src={imgSrc}
          alt={region?.masterRegionId?.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.src = placeholderImages[0] }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(26,32,48,0.85) 0%, transparent 60%)'
        }} />
        {/* ID tag */}
        <div style={{ position: 'absolute', bottom: '10px', left: '12px' }}>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
            #{region._id.slice(-6).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        {/* Name + Country */}
        <div className='flex justify-between items-center'>
          <div style={{ marginBottom: '6px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#f1f5f9' }}>
              {region?.masterRegionId?.name}
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {region?.masterRegionId?.country}
            </p>
          </div>
          <div >
            <span style={{
              padding: '3px 10px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.05em',
              background: region.is_active ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)',
              color: region.is_active ? '#4ade80' : '#f87171',
              border: `1px solid ${region.is_active ? 'rgba(74,222,128,0.35)' : 'rgba(248,113,113,0.35)'}`,
            }}>
              {region.is_active ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>
        </div>

        {/* Margin badges */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          <div style={{
            flex: 1,
            background: 'rgba(234,179,8,0.1)',
            border: '1px solid rgba(234,179,8,0.2)',
            borderRadius: '8px',
            padding: '6px 10px',
            textAlign: 'center',
          }}>
            <p style={{ margin: 0, fontSize: '10px', color: '#94a3b8', marginBottom: '2px' }}>Min Margin</p>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#eab308' }}>{region.min_margin}%</p>
          </div>
          <div style={{
            flex: 1,
            background: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: '8px',
            padding: '6px 10px',
            textAlign: 'center',
          }}>
            <p style={{ margin: 0, fontSize: '10px', color: '#94a3b8', marginBottom: '2px' }}>Max Margin</p>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#4ade80' }}>{region?.max_margin}%</p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={()=>navigate(`view-region/${region?._id}`)} style={{
            flex: 1,
            padding: '8px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'transparent',
            color: '#cbd5e1',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            View Details
          </button>
          <button
            onClick={()=>navigate(`edit-region/${region?._id}`)}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              background: 'rgba(234,179,8,0.15)',
              color: '#eab308',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(234,179,8,0.25)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(234,179,8,0.15)' }}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}

function Regions() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const allRegions = useSelector((state) => state.region.allRegions);
  const isProduction = useSelector((state) => state.user.isProduction);
  const loading = useSelector((state)=>state.user.loading)
  const [allCountry, setAllCountry] = useState(['All Country'])
  const [country, setCountry] = useState('All Country')
  const allCountryForSuggestions = useSelector((state)=>state.user.allCountryForSuggestions)
  
  const { getRegions,getCountryForOrg } = useRegionHooks();
  const [regionsFetched, setRegionsFetched] = useState(false);

  useEffect(() => {
    if (!allCountryForSuggestions) return;
  
    const country = allCountryForSuggestions
    setAllCountry(['All Country', ...country]);
  }, [allCountryForSuggestions]);

  
  const fetchCountryForSuggestion = async()=>{
    try{
      if(allCountryForSuggestions && allCountryForSuggestions?.length > 0) return 
      // setLoading(true)
      await getCountryForOrg()
      // setLoading(false)
    }
    catch(error){
      // setLoading(false)
      if (!isProduction) {
        console.log("========= ERROR DEBUG START =========");
        console.log("Error:", error);
        console.log("Response:", error?.response);
        console.log("========= ERROR DEBUG END =========");
      }
      toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
    }
  }

  useEffect(()=>{
    if(allCountryForSuggestions && allCountryForSuggestions?.length > 0) return 
    else{
      fetchCountryForSuggestion()
    }
  },[])
  
  const fetchRegions = useCallback(async () => {
    try {
      if (allRegions?.length > 0) return;
      // if(allRegions === null) return;  // If there are not any region present in db
      if(regionsFetched) return ;
  
      const res = await getRegions();
      setRegionsFetched(true)
    } catch (error) {
      if (!isProduction) {
        console.log("========= ERROR DEBUG START =========");
        console.log("Error:", error);
        console.log("Response:", error?.response);
        console.log("========= ERROR DEBUG END =========");
      }
  
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Error fetching regions"
      );
    }
  }, [allRegions, getRegions, isProduction]);
  
  useEffect(() => {
    if(allRegions?.length>0){
      return ;
    }
    fetchRegions();
  }, [fetchRegions]);

  const filtered = (!search && country === 'All Country')
  ? allRegions
  : allRegions?.filter(r =>
      r?.masterRegionId?.name?.toLowerCase()?.startsWith(search?.toLowerCase()) &&
      (country === 'All Country' ||
        r?.masterRegionId?.country?.toLowerCase()?.includes(country?.toLowerCase()))
    );


  return (
    <div style={{ minHeight: '100vh', background: '#0f1623', padding: '32px', fontFamily: "'Segoe UI', sans-serif" }}>


      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: '600', color: '#eab308', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          ● Management
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '800', color: '#f1f5f9', letterSpacing: '-0.5px' }}>
              Regions
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#475569' }}>
              {allRegions?.length} total · {allRegions?.filter(r => r?.is_active).length} active
            </p>
          </div>
          <button
            onClick={() => navigate('add-region')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              background: '#eab308',
              color: '#0f1623',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Region
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'TOTAL', value: allRegions?.length, color: '#f1f5f9' },
          { label: 'ACTIVE', value: allRegions?.filter(r => r?.is_active)?.length, color: '#4ade80' },
          { label: 'INACTIVE', value: allRegions?.filter(r => !r?.is_active).length, color: '#f87171' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'linear-gradient(145deg, #1e2535, #1a2030)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '12px',
            padding: '18px 20px',
          }}>
            <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#475569', fontWeight: '600', letterSpacing: '0.08em' }}>{stat.label}</p>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: '800', color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className='flex gap-4 items-center' style={{ position: 'relative', marginBottom: '24px', }}>
        <div style={{width: '480px' }}>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
          >
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search by region name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '11px 14px 11px 40px',
              background: '#1e2535',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              color: '#f1f5f9',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(234,179,8,0.4)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
          />
        </div>
        <div>
          <RegionDropDown value={country} onChange={(val)=>setCountry(val)} options={allCountry}/>
        </div>
      </div>

      {/* Showing count */}
      <p style={{ fontSize: '13px', color: '#475569', marginBottom: '18px' }}>
        Showing <span style={{ color: '#94a3b8', fontWeight: '600' }}>{filtered?.length}</span> of {allRegions?.length} regions
      </p>

      {/* Grid */}
      {
        loading ? <RegionsSkeleton/>:
        filtered?.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
          }}>
            {filtered?.map((region, idx) => (
              <RegionCard key={region?._id} region={region} index={idx} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#475569' }}>
            <p style={{ fontSize: '15px', fontWeight: '600', color: '#64748b' }}>No regions found</p>
            <p style={{ fontSize: '13px' }}>Try a different search term</p>
          </div>
        )}
      </div>
  )
}

export default Regions