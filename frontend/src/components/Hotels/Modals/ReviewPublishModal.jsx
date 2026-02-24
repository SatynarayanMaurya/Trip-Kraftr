function ReviewPublishModal({ title,actionButton, open, onClose, onConfirm }) {
    if (!open) return null
  
  
    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div className="bg-white w-[420px] rounded-3xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-800">
            {title||""}
          </h2>
  
          <p className="text-sm text-gray-500 mt-2">
            Review & Publish
          </p>
  
          <div className="flex justify-between mt-8">
            <button
              onClick={onClose}
              className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-2 rounded-xl shadow"
            >
              Cancel
            </button>
  
            <button
              onClick={onConfirm}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow flex items-center gap-2"
            >
              {actionButton||""}
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  export default ReviewPublishModal