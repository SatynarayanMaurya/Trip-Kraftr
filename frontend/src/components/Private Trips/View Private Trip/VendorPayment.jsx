import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Pencil,
  Hotel,
  Car,
  Save,
  X,
} from 'lucide-react'

// ─── constants ────────────────────────────────────────────────────────────────
const PINK = '#ED5F8D';
const BLUE = '#18305C';
const PAYMENT_MODES = ['UPI', 'Bank Transfer', 'Cash', 'Cheque', 'NEFT', 'RTGS']
const PAYMENT_STATUSES = ['Pending', 'Paid']

// ─── helpers ──────────────────────────────────────────────────────────────────

const formatINR = (n) =>
  `₹${Number(n || 0).toLocaleString('en-IN')}`

const formatDate = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const toInputDate = (d) => {
  if (!d) return ''
  const dt = new Date(d)
  if (isNaN(dt)) return ''
  return dt.toISOString().split('T')[0]
}

const emptyRow = () => ({
  _tempId: Math.random().toString(36).slice(2),
  date: '',
  amount: '',
  mode: 'UPI',
  utrNo: '',
  status: 'Pending',
  isNew: true,
})

// ─── PaymentTable ─────────────────────────────────────────────────────────────

function PaymentTable({ price, payments, onSaveNew, onDelete, entityLabel }) {
  const [rows, setRows] = useState(payments ?? [])
  const [newRows, setNewRows] = useState([]) // draft rows
  const [editIdx, setEditIdx] = useState(null)
  const [editData, setEditData] = useState(null)

  const totalPaid = rows
    .filter((r) => r.status === 'Paid')
    .reduce((s, r) => s + Number(r.amount || 0), 0)

  const addRow = () => setNewRows((p) => [...p, emptyRow()])

  const updateNew = (tempId, field, val) =>
    setNewRows((p) =>
      p.map((r) => (r._tempId === tempId ? { ...r, [field]: val } : r))
    )

  const removeNew = (tempId) =>
    setNewRows((p) => p.filter((r) => r._tempId !== tempId))

  const saveNew = (row) => {
    if (!row.date || !row.amount || !row.mode) {
      alert('Date, Amount and Mode are required.')
      return
    }
    const saved = {
      date: row.date,
      amount: Number(row.amount),
      mode: row.mode,
      utrNo: row.utrNo,
      status: row.status,
    }
    onSaveNew(saved)
    setRows((p) => [...p, saved])
    removeNew(row._tempId)
  }

  const startEdit = (i) => {
    setEditIdx(i)
    setEditData({ ...rows[i] })
  }

  const saveEdit = () => {
    const updated = rows.map((r, i) => (i === editIdx ? editData : r))
    setRows(updated)
    console.log(`[VendorPayment] updated payment @ index ${editIdx}:`, editData)
    setEditIdx(null)
    setEditData(null)
  }

  const cancelEdit = () => { setEditIdx(null); setEditData(null) }

  const deleteRow = (i) => {
    const removed = rows[i]
    setRows((p) => p.filter((_, idx) => idx !== i))
    onDelete(removed, i)
  }

//   const totalPrice = rows.reduce((s, r) => s + Number(r.amount || 0), 0)
  const totalPrice = price|| 0
  const balanceDue = totalPrice - totalPaid

  const colCls = 'px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide'
  const cellCls = 'px-3 py-3 text-sm text-gray-700'

  return (
    <div className="mt-3">
      {/* table wrapper — horizontal scroll on small screens */}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className={colCls}>{entityLabel} Name</th>
              <th className={colCls}>Date</th>
              <th className={colCls}>Amount</th>
              <th className={colCls}>Mode</th>
              <th className={colCls}>UTR No.</th>
              <th className={colCls}>Status</th>
              <th className={colCls}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">

            {/* existing rows */}
            {rows?.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                {editIdx === i ? (
                  <>
                    <td className={cellCls}>—</td>
                    <td className={cellCls}>
                      <input type="date" value={toInputDate(editData.date)}
                        onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                        className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs w-32 focus:outline-none focus:ring-2 focus:ring-pink-200" />
                    </td>
                    <td className={cellCls}>
                      <input type="number" value={editData.amount}
                        onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                        className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs w-24 focus:outline-none focus:ring-2 focus:ring-pink-200" />
                    </td>
                    <td className={cellCls}>
                      <select value={editData.mode}
                        onChange={(e) => setEditData({ ...editData, mode: e.target.value })}
                        className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-pink-200">
                        {PAYMENT_MODES.map((m) => <option key={m}>{m}</option>)}
                      </select>
                    </td>
                    <td className={cellCls}>
                      <input value={editData.utrNo}
                        onChange={(e) => setEditData({ ...editData, utrNo: e.target.value })}
                        className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs w-28 focus:outline-none focus:ring-2 focus:ring-pink-200" />
                    </td>
                    <td className={cellCls}>
                      <select value={editData.status}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                        className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-pink-200">
                        {PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className={cellCls}>
                      <div className="flex items-center gap-1.5">
                        <button onClick={saveEdit}
                          className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Save">
                          <Save size={13} />
                        </button>
                        <button onClick={cancelEdit}
                          className="p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors" title="Cancel">
                          <X size={13} />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className={`${cellCls} font-medium text-gray-800`}>—</td>
                    <td className={cellCls}>{formatDate(row.date)}</td>
                    <td className={`${cellCls} font-semibold`}>{formatINR(row.amount)}</td>
                    <td className={cellCls}>
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
                        {row.mode}
                      </span>
                    </td>
                    <td className={`${cellCls} text-gray-500`}>{row.utrNo || '—'}</td>
                    <td className={cellCls}>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        row.status === 'Paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className={cellCls}>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => startEdit(i)}
                          className="p-1.5 rounded-lg text-yellow-500 hover:bg-yellow-50 transition-colors" title="Edit">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => deleteRow(i)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors" title="Delete">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}

            {/* new draft rows */}
            {newRows.map((row) => (
              <tr key={row._tempId} className="bg-pink-50/30">
                <td className={cellCls + ' text-gray-400 italic text-xs'}>New entry</td>
                <td className={cellCls}>
                  <input type="date" value={row.date}
                    onChange={(e) => updateNew(row._tempId, 'date', e.target.value)}
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs w-32 focus:outline-none focus:ring-2 focus:ring-pink-200 bg-white" />
                </td>
                <td className={cellCls}>
                  <input type="number" placeholder="0" value={row.amount}
                    onChange={(e) => updateNew(row._tempId, 'amount', e.target.value)}
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs w-24 focus:outline-none focus:ring-2 focus:ring-pink-200 bg-white" />
                </td>
                <td className={cellCls}>
                  <select value={row.mode}
                    onChange={(e) => updateNew(row._tempId, 'mode', e.target.value)}
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-pink-200 bg-white">
                    {PAYMENT_MODES.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </td>
                <td className={cellCls}>
                  <input placeholder="UTR No." value={row.utrNo}
                    onChange={(e) => updateNew(row._tempId, 'utrNo', e.target.value)}
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs w-28 focus:outline-none focus:ring-2 focus:ring-pink-200 bg-white" />
                </td>
                <td className={cellCls}>
                  <select value={row.status}
                    onChange={(e) => updateNew(row._tempId, 'status', e.target.value)}
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-pink-200 bg-white">
                    {PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className={cellCls}>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => saveNew(row)}
                      className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Save">
                      <Save size={13} />
                    </button>
                    <button onClick={() => removeNew(row._tempId)}
                      className="p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors" title="Cancel">
                      <X size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {rows.length === 0 && newRows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-xs text-gray-400 italic">
                  No payments yet. Click "+ Add Payment" to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* summary cards */}
      {/* {rows.length > 0 && ( */}
      {(
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SummaryCard label="Total Price" value={formatINR(totalPrice)} valueClass="text-gray-800" />
          <SummaryCard label="Total Paid"  value={formatINR(totalPaid)}  valueClass="text-green-600" />
          <SummaryCard label="Balance Due" value={formatINR(balanceDue)} valueClass="text-[#E91E8C]" />
        </div>
      )}

      {/* add button at bottom */}
      <button
        onClick={addRow}
        className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#E91E8C] hover:text-[#c71878] transition-colors"
      >
        <Plus size={14} /> Add Payment
      </button>
    </div>
  )
}

// ─── SummaryCard ──────────────────────────────────────────────────────────────

function SummaryCard({ label, value, valueClass }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
      <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-lg font-bold ${valueClass}`}>{value}</p>
    </div>
  )
}

// ─── CollapsibleSection ───────────────────────────────────────────────────────

function CollapsibleSection({ icon: Icon, iconBg, title, subtitle, price, payments, onSaveNew, onDelete, entityLabel }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden mb-4">
      {/* header row — always visible */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 sm:px-5 py-4 hover:bg-gray-50/60 transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{title}</p>
            {subtitle && <p className="text-xs text-gray-400 truncate">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-3">
          <span className="hidden sm:block text-sm font-bold text-gray-700">{formatINR(price)}</span>
          {open ? (
            <ChevronUp size={16} className="text-gray-400" />
          ) : (
            <ChevronDown size={16} className="text-gray-400" />
          )}
        </div>
      </button>

      {/* price on mobile — shown below header */}
      <div className="sm:hidden px-4 pb-2 -mt-2 flex items-center justify-between">
        <span className="text-xs text-gray-400">Vendor Price</span>
        <span className="text-sm font-bold text-gray-800">{formatINR(price)}</span>
      </div>

      {/* collapsible body */}
      {open && (
        <div className="px-4 sm:px-5 pb-5 border-t border-gray-50">
          <PaymentTable
            price={price}
            payments={payments}
            onSaveNew={onSaveNew}
            onDelete={onDelete}
            entityLabel={entityLabel}
          />
        </div>
      )}
    </div>
  )
}

// ─── VendorPayment (main) ─────────────────────────────────────────────────────

function VendorPayment() {
  const { privateTripId } = useParams()
  const privateTripFinanceDetails = useSelector(
    (s) => s.privateTrip.privateTripFinanceById?.[privateTripId]
  )
//   console.log('privateTripFinanceDetails :', privateTripFinanceDetails)

  if (!privateTripFinanceDetails) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-400">
        Loading finance details…
      </div>
    )
  }

  const { _id: financeId, hotelPayments = [], vehiclePayments = [] } = privateTripFinanceDetails

  // ── hotel handlers ──
  const handleHotelSave = (hotel, payment) => {
    const payload = {
      financeId,
      hotelId: hotel.hotelId ?? null,
      hotelName: hotel.hotelName,
      payment,
    }
    console.log('[VendorPayment] Save hotel payment:', payload)
  }

  const handleHotelDelete = (hotel, payment, idx) => {
    const payload = {
      financeId,
      hotelId: hotel.hotelId ?? null,
      hotelName: hotel.hotelName,
      paymentIndex: idx,
      payment,
    }
    console.log('[VendorPayment] Delete hotel payment:', payload)
  }

  // ── vehicle handlers ──
  const handleVehicleSave = (vehicle, payment) => {
    const payload = {
      financeId,
      vehicleId: vehicle.vehicleId?._id ?? null,
      vendorName: vehicle.vehicleId?.vendorName ?? null,
      payment,
    }
    console.log('[VendorPayment] Save vehicle payment:', payload)
  }

  const handleVehicleDelete = (vehicle, payment, idx) => {
    const payload = {
      financeId,
      vehicleId: vehicle.vehicleId?._id ?? null,
      vendorName: vehicle.vehicleId?.vendorName ?? null,
      paymentIndex: idx,
      payment,
    }
    console.log('[VendorPayment] Delete vehicle payment:', payload)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8  ">

      {/* ── Hotel Vendors ── */}
      {hotelPayments.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Hotel size={16} className="text-indigo-500" />
            </div>
            <h2 className="text-base font-bold text-gray-900">Hotel Vendors</h2>
            <span className="ml-1 text-xs font-semibold bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full">
              {hotelPayments.length}
            </span>
          </div>

          {hotelPayments.map((hotel, i) => (
            <CollapsibleSection
              key={hotel.hotelId ?? `manual-hotel-${i}`}
              icon={Hotel}
              iconBg="bg-indigo-500"
              title={hotel.hotelName}
              subtitle={hotel.hotelId ? `ID: ${hotel.hotelId}` : 'Manual entry'}
              price={hotel.price}
              payments={hotel.payments ?? []}
              entityLabel="Hotel"
              onSaveNew={(payment) => handleHotelSave(hotel, payment)}
              onDelete={(payment, idx) => handleHotelDelete(hotel, payment, idx)}
            />
          ))}
        </section>
      )}

      {/* ── Vehicle Vendors ── */}
      {vehiclePayments.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center">
              <Car size={16} className={`text-${PINK}`} />
            </div>
            <h2 className="text-base font-bold text-gray-900">Vehicle Vendors</h2>
            <span className={`ml-1 text-xs font-semibold bg-pink-50 text-${PINK} px-2 py-0.5 rounded-full`}>
              {vehiclePayments.length}
            </span>
          </div>

          {vehiclePayments.map((vehicle, i) => (
            <CollapsibleSection
              key={vehicle.vehicleId?._id ?? `vehicle-${i}`}
              icon={Car}
              iconBg={`bg-[${PINK}]`}
              title={vehicle.vehicleId?.vendorName ?? `Vehicle Vendor ${i + 1}`}
              subtitle={vehicle.vehicleId?.contactNo ? `📞 ${vehicle.vehicleId.contactNo}` : null}
              price={vehicle.price}
              payments={vehicle.payments ?? []}
              entityLabel="Vehicle"
              onSaveNew={(payment) => handleVehicleSave(vehicle, payment)}
              onDelete={(payment, idx) => handleVehicleDelete(vehicle, payment, idx)}
            />
          ))}
        </section>
      )}

      {/* empty state */}
      {hotelPayments.length === 0 && vehiclePayments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Hotel size={24} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-600">No vendor payment data found.</p>
          <p className="text-xs text-gray-400 mt-1">Finance details may not be loaded yet.</p>
        </div>
      )}
    </div>
  )
}

export default VendorPayment