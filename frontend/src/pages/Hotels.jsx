import React from "react";
import {
  Upload,
  Download,
  Plus,
  Search,
  SlidersHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

function Hotels() {
    const hotels = [
        {
          name: "Tawang Mountain View",
          location: "Tawang",
          region: "Arunachal Pradesh",
          category: "Premium",
          contact: "7628988201",
          status: "Active",
        },
        {
          name: "Ziro Valley Retreat",
          location: "Ziro",
          region: "Arunachal Pradesh",
          category: "Deluxe",
          contact: "7628988202",
          status: "Active",
        },
        {
          name: "Bomdila Heights",
          location: "Bomdila",
          region: "Arunachal Pradesh",
          category: "Standard",
          contact: "7628988203",
          status: "Inactive",
        },
        {
          name: "Itanagar Grand",
          location: "Itanagar",
          region: "Arunachal Pradesh",
          category: "Premium",
          contact: "7628988204",
          status: "Active",
        },
        {
          name: "Pasighat Riverside Hotel",
          location: "Pasighat",
          region: "Arunachal Pradesh",
          category: "Deluxe",
          contact: "7628988205",
          status: "Active",
        },
        {
          name: "Dirang Valley Resort",
          location: "Dirang",
          region: "Arunachal Pradesh",
          category: "Premium",
          contact: "7628988206",
          status: "Inactive",
        },
        {
          name: "Roing Eco Stay",
          location: "Roing",
          region: "Arunachal Pradesh",
          category: "Standard",
          contact: "7628988207",
          status: "Active",
        },
        {
          name: "Tezu Lake View",
          location: "Tezu",
          region: "Arunachal Pradesh",
          category: "Deluxe",
          contact: "7628988208",
          status: "Active",
        },
        {
          name: "Along Heritage Inn",
          location: "Along",
          region: "Arunachal Pradesh",
          category: "Standard",
          contact: "7628988209",
          status: "Inactive",
        },
        {
          name: "Mechuka Paradise Lodge",
          location: "Mechuka",
          region: "Arunachal Pradesh",
          category: "Premium",
          contact: "7628988210",
          status: "Active",
        },
      ];

  return (
    <div className="bg-[#f3f4f6] min-h-screen px-10 py-8">
      {/* Title Section */}
      <div className="mb-6">
        <h1 className="text-[26px] font-bold text-[#18305C]">
          Hotels Inventory
        </h1>
        <p className="text-[#6b7280] text-sm mt-1">
          Manage your contracted properties and catalog drafts.
        </p>
      </div>

      {/* Top Right Buttons */}
      <div className="flex justify-end gap-4 mb-6">
        <button className="flex items-center gap-2 px-5 py-2 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition text-sm">
          <Upload size={15} />
          Bulk Import
        </button>

        <button className="flex items-center gap-2 px-5 py-2 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition text-sm">
          <Download size={15} />
          Export
        </button>

        <button className="flex items-center gap-2 px-5 py-2 bg-[#ec5a89] text-white rounded-xl shadow-md hover:shadow-lg transition text-sm">
          <Plus size={15} />
          Add New Hotels
        </button>
      </div>

      {/* Main Card Container */}
      <div className="bg-[#e5e7eb] p-6 rounded-3xl shadow-inner">
        
        {/* Search + Filter */}
        <div className="flex justify-between items-center mb-6">
          
          {/* Search */}
          <div className="flex items-center bg-white rounded-full px-5 py-3 w-[70%] shadow-sm">
            <Search size={16} className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search by hotel names, subregion, region, category"
              className="outline-none w-full text-sm text-gray-600"
            />
          </div>

          {/* Filters */}
          <button className="flex items-center gap-2 bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition text-sm">
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#18305C] ">
                <th className="text-left px-6 py-4">Hotel Details</th>
                <th className="text-left px-6 py-4">Region</th>
                <th className="text-left px-6 py-4">Category</th>
                <th className="text-left px-6 py-4">Contact</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {hotels?.slice(0,5).map((hotel, index) => (
                <tr
                  key={index}
                  className="group  border-t border-dashed border-blue-200"
                >
                  <td className="px-6 py-3">
                    <div className="font-medium text-[#18305C] group-hover:text-[#ED5F8D]">
                      {hotel.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {hotel.location}
                    </div>
                  </td>

                  <td className="px-6 py-5 text-gray-600">
                    {hotel.region}
                  </td>

                  <td className="px-6 py-5 text-gray-600">
                    {hotel.category}
                  </td>

                  <td className="px-6 py-5 text-gray-600">
                    {hotel.contact}
                  </td>

                  <td className="px-6 py-5">
                    <span className={` ${hotel?.status==='Active'?"bg-green-100 text-green-600":"bg-red-100 text-red-600"}  text-xs px-4 py-1 rounded-full`}>
                      {hotel.status}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex gap-4 text-gray-500">
                      <Pencil
                        size={16}
                        className="cursor-pointer hover:text-blue-500"
                      />
                      <Trash2
                        size={16}
                        className="cursor-pointer hover:text-red-500"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}

export default Hotels;