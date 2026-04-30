import React from "react";

export const BlueButton = ({ text="Button"}) => {
    return (
        <button
            className={`
                px-6 py-2
                rounded-full
                bg-[#08255B]
                text-white
                font-medium
                shadow-md
                hover:bg-[#081f52]
                transition-all duration-200
                active:scale-95
            `}
        >
            {text}
        </button>
    );
};

// export default PrimaryButton;