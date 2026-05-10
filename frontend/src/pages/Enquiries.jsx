import React from 'react'
import { useNavigate } from 'react-router-dom'

function Enquiries() {
    const navigate = useNavigate()
  return (
    <div>Enquiries
        <button onClick={()=>navigate('add-enquiry')}>Add</button>
    </div>
  )
}

export default Enquiries