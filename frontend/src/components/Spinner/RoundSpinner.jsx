
const RoundSpinner = () => {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/20 backdrop-blur-[2px]">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  };
  
  export default RoundSpinner;