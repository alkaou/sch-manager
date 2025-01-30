import React from "react";
// import { FaPalette } from "react-icons/fa";
import palletteIcon from "../assets/images/pallette.png";

const ColorPalette = () => {
    return (
        <button className="text-gray-700 dark:text-white">
            <img
                src={palletteIcon}
                className="w-7 h-7 rounded-full transition-all duration-300 hover:w-8 hover:h-8"
                alt="Lang"
            />
        </button>
    );
};

export default ColorPalette;
