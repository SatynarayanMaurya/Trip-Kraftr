import React from "react";

function EnquiryPrivateTrip({
    enquiryDetails,
    searchEnquiry,
    setSearchEnquiry,
    setCustomerDetails,
    setEnquiryDetails,
    searchedEnquiries,
    setActiveTab,
    setFormData,
}) {

    return (
        <div className="w-full">
            <p className="mb-3 text-sm text-gray-500">
                Search for an open enquiry to start building the itinerary.
            </p>

            {/* Search bar + B2B/B2C dropdown */}
            <div className="flex gap-2 items-center">
                <select
                    value={searchEnquiry.enquiryType}
                    onChange={(e) =>
                        setSearchEnquiry((prev) => ({
                            ...prev,
                            enquiryType: e.target.value,
                        }))
                    }
                    className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-gray-700 cursor-pointer"
                >
                    <option value="b2c">B2C</option>
                    <option value="b2b">B2B</option>
                </select>
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        value={searchEnquiry.search}
                        onChange={(e) => {
                            setSearchEnquiry((prev) => ({
                                ...prev,
                                search: e.target.value,
                            }));

                            // Clear selected enquiry so suggestions appear again
                            if (enquiryDetails?._id) {
                                setEnquiryDetails(null);
                            }
                        }}
                        placeholder="Search by name or phone no"
                        className="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                    />
                </div>


            </div>

            {/* Results dropdown */}
            {!enquiryDetails?._id &&
                (searchEnquiry.loading ||
                    searchedEnquiries?.length > 0 ||
                    (searchEnquiry.search?.trim() && !searchEnquiry.loading)) && (
                    <div className="mt-2 rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                        {searchEnquiry.loading ? (
                            <div className="divide-y divide-gray-100">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="animate-pulse p-4">
                                        <div className="h-3 w-16 rounded bg-gray-100 mb-2" />
                                        <div className="h-4 w-36 rounded bg-gray-200 mb-2" />
                                        <div className="h-3 w-28 rounded bg-gray-100" />
                                    </div>
                                ))}
                            </div>
                        ) :
                            searchedEnquiries?.length > 0 ? (
                                <div className="max-h-92 overflow-y-auto divide-y divide-gray-100">
                                    {searchedEnquiries?.map((enquiry) => (
                                        <button
                                            key={enquiry._id}
                                            type="button"
                                            onClick={() => {
                                                setEnquiryDetails(enquiry);
                                                setFormData(prev=>({
                                                    ...prev,
                                                    customerNotes:enquiry?.notes
                                                }))
                                                setSearchEnquiry((prev) => ({
                                                    ...prev,
                                                    search: enquiry?.accountId?.fullName || "",
                                                }));
                                                setActiveTab(2);
                                            }}
                                            className="w-full text-left px-4 py-3.5 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="text-xs text-gray-400 mb-0.5">
                                                        {enquiry?.enquiryId}
                                                    </p>
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {enquiry?.accountId?.fullName || enquiry?.accountId?.businessName} • {enquiry?.purpose}
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-0.5">
                                                        {enquiry?.accountId?.phone}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end gap-1.5 shrink-0">
                                                    <p className="text-xs text-gray-500">
                                                        {enquiry?.destinations?.join(", ")}
                                                    </p>
                                                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${searchEnquiry.enquiryType === "b2b"
                                                        ? "bg-pink-50 text-pink-700"
                                                        : "bg-blue-50 text-blue-700"
                                                        }`}>
                                                        {searchEnquiry.enquiryType.toUpperCase()}
                                                    </span>
                                                    <p className="text-xs text-gray-400">
                                                        {enquiry?.totalMembers} members
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 text-center text-sm text-gray-400">
                                    No enquiries found
                                </div>
                            )}
                    </div>
                )}

            {/* Enquiry Details */}
            {enquiryDetails?._id && (
                <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-lg font-semibold">
                                {enquiryDetails.accountId?.fullName || enquiryDetails.accountId?.businessName} • {enquiryDetails?.purpose}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {enquiryDetails.enquiryId}
                            </p>
                        </div>

                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                            {enquiryDetails.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">

                        <div>
                            <p className="text-gray-500">Phone</p>
                            <p className="font-medium">
                                {enquiryDetails.accountId?.phone}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Email</p>
                            <p className="font-medium">
                                {enquiryDetails.accountId?.email || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Trip Type</p>
                            <p className="font-medium">
                                {enquiryDetails.tripType}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Destination</p>
                            <p className="font-medium">
                                {enquiryDetails.destinations?.join(", ")}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Start Date</p>
                            <p className="font-medium">
                                {new Date(enquiryDetails.startDate).toLocaleDateString()}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Duration</p>
                            <p className="font-medium">
                                {enquiryDetails.noOfDays} Days
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Adults</p>
                            <p className="font-medium">
                                {enquiryDetails.adult}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Children</p>
                            <p className="font-medium">
                                {enquiryDetails.child}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Total Members</p>
                            <p className="font-medium">
                                {enquiryDetails.totalMembers}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Source</p>
                            <p className="font-medium">
                                {enquiryDetails.accountId?.source}
                            </p>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default EnquiryPrivateTrip;