import React from 'react'
import {useNavigate} from 'react-router-dom'
function PrivateTrips() {
    const navigate = useNavigate();
  return (
    <div>PrivateTrips
        <button onClick={()=>navigate("add-private-trip")}>Add Trip</button>
    </div>
  )
}

export default PrivateTrips