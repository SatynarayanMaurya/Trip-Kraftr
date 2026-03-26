import React, { useState } from 'react'
import AddRoomRate from './AddRoomRate'

function RoomRates() {
    const [isAddRoomRate, setIsAddRoomRate] = useState(false)
  return (
    <div>RoomRates
        <button onClick={()=>setIsAddRoomRate(true)} className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg'>Add Room Rate</button>
        {
            isAddRoomRate&&
            <AddRoomRate/>
        }
    </div>
  )
}

export default RoomRates