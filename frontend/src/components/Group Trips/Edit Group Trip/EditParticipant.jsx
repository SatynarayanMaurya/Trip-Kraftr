import React, { useEffect, useState, useRef } from 'react'
import { useCommonHooks } from '../../../hooks/useCommonHooks'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { X, Search, Save, ChevronDown } from 'lucide-react'
import {useParams} from 'react-router-dom'
import { useGroupTripHooks } from '../../../hooks/useGroupTripHooks'

const OCCUPANCY_OPTIONS = ['single', 'double', 'triple']
const VISA_OPTIONS = ['N/A', 'Applied', 'Approved', 'Rejected', 'On Arrival']
const DIETARY_OPTIONS = ['Vegetarian', 'Non-Vegetarian', 'Both (Veg & Non-Veg)', 'Vegan', 'Jain'];

function EditParticipant({ closeModal,selectedParticipant,setIsUpdated }) {
  const { searchB2BEnquiry, searchB2CEnquiry } = useCommonHooks()
  const isProduction = useSelector(s => s.user.isProduction)
  const { groupTripId } = useParams();
  const {updateGroupTripParticipantById} = useGroupTripHooks()
  const groupTripDetails = useSelector(s => s.groupTrip.groupTripById?.[groupTripId]);
//   console.log("group trip details : ",groupTripDetails)



  const [account, setAccount] = useState('b2c')
  const [search, setSearch] = useState('')
  const [selectedEnquiry, setSelectedEnquiry] = useState(null)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [searchedEnquiries, setSearchedEnquiries] = useState(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef(null)

  const [form, setForm] = useState({
    travellerName: selectedParticipant?.travellerName || '',
    totalMembers:  selectedParticipant?.totalMembers || '',
    contact:  selectedParticipant?.contact || '',
    dietaryPreference:  selectedParticipant?.dietaryPreference || '',
    occupancy:  selectedParticipant?.occupancy || '',
    saleAmount:  selectedParticipant?.saleAmount || '',
    paidAmount:  selectedParticipant?.paidAmount || '',
    visaStatus: selectedParticipant?.visaStatus ||  'N/A',
    status: selectedParticipant?.status || 'enquiry'
  })

  useEffect(() => {
    if(!groupTripDetails) return 
    setForm(prev => ({
      ...prev,
      saleAmount:
        (groupTripDetails?.tripDetails?.occupancy?.[prev.occupancy] || 0) *
        (form.totalMembers||1),
    }));
  }, [form.occupancy, form.totalMembers, groupTripDetails]);

  const [errors, setErrors] = useState({})

  const searchEnquiry = async () => {
    try {
      setFetchLoading(true)
      let response
      if (account === 'b2b') {
        response = await searchB2BEnquiry(search, null, true)
      } else {
        response = await searchB2CEnquiry(search, null, true)
      }
      setSearchedEnquiries(response?.data?.searchedEnquiries)
      setShowSuggestions(true)
    } catch (error) {
      if (!isProduction) console.log('Search error:', error)
      toast.error(error?.response?.data?.message || error?.message || 'Error searching')
    } finally {
      setFetchLoading(false)
    }
  }

  useEffect(() => {
    if (search?.trim() && !selectedEnquiry) {
      searchEnquiry()
    } else {
      setSearchedEnquiries(null)
      setShowSuggestions(false)
    }
  }, [search, account])

  // Close suggestions on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const clearEnquiry = () => {
    setSelectedEnquiry(null)
    setSearch('')
    setSearchedEnquiries(null)
    setShowSuggestions(false)
    setForm({ travellerName: '', totalMembers: '', contact: '', dietaryPreference: '', occupancy: '', saleAmount: '', paidAmount: '', visaStatus: 'N/A' })
    setErrors({})
  }

  const handleSelectEnquiry = (enq) => {
    setSelectedEnquiry(enq)
    setSearch(enq.accountId?.fullName || enq.accountId?.businessName || '')
    setShowSuggestions(false)
    setForm(prev=>({
        ...prev,
      travellerName: enq.accountId?.fullName || enq.accountId?.businessName||'',
      totalMembers: enq.totalMembers ?? '',
      contact: enq.accountId?.phone ?? '',
      dietaryPreference: enq.dietaryPreference || '',
    }))
    setErrors({})
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.travellerName.trim()) e.travellerName = 'Required'
    if (!form.totalMembers) e.totalMembers = 'Required'
    if (!form.contact) e.contact = 'Required'
    if (!form.occupancy) e.occupancy = 'Required'
    if (!form.saleAmount) e.saleAmount = 'Required'
    if (form.paidAmount && Number(form.paidAmount) > Number(form.saleAmount))
      e.paidAmount = 'Cannot exceed sale amount'
    return e
  }

  const handleSubmit =async (e) => {

    try{
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length) { setErrors(errs); return }
        // submit logic here
        const payload = {
            ...form,
            _id:selectedParticipant?._id,
            groupTripId: groupTripId,
            enquiryId: selectedParticipant?.enquiryId?._id,
            saleAmount: Number(form.saleAmount),
            paidAmount: Number(form.paidAmount)||0,
            totalMembers: Number(form.totalMembers),
            enquiryType:account
        }
        setSubmitLoading(true)
        const response = await updateGroupTripParticipantById(groupTripId,payload)
        toast.success(response?.data?.message||'Participant updated!')
        setIsUpdated()
        closeModal()

    }
    catch(error){
      if (!isProduction) {
        console.log("========= ERROR DEBUG START =========");
        console.log("Error:", error);
        console.log("Response:", error?.response);
        console.log("========= ERROR DEBUG END =========");
      }
      toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
    }
    finally{
        setSubmitLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-lg font-semibold text-gray-800">Update Participant</h2>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5 space-y-5">
          {/* Search + B2B/B2C */}
          <div className="flex gap-2" ref={searchRef}>
            {/* Account type dropdown */}
            <div className="relative">
              <select
                value={account}
                disabled
                // onChange={e => {
                //     setAccount(e.target.value) 
                //     clearEnquiry()
                // }}
                className="h-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-pink-400 cursor-pointer"
              >
                <option value="b2c">B2C</option>
                <option value="b2b">B2B</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Search input */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search enquiry by name..."
                value={selectedParticipant?.travellerName||''}
                readOnly
                className={`w-full pl-9 pr-8 py-2.5 border rounded-lg text-sm focus:outline-none transition placeholder:text-gray-400
                  ${selectedEnquiry
                    ? 'border-pink-300 bg-pink-50 text-gray-700 cursor-default focus:ring-0'
                    : 'border-pink-300 bg-pink-50 text-gray-700 cursor-default focus:ring-0'
                    // : 'border-gray-200 focus:ring-2 focus:ring-pink-400 bg-white'
                  }`}
              />

              {/* Clear button (X) when enquiry is selected */}
              {selectedEnquiry ? (
                <button
                  type="button"
                  onClick={clearEnquiry}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full bg-pink-200 hover:bg-pink-300 text-pink-600 transition"
                  title="Remove selected enquiry"
                >
                  <X size={12} />
                </button>
              ) : fetchLoading ? (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : null}

              {/* Suggestions dropdown */}
              {showSuggestions && searchedEnquiries?.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-52 overflow-y-auto">
                  {searchedEnquiries.map(enq => (
                    <button
                      key={enq._id}
                      type="button"
                      onClick={() => handleSelectEnquiry(enq)}
                      className="w-full text-left px-4 py-3 hover:bg-pink-50 border-b border-gray-50 last:border-0 transition"
                    >
                      <div className="font-medium text-sm text-gray-800">{enq.accountId?.fullName || enq?.accountId?.businessName}</div>
                      <div className="text-xs text-gray-500 mt-0.5 flex gap-3">
                        <span>{enq.enquiryId}</span>
                        <span>{enq.accountId?.phone}</span>
                        <span className="bg-gray-100 px-1.5 rounded text-gray-600">{enq.status}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {showSuggestions && searchedEnquiries?.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 px-4 py-3 text-sm text-gray-500">
                  No enquiries found
                </div>
              )}
            </div>

            <div className="relative">
              <select
                value={form?.status}
                onChange={e => {
                    handleChange('status', e.target.value)}}
                className="h-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-pink-400 cursor-pointer"
              >
                {/* <option value="">Status</option> */}
                <option value="enquiry">Enquiry</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="confirmed">Confirmed</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Row: Traveller Name + Visa Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Traveller Name" required error={errors.travellerName}>
              <input
                type="text"
                value={form.travellerName}
                onChange={e => handleChange('travellerName', e.target.value)}
                placeholder="Traveller name"
                className={input(errors.travellerName)}
              />
            </Field>
            <Field label="Visa Status">
              <div className="relative">
                <select
                  value={form.visaStatus}
                  onChange={e => handleChange('visaStatus', e.target.value)}
                  className={`${input()} appearance-none pr-8`}
                >
                  {VISA_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </Field>
          </div>

          {/* Row: Total Members + Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Total Members" required error={errors.totalMembers}>
              <input
                type="number"
                value={form.totalMembers}
                onChange={e => handleChange('totalMembers', e.target.value)}
                placeholder="0"
                min={1}
                className={input(errors.totalMembers)}
              />
            </Field>
            <Field label="Contact" required error={errors.contact}>
              <input
                type="tel"
                value={form.contact}
                onChange={e => handleChange('contact', e.target.value)}
                placeholder="Phone number"
                className={input(errors.contact)}
              />
            </Field>
          </div>

          {/* Row: Dietary + Occupancy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* <Field label="Dietary Preference">
              <input
                type="text"
                value={form.dietaryPreference}
                onChange={e => handleChange('dietaryPreference', e.target.value)}
                placeholder="e.g. Vegetarian"
                className={input()}
              />
            </Field> */}
            <Field label="Dietary Preference" required error={errors.dietaryPreference}>
              <div className="relative">
                <select
                  value={form.dietaryPreference}
                  onChange={e => handleChange('dietaryPreference', e.target.value)}
                  className={`${input(errors.dietaryPreference)} appearance-none pr-8`}
                >
                  <option value="">Select dietary Preference</option>
                  {DIETARY_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </Field>
            <Field label="Occupancy" required error={errors.occupancy}>
              <div className="relative">
                <select
                  value={form.occupancy}
                  onChange={e => handleChange('occupancy', e.target.value)}
                  className={`${input(errors.occupancy)} appearance-none pr-8`}
                >
                  <option value="">Select occupancy</option>
                  {OCCUPANCY_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </Field>
          </div>

          {/* Row: Sale Amount + Paid Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Sale Amount" required error={errors.saleAmount}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input
                  type="number"
                  value={form.saleAmount}
                  onChange={e => handleChange('saleAmount', e.target.value)}
                  placeholder="0"
                  min={0}
                  className={`${input(errors.saleAmount)} pl-7`}
                />
              </div>
            </Field>
            <Field label="Paid Amount" error={errors.paidAmount}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input
                  type="number"
                  value={form.paidAmount}
                  onChange={e => handleChange('paidAmount', e.target.value)}
                  placeholder="0"
                  min={0}
                  className={`${input(errors.paidAmount)} pl-7`}
                />
              </div>
            </Field>
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition shadow-sm"
            >
              <Save size={15} />
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Helpers
const input = (error) =>
  `w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition
  ${error
    ? 'border-red-300 focus:ring-red-300 bg-red-50'
    : 'border-gray-200 focus:ring-pink-400 bg-white'
  }`

function Field({ label, required, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
        {label}{required && <span className="text-pink-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export default EditParticipant