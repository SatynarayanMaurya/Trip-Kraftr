
import React from 'react';
import { Car, Plus, Trash2 } from 'lucide-react';
import { cardStyle } from '../../Common/CommonCss'; // keep your existing path

const PINK = '#ED5F8D';
const BLUE = '#18305C';

// ─── blank vehicle entry ──────────────────────────────────────────────────────
export const blankVehicle = () => ({
  vehicleId: null,
  capacity: 0,
  pricePerDay: 0,
  vehicleImageUrl: '',
  vehicleModel: '',
  vehicleType: '',
  quantity: 1,
  // _id:             '',
});

// ─── shared tiny helpers ──────────────────────────────────────────────────────
const labelCls = 'block text-sm font-semibold text-[#18305C] mb-2';

const selectCls = (disabled) =>
  `w-full border rounded-lg px-3 py-2 outline-none appearance-none text-[13px] transition-colors
   ${disabled
    ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
    : 'border-gray-300 bg-white cursor-pointer focus:ring-2 focus:ring-pink-300'}`;

// ─── SectionHeader (same style as the rest of the file) ──────────────────────
function SectionHeader({ icon, label }) {
  return (
    <div className="flex justify-center mb-4">
      <div
        className="flex items-center gap-2 px-7 py-2 rounded-lg text-[14px] font-bold tracking-wide text-white"
        style={{ background: BLUE }}
      >
        {icon}
        {label}
      </div>
    </div>
  );
}

// ─── single vehicle row ───────────────────────────────────────────────────────
function VehicleEntry({ entry, index, total, allVehicles, disabled, onEntryChange, onDelete }) {
  const selected = allVehicles?.find(v => v._id === entry.vehicleId);

  const handleVehicleSelect = (vehicleId) => {
    const v = allVehicles?.find(v => v._id === vehicleId);
    onEntryChange(index, {
      vehicleId: v?._id || null,
      capacity: v?.capacity || 0,
      pricePerDay: v?.pricePerDay || 0,
      vehicleImageUrl: v?.vehicleImageUrl || '',
      vehicleModel: v?.vehicleModel || '',
      vehicleType: v?.vehicleType || '',
      quantity: entry.quantity || 1,
      // _id:             v?._id            || '',
    });
  };

  const handleQty = (delta) => {
    const qty = Math.max(1, (entry.quantity || 1) + delta);
    onEntryChange(index, { ...entry, quantity: qty });
  };

  return (
    <div className="border border-gray-100 rounded-xl p-4 mb-3 bg-white relative">

      {/* row header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] font-bold" style={{ color: BLUE }}>
          Vehicle {index + 1}
        </span>

        {/* delete — only when more than 1 entry exists */}
        {total > 1 && (
          <button
            type="button"
            onClick={() => onDelete(index)}
            className="p-1 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
            title="Remove vehicle"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* ── Vehicle select ── */}
        <div>
          <label className={labelCls}>Vehicle Selection</label>
          <div className="relative">
            <select
              className={selectCls(disabled)}
              disabled={disabled}
              value={entry.vehicleId ?? ''}
              onChange={e => handleVehicleSelect(e.target.value)}
            >
              <option value="">
                {disabled ? 'Select Sub-Region first' : 'Select Vehicle'}
              </option>
              {(allVehicles ?? []).map(v => (
                <option key={v._id} value={v._id}>
                  {v.vehicleModel} ({v.regionId?.name})
                </option>
              ))}
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-300 pointer-events-none">
              ▼
            </span>
          </div>
        </div>

        {/* ── Quantity stepper ── */}
        <div>
          <label className={labelCls}>Quantity</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleQty(-1)}
              disabled={(entry.quantity || 1) <= 1}
              className="w-9 h-9 rounded-full border border-gray-300 text-lg disabled:opacity-40 transition-opacity"
            >
              −
            </button>
            <div className="w-10 h-9 rounded-md border border-gray-300 flex items-center justify-center font-bold text-[#18305C]">
              {entry.quantity || 1}
            </div>
            <button
              type="button"
              onClick={() => handleQty(1)}
              className="w-9 h-9 rounded-full border border-gray-300 text-lg hover:border-pink-300 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* ── Image preview ── */}
        <div>
          <label className={labelCls}>Vehicle Preview</label>
          <div className="h-37.5 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
            {selected?.vehicleImageUrl ? (
              <img
                src={selected.vehicleImageUrl}
                alt={selected.vehicleModel}
                className="w-full h-full object-cover"
                onError={e => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                No Image
              </div>
            )}
          </div>
        </div>

        {/* ── Details pills ── */}
        <div>
          <label className={labelCls}>Vehicle Details</label>
          <div className="flex flex-col gap-2">
            <div className="border border-gray-300 rounded-full px-4 py-1.5 text-[13px] font-medium text-[#18305C]">
              Capacity : {selected?.capacity || '—'} pax
            </div>
            <div className="border border-gray-300 rounded-full px-4 py-1.5 text-[13px] font-medium text-[#18305C]">
              ₹ {selected?.pricePerDay || 0}/day
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VehicleSection — main export
// ─────────────────────────────────────────────────────────────────────────────
function VehicleSectionPrivateTrip({ dayData, allVehicles, onDayChange, activeDay, formData }) {
  // vehicleDetails is always an array (from blankDay)
  const vehicles = Array.isArray(dayData?.vehicleDetails)
    ? dayData.vehicleDetails
    : [blankVehicle()];


  // last entry must have a vehicleId before adding another
  const lastEntry = vehicles[vehicles.length - 1];
  const canAddMore = !!lastEntry?.vehicleId;

  // ── handlers ──────────────────────────────────────────────────────────────

  const handleEntryChange = (index, patch) => {
    const updated = vehicles.map((v, i) => i === index ? { ...v, ...patch } : v);
    onDayChange('vehicleDetails', updated);
  };

  const handleAddVehicle = () => {
    if (!canAddMore) return;
    onDayChange('vehicleDetails', [...vehicles, blankVehicle()]);
  };

  const handleDeleteVehicle = (index) => {
    if (vehicles.length <= 1) return;
    onDayChange('vehicleDetails', vehicles.filter((_, i) => i !== index));
  };

  const handleSameAsPrevious = () => {
    const previousVehicle = formData?.itineraryBuilder?.daysDetails?.[activeDay - 2]?.vehicleDetails
    const copiedVehicles = previousVehicle.map(vehicle => ({
      ...vehicle,
    }));

    onDayChange("vehicleDetails", copiedVehicles);
  }

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div style={cardStyle}>
      <SectionHeader icon={<Car size={16} />} label="Vehicle" />

      {/* Add vehicle button row */}
      <div className="flex justify-between mb-3">

        <button
          type="button"
          onClick={handleAddVehicle}
          disabled={!canAddMore}
          title={
            !canAddMore ? 'Select a vehicle first' :
              'Add another vehicle'
          }
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold transition-all
            ${canAddMore
              ? 'text-white cursor-pointer'
              : 'text-gray-300 bg-gray-100 border border-gray-200 cursor-not-allowed'}`}
          style={canAddMore ? { background: PINK, border: `1px solid ${PINK}` } : {}}
        >
          <Plus size={13} />
          Add Vehicle
        </button>

        {
          activeDay !== 1 &&
          <button
            type="button"
            onClick={handleSameAsPrevious}
            // disabled={!canAddMore}
            title="Same as Previous day Vehicle"
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold transition-all text-white cursor-pointer  `}
            style={{ background: PINK, border: `1px solid ${PINK}` }}
          >
            Same as Previous day
          </button>
        }
      </div>

      {/* Vehicle entries */}
      {vehicles.map((entry, idx) => (
        <VehicleEntry
          key={idx}
          entry={entry}
          index={idx}
          total={vehicles.length}
          allVehicles={allVehicles}
          // disabled={isDisabled}
          onEntryChange={handleEntryChange}
          onDelete={handleDeleteVehicle}
        />
      ))}
    </div>
  );
}


export default VehicleSectionPrivateTrip