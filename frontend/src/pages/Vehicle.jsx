import React from 'react'
import { useNavigate } from 'react-router-dom'

function Vehicle() {
  const navigate = useNavigate()
  return (
    <div>Vehicle
      <button onClick={()=>navigate("add-vehicle")} className='px-4 py-2 rounded-lg bg-blue-400 text-white font-semibold'>Add Vehicle</button>
    </div>
  )
}

export default Vehicle