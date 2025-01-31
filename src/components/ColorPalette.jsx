import React from "react";
// import { FaPalette } from "react-icons/fa";
import palletteIcon from "../assets/images/pallette.png";

const ColorPalette = ({OpenThePopup}) => {
    return (
        <button className="text-gray-700 dark:text-white" onClick={OpenThePopup}>
            <img
                src={palletteIcon}
                className="w-7 h-7 rounded-full transition-all duration-300"
                alt="Lang"
            />
        </button>
    );
};

export default ColorPalette;
