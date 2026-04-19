import React from 'react'
import {useNavigate} from 'react-router-dom'
function GroupTrips() {
    const navigate = useNavigate()
  return (
    <div>GroupTrips
        <button onClick={()=>navigate("add-group-trip")}>Add Group Trip</button>
    </div>
  )
}

export default GroupTrips