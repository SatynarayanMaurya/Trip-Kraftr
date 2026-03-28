import React, { useEffect, useState } from 'react'
import {useLocation, useParams} from 'react-router-dom'
import AddRoomRate from './AddRoomRate'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useHotelHooks } from '../../../hooks/useHotelHooks'
import { useRoomHooks } from '../../../hooks/useRoomHooks'

function RoomRates() {
  const {getHotelById} = useHotelHooks()
  const {getRooms} = useRoomHooks()
    const [isAddRoomRate, setIsAddRoomRate] = useState(false)
    const isProduction = useSelector((state)=>state.user.isProduction)
    const {hotelId} = useParams()
    const [hotelDetails, setHotelDetails] = useState({})
    const location = useLocation()
    const [allRooms, setAllRooms] = useState([])
    const [fetchLoading, setFetchLoading] = useState(false)
    const {rooms,hotel} = location.state||{}


    const fetchHotelDetails = async () => {
      try {
          setFetchLoading(true)
          console.log("Going to fetch : Hotels")
          const response = await getHotelById(hotelId)
          const data = response?.data?.foundHotel
          setHotelDetails(data)
      } catch (error) {
          if (!isProduction) {
              console.log('========= ERROR DEBUG START =========')
              console.log('Error:', error)
              console.log('Response:', error?.response)
              console.log('========= ERROR DEBUG END =========')
          }
          toast.error(error?.response?.data?.message || error?.message || 'Error fetching hotel details')
      } finally {
          setFetchLoading(false)
      }
  }

  useEffect(() => {
      if (hotel) {
          setHotelDetails(hotel)
      }
      else {
          fetchHotelDetails()
      }

  }, [hotelId])



  const fetchRooms = async () => {
      try {
          setFetchLoading(true)
          console.log("Going to fetch : Rooms")
          const response = await getRooms(hotelId)
          setAllRooms(response?.data?.allRooms)
          setFetchLoading(false)
      }
      catch (error) {
          setFetchLoading(false)
          if (!isProduction) {
              console.log("========= ERROR DEBUG START =========");
              console.log("Error:", error);
              console.log("Response:", error?.response);
              console.log("========= ERROR DEBUG END =========");
          }
          toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
      }
  }

  useEffect(() => {
      if (hotelId) {
        if(rooms){
          setAllRooms(rooms)
        }
        else{
          fetchRooms()
        }
      }
  }, [hotelId])


    // console.log("Rooms & Hotel : ",rooms,hotel)


  return (
    <div>RoomRates
        <button onClick={()=>setIsAddRoomRate(true)} className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg'>Add Room Rate</button>
        {
            isAddRoomRate&&
            <AddRoomRate onClose={()=>setIsAddRoomRate(false)} hotelId={hotelId} allRooms={allRooms}/>
        }
    </div>
  )
}

export default RoomRates