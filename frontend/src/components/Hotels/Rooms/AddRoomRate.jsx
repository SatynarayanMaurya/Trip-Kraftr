import React, { useMemo, useRef, useState } from "react";
import { X, CalendarDays, Save, Tag, BedDouble } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRoomRateHooks } from "../../../hooks/useRoomRateHooks";

function AddRoomRate({ onClose, hotelId, allRooms }) {

    const isProduction = useSelector((state) => state.user.isProduction)
    const { addRoomRate } = useRoomRateHooks()
    const [loading, setLoading] = useState(false)
    const dateRef = useRef(null);
    const dateRef2 = useRef(null);

    const initialRoomRates = allRooms?.map((room) => ({
        roomId: room._id,
        roomNameSnapshot: room.roomName,
        ep: "",
        cp: "",
        map: "",
        ap: "",
    }));

    const [formData, setFormData] = useState({
        hotelId: hotelId || "",
        ratePlanName: "",
        fromDate: "",
        toDate: "",
        roomRates: initialRoomRates,
        extraMattress: {
            ep: "",
            cp: "",
            map: "",
            ap: "",
        },
        cnb: {
            ep: "",
            cp: "",
            map: "",
            ap: "",
        },
    });

    const [errors, setErrors] = useState({});


    // ---------------------------------------
    // Basic input change
    // ---------------------------------------
    const handleBasicChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    // ---------------------------------------
    // Room row rate change
    // ---------------------------------------
    const handleRoomRateChange = (roomId, field, value) => {
        if (value !== "" && !/^\d+$/.test(value)) return;

        setFormData((prev) => ({
            ...prev,
            roomRates: prev.roomRates.map((room) =>
                room.roomId === roomId ? { ...room, [field]: value } : room
            ),
        }));
    };

    // ---------------------------------------
    // Extra Mattress / CNB change
    // ---------------------------------------
    const handleSpecialRateChange = (section, field, value) => {
        if (value !== "" && !/^\d+$/.test(value)) return;

        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    };

    // ---------------------------------------
    // Validation
    // ---------------------------------------
    const validateForm = () => {
        const newErrors = {};

        if (!formData.ratePlanName.trim()) {
            newErrors.ratePlanName = "Rate plan name is required.";
        }

        if (!formData.fromDate) {
            newErrors.fromDate = "From date is required.";
        }

        if (!formData.toDate) {
            newErrors.toDate = "To date is required.";
        }

        if (formData.fromDate && formData.toDate) {
            const from = new Date(formData.fromDate);
            const to = new Date(formData.toDate);

            if (from > to) {
                newErrors.toDate = "To date must be greater than or equal to From date.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ---------------------------------------
    // Submit
    // ---------------------------------------
    const handleSubmit = async (e) => {
        try {

            e.preventDefault();

            const isValid = validateForm();
            if (!isValid) return;

            const payload = {
                hotelId: formData.hotelId,
                ratePlanName: formData.ratePlanName.trim(),
                fromDate: formData.fromDate,
                toDate: formData.toDate,

                roomRates: formData.roomRates.map((room) => ({
                    roomId: room.roomId,
                    roomNameSnapshot: room.roomNameSnapshot,
                    ep: room.ep === "" ? 0 : Number(room.ep),
                    cp: room.cp === "" ? 0 : Number(room.cp),
                    map: room.map === "" ? 0 : Number(room.map),
                    ap: room.ap === "" ? 0 : Number(room.ap),
                })),

                extraMattress: {
                    ep:
                        formData.extraMattress.ep === ""
                            ? 0
                            : Number(formData.extraMattress.ep),
                    cp:
                        formData.extraMattress.cp === ""
                            ? 0
                            : Number(formData.extraMattress.cp),
                    map:
                        formData.extraMattress.map === ""
                            ? 0
                            : Number(formData.extraMattress.map),
                    ap:
                        formData.extraMattress.ap === ""
                            ? 0
                            : Number(formData.extraMattress.ap),
                },

                cnb: {
                    ep: formData.cnb.ep === "" ? 0 : Number(formData.cnb.ep),
                    cp: formData.cnb.cp === "" ? 0 : Number(formData.cnb.cp),
                    map: formData.cnb.map === "" ? 0 : Number(formData.cnb.map),
                    ap: formData.cnb.ap === "" ? 0 : Number(formData.cnb.ap),
                },
            };

            setLoading(true)
            const response = await addRoomRate(payload)
            toast.success(response?.data?.message)
            setLoading(false)
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

    const inputStyle =
        "w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-pink-500";

    const tableInputStyle =
        "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-pink-500";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-4">
            <div className="w-full max-w-5xl rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 bg-linear-to-r from-pink-50 to-white">
                    <div>
                        <h2 className="text-xl font-bold text-[#1d3561]">
                            Add Room Rate
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Create a pricing plan for selected dates.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5">
                    {/* Top Inputs */}
                    <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                        {/* Rate Name */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Rate Plan Name
                            </label>
                            <div className="relative">
                                <Tag
                                    size={17}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="text"
                                    name="ratePlanName"
                                    value={formData.ratePlanName}
                                    onChange={handleBasicChange}
                                    placeholder="e.g. Diwali Offer"
                                    className={`${inputStyle} ${errors.ratePlanName
                                        ? "border-red-400 focus:border-red-500"
                                        : ""
                                        }`}
                                />
                            </div>
                            {errors.ratePlanName && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.ratePlanName}
                                </p>
                            )}
                        </div>

                        {/* From Date */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                From
                            </label>
                            <div className="relative">
                                <CalendarDays
                                    size={17}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    ref={dateRef}
                                    onClick={() => dateRef.current?.showPicker()}
                                    type="date"
                                    name="fromDate"
                                    value={formData.fromDate}
                                    onChange={handleBasicChange}
                                    className={`${inputStyle} ${errors.fromDate
                                        ? "border-red-400 focus:border-red-500"
                                        : ""
                                        }`}
                                />
                            </div>
                            {errors.fromDate && (
                                <p className="mt-1 text-xs text-red-500">{errors.fromDate}</p>
                            )}
                        </div>

                        {/* To Date */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                To
                            </label>
                            <div className="relative">
                                <CalendarDays
                                    size={17}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    ref={dateRef2}
                                    onClick={() => dateRef2.current?.showPicker()}
                                    type="date"
                                    name="toDate"
                                    value={formData.toDate}
                                    onChange={handleBasicChange}
                                    className={`${inputStyle} ${errors.toDate ? "border-red-400 focus:border-red-500" : ""
                                        }`}
                                />
                            </div>
                            {errors.toDate && (
                                <p className="mt-1 text-xs text-red-500">{errors.toDate}</p>
                            )}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-auto max-h-[50vh] rounded-2xl border border-slate-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-[#f2f2f5]">
                                    <tr className="text-left text-sm font-bold text-[#1d3561]">
                                        <th className="px-4 py-3 min-w-[220px]">Room Category</th>
                                        <th className="px-4 py-3 min-w-[110px]">EP</th>
                                        <th className="px-4 py-3 min-w-[110px]">CP</th>
                                        <th className="px-4 py-3 min-w-[110px]">MAP</th>
                                        <th className="px-4 py-3 min-w-[110px]">AP</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {/* Actual Rooms */}
                                    {formData.roomRates.map((room, index) => (
                                        <tr
                                            key={room.roomId}
                                            className={`text-sm text-slate-700 hover:bg-slate-50 transition ${index !== formData.roomRates.length - 1
                                                ? "border-b border-dashed border-slate-300"
                                                : ""
                                                }`}
                                        >
                                            <td className="px-4 py-2">
                                                <div className="flex items-center gap-3 font-medium text-[#1d3561]">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-50">
                                                        <BedDouble size={16} className="text-pink-500" />
                                                    </div>
                                                    <span>{room.roomNameSnapshot}</span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-2">
                                                <input
                                                    type="text"
                                                    value={room.ep}
                                                    onChange={(e) =>
                                                        handleRoomRateChange(room.roomId, "ep", e.target.value)
                                                    }
                                                    placeholder="0"
                                                    className={tableInputStyle}
                                                />
                                            </td>

                                            <td className="px-4 py-2">
                                                <input
                                                    type="text"
                                                    value={room.cp}
                                                    onChange={(e) =>
                                                        handleRoomRateChange(room.roomId, "cp", e.target.value)
                                                    }
                                                    placeholder="0"
                                                    className={tableInputStyle}
                                                />
                                            </td>

                                            <td className="px-4 py-2">
                                                <input
                                                    type="text"
                                                    value={room.map}
                                                    onChange={(e) =>
                                                        handleRoomRateChange(room.roomId, "map", e.target.value)
                                                    }
                                                    placeholder="0"
                                                    className={tableInputStyle}
                                                />
                                            </td>

                                            <td className="px-4 py-2 ">
                                                <input
                                                    type="text"
                                                    value={room.ap}
                                                    onChange={(e) =>
                                                        handleRoomRateChange(room.roomId, "ap", e.target.value)
                                                    }
                                                    placeholder="0"
                                                    className={tableInputStyle}
                                                />
                                            </td>
                                        </tr>
                                    ))}

                                    {/* Extra Mattress */}
                                    <tr className="border-t border-slate-300 bg-pink-50/40 text-sm text-slate-700">
                                        <td className="px-4 py-2 font-semibold text-[#1d3561]">
                                            Extra Mattress
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="text"
                                                value={formData.extraMattress.ep}
                                                onChange={(e) =>
                                                    handleSpecialRateChange(
                                                        "extraMattress",
                                                        "ep",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="0"
                                                className={tableInputStyle}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="text"
                                                value={formData.extraMattress.cp}
                                                onChange={(e) =>
                                                    handleSpecialRateChange(
                                                        "extraMattress",
                                                        "cp",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="0"
                                                className={tableInputStyle}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="text"
                                                value={formData.extraMattress.map}
                                                onChange={(e) =>
                                                    handleSpecialRateChange(
                                                        "extraMattress",
                                                        "map",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="0"
                                                className={tableInputStyle}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="text"
                                                value={formData.extraMattress.ap}
                                                onChange={(e) =>
                                                    handleSpecialRateChange(
                                                        "extraMattress",
                                                        "ap",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="0"
                                                className={tableInputStyle}
                                            />
                                        </td>
                                    </tr>

                                    {/* CNB */}
                                    <tr className="border-t border-slate-300 bg-pink-50/40 text-sm text-slate-700">
                                        <td className="px-4 py-2 font-semibold text-[#1d3561]">
                                            CNB
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="text"
                                                value={formData.cnb.ep}
                                                onChange={(e) =>
                                                    handleSpecialRateChange("cnb", "ep", e.target.value)
                                                }
                                                placeholder="0"
                                                className={tableInputStyle}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="text"
                                                value={formData.cnb.cp}
                                                onChange={(e) =>
                                                    handleSpecialRateChange("cnb", "cp", e.target.value)
                                                }
                                                placeholder="0"
                                                className={tableInputStyle}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="text"
                                                value={formData.cnb.map}
                                                onChange={(e) =>
                                                    handleSpecialRateChange("cnb", "map", e.target.value)
                                                }
                                                placeholder="0"
                                                className={tableInputStyle}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="text"
                                                value={formData.cnb.ap}
                                                onChange={(e) =>
                                                    handleSpecialRateChange("cnb", "ap", e.target.value)
                                                }
                                                placeholder="0"
                                                className={tableInputStyle}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>


                    {/* Action  */}
                    <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className={`rounded-xl border bg-white px-5 py-2.5 text-sm font-semibold shadow-sm transition
      ${loading
                                    ? "border-slate-200 text-slate-400 cursor-not-allowed"
                                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                                }`}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md transition
      ${loading
                                    ? "bg-pink-300 cursor-not-allowed"
                                    : "bg-[#ED5F8D]"
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
                                <>
                                    <Save size={16} />
                                    Save
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddRoomRate;



