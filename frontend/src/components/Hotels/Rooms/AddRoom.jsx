import React, { useState } from "react";
import { X, BedDouble, Users, User, Baby, Bed, Image } from "lucide-react";
import { useSelector } from "react-redux";
import { useRoomHooks } from "../../../hooks/useRoomHooks";
import { toast } from "react-toastify";

function AddRoom({ onClose, hotelId }) {

    const isProduction = useSelector((state) => state.user.isProduction)
    const [loading, setLoading] = useState(false)
    const { addRoom } = useRoomHooks()
    const [formData, setFormData] = useState({
        roomName: "",
        capacity: "",
        adult: "",
        quantity:1,
        extraMattress: 0,
        imageLink:''
    });

    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Only allow numbers for numeric fields
        if (["capacity", "adult",'quantity'].includes(name)) {
            if (value !== "" && !/^\d+$/.test(value)) return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Remove field error while typing
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));

        setSubmitError("");
    };

    const validateForm = () => {
        const newErrors = {};
        const roomName = formData.roomName.trim();
        const capacity = Number(formData.capacity);
        const adult = Number(formData.adult);
        const quantity = Number(formData.quantity);
        const extraMattress = Number(formData.extraMattress);

        // Required validations
        if (!roomName) newErrors.roomName = "Room name is required.";
        if (formData.capacity === "") newErrors.capacity = "Capacity is required.";
        if (formData.adult === "") newErrors.adult = "Adult count is required.";
        if (formData.children === "") newErrors.children = "Children count is required.";
        if (formData.quantity === "") newErrors.quantity = "Room Quantity is required.";
        if (formData.extraMattress === "" ) newErrors.extraMattress = "Extraa Mattress Required";

        // Positive / valid number validations
        if (formData.capacity !== "" && capacity <= 0) {
            newErrors.capacity = "Capacity must be greater than 0.";
        }

        if (formData.adult !== "" && adult < 0) {
            newErrors.adult = "Adult count cannot be negative.";
        }

        if (formData.quantity !== "" && quantity < 1) {
            newErrors.quantity = "Room Quantity Can not be less than 1";
        }

        if (formData.extraMattress !== "" && extraMattress < 0) {
            newErrors.extraMattress = "Extra Mattress Can not be less than 0";
        }

        // Capacity match validation only when all numeric values exist
        if (
            formData.capacity !== "" &&
            formData.adult !== "" &&
            capacity > 0
        ) {
            const total = adult + extraMattress;

            if (total !== capacity) {
                setSubmitError(
                    `Adult + Extra Mattress must be exactly equal to Capacity. Current total is ${total}, but capacity is ${capacity}.`
                );
            }
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        try {


            e.preventDefault();

            const isValid = validateForm();

            const capacity = Number(formData.capacity);
            const adult = Number(formData.adult);
            const quantity = Number(formData.quantity);
            const extraMattress = Number(formData.extraMattress);

            if (!isValid) return;

            if (adult + extraMattress !== capacity) {
                return;
            }

            const payload = {
                roomName: formData.roomName.trim(),
                capacity,
                adult,
                quantity,
                extraMattress,
                imageLink:formData?.imageLink,
                hotelId
            };

            // console.log("Payload : ",payload)
            setLoading(true)
            const response = await addRoom(payload)
            toast.success(response?.data?.message)
            setLoading(false)

            // Reset after submit
            setFormData({
                roomName: "",
                capacity: "",
                adult: "",
                quantity:1,
                extraMattress: 0,
                imageLink:''
            });
            setErrors({});
            setSubmitError("");

            if (onClose) onClose();
        }
        catch (error) {
            setLoading(false)
            if (!isProduction) {
                console.log("========= ERROR DEBUG START =========");
                console.log("Error:", error);
                console.log("Response:", error?.response);
                console.log("========= ERROR DEBUG END =========");
            }
            toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
        }



    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 bg-linear-to-r from-pink-50 to-white">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Add New Room</h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Add room details with exact guest capacity.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {/* Room Name */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Room Name
                            </label>
                            <div className="relative">
                                <BedDouble
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="text"
                                    name="roomName"
                                    value={formData.roomName}
                                    onChange={handleChange}
                                    placeholder="Enter room name"
                                    className={`w-full rounded-2xl border bg-white py-3 pl-11 pr-4 text-sm outline-none transition ${errors.roomName
                                        ? "border-red-400 focus:border-red-500"
                                        : "border-slate-300 focus:border-pink-500"
                                        }`}
                                />
                            </div>
                            {errors.roomName && (
                                <p className="mt-2 text-sm text-red-500">{errors.roomName}</p>
                            )}
                        </div>

                        {/* Capacity */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Capacity
                            </label>
                            <div className="relative">
                                <Users
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="text"
                                    name="capacity"
                                    value={formData.capacity}
                                    min={1}
                                    onChange={handleChange}
                                    placeholder="Enter capacity"
                                    className={`w-full rounded-2xl border bg-white py-3 pl-11 pr-4 text-sm outline-none transition ${errors.capacity
                                        ? "border-red-400 focus:border-red-500"
                                        : "border-slate-300 focus:border-pink-500"
                                        }`}
                                />
                            </div>
                            {errors.capacity && (
                                <p className="mt-2 text-sm text-red-500">{errors.capacity}</p>
                            )}
                        </div>

                        {/* Adult */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Adult
                            </label>
                            <div className="relative">
                                <User
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="text"
                                    name="adult"
                                    min={0}
                                    value={formData.adult}
                                    onChange={handleChange}
                                    placeholder="Enter adult count"
                                    className={`w-full rounded-2xl border bg-white py-3 pl-11 pr-4 text-sm outline-none transition ${errors.adult
                                        ? "border-red-400 focus:border-red-500"
                                        : "border-slate-300 focus:border-pink-500"
                                        }`}
                                />
                            </div>
                            {errors.adult && (
                                <p className="mt-2 text-sm text-red-500">{errors.adult}</p>
                            )}
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Room Quantity
                            </label>
                            <div className="relative">
                                <Baby
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="text"
                                    name="quantity"
                                    min={1}
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    placeholder="Enter Room Quantity"
                                    className={`w-full rounded-2xl border bg-white py-3 pl-11 pr-4 text-sm outline-none transition ${errors.quantity
                                        ? "border-red-400 focus:border-red-500"
                                        : "border-slate-300 focus:border-pink-500"
                                        }`}
                                />
                            </div>
                            {errors.quantity && (
                                <p className="mt-2 text-sm text-red-500">{errors.quantity}</p>
                            )}
                        </div>

                        {/* Extra Mattress */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Extra Mattress
                            </label>
                            <div className="relative">
                                <Bed
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="number"
                                    name="extraMattress"
                                    min={0}
                                    value={formData.extraMattress||''}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className={`w-full rounded-2xl border bg-white py-3 pl-11 pr-4 text-sm outline-none transition ${errors.extraMattress
                                        ? "border-red-400 focus:border-red-500"
                                        : "border-slate-300 focus:border-pink-500"
                                        }`}
                                />
                            </div>
                            {errors.extraMattress && (
                                <p className="mt-2 text-sm text-red-500">{errors.extraMattress}</p>
                            )}
                        </div>

                        {/* Google Photos link */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Image Link
                            </label>
                            <div className="relative">
                                <Image
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="text"
                                    name="imageLink"
                                    value={formData.imageLink}
                                    onChange={handleChange}
                                    placeholder="Enter image link"
                                    className={`w-full rounded-2xl border bg-white py-3 pl-11 pr-4 text-sm outline-none transition border-slate-300 focus:border-pink-500
                                        }`}
                                />
                            </div>
                        </div>


                        {/* Capacity Error */}
                        {submitError && (
                            <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                                <p className="text-sm font-medium text-red-600">{submitError}</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className={`rounded-2xl border px-5 py-3 text-sm font-semibold transition 
      ${loading
                                    ? "border-slate-200 text-slate-400 cursor-not-allowed"
                                    : "border-slate-300 text-slate-700 hover:bg-slate-100"
                                }`}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white shadow-md transition
      ${loading
                                    ? "bg-pink-300 cursor-not-allowed"
                                    : "bg-[#ED5F8D] cursor-pointer"
                                }`}
                        >
                            {loading ? (
                                <>
                                    {/* Spinner */}
                                    <svg
                                        className="h-4 w-4 animate-spin"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8H4z"
                                        />
                                    </svg>

                                    Saving...
                                </>
                            ) : (
                                "Add Room"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddRoom;