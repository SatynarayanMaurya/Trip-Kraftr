const normalizeRate = (rate) => ({
    ...rate,
    roomRates: (rate.roomRates || []).map((room) => ({
      roomId: room?.roomId?._id || room?.roomId || "",
      roomNameSnapshot:
        room?.roomNameSnapshot || room?.roomName || room?.roomId?.roomName || "",
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
  });

const RenderRateTable = (rate, isEditable = false, isDraft = false) => {
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
        <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 md:flex-row md:items-center md:justify-between">
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
                <>
                  <h3 className="text-lg font-bold text-[#1d3561]">
                    {current?.ratePlanName || "Untitled Rate Plan"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatDate(current?.fromDate)} - {formatDate(current?.toDate)}
                  </p>
                </>
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
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500 text-white shadow-sm transition hover:bg-pink-600"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyRate(rate)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500 text-white shadow-sm transition hover:bg-pink-600"
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
                  <th className="px-5 py-4 min-w-[220px]">Room Category</th>
                  <th className="px-5 py-4 min-w-[120px]">EP</th>
                  <th className="px-5 py-4 min-w-[120px]">CP</th>
                  <th className="px-5 py-4 min-w-[120px]">MAP</th>
                  <th className="px-5 py-4 min-w-[120px]">AP</th>
                </tr>
              </thead>

              <tbody>
                {(current?.roomRates || []).map((room, index) => (
                  <tr
                    key={`${uniqueId}_${room.roomId}_${index}`}
                    className={`text-sm text-slate-700 hover:bg-slate-50 ${
                      index !== current.roomRates.length - 1
                        ? "border-b border-dashed border-slate-300"
                        : ""
                    }`}
                  >
                    <td className="px-5 py-4 font-medium text-[#1d3561]">
                      {room.roomNameSnapshot}
                    </td>

                    {["ep", "cp", "map", "ap"].map((field) => (
                      <td key={field} className="px-5 py-4">
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
                                    e.target.value
                                  )
                                : handleEditRoomChange(
                                    room.roomId,
                                    field,
                                    e.target.value
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
                  <td className="px-5 py-4 font-semibold text-[#1d3561]">
                    Extra Mattress
                  </td>
                  {["ep", "cp", "map", "ap"].map((field) => (
                    <td key={field} className="px-5 py-4">
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
                                  e.target.value
                                )
                              : handleEditSpecialChange(
                                  "extraMattress",
                                  field,
                                  e.target.value
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
                  <td className="px-5 py-4 font-semibold text-[#1d3561]">
                    CNB
                  </td>
                  {["ep", "cp", "map", "ap"].map((field) => (
                    <td key={field} className="px-5 py-4">
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
                                  e.target.value
                                )
                              : handleEditSpecialChange(
                                  "cnb",
                                  field,
                                  e.target.value
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
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-pink-600"
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

  export default RenderRateTable