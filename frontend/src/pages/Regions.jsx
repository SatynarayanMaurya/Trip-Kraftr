import React from 'react'
import { useNavigate } from 'react-router-dom'

function Regions() {
    const navigate = useNavigate()
  return (
    <div>Regions
        <button onClick={()=>navigate("add-region")} className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg'>Add Region</button>
    </div>
  )
}

export default Regions