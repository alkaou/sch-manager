import React, { useState, useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import { Check } from "lucide-react";

import { useLanguage, useTheme } from "./contexts";
import { gradients } from "../utils/colors";
import { Translator } from "../utils/Translator";

const ColorsSelector = ({ OpenThePopup }) => {
    const [selectedColor, setSelectedColor] = useState(gradients[0]);

    const { setThemeColor, theme } = useTheme();
    const { language } = useLanguage();

    useEffect(() => {
        let BgColorSelected = secureLocalStorage.getItem("ThemeColorSelect");
        if (BgColorSelected !== undefined && BgColorSelected !== null) {
            setSelectedColor(BgColorSelected["light"]);
            // console.log(BgColorSelected["light"]);
        }
    }, []);

    const select_this_color = () => {
        const BG_COLORS = {
            light: selectedColor,
            dark: "bg-gray-900 text-white",
        }
        // console.log(BG_COLORS);
        setThemeColor(BG_COLORS);
        secureLocalStorage.setItem("ThemeColorSelect", BG_COLORS);
        OpenThePopup();
    };

    return (
        <div className="flex flex-col items-center gap-3 md:gap-4 w-full max-w-full">
            {/* Aperçu du fond sélectionné */}
            <div className={`w-32 md:w-40 h-16 md:h-20 rounded-lg shadow-lg ${selectedColor}`}></div>

            {/* Bouton de validation */}
            <button
                className="w-10 h-10 md:w-12 md:h-12 hover:scale-110 flex items-center justify-center rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 transition"
                onClick={select_this_color}
            >
                <Check className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Sélecteur de couleurs */}
            <h2 className={`text-base md:text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-800"} text-bold italic text-center mb-1 md:mb-2`}>{Translator[language].select_color_text}</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 md:gap-3 overflow-y-auto scrollbar-custom max-h-48 md:max-h-60 p-2 w-full">
                {gradients.map((gradient, index) => (
                    <button
                        key={index}
                        className={`
                            relative ml-auto mr-auto w-12 h-12 md:w-14 md:h-14 rounded-full 
                            shadow-md border-2 ${selectedColor === gradient ? "border-blue-500" : 
                            "border-transparent"} ${gradient} hover:scale-110 transition-all duration-300
                            ${index + 1 === gradients.length ? "mb-2" : ""}
                        `}
                        onClick={() => setSelectedColor(gradient)}
                    >
                        {/* Icône Check centrée sur la couleur sélectionnée */}
                        {selectedColor === gradient && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Check className="w-5 h-5 md:w-6 md:h-6 text-white drop-shadow-md" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ColorsSelector;
