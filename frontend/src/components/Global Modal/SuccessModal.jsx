function SuccessModal({ open, onClose }) {
    if (!open) return null
  
    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-50" onClick={()=>onClose()}>
        <div className="w-[430px] bg-white rounded-[28px] shadow-2xl overflow-hidden" onClick={(e)=>e.stopPropagation()}>
          
          {/* Header */}
          <div className="bg-green-500 text-white text-center py-5 text-lg font-semibold">
            Saved Successfully
          </div>
  
          {/* Body */}
          <div className="py-10 px-8 text-center">
            
            {/* Check Icon */}
            <div className="w-20 h-20 mx-auto bg-green-500 rounded-2xl flex items-center justify-center shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
  
            {/* Text */}
            <p className="text-sm text-gray-500 mt-6">
              All mandatory fields are validated.
            </p>
          </div>
        </div>
      </div>
    )
  }
  
  export default SuccessModal