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
    Save,
    X,
} from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRoomHooks } from "../../../hooks/useRoomHooks";
import { useHotelHooks } from "../../../hooks/useHotelHooks";
import { ArrowLeft } from 'lucide-react'
import DeleteModal from "../../DeleteModals/DeleteModal";

function Rooms() {

    const { hotelId } = useParams();
    const location = useLocation()
    const navigate = useNavigate()
    const [isAddRoom, setIsAddRoom] = useState(false);
    const isProduction = useSelector((state) => state.user.isProduction)
    const { getRooms, updateRoomById, deleteRoomById } = useRoomHooks();
    const { getHotelById } = useHotelHooks()
    const allRooms = useSelector((state) => state.room.allRooms?.[hotelId])
    const [fetchLoading, setFetchLoading] = useState(false)

    const [hotelDetails, setHotelDetails] = useState(null)
    const { hotel } = location.state || {};
    const [deletingRoomDetails, setDeletingRoomDetails] = useState(null)
    const [isDeletingModal, setIsDeletingModal] = useState(false)

    // =========================
    // INLINE EDIT STATES
    // =========================
    const [editingRoomId, setEditingRoomId] = useState(null)
    const [editingRoomData, setEditingRoomData] = useState({
        roomName: "",
        quantity: "",
        capacity: "",
        adult: "",
        extraMattress: "",
        imageLink: "",
    })

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
            await getRooms(hotelId)
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
            if (!allRooms) {
                fetchRooms()
            }
        }
    }, [hotelId])

    // =========================
    // INLINE EDIT FUNCTIONS
    // =========================
    const handleEditClick = (room) => {
        setEditingRoomId(room._id)
        setEditingRoomData({
            roomName: room.roomName || "",
            quantity: room.quantity||1,
            capacity: room.capacity || "",
            adult: room.adult?.toString() || "",
            extraMattress: room.extraMattress || "",
            imageLink: room.imageLink || "",
        })
    }

    const handleCancelEdit = () => {
        setEditingRoomId(null)
        setEditingRoomData({
            roomName: "",
            quantity: "",
            capacity: "",
            adult: "",
            children: "",
            extraMattress: "",
            imageLink: "",
        })
    }

    const handleEditChange = (field, value) => {
        if (["capacity", "adult",  'quantity','extraMattress'].includes(field)) {
            if (value !== "" && !/^\d+$/.test(value)) return
        }

        setEditingRoomData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSaveEdit = async (roomId) => {
        try {
            const roomName = editingRoomData.roomName.trim()
            const imageLink = editingRoomData.imageLink.trim()
            const capacity = Number(editingRoomData.capacity)
            const adult = Number(editingRoomData.adult)
            const quantity = Number(editingRoomData.quantity)
            const extraMattress = Number(editingRoomData.extraMattress)

            if (
                !roomName ||
                editingRoomData.quantity === "" ||
                editingRoomData.capacity === "" ||
                editingRoomData.adult === "" ||
                editingRoomData.extraMattress === "" 
            ) {
                toast.error("All fields are required")
                return
            }

            if (capacity <= 0) {
                toast.error("Capacity must be greater than 0")
                return
            }

            if (adult + extraMattress !== capacity) {
                toast.error("Adult + Extra Mattress must be equal to Capacity")
                return
            }

            const updatedRoom = {
                hotelId,
                roomId,
                roomName,
                capacity,
                quantity,
                adult,
                extraMattress,
                imageLink
            }

            // console.log("Updated Room Data:", updatedRoom)
            const response = await updateRoomById(updatedRoom)

            toast.success(response?.data?.message)

            setEditingRoomId(null)
            setEditingRoomData({
                roomName: "",
                capacity: "",
                quantity:1,
                adult: "",
                extraMattress: 0,
                imageLink: "",
            })
        }
        catch (error) {
            if (!isProduction) {
                console.log("========= ERROR DEBUG START =========");
                console.log("Error:", error);
                console.log("Response:", error?.response);
                console.log("========= ERROR DEBUG END =========");
            }
            toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
        }

    }

    const deleteRoom = async () => {
        try {
            setFetchLoading(true)
            const response = await deleteRoomById(hotelId, deletingRoomDetails?._id)
            toast.success(response?.data?.message)
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

    const inputClass =
        "w-full min-w-[90px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#1d3561] outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"

    return (
        <div className="min-h-screen bg-[#f8f8fb] p-4 md:p-6">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-semibold text-[#1d3561]">Room management</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Define room types, capacities, and standard amenities.
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#18305C] mt-3 transition-colors cursor-pointer"
                >
                    <ArrowLeft size={15} />
                    Back to List
                </button>
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
                    className="inline-flex items-center gap-2 self-start rounded-xl bg-[#ED5F8D] px-5 py-3 text-sm font-semibold text-white shadow-md transition"
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
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#ED5F8D] px-5 py-3 text-sm font-semibold text-white shadow-md transition "
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
                                    <th className="px-5 py-4">Quantity</th>
                                    <th className="px-5 py-4">Capacity</th>
                                    <th className="px-5 py-4">Adult</th>
                                    {/* <th className="px-5 py-4">Child</th> */}
                                    <th className="px-5 py-4">Extra Mattress</th>
                                    <th className="px-5 py-4">Room Photos</th>
                                    <th className="px-5 py-4 text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {allRooms?.map((room, index) => {
                                    const isEditing = editingRoomId === room._id

                                    return (
                                        <tr
                                            key={room._id}
                                            className={`text-sm text-gray-700 ${index !== allRooms?.length - 1
                                                ? "border-b border-dashed border-gray-300"
                                                : ""
                                                } hover:bg-gray-50 transition`}
                                        >
                                            {/* Room Name */}
                                            <td className="px-5 py-4 font-medium text-[#1d3561]">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editingRoomData.roomName}
                                                        onChange={(e) =>
                                                            handleEditChange("roomName", e.target.value)
                                                        }
                                                        className={inputClass}
                                                        placeholder="Room Name"
                                                    />
                                                ) : (
                                                    room.roomName
                                                )}
                                            </td>

                                            {/* Capacity */}
                                            <td className="px-5 py-4">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editingRoomData.quantity}
                                                        onChange={(e) =>
                                                            handleEditChange("quantity", e.target.value)
                                                        }
                                                        className={inputClass}
                                                        placeholder="Quantity"
                                                    />
                                                ) : (
                                                    room.quantity || 1
                                                )}
                                            </td>

                                            {/* Capacity */}
                                            <td className="px-5 py-4">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editingRoomData.capacity}
                                                        onChange={(e) =>
                                                            handleEditChange("capacity", e.target.value)
                                                        }
                                                        className={inputClass}
                                                        placeholder="Capacity"
                                                    />
                                                ) : (
                                                    room.capacity
                                                )}
                                            </td>

                                            {/* Adult */}
                                            <td className="px-5 py-4">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editingRoomData.adult}
                                                        onChange={(e) =>
                                                            handleEditChange("adult", e.target.value)
                                                        }
                                                        className={inputClass}
                                                        placeholder="Adult"
                                                    />
                                                ) : (
                                                    <div className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5">
                                                        <Users size={14} className="text-gray-400" />
                                                        <span>{room.adult}</span>
                                                    </div>
                                                )}
                                            </td>

                                            {/* Children */}
                                            {/* <td className="px-5 py-4">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editingRoomData.children}
                                                        onChange={(e) =>
                                                            handleEditChange("children", e.target.value)
                                                        }
                                                        className={inputClass}
                                                        placeholder="Children"
                                                    />
                                                ) : (
                                                    <div className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5">
                                                        <Users size={14} className="text-gray-400" />
                                                        <span>{room.children}</span>
                                                    </div>
                                                )}
                                            </td> */}

                                            {/* Extra Mattress */}
                                            <td className="px-5 py-4">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editingRoomData.extraMattress}
                                                        onChange={(e) =>
                                                            handleEditChange("extraMattress", e.target.value)
                                                        }
                                                        className={inputClass}
                                                        placeholder="Extra Mattress"
                                                    />
                                                ) : (
                                                    room.extraMattress||1
                                                )}
                                            </td>

                                            {/* Image Link */}
                                            <td className="px-5 py-4 italic">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editingRoomData.imageLink||''}
                                                        onChange={(e) =>
                                                            handleEditChange("imageLink", e.target.value)
                                                        }
                                                        className={inputClass}
                                                        placeholder="Image Link"
                                                    />
                                                ) : (
                                                    <a href={room.imageLink?.split(":")?.[0] === 'https' ?room.imageLink:`https://${room.imageLink}` } target="_blank">{`${room.imageLink?.slice(0,10)}...`||''}</a>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-center gap-3">
                                                    {isEditing ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleSaveEdit(room._id)}
                                                                className="inline-flex items-center gap-1 rounded-lg bg-[#ED5F8D] px-3 py-2 text-xs font-semibold text-white transition "
                                                                title="Save Room"
                                                            >
                                                                <Save size={14} />
                                                                Save
                                                            </button>

                                                            <button
                                                                onClick={handleCancelEdit}
                                                                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                                                                title="Cancel Edit"
                                                            >
                                                                <X size={14} />
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => handleEditClick(room)}
                                                                className="text-[#1d3561] transition hover:text-pink-500"
                                                                title="Edit Room"
                                                            >
                                                                <Pencil size={17} />
                                                            </button>

                                                            <button
                                                                onClick={() => {
                                                                    setDeletingRoomDetails(room)
                                                                    setIsDeletingModal(true)
                                                                }}
                                                                className="text-[#1d3561] transition hover:text-red-500"
                                                                title="Delete Room"
                                                            >
                                                                <Trash2 size={17} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Footer Buttons */}
            {!fetchLoading && allRooms?.length > 0 && (
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                        onClick={() => navigate(`manage-rates`, { state: { rooms: allRooms, hotel: hotelDetails } })} className="rounded-xl bg-[#ED5F8D] px-5 py-3 text-sm font-semibold text-white shadow-md transition ">
                        Manage Rates
                    </button>

                    <button className="rounded-xl bg-[#ED5F8D] px-5 py-3 text-sm font-semibold text-white shadow-md transition ">
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

            {/* Delete Room Popup */}
            {isDeletingModal && (
                <DeleteModal
                    onClose={() => setIsDeletingModal(false)} onDelete={() => deleteRoom()} itemName={deletingRoomDetails?.roomName} confirmText={deletingRoomDetails?.roomName}
                />
            )}
        </div>
    );
}

export default Rooms;