import React from 'react'
import { useNavigate } from 'react-router-dom'

function Plans() {
    const navigate = useNavigate()
  return (
    <div className='p-6'>
        <button onClick={()=>navigate("add-plan")} className='bg-blue-600 texxt-white font-semibold px-4 py-2 rounded-lg text-white cursor-pointer'>Add Plan</button>
    </div>

  )
}

export default Plans