import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'

function ProfitAndLoss() {
  const { privateTripId } = useParams()

  const privateTripFinanceDetails = useSelector(
    (s) => s.privateTrip.privateTripFinanceById?.[privateTripId]
  )
  const privateTripDetails = useSelector((s) => s.privateTrip.privateTripById?.[privateTripId])
  const tripPrice = privateTripDetails?.price

  const hotelCost = privateTripFinanceDetails?.hotelPayments?.reduce((acc, val) => acc + val?.price, 0) || 0
  const vehicleCost = privateTripFinanceDetails?.vehiclePayments?.reduce((acc, val) => acc + val?.price, 0) || 0
  const totalCost = hotelCost + vehicleCost + (tripPrice?.additionalActivities || 0)

  const sellingPrice = (tripPrice?.isMargin ? totalCost + (totalCost * tripPrice?.margin) / 100 : totalCost + tripPrice?.commission) + (tripPrice?.isGstChecked ? tripPrice?.gstPrice : 0)
  const netRevenue = sellingPrice + tripPrice?.festivalSurge - tripPrice?.discount - (tripPrice?.isGstChecked ? tripPrice?.gstPrice : 0)
  const netProfit = (netRevenue - totalCost)

  const netMargin = ((netProfit / totalCost) * 100)?.toFixed(2)

  const fmt = (val) => `₹${Number(val || 0).toLocaleString('en-IN')}`

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp size={22} color="#ED5F8D" />
        <h2 className="text-lg md:text-xl font-bold text-[#18305C] m-0">
          Profit & Loss Statement
        </h2>
      </div>

      {/* Cards Grid */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch">

        {/* Cost Breakdown */}
        <div className="flex-1 bg-white border border-[#F0E0E8] rounded-xl p-4 md:p-6">
          <p className="font-bold text-sm text-[#18305C] mb-4">Cost Breakdown</p>
          <div className="flex flex-col gap-3">
            <Row label="Total Hotel Cost" value={fmt(hotelCost)} />
            <Row label="Total Vehicle Cost" value={fmt(vehicleCost)} />
            <Row label="Activities Cost" value={fmt(tripPrice?.additionalActivities)} />
          </div>
          <div className="border-t border-gray-200 mt-4 pt-4">
            <Row label="Total Cost" value={fmt(totalCost)} bold />
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="flex-1 bg-white border border-[#F0E0E8] rounded-xl p-4 md:p-6">
          <p className="font-bold text-sm text-[#18305C] mb-4">Revenue Summary</p>
          <div className="flex flex-col gap-3">
            <Row label="Selling Price" value={fmt(sellingPrice)} />
            <Row label="Festival Surge" value={fmt(tripPrice?.festivalSurge)} />
            <Row label="GST (5%)" value={fmt(tripPrice?.gstPrice)} />
            <Row label="Discount" value={fmt(tripPrice?.discount)} />
          </div>
          <div className="border-t border-gray-200 mt-4 pt-4">
            <Row label="Net Revenue" value={fmt(netRevenue)} bold />
          </div>
        </div>

        {/* Profitability */}
        <div className="bg-[#F0FFF4] border border-[#BBF7D0] rounded-xl p-4 md:p-6
                        flex flex-row md:flex-col
                        items-center md:items-start
                        justify-around md:justify-center
                        md:w-52 md:gap-6">
          <p className="hidden md:block font-bold text-base text-[#18305C]">Profitability</p>
          <div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Net Profit ({tripPrice?.isMargin ? "Margin":"Commission"}  Basis)</p>
              <p className="text-lg md:text-xl font-bold text-green-600">{fmt(netRevenue)}</p>
            </div>
          </div>
          <div className="w-px h-10 bg-green-200 md:hidden" />
          <ProfitStat label="Net Margin" value={`${netMargin}%`} />
        </div>

      </div>
    </div>
  )
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between items-center">
      <span className={`text-xs md:text-sm ${bold ? 'text-[#18305C] font-bold' : 'text-gray-500 font-normal'}`}>
        {label}
      </span>
      <span className={`text-xs md:text-sm text-[#18305C] ${bold ? 'font-bold' : 'font-medium'}`}>
        {value}
      </span>
    </div>
  )
}

function ProfitStat({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-lg md:text-xl font-bold text-green-600">{value}</p>
    </div>
  )
}

export default ProfitAndLoss