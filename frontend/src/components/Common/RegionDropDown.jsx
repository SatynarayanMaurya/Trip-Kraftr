import { useEffect, useRef, useState } from "react"
import {
    Car,  Map, LayoutGrid, Plus, Search, SlidersHorizontal,
     ChevronDown, X
  } from 'lucide-react'

function RegionDropDown({ value, onChange, options }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)
  
    useEffect(() => {
      const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
      document.addEventListener('mousedown', h)
      return () => document.removeEventListener('mousedown', h)
    }, [])
  
    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            boxShadow: open
              ? '0 0 0 3px rgba(24,48,92,0.08), 0 2px 8px rgba(0,0,0,0.10)'
              : '0 1px 6px rgba(0,0,0,0.09)',
            border: open ? '1.5px solid #18305C' : '1.5px solid #E5E7EB',
            transition: 'all 0.15s ease',
          }}
          className="flex items-center gap-2 px-3.5 py-[9px] bg-white text-sm font-semibold rounded-xl whitespace-nowrap text-[#18305C]"
        >
          {value}
          <ChevronDown
            size={15}
            strokeWidth={2.5}
            className="text-[#18305C]"
            style={{
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          />
        </button>
        {open && (
          <div
            className="absolute z-30 mt-1.5 min-w-full bg-white border border-gray-200 rounded-xl overflow-hidden"
            style={{ boxShadow: '0 8px 28px rgba(0,0,0,0.13)' }}
          >
            {options?.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false) }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors whitespace-nowrap
                  ${value === opt
                    ? 'bg-[#18305C] text-white font-semibold'
                    : 'text-[#18305C] hover:bg-[#F5F7FA] font-medium'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  export default RegionDropDown