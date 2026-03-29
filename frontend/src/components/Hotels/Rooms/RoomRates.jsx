

import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AddRoomRate from "./AddRoomRate";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useHotelHooks } from "../../../hooks/useHotelHooks";
import { useRoomHooks } from "../../../hooks/useRoomHooks";
import { useRoomRateHooks } from "../../../hooks/useRoomRateHooks";
import {
  Plus,
  Pencil,
  Copy,
  Save,
  X,
  ChevronDown,
  ChevronRight,
  CalendarDays,
  Trash2,
  Hotel,
  ArrowLeft
} from "lucide-react";
import DeleteModal from "../../DeleteModals/DeleteModal";

function RoomRates() {
  const navigate = useNavigate()
  const { getHotelById } = useHotelHooks();
  const { getRooms } = useRoomHooks();
  const { getRoomRates,updateRoomRate,addRoomRate,deleteRoomRate } = useRoomRateHooks();

  const [isAddRoomRate, setIsAddRoomRate] = useState(false);
  const isProduction = useSelector((state) => state.user.isProduction);
  const { hotelId } = useParams();
  const [hotelDetails, setHotelDetails] = useState({});
  const location = useLocation();
  const [allRooms, setAllRooms] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const { rooms, hotel } = location.state || {};
  const allRoomRates = useSelector((state)=>state.roomRate.allRoomRates?.[hotelId])

  // UI States
  const [expandedIds, setExpandedIds] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [copiedDrafts, setCopiedDrafts] = useState([]);
  const [isDeleteModal, setIsDeleteModal] = useState(false)
  const [deletingRoomRateDetails, setDeletingRoomRateDetails] = useState(null)

  // -----------------------------
  // Fetch hotel details
  // -----------------------------
  const fetchHotelDetails = async () => {
    try {
      setFetchLoading(true);
      const response = await getHotelById(hotelId);
      const data = response?.data?.foundHotel;
      setHotelDetails(data);
    } catch (error) {
      if (!isProduction) {
        console.log("========= ERROR DEBUG START =========");
        console.log("Error:", error);
        console.log("Response:", error?.response);
        console.log("========= ERROR DEBUG END =========");
      }
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Error fetching hotel details"
      );
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (hotel) {
      setHotelDetails(hotel);
    } else {
      fetchHotelDetails();
    }
  }, [hotelId]);

  // -----------------------------
  // Fetch rooms
  // -----------------------------
  const fetchRooms = async () => {
    try {
      setFetchLoading(true);
      const response = await getRooms(hotelId);
      setAllRooms(response?.data?.allRooms || []);
    } catch (error) {
      if (!isProduction) {
        console.log("========= ERROR DEBUG START =========");
        console.log("Error:", error);
        console.log("Response:", error?.response);
        console.log("========= ERROR DEBUG END =========");
      }
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Error fetching rooms"
      );
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (hotelId) {
      if (rooms) {
        setAllRooms(rooms);
      } else {
        fetchRooms();
      }
    }
  }, [hotelId]);

  // -----------------------------
  // Fetch room rates
  // -----------------------------
  const fetchRoomRates = async () => {
    try {
      setFetchLoading(true);
      const response = await getRoomRates(hotelId);
      const rates = response?.data?.allRoomRates || [];
      // First one expanded by default
      if (rates.length > 0) {
        setExpandedIds([rates[0]._id]);
      }
    } catch (error) {
      if (!isProduction) {
        console.log("========= ERROR DEBUG START =========");
        console.log("Error:", error);
        console.log("Response:", error?.response);
        console.log("========= ERROR DEBUG END =========");
      }
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Error fetching room rates"
      );
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (hotelId) {
      if(!allRoomRates){
        fetchRoomRates();
      }
    }
  }, [hotelId]);

  // -----------------------------
  // Helpers
  // -----------------------------
  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString("en-GB");
  };

  const deleteThisRoomRate = async()=>{
    try{
      setFetchLoading(true)
      const response = await deleteRoomRate(hotelId,deletingRoomRateDetails?._id)
      toast.success(response?.data?.message)
      setFetchLoading(false)
    }
    catch(error){
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

  const formatDateForInput = (date) => {
    if (!date) return "";
  
    const d = new Date(date);
  
    // convert UTC → IST
    const ist = new Date(d.getTime() + 5.5 * 60 * 60 * 1000);
  
    return ist.toISOString().split("T")[0]; // "YYYY-MM-DD"
  };

  const normalizeRate = (rate) => {
  
    return {
      ...rate,
  
      fromDate: formatDateForInput(rate.fromDate),
      toDate: formatDateForInput(rate.toDate),
  
      roomRates: (rate.roomRates || []).map((room) => ({
        roomId: room?.roomId?._id || room?.roomId || "",
        roomNameSnapshot:
          room?.roomNameSnapshot ||
          room?.roomName ||
          room?.roomId?.roomName ||
          "",
        ep: room?.ep ?? 0,
        cp: room?.cp ?? 0,
        map: room?.map ?? 0,
        ap: room?.ap ?? 0,
      })),
  
      extraMattress: {
        ep: rate?.extraMattress?.ep ?? 0,
        cp: rate?.extraMattress?.cp ?? 0,
        map: rate?.extraMattress?.map ?? 0,
        ap: rate?.extraMattress?.ap ?? 0,
      },
  
      cnb: {
        ep: rate?.cnb?.ep ?? 0,
        cp: rate?.cnb?.cp ?? 0,
        map: rate?.cnb?.map ?? 0,
        ap: rate?.cnb?.ap ?? 0,
      },
    };
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const startEdit = (rate) => {
    setEditingId(rate._id);
    setEditingData(normalizeRate(rate));
    if (!expandedIds.includes(rate._id)) {
      setExpandedIds((prev) => [...prev, rate._id]);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingData(null);
  };

  const handleEditBasicChange = (field, value) => {
    setEditingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditRoomChange = (roomId, field, value) => {
    if (value !== "" && !/^\d+$/.test(value)) return;

    setEditingData((prev) => ({
      ...prev,
      roomRates: prev.roomRates.map((room) =>
        room.roomId === roomId ? { ...room, [field]: value } : room
      ),
    }));
  };

  const handleEditSpecialChange = (section, field, value) => {
    if (value !== "" && !/^\d+$/.test(value)) return;

    setEditingData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleUpdateRate = async() => {

    try {
      if (!editingData?.ratePlanName?.trim()) {
        toast.error("Rate plan name is required");
        return;
      }

      if (!editingData?.fromDate || !editingData?.toDate) {
        toast.error("From date and To date are required");
        return;
      }

      if (new Date(editingData.fromDate) > new Date(editingData.toDate)) {
        toast.error("From date must be smaller than or equal to To date");
        return;
      }

      const response = await updateRoomRate(hotelId,editingData)
      toast.success(response?.data?.message);
      setEditingId(null);
      setEditingData(null);
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

  };

  // -----------------------------
  // Copy functionality
  // -----------------------------
  const handleCopyRate = (rate) => {
    const normalized = normalizeRate(rate);

    const newDraft = {
      draftId: `draft_${Date.now()}`,
      hotelId,
      ratePlanName: "",
      fromDate: "",
      toDate: "",
      roomRates: normalized.roomRates.map((room) => ({
        roomId: room.roomId,
        roomNameSnapshot: room.roomNameSnapshot,
        ep: room.ep,
        cp: room.cp,
        map: room.map,
        ap: room.ap,
      })),
      extraMattress: { ...normalized.extraMattress },
      cnb: { ...normalized.cnb },
    };

    setCopiedDrafts((prev) => [...prev, newDraft]);
  };

  const handleDraftBasicChange = (draftId, field, value) => {
    setCopiedDrafts((prev) =>
      prev.map((draft) =>
        draft.draftId === draftId ? { ...draft, [field]: value } : draft
      )
    );
  };

  const handleDraftRoomChange = (draftId, roomId, field, value) => {
    if (value !== "" && !/^\d+$/.test(value)) return;

    setCopiedDrafts((prev) =>
      prev.map((draft) =>
        draft.draftId === draftId
          ? {
            ...draft,
            roomRates: draft.roomRates.map((room) =>
              room.roomId === roomId ? { ...room, [field]: value } : room
            ),
          }
          : draft
      )
    );
  };

  const handleDraftSpecialChange = (draftId, section, field, value) => {
    if (value !== "" && !/^\d+$/.test(value)) return;

    setCopiedDrafts((prev) =>
      prev.map((draft) =>
        draft.draftId === draftId
          ? {
            ...draft,
            [section]: {
              ...draft[section],
              [field]: value,
            },
          }
          : draft
      )
    );
  };

  const handleSaveDraft = async(draft) => {
    try{
      if (!draft.ratePlanName.trim()) {
        toast.error("Rate plan name is required");
        return;
      }
  
      if (!draft.fromDate || !draft.toDate) {
        toast.error("From date and To date are required");
        return;
      }
  
      if (new Date(draft.fromDate) > new Date(draft.toDate)) {
        toast.error("From date must be smaller than or equal to To date");
        return;
      }
  
      const payload ={
        ...draft,
        hotelId:hotelId
      }
      setFetchLoading(true)
      const response  = await addRoomRate(payload)
      toast.success(response?.data?.message)
      setFetchLoading(false)
      setCopiedDrafts((prev) =>
        prev.filter((item) => item.draftId !== draft.draftId)
    );
  }
  catch(error){
      setFetchLoading(false)
      if (!isProduction) {
        console.log("========= ERROR DEBUG START =========");
        console.log("Error:", error);
        console.log("Response:", error?.response);
        console.log("========= ERROR DEBUG END =========");
      }
      toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
    }

  };

  const handleCancelDraft = (draftId) => {
    setCopiedDrafts((prev) => prev.filter((item) => item.draftId !== draftId));
  };

  // -----------------------------
  // Skeleton
  // -----------------------------
  const SkeletonTable = () => (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm animate-pulse">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div className="space-y-2">
          <div className="h-4 w-40 rounded bg-slate-200"></div>
          <div className="h-3 w-56 rounded bg-slate-200"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-9 rounded-xl bg-slate-200"></div>
          <div className="h-9 w-9 rounded-xl bg-slate-200"></div>
        </div>
      </div>
      <div className="p-5 space-y-3">
        {[1, 2, 3, 4].map((row) => (
          <div key={row} className="grid grid-cols-5 gap-3">
            <div className="h-10 rounded bg-slate-200"></div>
            <div className="h-10 rounded bg-slate-200"></div>
            <div className="h-10 rounded bg-slate-200"></div>
            <div className="h-10 rounded bg-slate-200"></div>
            <div className="h-10 rounded bg-slate-200"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const tableInputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-pink-500";

  // -----------------------------
  // Table Block Renderer
  // -----------------------------
  const renderRateTable = (rate, isEditable = false, isDraft = false) => {
    const current = isDraft
      ? rate
      : isEditable && editingId === rate._id
        ? editingData
        : normalizeRate(rate);

    const uniqueId = isDraft ? rate.draftId : rate._id;
    const isExpanded = isDraft ? true : expandedIds.includes(uniqueId);

    return (
      <div
        key={uniqueId}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-3 md:flex-row md:items-center md:justify-between">
          <div
            className="flex cursor-pointer items-start gap-3"
            onClick={() => !isDraft && toggleExpand(uniqueId)}
          >
            {!isDraft && (
              <button
                type="button"
                className="mt-0.5 rounded-lg p-1 text-slate-500 hover:bg-slate-100"
              >
                {isExpanded ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </button>
            )}

            <div>
              {isEditable ? (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <input
                    type="text"
                    value={current?.ratePlanName || ""}
                    onChange={(e) =>
                      isDraft
                        ? handleDraftBasicChange(
                          uniqueId,
                          "ratePlanName",
                          e.target.value
                        )
                        : handleEditBasicChange("ratePlanName", e.target.value)
                    }
                    placeholder="Rate Plan Name"
                    className={tableInputClass}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <input
                    type="date"
                    value={
                      current?.fromDate
                        ? new Date(current.fromDate).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      isDraft
                        ? handleDraftBasicChange(
                          uniqueId,
                          "fromDate",
                          e.target.value
                        )
                        : handleEditBasicChange("fromDate", e.target.value)
                    }
                    className={tableInputClass}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <input
                    type="date"
                    value={
                      current?.toDate
                        ? new Date(current.toDate).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      isDraft
                        ? handleDraftBasicChange(
                          uniqueId,
                          "toDate",
                          e.target.value
                        )
                        : handleEditBasicChange("toDate", e.target.value)
                    }
                    className={tableInputClass}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-8">
                  <h3 className="text-lg font-semibold text-[#1d3561]">
                    {current?.ratePlanName || "Untitled Rate Plan"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatDate(current?.fromDate)} - {formatDate(current?.toDate)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {!isDraft && editingId !== uniqueId && (
              <>
                <button
                  type="button"
                  onClick={() => startEdit(rate)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#ED5F8D] text-white shadow-sm transition hover:bg-pink-600 cursor-pointer"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>

                <button
                  type="button"
                  // onClick={() => handleCopyRate(rate)}
                  onClick={()=>{
                    setDeletingRoomRateDetails(rate)
                    setIsDeleteModal(true)
                  }}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-400 text-white shadow-sm transition hover:bg-red-600 cursor-pointer"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyRate(rate)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#ED5F8D] text-white shadow-sm transition hover:bg-pink-600 cursor-pointer"
                  title="Copy"
                >
                  <Copy size={16} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Body */}
        {isExpanded && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#f2f2f5]">
                <tr className="text-left text-sm font-bold text-[#1d3561]">
                  <th className="px-5 py-3 min-w-[220px]">Room Category</th>
                  <th className="px-5 py-3 min-w-[120px]">EP</th>
                  <th className="px-5 py-3 min-w-[120px]">CP</th>
                  <th className="px-5 py-3 min-w-[120px]">MAP</th>
                  <th className="px-5 py-3 min-w-[120px]">AP</th>
                </tr>
              </thead>

              <tbody>
                {(current?.roomRates || []).map((room, index) => (
                  <tr
                    key={`${uniqueId}_${room.roomId}_${index}`}
                    className={`text-sm text-slate-700 hover:bg-slate-50 ${index !== current.roomRates.length - 1
                        ? "border-b border-dashed border-slate-300"
                        : ""
                      }`}
                  >
                    <td className="px-5 py-3 font-medium text-[#1d3561]">
                      {room.roomNameSnapshot}
                    </td>

                    {["ep", "cp", "map", "ap"].map((field) => (
                      <td key={field} className="px-5 py-3">
                        {isEditable ? (
                          <input
                            type="text"
                            value={room[field]}
                            onChange={(e) =>
                              isDraft
                                ? handleDraftRoomChange(
                                  uniqueId,
                                  room.roomId,
                                  field,
                                  Number(e.target.value)
                                )
                                : handleEditRoomChange(
                                  room.roomId,
                                  field,
                                  Number(e.target.value)
                                )
                            }
                            className={tableInputClass}
                          />
                        ) : (
                          <span>₹ {room[field] || 0}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Extra Mattress */}
                <tr className="border-t border-slate-300 bg-pink-50/40 text-sm text-slate-700">
                  <td className="px-5 py-3 font-semibold text-[#1d3561]">
                    Extra Mattress
                  </td>
                  {["ep", "cp", "map", "ap"].map((field) => (
                    <td key={field} className="px-5 py-3">
                      {isEditable ? (
                        <input
                          type="text"
                          value={current?.extraMattress?.[field] ?? 0}
                          onChange={(e) =>
                            isDraft
                              ? handleDraftSpecialChange(
                                uniqueId,
                                "extraMattress",
                                field,
                                Number(e.target.value)
                              )
                              : handleEditSpecialChange(
                                "extraMattress",
                                field,
                                Number(e.target.value)
                              )
                          }
                          className={tableInputClass}
                        />
                      ) : (
                        <span>₹ {current?.extraMattress?.[field] || 0}</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* CNB */}
                <tr className="border-t border-slate-300 bg-pink-50/40 text-sm text-slate-700">
                  <td className="px-5 py-3 font-semibold text-[#1d3561]">
                    CNB
                  </td>
                  {["ep", "cp", "map", "ap"].map((field) => (
                    <td key={field} className="px-5 py-3">
                      {isEditable ? (
                        <input
                          type="text"
                          value={current?.cnb?.[field] ?? 0}
                          onChange={(e) =>
                            isDraft
                              ? handleDraftSpecialChange(
                                uniqueId,
                                "cnb",
                                field,
                                Number(e.target.value)
                              )
                              : handleEditSpecialChange(
                                "cnb",
                                field,
                                Number(e.target.value)
                              )
                          }
                          className={tableInputClass}
                        />
                      ) : (
                        <span>₹ {current?.cnb?.[field] || 0}</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>

            {/* Footer Buttons */}
            {isEditable && (
              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    isDraft ? handleCancelDraft(uniqueId) : cancelEdit()
                  }
                  className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() =>
                    isDraft ? handleSaveDraft(rate) : handleUpdateRate()
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ED5F8D] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-pink-600"
                >
                  <Save size={16} />
                  {isDraft ? "Save" : "Update"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f8fb] p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-[#1d3561]">Rate management</h1>
        <p className="mt-1 text-sm text-slate-500">
          Configure pricing matrices and seasonal rate plans.
        </p>
        <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#18305C] mt-3 transition-colors cursor-pointer"
                >
                    <ArrowLeft size={15} />
                    Back to List
                </button>
      </div>

      {/* Hotel Info */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#1d3561]">
            {hotelDetails?.hotelName || hotelDetails?.name || "The Grand Palace"}
          </h2>
          <p className="text-sm text-slate-500">Rooms & Rates Configuration</p>
        </div>

        <button
          onClick={() => setIsAddRoomRate(true)}
          className="inline-flex items-center gap-2 self-start rounded-xl bg-[#ED5F8D] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-pink-600"
        >
          <Plus size={18} />
          Add
        </button>
      </div>

      {/* Section Title */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#1d3561]">Rate Management</h3>
      </div>

      {/* Content */}
      <div className="space-y-5">
        {fetchLoading ? (
          <>
            <SkeletonTable />
            <SkeletonTable />
          </>
        ) : allRoomRates?.length === 0 && copiedDrafts?.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-[#1d3561]">
              No room rates added yet
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Start by creating your first room rate plan.
            </p>

            <button
              onClick={() => setIsAddRoomRate(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#ED5F8D] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-pink-600"
            >
              <Plus size={18} />
              Add Room Rate
            </button>
          </div>
        ) : (
          <>
            {/* Existing Room Rates */}
            {allRoomRates?.map((rate) =>
              renderRateTable(rate, editingId === rate._id, false)
            )}

            {/* Copied Drafts */}
            {copiedDrafts?.length > 0 && (
              <div className="space-y-5 pt-2">
                {copiedDrafts.map((draft) => renderRateTable(draft, true, true))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Room Rate Popup */}
      {isAddRoomRate && (
        <AddRoomRate
          onClose={() => setIsAddRoomRate(false)}
          hotelId={hotelId}
          allRooms={allRooms}
        />
      )}

      {/* Delete Room Rate Popup */}
      {isDeleteModal && (
        <DeleteModal
          onClose={() => setIsDeleteModal(false)}
          onDelete={()=>deleteThisRoomRate()} itemName = {deletingRoomRateDetails?.ratePlanName} confirmText = {deletingRoomRateDetails?.ratePlanName} 
        />
      )}
    </div>
  );
}

export default RoomRates;
