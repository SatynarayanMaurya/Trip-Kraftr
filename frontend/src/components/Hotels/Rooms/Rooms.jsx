import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AddRoom from "./AddRoom";
import {
    Plus,
    BedDouble,
    Pencil,
    Trash2,
    Hotel,
    Eye,
    Users,
} from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRoomHooks } from "../../../hooks/useRoomHooks";
import { useHotelHooks } from "../../../hooks/useHotelHooks";

function Rooms() {

    const { hotelId } = useParams();
    const location = useLocation()
    const navigate = useNavigate()
    const [isAddRoom, setIsAddRoom] = useState(false);
    const isProduction = useSelector((state) => state.user.isProduction)
    const { getRooms } = useRoomHooks();
    const { getHotelById } = useHotelHooks()
    const [allRooms, setAllRooms] = useState([])
    const [fetchLoading, setFetchLoading] = useState(false)

    const [hotelDetails, setHotelDetails] = useState(null)
    const { hotel } = location.state || {};
    // console.log("All Rooms : ",allRooms)



    const fetchHotelDetails = async () => {
        try {
            setFetchLoading(true)
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
            fetchRooms()
        }
    }, [hotelId])

    return (
        <div className="min-h-screen bg-[#f8f8fb] p-4 md:p-6">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-semibold text-[#1d3561]">Room management</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Define room types, capacities, and standard amenities.
                </p>
            </div>

            {/* Hotel Info + Action */}
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-[#1d3561]">
                        {hotelDetails?.hotelName || "Dummy Hotel"}
                    </h2>
                    <p className="text-sm text-gray-500">Rooms & Rates Configuration</p>
                </div>

                <button
                    onClick={() => setIsAddRoom(true)}
                    className="inline-flex items-center gap-2 self-start rounded-xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-pink-600"
                >
                    <Plus size={18} />
                    Add Rooms
                </button>
            </div>

            {/* Room Card */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                {/* Card Header */}
                <div className="border-b border-gray-200 px-5 py-4">
                    <h3 className="text-lg font-semibold text-[#1d3561]">Room Categories</h3>
                </div>

                {/* Loading Skeleton */}
                {fetchLoading ? (
                    <div className="p-5">
                        <div className="animate-pulse">
                            {/* table head skeleton */}
                            <div className="mb-4 grid grid-cols-5 gap-4 rounded-xl bg-gray-100 p-4">
                                <div className="h-4 rounded bg-gray-200"></div>
                                <div className="h-4 rounded bg-gray-200"></div>
                                <div className="h-4 rounded bg-gray-200"></div>
                                <div className="h-4 rounded bg-gray-200"></div>
                                <div className="h-4 rounded bg-gray-200"></div>
                            </div>

                            {/* rows skeleton */}
                            {[1, 2, 3, 4].map((item) => (
                                <div
                                    key={item}
                                    className="mb-3 grid grid-cols-5 gap-4 rounded-xl border border-gray-100 p-4"
                                >
                                    <div className="h-4 rounded bg-gray-200"></div>
                                    <div className="h-4 rounded bg-gray-200"></div>
                                    <div className="h-4 rounded bg-gray-200"></div>
                                    <div className="h-4 rounded bg-gray-200"></div>
                                    <div className="h-4 rounded bg-gray-200"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : allRooms?.length === 0 ? (
                    /* Empty State */
                    <div className="flex min-h-[280px] flex-col items-center justify-center px-6 py-12 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-50">
                            <BedDouble size={28} className="text-pink-500" />
                        </div>

                        <h3 className="text-lg font-semibold text-[#1d3561]">
                            No rooms added yet
                        </h3>
                        <p className="mt-2 max-w-md text-sm text-gray-500">
                            Start by adding your first room category with occupancy details.
                        </p>

                        <button
                            onClick={() => setIsAddRoom(true)}
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-pink-600"
                        >
                            <Plus size={18} />
                            Add First Room
                        </button>
                    </div>
                ) : (
                    /* Table */
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-[#f2f2f5]">
                                <tr className="text-left text-sm font-bold text-[#1d3561]">
                                    <th className="px-5 py-4">Room Name</th>
                                    <th className="px-5 py-4">Capacity</th>
                                    <th className="px-5 py-4">Adult</th>
                                    <th className="px-5 py-4">Child</th>
                                    <th className="px-5 py-4 text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {allRooms?.map((room, index) => (
                                    <tr
                                        key={room._id}
                                        className={`text-sm text-gray-700 ${index !== allRooms?.length - 1
                                                ? "border-b border-dashed border-gray-300"
                                                : ""
                                            } hover:bg-gray-50 transition`}
                                    >
                                        <td className="px-5 py-4 font-medium text-[#1d3561]">
                                            {room.roomName}
                                        </td>

                                        <td className="px-5 py-4">{room.capacity}</td>

                                        <td className="px-5 py-4">
                                            <div className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5">
                                                <Users size={14} className="text-gray-400" />
                                                <span>{room.adult}</span>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5">
                                                <Users size={14} className="text-gray-400" />
                                                <span>{room.children}</span>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-center gap-4">
                                                {/* <button onClick={()=>navigate(`manage-rates`)}
                                                    className="text-[#1d3561] transition hover:text-pink-500"
                                                    title="Edit Room"
                                                >
                                                    <Eye size={17}/>
                                                </button> */}
                                                <button
                                                    className="text-[#1d3561] transition hover:text-pink-500"
                                                    title="Edit Room"
                                                >
                                                    <Pencil size={17} />
                                                </button>

                                                <button
                                                    className="text-[#1d3561] transition hover:text-red-500"
                                                    title="Delete Room"
                                                >
                                                    <Trash2 size={17} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Footer Buttons */}
            {!fetchLoading && allRooms?.length > 0 && (
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button 
                    onClick={()=>navigate(`manage-rates`,{state:{rooms:allRooms,hotel:hotelDetails}})} className="rounded-xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-pink-600">
                        Manage Rates
                    </button>

                    <button className="rounded-xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-pink-600">
                        Save
                    </button>
                </div>
            )}

            {/* Add Room Popup */}
            {isAddRoom && (
                <AddRoom
                    hotelId={hotelId}
                    onClose={() => setIsAddRoom(false)}
                />
            )}
        </div>
    );
}

export default Rooms;