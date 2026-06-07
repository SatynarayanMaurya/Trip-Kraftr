import React from 'react'
import { useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom'
function PrivateTrips() {
    const navigate = useNavigate();
    const currentPagePrivateTrip = useSelector(s=>s.privateTrip.currentPagePrivateTrip)
    console.log("currentPagePrivateTrip : ",currentPagePrivateTrip)
  return (
    <div>PrivateTrips
        <button onClick={()=>navigate("add-private-trip")}>Add Trip</button>
    </div>
  )
}

export default PrivateTrips