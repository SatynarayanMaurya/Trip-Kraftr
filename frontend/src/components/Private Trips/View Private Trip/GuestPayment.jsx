
import React, { useState, useRef } from 'react'
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
  Loader2,
  X,
  Upload,
  FileText,
  Send,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { usePrivateTripHooks } from '../../../hooks/usePrivateTripHooks'
import LoadingSpinner from './LoadingSpinner'

// ─── constants ────────────────────────────────────────────────────────────────
const PAYMENT_MODES = ['UPI', 'Bank Transfer', 'Cash', 'Cheque', 'NEFT', 'RTGS']
const PAYMENT_STATUSES = ['Pending', 'Paid']

// ─── helpers ──────────────────────────────────────────────────────────────────

const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`

const formatDate = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
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
  file: null,
  status: 'Pending',
  isNew: true,
})

// ─── FileUploadCell ───────────────────────────────────────────────────────────

function FileUploadCell({ file, onChange, readOnly = false }) {
  const inputRef = useRef()

  if (readOnly) {
    if (!file) return <span className="text-gray-400 text-xs">—</span>
    const name = typeof file === 'string' ? file : file.name
    return (
      <span className="inline-flex items-center gap-1 text-xs text-indigo-600 font-medium truncate max-w-[100px]">
        <FileText size={12} className="shrink-0" />
        <span className="truncate">{name}</span>
      </span>
    )
  }

  return (
    <div className="flex items-center gap-1.5">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={(e) => onChange(e.target.files[0] || null)}
      />
      {file ? (
        <div className="flex items-center gap-1 max-w-[110px]">
          <FileText size={12} className="text-indigo-500 shrink-0" />
          <span className="text-xs text-gray-600 truncate" title={typeof file === 'string' ? file : file.name}>
            {typeof file === 'string' ? 'Receipt' : file.name}
          </span>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-gray-400 hover:text-red-400 transition-colors shrink-0"
          >
            <X size={11} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1 px-2 py-1 rounded-lg border border-dashed border-gray-300 text-gray-400 hover:border-pink-400 hover:text-pink-500 transition-colors text-xs"
        >
          <Upload size={11} /> Upload
        </button>
      )}
    </div>
  )
}

// ─── PaymentTable ─────────────────────────────────────────────────────────────

function PaymentTable({
  price,
  balanceAmount,
  paidAmount,
  payments,
  onSaveNew,
  onSaveAll,
  onDelete,      // (row, index) => void  — console only for now
  onEditSave,    // (payload) => void      — console only for now
  entityLabel,
  submitLoading = false,
}) {
  const [rows, setRows] = useState(payments ?? [])
  const [newRows, setNewRows] = useState([])
  const [editIdx, setEditIdx] = useState(null)
  const [editData, setEditData] = useState(null)


  // ── add helpers (unchanged) ──
  const addRow = () => setNewRows((p) => [...p, emptyRow()])

  const updateNew = (tempId, field, val) =>
    setNewRows((p) => p.map((r) => (r._tempId === tempId ? { ...r, [field]: val } : r)))

  const removeNew = (tempId) =>
    setNewRows((p) => p.filter((r) => r._tempId !== tempId))

  const saveSingleNew = (row) => {
    if (!row.date || !row.amount || !row.mode) {
      alert('Date, Amount and Mode are required.')
      return
    }
    const saved = {
      date: row.date,
      amount: Number(row.amount),
      mode: row.mode,
      file: row.file,
      status: row.status,
    }
    onSaveNew(saved)
    setRows((p) => [...p, saved])
    removeNew(row._tempId)
  }

  const saveAllNew = () => {
    const invalid = newRows.find((r) => !r.date || !r.amount || !r.mode)
    if (invalid) {
      alert('All rows need Date, Amount and Mode filled in.')
      return
    }
    const saved = newRows.map((r) => ({
      date: r.date,
      amount: Number(r.amount),
      mode: r.mode,
      file: r.file,
      status: r.status,
    }))
    onSaveAll?.(saved)
    setRows((p) => [...p, ...saved])
    setNewRows([])
  }

  // ── edit helpers ──
  const startEdit = (i) => {
    setEditIdx(i)
    setEditData({
      ...rows[i],
      file: rows[i].file ?? rows[i].receipt ?? null,
      _originalReceipt: rows[i].receipt ?? rows[i].file ?? null,
    })
  }

  const saveEdit = async () => {
    const original = rows[editIdx]

    // Determine whether the receipt changed
    const newFileIsObject = editData.file instanceof File
    const receiptChanged = newFileIsObject ||
      (editData.file === null && editData._originalReceipt !== null)

    // Build payload — include _id and paymentIndex for backend targeting
    const payload = {
      paymentIndex: editIdx,
      ...(original._id ? { paymentId: original._id } : {}),
      updatedFields: {
        date: editData.date,
        amount: Number(editData.amount),
        mode: editData.mode,
        status: editData.status,
      },
      ...(receiptChanged
        ? {
          receipt: {
            // if newFile is a File object → needs upload; null → remove
            newFile: newFileIsObject ? editData.file : null,
            previousReceipt: editData._originalReceipt ?? null,
            action: newFileIsObject
              ? 'replace'          // delete old, upload new
              : 'remove',          // delete old, no replacement
          },
        }
        : {}),
    }

    await onEditSave?.(payload)
    // Optimistically update local state
    const updatedRow = {
      ...original,
      date: editData.date,
      amount: Number(editData.amount),
      mode: editData.mode,
      status: editData.status,
      // If a new file was uploaded, show it locally; if removed, clear it
      file: newFileIsObject ? editData.file : editData.file,
      receipt: newFileIsObject ? null : editData.file, // new upload has no URL yet
    }
    setRows((p) => p.map((r, i) => (i === editIdx ? updatedRow : r)))

    setEditIdx(null)
    setEditData(null)
  }

  const cancelEdit = () => { setEditIdx(null); setEditData(null) }

  // ── delete helper ──
  const deleteRow = async (i) => {
    const removed = rows[i]
    await onDelete?.(removed, i)
    setRows((p) => p.filter((_, idx) => idx !== i))
  }

  const totalPrice = price || 0

  return (
    <div className="mt-3">

      {/* ── Desktop table ── */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className={colCls}>#</th>
              <th className={colCls}>Date</th>
              <th className={colCls}>Amount</th>
              <th className={colCls}>Mode</th>
              <th className={colCls}>Receipt</th>
              <th className={colCls}>Status</th>
              <th className={colCls}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">

            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                {editIdx === i ? (
                  <>
                    <td className={cellCls + ' text-gray-400 font-mono text-xs'}>{i + 1}</td>
                    <td className={cellCls}>
                      <input type="date" value={toInputDate(editData.date)}
                        onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                        className={inputCls + ' w-32'} />
                    </td>
                    <td className={cellCls}>
                      <input type="number" value={editData.amount}
                        onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                        className={inputCls + ' w-24'} />
                    </td>
                    <td className={cellCls}>
                      <select value={editData.mode}
                        onChange={(e) => setEditData({ ...editData, mode: e.target.value })}
                        className={inputCls}>
                        {PAYMENT_MODES.map((m) => <option key={m}>{m}</option>)}
                      </select>
                    </td>
                    <td className={cellCls}>
                      {/* Shows existing URL as a "file" and allows replacing with a new File */}
                      <FileUploadCell
                        file={editData.file}
                        onChange={(f) => setEditData({ ...editData, file: f })}
                      />
                    </td>
                    <td className={cellCls}>
                      <select value={editData.status}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                        className={inputCls}>
                        {PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className={cellCls}>
                      <div className="flex items-center gap-1.5">
                        {
                          submitLoading ?
                            (
                              <LoadingSpinner />
                            ) :
                            <button onClick={saveEdit} className={actionBtn('green')} title="Save"><Save size={13} /></button>
                        }
                        <button onClick={cancelEdit} className={actionBtn('gray')} title="Cancel"><X size={13} /></button>

                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className={cellCls + ' text-gray-400 font-mono text-xs'}>{i + 1}</td>
                    <td className={cellCls}>{formatDate(row.date)}</td>
                    <td className={cellCls + ' font-semibold'}>{formatINR(row.amount)}</td>
                    <td className={cellCls}>
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">{row.mode}</span>
                    </td>
                    <td className={cellCls}>
                      {row?.receipt ? (
                        <a href={row.receipt} target="_blank" rel="noreferrer"
                          className="px-2 py-0.5 rounded-md underline bg-blue-100 text-blue-600 text-xs font-medium">
                          Receipt
                        </a>
                      ) : row?.file instanceof File ? (
                        <span className="inline-flex items-center gap-1 text-xs text-indigo-600 font-medium">
                          <FileText size={12} />
                          {row.file.name}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">No file</span>
                      )}
                    </td>
                    <td className={cellCls}>
                      <StatusBadge status={row.status} />
                    </td>
                    <td className={cellCls}>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => startEdit(i)} className={actionBtn('yellow')} title="Edit"><Pencil size={13} /></button>
                        <button onClick={() => deleteRow(i)} className={actionBtn('red')} title="Delete"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}

            {/* new draft rows — unchanged */}
            {newRows.map((row, idx) => (
              <tr key={row._tempId} className="bg-pink-50/30">
                <td className={cellCls + ' text-gray-400 font-mono text-xs'}>{rows.length + idx + 1}</td>
                <td className={cellCls}>
                  <input type="date" value={row.date}
                    onChange={(e) => updateNew(row._tempId, 'date', e.target.value)}
                    className={inputCls + ' w-32 bg-white'} />
                </td>
                <td className={cellCls}>
                  <input type="number" placeholder="0" value={row.amount}
                    onChange={(e) => updateNew(row._tempId, 'amount', e.target.value)}
                    className={inputCls + ' w-24 bg-white'} />
                </td>
                <td className={cellCls}>
                  <select value={row.mode}
                    onChange={(e) => updateNew(row._tempId, 'mode', e.target.value)}
                    className={inputCls + ' bg-white'}>
                    {PAYMENT_MODES.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </td>
                <td className={cellCls}>
                  <FileUploadCell
                    file={row.file}
                    onChange={(f) => updateNew(row._tempId, 'file', f)}
                  />
                </td>
                <td className={cellCls}>
                  <select value={row.status}
                    onChange={(e) => updateNew(row._tempId, 'status', e.target.value)}
                    className={inputCls + ' bg-white'}>
                    {PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className={cellCls}>
                  <div className="flex items-center gap-1.5">
                    {submitLoading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <button onClick={() => saveSingleNew(row)} className={actionBtn('green')} title="Save this row">
                        <Save size={13} />
                      </button>
                    )}
                    <button onClick={() => removeNew(row._tempId)} className={actionBtn('gray')} title="Remove"><X size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}

            {rows.length === 0 && newRows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-xs text-gray-400 italic">
                  No payments yet — click "+ Add Payment" below.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile card view ── */}
      <div className="sm:hidden space-y-3">
        {rows.map((row, i) => (
          <MobilePaymentCard
            key={i}
            serial={i + 1}
            row={row}
            isEditing={editIdx === i}
            editData={editData}
            onEdit={() => startEdit(i)}
            onSaveEdit={saveEdit}
            onCancelEdit={cancelEdit}
            onEditChange={(f, v) => setEditData({ ...editData, [f]: v })}
            onDelete={() => deleteRow(i)}
          />
        ))}

        {newRows.map((row, idx) => (
          <MobileNewCard
            key={row._tempId}
            serial={rows.length + idx + 1}
            row={row}
            onChange={(f, v) => updateNew(row._tempId, f, v)}
            onSave={() => saveSingleNew(row)}
            onRemove={() => removeNew(row._tempId)}
          />
        ))}

        {rows.length === 0 && newRows.length === 0 && (
          <p className="text-center text-xs text-gray-400 italic py-6">
            No payments yet — click "+ Add Payment" below.
          </p>
        )}
      </div>

      {/* ── Bottom actions ── */}
      <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
        <button
          onClick={addRow}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#E91E8C] hover:text-[#c71878] transition-colors"
        >
          <Plus size={14} /> Add Payment
        </button>

        {newRows.length > 1 && (
          <button
            onClick={saveAllNew}
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#E91E8C] hover:bg-[#c71878] px-3 py-1.5 rounded-lg transition-colors"
          >
            <Send size={13} /> Save All ({newRows.length})
          </button>
        )}
      </div>

      {/* ── Summary cards ── */}
      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
        <SummaryCard label="Total Price" value={formatINR(totalPrice)} valueClass="text-gray-800" />
        <SummaryCard label="Total Paid" value={formatINR(paidAmount)} valueClass="text-green-600" />
        <SummaryCard label="Balance Due" value={formatINR(balanceAmount)} valueClass="text-[#E91E8C]" />
      </div>
    </div>
  )
}

// ─── Mobile card sub-components ───────────────────────────────────────────────

function MobilePaymentCard({ serial, row, isEditing, editData, onEdit, onSaveEdit, onCancelEdit, onEditChange, onDelete }) {
  if (isEditing) {
    return (
      <div className="rounded-xl border border-pink-200 bg-pink-50/30 p-3 space-y-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-bold text-gray-500">#{serial}</span>
          <div className="flex gap-1.5">
            <button onClick={onSaveEdit} className={actionBtn('green')}><Save size={13} /></button>
            <button onClick={onCancelEdit} className={actionBtn('gray')}><X size={13} /></button>
          </div>
        </div>
        <MobileField label="Date">
          <input type="date" value={toInputDate(editData.date)}
            onChange={(e) => onEditChange('date', e.target.value)}
            className={inputCls + ' w-full'} />
        </MobileField>
        <MobileField label="Amount">
          <input type="number" value={editData.amount}
            onChange={(e) => onEditChange('amount', e.target.value)}
            className={inputCls + ' w-full'} />
        </MobileField>
        <MobileField label="Mode">
          <select value={editData.mode} onChange={(e) => onEditChange('mode', e.target.value)} className={inputCls + ' w-full'}>
            {PAYMENT_MODES.map((m) => <option key={m}>{m}</option>)}
          </select>
        </MobileField>
        <MobileField label="Receipt">
          <FileUploadCell
            file={editData.file}
            onChange={(f) => onEditChange('file', f)}
          />
        </MobileField>
        <MobileField label="Status">
          <select value={editData.status} onChange={(e) => onEditChange('status', e.target.value)} className={inputCls + ' w-full'}>
            {PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </MobileField>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 font-mono">#{serial}</span>
          <span className="text-sm font-bold text-gray-800">{formatINR(row.amount)}</span>
          <StatusBadge status={row.status} />
        </div>
        <div className="flex gap-1.5">
          <button onClick={onEdit} className={actionBtn('yellow')}><Pencil size={13} /></button>
          <button onClick={onDelete} className={actionBtn('red')}><Trash2 size={13} /></button>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-500">
        <span><span className="text-gray-400">Date:</span> {formatDate(row.date)}</span>
        <span><span className="text-gray-400">Mode:</span> {row.mode}</span>
        {(row.receipt || row.file) && (
          <span className="col-span-2">
            <span className="text-gray-400">Receipt: </span>
            {row.receipt ? (
              <a href={row.receipt} target="_blank" rel="noreferrer" className="underline text-blue-600">View</a>
            ) : (
              <FileUploadCell file={row.file} readOnly />
            )}
          </span>
        )}
      </div>
    </div>
  )
}

function MobileNewCard({ serial, row, onChange, onSave, onRemove }) {
  return (
    <div className="rounded-xl border border-dashed border-pink-300 bg-pink-50/20 p-3 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-pink-400">#{serial} New</span>
        <div className="flex gap-1.5">
          <button onClick={onSave} className={actionBtn('green')}><Save size={13} /></button>
          <button onClick={onRemove} className={actionBtn('gray')}><X size={13} /></button>
        </div>
      </div>
      <MobileField label="Date">
        <input type="date" value={row.date} onChange={(e) => onChange('date', e.target.value)} className={inputCls + ' w-full bg-white'} />
      </MobileField>
      <MobileField label="Amount">
        <input type="number" placeholder="0" value={row.amount} onChange={(e) => onChange('amount', e.target.value)} className={inputCls + ' w-full bg-white'} />
      </MobileField>
      <MobileField label="Mode">
        <select value={row.mode} onChange={(e) => onChange('mode', e.target.value)} className={inputCls + ' w-full bg-white'}>
          {PAYMENT_MODES.map((m) => <option key={m}>{m}</option>)}
        </select>
      </MobileField>
      <MobileField label="Receipt">
        <FileUploadCell file={row.file} onChange={(f) => onChange('file', f)} />
      </MobileField>
      <MobileField label="Status">
        <select value={row.status} onChange={(e) => onChange('status', e.target.value)} className={inputCls + ' w-full bg-white'}>
          {PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </MobileField>
    </div>
  )
}

function MobileField({ label, children }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 w-14 shrink-0">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  )
}

// ─── Shared style helpers ─────────────────────────────────────────────────────

const colCls = 'px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap'
const cellCls = 'px-3 py-3 text-sm text-gray-700'
const inputCls = 'border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-pink-200'

const actionBtn = (color) => {
  const map = {
    green: 'p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors',
    gray: 'p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors',
    yellow: 'p-1.5 rounded-lg text-yellow-500 hover:bg-yellow-50 transition-colors',
    red: 'p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors',
  }
  return map[color]
}

// ─── StatusBadge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
      {status}
    </span>
  )
}

// ─── SummaryCard ──────────────────────────────────────────────────────────────

function SummaryCard({ label, value, valueClass }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-3 py-2.5 sm:px-4 sm:py-3 shadow-sm">
      <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium uppercase tracking-wide mb-0.5 sm:mb-1 leading-tight">{label}</p>
      <p className={`text-base sm:text-lg font-bold leading-tight ${valueClass}`}>{value}</p>
    </div>
  )
}

// ─── CollapsibleSection ───────────────────────────────────────────────────────

function CollapsibleSection({
  serial, icon: Icon, iconBg, title, subtitle, price, balanceAmount, paidAmount,
  payments, onSaveNew, onSaveAll, onDelete, onEditSave,
  entityLabel, isOpen, onToggle, submitLoading,
}) {
  return (
    <div className="rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden mb-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 sm:px-5 py-4 hover:bg-gray-50/60 transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center font-mono">
            {serial}
          </span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{title}</p>
            {subtitle && <p className="text-xs text-gray-400 truncate">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
          <span className="text-sm font-bold text-gray-700">{formatINR(price)}</span>
          {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-4 sm:px-5 pb-5 border-t border-gray-50">
          <PaymentTable
            price={price}
            balanceAmount={balanceAmount}
            paidAmount={paidAmount}
            payments={payments}
            onSaveNew={onSaveNew}
            onSaveAll={onSaveAll}
            onDelete={onDelete}
            onEditSave={onEditSave}
            entityLabel={entityLabel}
            submitLoading={submitLoading}
          />
        </div>
      )}
    </div>
  )
}


// ─── VendorPayment (main) ─────────────────────────────────────────────────────

function GuestPayment() {
  const isProduction = useSelector((s) => s.user.isProduction)
  const { updatePrivateTripGuestPayments, updatePrivateTripGuestPaymentsRowWise, deletePrivateTripsGuestPayment } = usePrivateTripHooks()
  const { privateTripId } = useParams()
  const privateTripFinanceDetails = useSelector(
    (s) => s.privateTrip.privateTripFinanceById?.[privateTripId]
  )
  const [submitLoading, setSubmitLoading] = useState(false)

  if (!privateTripFinanceDetails) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-400">
        Loading finance details…
      </div>
    )
  }

  const { _id: financeId, hotelPayments = [], guestPayments = [] } = privateTripFinanceDetails

  const handleGuestPaymentSave = (payment) => {
    const payload = {
      privateTripId,
      financeId,
      payments: [payment]
    }
    GuestPaymentSave(payload)
  }
  const handleGuestSaveAll = (payments) => {
    const payload = {
      privateTripId,
      financeId,
      payments
    }
    GuestPaymentSave(payload)
  }
  const handleGuestDelete = async (hotel, payment, idx) => {
    try {
      const payload = {
        privateTripId,
        financeId,
        paymentIndex: payment,
      }
      setSubmitLoading(true)
      const response = await deletePrivateTripsGuestPayment(payload)
      toast.success(response?.data?.message)
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
    finally {
      setSubmitLoading(false)
    }
  }

  const GuestPaymentSave = async (payload) => {
    try {
      setSubmitLoading(true)
      const response = await updatePrivateTripGuestPayments(payload)
      toast.success(response?.data?.message)
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
    finally {
      setSubmitLoading(false)
    }
  }

  const handleGuestEditSave = async (editPayload) => {
    try {
      const payload = {
        privateTripId,
        financeId,
        ...editPayload,  // paymentIndex, paymentId?, updatedFields, receipt?
      }
      setSubmitLoading(true)
      const response = await updatePrivateTripGuestPaymentsRowWise(payload)
      toast.success(response?.data?.message)
    } catch (error) {
      if (!isProduction) console.log('Error:', error)
      toast.error(error?.response?.data?.message || error?.message || 'Error saving hotel payment')
    } finally {
      setSubmitLoading(false)
    }
  }


  return (
    <div className="p-4 sm:p-6 lg:p-8">


      <CollapsibleSection
        icon={Hotel}
        iconBg="bg-indigo-500"
        title={"Guest Payment Tracking"}
        subtitle={""}
        price={guestPayments?.price || 10000}
        balanceAmount={guestPayments?.balanceAmount}
        paidAmount={guestPayments?.paidAmount}
        payments={guestPayments.payments ?? []}
        entityLabel="Hotel"
        isOpen={true}
        onSaveNew={(payment) => handleGuestPaymentSave(payment)}
        onSaveAll={(payments) => handleGuestSaveAll(payments)}
        onDelete={(payment, idx) => handleGuestDelete(payment, idx)}
        onEditSave={(editPayload) => handleGuestEditSave(editPayload)}
        submitLoading={submitLoading}
      />

      {/* ── empty state ── */}
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

export default GuestPayment




















// import React, { useState, useRef, useEffect } from 'react'
// import { useSelector } from 'react-redux'
// import { useParams } from 'react-router-dom'
// import {
//   ChevronDown,
//   ChevronUp,
//   Plus,
//   Trash2,
//   Pencil,
//   Hotel,
//   Car,
//   Save,
//   Loader2,
//   X,
//   Upload,
//   FileText,
//   Send,
// } from 'lucide-react'
// import { toast } from 'react-toastify'
// import { usePrivateTripHooks } from '../../../hooks/usePrivateTripHooks'

// // ─── constants ────────────────────────────────────────────────────────────────
// const PINK = '#ED5F8D'
// const BLUE = '#18305C'
// const PAYMENT_MODES = ['UPI', 'Bank Transfer', 'Cash', 'Cheque', 'NEFT', 'RTGS']
// const PAYMENT_STATUSES = ['Pending', 'Paid']

// // ─── helpers ──────────────────────────────────────────────────────────────────

// const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`

// const formatDate = (d) => {
//   if (!d) return ''
//   return new Date(d).toLocaleDateString('en-IN', {
//     day: '2-digit', month: '2-digit', year: 'numeric',
//   })
// }

// const toInputDate = (d) => {
//   if (!d) return ''
//   const dt = new Date(d)
//   if (isNaN(dt)) return ''
//   return dt.toISOString().split('T')[0]
// }

// const emptyRow = () => ({
//   _tempId: Math.random().toString(36).slice(2),
//   date: '',
//   amount: '',
//   mode: 'UPI',
//   file: null,
//   status: 'Pending',
//   isNew: true,
// })

// // ─── FileUploadCell ───────────────────────────────────────────────────────────

// function FileUploadCell({ file, onChange, readOnly = false }) {
//   const inputRef = useRef()

//   if (readOnly) {
//     if (!file) return <span className="text-gray-400 text-xs">—</span>
//     const name = typeof file === 'string' ? file : file.name
//     return (
//       <span className="inline-flex items-center gap-1 text-xs text-indigo-600 font-medium truncate max-w-[100px]">
//         <FileText size={12} className="shrink-0" />
//         <span className="truncate">{name}</span>
//       </span>
//     )
//   }

//   return (
//     <div className="flex items-center gap-1.5">
//       <input
//         ref={inputRef}
//         type="file"
//         accept=".pdf,.jpg,.jpeg,.png,.webp"
//         className="hidden"
//         onChange={(e) => onChange(e.target.files[0] || null)}
//       />
//       {file ? (
//         <div className="flex items-center gap-1 max-w-[110px]">
//           <FileText size={12} className="text-indigo-500 shrink-0" />
//           <span className="text-xs text-gray-600 truncate" title={file.name}>{file.name}</span>
//           <button
//             type="button"
//             onClick={() => onChange(null)}
//             className="text-gray-400 hover:text-red-400 transition-colors shrink-0"
//           >
//             <X size={11} />
//           </button>
//         </div>
//       ) : (
//         <button
//           type="button"
//           onClick={() => inputRef.current?.click()}
//           className="flex items-center gap-1 px-2 py-1 rounded-lg border border-dashed border-gray-300 text-gray-400 hover:border-pink-400 hover:text-pink-500 transition-colors text-xs"
//         >
//           <Upload size={11} /> Upload
//         </button>
//       )}
//     </div>
//   )
// }

// // ─── PaymentTable ─────────────────────────────────────────────────────────────

// function PaymentTable({ price, balanceAmount, paidAmount, payments, onSaveNew, onSaveAll, onDelete, entityLabel, submitLoading = false }) {
//   const [rows, setRows] = useState(payments ?? [])
//   const [newRows, setNewRows] = useState([])
//   const [editIdx, setEditIdx] = useState(null)
//   const [editData, setEditData] = useState(null)

//   const totalPaid = rows
//     .filter((r) => r.status === 'Paid')
//     .reduce((s, r) => s + Number(r.amount || 0), 0)

//   const addRow = () => setNewRows((p) => [...p, emptyRow()])

//   const updateNew = (tempId, field, val) =>
//     setNewRows((p) =>
//       p.map((r) => (r._tempId === tempId ? { ...r, [field]: val } : r))
//     )

//   const removeNew = (tempId) =>
//     setNewRows((p) => p.filter((r) => r._tempId !== tempId))

//   const saveSingleNew = (row) => {
//     if (!row.date || !row.amount || !row.mode) {
//       alert('Date, Amount and Mode are required.')
//       return
//     }
//     const saved = {
//       date: row.date,
//       amount: Number(row.amount),
//       mode: row.mode,
//       file: row.file,
//       status: row.status,
//     }
//     onSaveNew(saved)
//     setRows((p) => [...p, saved])
//     removeNew(row._tempId)
//   }

//   const saveAllNew = () => {
//     const invalid = newRows.find((r) => !r.date || !r.amount || !r.mode)
//     if (invalid) {
//       alert('All rows need Date, Amount and Mode filled in.')
//       return
//     }
//     const saved = newRows.map((r) => ({
//       date: r.date,
//       amount: Number(r.amount),
//       mode: r.mode,
//       file: r.file,
//       status: r.status,
//     }))
//     onSaveAll?.(saved)
//     setRows((p) => [...p, ...saved])
//     setNewRows([])
//   }

//   const startEdit = (i) => { setEditIdx(i); setEditData({ ...rows[i] }) }
//   const saveEdit = () => {
//     const updated = rows.map((r, i) => (i === editIdx ? editData : r))
//     setRows(updated)
//     setEditIdx(null); setEditData(null)
//   }
//   const cancelEdit = () => { setEditIdx(null); setEditData(null) }

//   const deleteRow = (i) => {
//     const removed = rows[i]
//     setRows((p) => p.filter((_, idx) => idx !== i))
//     onDelete(removed, i)
//   }

//   const totalPrice = price || 0
//   const balanceDue = totalPrice - totalPaid

//   // ── responsive: card view on mobile, table on sm+ ──
//   return (
//     <div className="mt-3">

//       {/* ── Desktop table ── */}
//       <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-100">
//         <table className="min-w-full text-sm">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className={colCls}>#</th>
//               <th className={colCls}>Date</th>
//               <th className={colCls}>Amount</th>
//               <th className={colCls}>Mode</th>
//               <th className={colCls}>Receipt</th>
//               <th className={colCls}>Status</th>
//               <th className={colCls}>Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-50 bg-white">

//             {rows.map((row, i) => (
//               <tr key={i} className="hover:bg-gray-50/60 transition-colors">
//                 {editIdx === i ? (
//                   <>
//                     <td className={cellCls + ' text-gray-400 font-mono text-xs'}>{i + 1}</td>
//                     <td className={cellCls}>
//                       <input type="date" value={toInputDate(editData.date)}
//                         onChange={(e) => setEditData({ ...editData, date: e.target.value })}
//                         className={inputCls + ' w-32'} />
//                     </td>
//                     <td className={cellCls}>
//                       <input type="number" value={editData.amount}
//                         onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
//                         className={inputCls + ' w-24'} />
//                     </td>
//                     <td className={cellCls}>
//                       <select value={editData.mode}
//                         onChange={(e) => setEditData({ ...editData, mode: e.target.value })}
//                         className={inputCls}>
//                         {PAYMENT_MODES.map((m) => <option key={m}>{m}</option>)}
//                       </select>
//                     </td>
//                     <td className={cellCls}>
//                       <FileUploadCell
//                         file={editData.file}
//                         onChange={(f) => setEditData({ ...editData, file: f })}
//                       />
//                     </td>
//                     <td className={cellCls}>
//                       <select value={editData.status}
//                         onChange={(e) => setEditData({ ...editData, status: e.target.value })}
//                         className={inputCls}>
//                         {PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
//                       </select>
//                     </td>
//                     <td className={cellCls}>
//                       <div className="flex items-center gap-1.5">
//                         <button onClick={saveEdit} className={actionBtn('green')} title="Save"><Save size={13} /></button>
//                         <button onClick={cancelEdit} className={actionBtn('gray')} title="Cancel"><X size={13} /></button>
//                       </div>
//                     </td>
//                   </>
//                 ) : (
//                   <>
//                     <td className={cellCls + ' text-gray-400 font-mono text-xs'}>{i + 1}</td>
//                     <td className={cellCls}>{formatDate(row.date)}</td>
//                     <td className={cellCls + ' font-semibold'}>{formatINR(row.amount)}</td>
//                     <td className={cellCls}>
//                       <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">{row.mode}</span>
//                     </td>
//                     <td className={cellCls}>
//                       {
//                         row?.receipt ?

//                           <a href={row?.receipt} target='_blank' className="px-2 py-0.5 rounded-md underline bg-blue-100 text-blue-600 text-xs font-medium">Receipt</a> :
//                           <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">No file</span>
//                       }
//                     </td>
//                     <td className={cellCls}>
//                       <StatusBadge status={row.status} />
//                     </td>
//                     <td className={cellCls}>
//                       <div className="flex items-center gap-1.5">
//                         <button onClick={() => startEdit(i)} className={actionBtn('yellow')} title="Edit"><Pencil size={13} /></button>
//                         <button onClick={() => deleteRow(i)} className={actionBtn('red')} title="Delete"><Trash2 size={13} /></button>
//                       </div>
//                     </td>
//                   </>
//                 )}
//               </tr>
//             ))}

//             {newRows.map((row, idx) => (
//               <tr key={row._tempId} className="bg-pink-50/30">
//                 <td className={cellCls + ' text-gray-400 font-mono text-xs'}>{rows.length + idx + 1}</td>
//                 <td className={cellCls}>
//                   <input type="date" value={row.date}
//                     onChange={(e) => updateNew(row._tempId, 'date', e.target.value)}
//                     className={inputCls + ' w-32 bg-white'} />
//                 </td>
//                 <td className={cellCls}>
//                   <input type="number" placeholder="0" value={row.amount}
//                     onChange={(e) => updateNew(row._tempId, 'amount', e.target.value)}
//                     className={inputCls + ' w-24 bg-white'} />
//                 </td>
//                 <td className={cellCls}>
//                   <select value={row.mode}
//                     onChange={(e) => updateNew(row._tempId, 'mode', e.target.value)}
//                     className={inputCls + ' bg-white'}>
//                     {PAYMENT_MODES.map((m) => <option key={m}>{m}</option>)}
//                   </select>
//                 </td>
//                 <td className={cellCls}>
//                   <FileUploadCell
//                     file={row.file}
//                     onChange={(f) => updateNew(row._tempId, 'file', f)}
//                   />
//                 </td>
//                 <td className={cellCls}>
//                   <select value={row.status}
//                     onChange={(e) => updateNew(row._tempId, 'status', e.target.value)}
//                     className={inputCls + ' bg-white'}>
//                     {PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
//                   </select>
//                 </td>
//                 <td className={cellCls}>
//                   <div className="flex items-center gap-1.5">
//                     {
//                       submitLoading ? (
//                         <Loader2 className="animate-spin" size={18} />
//                       ) : (
//                         <button
//                           onClick={() => saveSingleNew(row)}
//                           className={actionBtn("green")}
//                           title="Save this row"
//                         >
//                           <Save size={13} />
//                         </button>
//                       )
//                     }
//                     <button onClick={() => removeNew(row._tempId)} className={actionBtn('gray')} title="Remove"><X size={13} /></button>
//                   </div>
//                 </td>
//               </tr>
//             ))}

//             {rows.length === 0 && newRows.length === 0 && (
//               <tr>
//                 <td colSpan={7} className="px-4 py-8 text-center text-xs text-gray-400 italic">
//                   No payments yet — click "+ Add Payment" below.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* ── Mobile card view ── */}
//       <div className="sm:hidden space-y-3">
//         {rows.map((row, i) => (
//           <MobilePaymentCard
//             key={i}
//             serial={i + 1}
//             row={row}
//             isEditing={editIdx === i}
//             editData={editData}
//             onEdit={() => startEdit(i)}
//             onSaveEdit={saveEdit}
//             onCancelEdit={cancelEdit}
//             onEditChange={(f, v) => setEditData({ ...editData, [f]: v })}
//             onDelete={() => deleteRow(i)}
//           />
//         ))}

//         {newRows.map((row, idx) => (
//           <MobileNewCard
//             key={row._tempId}
//             serial={rows.length + idx + 1}
//             row={row}
//             onChange={(f, v) => updateNew(row._tempId, f, v)}
//             onSave={() => saveSingleNew(row)}
//             onRemove={() => removeNew(row._tempId)}
//           />
//         ))}

//         {rows.length === 0 && newRows.length === 0 && (
//           <p className="text-center text-xs text-gray-400 italic py-6">
//             No payments yet — click "+ Add Payment" below.
//           </p>
//         )}
//       </div>

//       {/* ── Summary cards ── */}
//       <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
//         <SummaryCard label="Total Price" value={formatINR(totalPrice)} valueClass="text-gray-800" />
//         <SummaryCard label="Total Paid" value={formatINR(paidAmount)} valueClass="text-green-600" />
//         <SummaryCard label="Balance Due" value={formatINR(balanceAmount)} valueClass="text-[#E91E8C]" />
//       </div>

//       {/* ── Bottom actions ── */}
//       <div className="mt-4 flex flex-wrap items-center gap-3">
//         <button
//           onClick={addRow}
//           className="flex items-center gap-1.5 text-xs font-semibold text-[#E91E8C] hover:text-[#c71878] transition-colors"
//         >
//           <Plus size={14} /> Add Payment
//         </button>

//         {newRows.length > 1 && (
//           <button
//             onClick={saveAllNew}
//             className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#E91E8C] hover:bg-[#c71878] px-3 py-1.5 rounded-lg transition-colors"
//           >
//             <Send size={13} /> Save All ({newRows.length})
//           </button>
//         )}
//       </div>
//     </div>
//   )
// }

// // ─── Mobile card sub-components ───────────────────────────────────────────────

// function MobilePaymentCard({ serial, row, isEditing, editData, onEdit, onSaveEdit, onCancelEdit, onEditChange, onDelete }) {
//   if (isEditing) {
//     return (
//       <div className="rounded-xl border border-pink-200 bg-pink-50/30 p-3 space-y-2">
//         <div className="flex justify-between items-center mb-1">
//           <span className="text-xs font-bold text-gray-500">#{serial}</span>
//           <div className="flex gap-1.5">
//             <button onClick={onSaveEdit} className={actionBtn('green')}><Save size={13} /></button>
//             <button onClick={onCancelEdit} className={actionBtn('gray')}><X size={13} /></button>
//           </div>
//         </div>
//         <MobileField label="Date">
//           <input type="date" value={toInputDate(editData.date)}
//             onChange={(e) => onEditChange('date', e.target.value)}
//             className={inputCls + ' w-full'} />
//         </MobileField>
//         <MobileField label="Amount">
//           <input type="number" value={editData.amount}
//             onChange={(e) => onEditChange('amount', e.target.value)}
//             className={inputCls + ' w-full'} />
//         </MobileField>
//         <MobileField label="Mode">
//           <select value={editData.mode} onChange={(e) => onEditChange('mode', e.target.value)} className={inputCls + ' w-full'}>
//             {PAYMENT_MODES.map((m) => <option key={m}>{m}</option>)}
//           </select>
//         </MobileField>
//         <MobileField label="Receipt">
//           <FileUploadCell file={editData.file} onChange={(f) => onEditChange('file', f)} />
//         </MobileField>
//         <MobileField label="Status">
//           <select value={editData.status} onChange={(e) => onEditChange('status', e.target.value)} className={inputCls + ' w-full'}>
//             {PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
//           </select>
//         </MobileField>
//       </div>
//     )
//   }
//   return (
//     <div className="rounded-xl border border-gray-100 bg-white p-3">
//       <div className="flex justify-between items-start">
//         <div className="flex items-center gap-2">
//           <span className="text-xs font-bold text-gray-400 font-mono">#{serial}</span>
//           <span className="text-sm font-bold text-gray-800">{formatINR(row.amount)}</span>
//           <StatusBadge status={row.status} />
//         </div>
//         <div className="flex gap-1.5">
//           <button onClick={onEdit} className={actionBtn('yellow')}><Pencil size={13} /></button>
//           <button onClick={onDelete} className={actionBtn('red')}><Trash2 size={13} /></button>
//         </div>
//       </div>
//       <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-500">
//         <span><span className="text-gray-400">Date:</span> {formatDate(row.date)}</span>
//         <span><span className="text-gray-400">Mode:</span> {row.mode}</span>
//         {row.file && (
//           <span className="col-span-2">
//             <span className="text-gray-400">Receipt: </span>
//             <FileUploadCell file={row.file} readOnly />
//           </span>
//         )}
//       </div>
//     </div>
//   )
// }

// function MobileNewCard({ serial, row, onChange, onSave, onRemove }) {
//   return (
//     <div className="rounded-xl border border-dashed border-pink-300 bg-pink-50/20 p-3 space-y-2">
//       <div className="flex justify-between items-center">
//         <span className="text-xs font-bold text-pink-400">#{serial} New</span>
//         <div className="flex gap-1.5">
//           <button onClick={onSave} className={actionBtn('green')}><Save size={13} /></button>
//           <button onClick={onRemove} className={actionBtn('gray')}><X size={13} /></button>
//         </div>
//       </div>
//       <MobileField label="Date">
//         <input type="date" value={row.date} onChange={(e) => onChange('date', e.target.value)} className={inputCls + ' w-full bg-white'} />
//       </MobileField>
//       <MobileField label="Amount">
//         <input type="number" placeholder="0" value={row.amount} onChange={(e) => onChange('amount', e.target.value)} className={inputCls + ' w-full bg-white'} />
//       </MobileField>
//       <MobileField label="Mode">
//         <select value={row.mode} onChange={(e) => onChange('mode', e.target.value)} className={inputCls + ' w-full bg-white'}>
//           {PAYMENT_MODES.map((m) => <option key={m}>{m}</option>)}
//         </select>
//       </MobileField>
//       <MobileField label="Receipt">
//         <FileUploadCell file={row.file} onChange={(f) => onChange('file', f)} />
//       </MobileField>
//       <MobileField label="Status">
//         <select value={row.status} onChange={(e) => onChange('status', e.target.value)} className={inputCls + ' w-full bg-white'}>
//           {PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
//         </select>
//       </MobileField>
//     </div>
//   )
// }

// function MobileField({ label, children }) {
//   return (
//     <div className="flex items-center gap-2">
//       <span className="text-xs text-gray-400 w-14 shrink-0">{label}</span>
//       <div className="flex-1">{children}</div>
//     </div>
//   )
// }

// // ─── Shared style helpers ─────────────────────────────────────────────────────

// const colCls = 'px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap'
// const cellCls = 'px-3 py-3 text-sm text-gray-700'
// const inputCls = 'border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-pink-200'

// const actionBtn = (color) => {
//   const map = {
//     green: 'p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors',
//     gray: 'p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors',
//     yellow: 'p-1.5 rounded-lg text-yellow-500 hover:bg-yellow-50 transition-colors',
//     red: 'p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors',
//   }
//   return map[color]
// }

// // ─── StatusBadge ──────────────────────────────────────────────────────────────

// function StatusBadge({ status }) {
//   return (
//     <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
//       }`}>
//       {status}
//     </span>
//   )
// }

// // ─── SummaryCard ──────────────────────────────────────────────────────────────

// function SummaryCard({ label, value, valueClass }) {
//   return (
//     <div className="rounded-xl border border-gray-100 bg-white px-3 py-2.5 sm:px-4 sm:py-3 shadow-sm">
//       <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium uppercase tracking-wide mb-0.5 sm:mb-1 leading-tight">{label}</p>
//       <p className={`text-base sm:text-lg font-bold leading-tight ${valueClass}`}>{value}</p>
//     </div>
//   )
// }

// // ─── CollapsibleSection ───────────────────────────────────────────────────────

// function CollapsibleSection({  icon: Icon, iconBg, title, subtitle, price,balanceAmount, paidAmount, payments, onSaveNew, onSaveAll, onDelete, entityLabel, isOpen, submitLoading }) {
//   return (
//     <div className="rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden mb-3">
//       {/* header */}
//       <button
//         className="w-full flex items-center justify-between px-4 sm:px-5 py-4 hover:bg-gray-50/60 transition-colors text-left"
//       >
//         <div className="flex items-center gap-3 min-w-0">
//           <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
//             <Icon size={18} className="text-white" />
//           </div>
//           <div className="min-w-0">
//             <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{title}</p>
//             {subtitle && <p className="text-xs text-gray-400 truncate">{subtitle}</p>}
//           </div>
//         </div>
//         <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
//           <span className="text-sm font-bold text-gray-700">{formatINR(price)}</span>
//           {isOpen
//             ? <ChevronUp size={16} className="text-gray-400" />
//             : <ChevronDown size={16} className="text-gray-400" />
//           }
//         </div>
//       </button>

//       {/* collapsible body */}
//       {isOpen && (
//         <div className="px-4 sm:px-5 pb-5 border-t border-gray-50">
//           <PaymentTable
//             price={price}
//             paidAmount={paidAmount}
//             balanceAmount={balanceAmount}
//             payments={payments}
//             onSaveNew={onSaveNew}
//             onSaveAll={onSaveAll}
//             onDelete={onDelete}
//             entityLabel={entityLabel}
//             submitLoading={submitLoading}
//           />
//         </div>
//       )}
//     </div>
//   )
// }

// // ─── VendorPayment (main) ─────────────────────────────────────────────────────

// function GuestPayment() {

//   const isProduction = useSelector(s => s.user.isProduction)
//   const { updatePrivateTripGuestPayments} = usePrivateTripHooks()
//   const { privateTripId } = useParams()
//   const privateTripFinanceDetails = useSelector(
//     (s) => s.privateTrip.privateTripFinanceById?.[privateTripId]
//   )
//   const [submitLoading, setSubmitLoading] = useState(false)



//   if (!privateTripFinanceDetails) {
//     return (
//       <div className="flex items-center justify-center py-20 text-sm text-gray-400">
//         Loading finance details…
//       </div>
//     )
//   }
//   const { _id: financeId, hotelPayments = [], guestPayments = [] } = privateTripFinanceDetails

//   // ── hotel handlers ──
//   // ── hotel handlers ──
//   const handleGuestPaymentSave = ( payment) => {
//     const payload = {
//       privateTripId,
//       financeId,
//       payments: [payment]
//     }
//     GuestPaymentSave(payload)
//   }
//   const handleHotelSaveAll = (payments) => {
//     const payload = {
//       privateTripId,
//       financeId,
//       payments
//     }
//     GuestPaymentSave(payload)
//   }
//   const handleHotelDelete = (hotel, payment, idx) => {
//     console.log('[VendorPayment] Delete hotel payment:', { financeId, hotelId: hotel.hotelId ?? null, hotelName: hotel.hotelName, paymentIndex: idx, payment })
//   }

//   const GuestPaymentSave = async (payload) => {
//     try {
//       console.log("Payload : ", payload)
//       setSubmitLoading(true)
//       const response = await updatePrivateTripGuestPayments(payload)
//       console.log("Response : ", response)
//     }
//     catch (error) {
//       if (!isProduction) {
//         console.log("========= ERROR DEBUG START =========");
//         console.log("Error:", error);
//         console.log("Response:", error?.response);
//         console.log("========= ERROR DEBUG END =========");
//       }
//       toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
//     }
//     finally {
//       setSubmitLoading(false)
//     }
//   }


//   return (
//     <div className="p-4 sm:p-6 lg:p-8">


//       <CollapsibleSection
//         icon={Hotel}
//         iconBg="bg-indigo-500"
//         title={"Guest Payment Tracking"}
//         subtitle={""}
//         price={guestPayments?.price||10000}
//         balanceAmount={guestPayments?.balanceAmount}
//         paidAmount={guestPayments?.paidAmount}
//         payments={guestPayments.payments ?? []}
//         entityLabel="Hotel"
//         isOpen={true}
//         onSaveNew={(payment) => handleGuestPaymentSave( payment)}
//         onSaveAll={(payments) => handleHotelSaveAll( payments)}
//         onDelete={(payment, idx) => handleHotelDelete( payment, idx)}
//         submitLoading={submitLoading}
//       />



//       {/* ── empty state ── */}
//       {hotelPayments.length === 0 && (
//         <div className="flex flex-col items-center justify-center py-20 text-center">
//           <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
//             <Hotel size={24} className="text-gray-400" />
//           </div>
//           <p className="text-sm font-medium text-gray-600">No vendor payment data found.</p>
//           <p className="text-xs text-gray-400 mt-1">Finance details may not be loaded yet.</p>
//         </div>
//       )}
//     </div>
//   )
// }

// // ─── SectionHeader ────────────────────────────────────────────────────────────

// function SectionHeader({ icon: Icon, iconBg, iconColor, title, count }) {
//   return (
//     <div className="flex items-center gap-2 mb-4">
//       <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center`}>
//         <Icon size={16} className={iconColor} />
//       </div>
//       <h2 className="text-base font-bold text-gray-900">{title}</h2>
//       <span className={`ml-1 text-xs font-semibold ${iconBg} ${iconColor} px-2 py-0.5 rounded-full`}>
//         {count}
//       </span>
//     </div>
//   )
// }


// export default GuestPayment