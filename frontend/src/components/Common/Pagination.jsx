import React from 'react'

function Pagination({ setCurrentPage,pagination,currentPage=1,isSearching=false,}) {
    return (
        <div
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 bg-white rounded-xl px-4 md:px-5 py-4"
            style={{
                border: '1.5px solid #E5E7EB',
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
            }}
        >

            {/* 🔹 Left Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">

                {/* Row: Prev → Page → Next */}
                <div className="flex items-center justify-between sm:justify-start gap-3 w-full">

                    {/* Prev */}
                    <button
                        disabled={currentPage === 1 || isSearching}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 w-full sm:w-auto
    ${currentPage === 1 || isSearching
                                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-[#ED5F8D] border-[#E91E8C] text-white hover:bg-[#C81878] cursor-pointer'
                            }`}
                    >
                        ← Prev
                    </button>

                    {/* Page Info */}
                    <p className="text-sm text-gray-400 whitespace-nowrap">
                        Page <span className="text-[#18305C] font-semibold">{currentPage || 1}</span> of{" "}
                        <span className="text-[#18305C] font-semibold">{pagination?.totalPages || 0}</span>
                    </p>

                    {/* Next */}
                    <button
                        disabled={currentPage === pagination?.totalPages || isSearching}
                        onClick={() => setCurrentPage(Number(currentPage + 1))}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 w-full sm:w-auto
    ${currentPage === pagination?.totalPages || isSearching
                                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-[#ED5F8D] border-[#E91E8C] text-white hover:bg-[#C81878] cursor-pointer'
                            }`}
                    >
                        Next →
                    </button>

                </div>

            </div>

            {/* 🔹 Right Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 w-full md:w-auto">

                {/* Go to page */}
                <div className="flex items-center justify-between sm:justify-start gap-3 text-sm text-gray-400 w-full sm:w-auto">
                    <span>Go to page</span>

                    <select
                        value={currentPage}
                        disabled={isSearching}
                        onChange={(e) => setCurrentPage(Number(e.target.value))}
                        className="w-[100px] bg-white border border-gray-200 text-[#18305C] text-sm px-3 py-2 rounded-lg outline-none focus:border-[#E91E8C] cursor-pointer"
                        style={{
                            boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                        }}
                    >
                        {Array.from({ length: pagination?.totalPages || 1 }, (_, index) => (
                            <option key={index} value={index + 1}>
                                {index + 1}
                            </option>
                        ))}
                    </select>
                </div>

            </div>

        </div>
    )
}

export default Pagination