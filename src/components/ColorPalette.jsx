import React from "react";
import palletteIcon from "../assets/images/pallette.png";

const ColorPalette = ({ OpenThePopup, theme }) => {
    return (
        <>
            {theme === "dark" ?
                <div className="text-gray-300 dark:text-white opacity-50">
                    <img
                        src={palletteIcon}
                        className="w-8 h-8 rounded-full"
                        alt="Lang"
                    />
                </div>
                : (
                    <button className="text-gray-700 dark:text-white" onClick={OpenThePopup}>
                        <img
                            src={palletteIcon}
                            className="w-8 h-8 hover:border-2 border-white rounded-full transition-all hover:scale-110"
                            alt="Lang"
                        />
                    </button>
                )}
        </>
    );
};

export default ColorPalette;
