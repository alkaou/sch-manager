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
        <div className="flex flex-col items-center gap-4">
            {/* Aperçu du fond sélectionné */}
            <div className={`w-40 h-20 rounded-lg shadow-lg ${selectedColor}`}></div>

            {/* Bouton de validation */}
            <button
                className="w-12 h-12 hover:scale-110 flex items-center justify-center rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 transition"
                onClick={select_this_color}
            >
                <Check className="w-6 h-6" />
            </button>

            {/* Sélecteur de couleurs */}
            <h2 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-800"} text-bold italic text-center mb-2`}>{Translator[language].select_color_text}</h2>
            <div className="grid grid-cols-4 gap-3 overflow-y-auto max-h-60 custom-scrollbar p-2">
                {gradients.map((gradient, index) => (
                    <button
                        key={index}
                        className={`relative w-14 h-14 rounded-full shadow-md border-2 ${selectedColor === gradient ? "border-blue-500" : "border-transparent"} ${gradient} hover:scale-110 transition-all`}
                        onClick={() => setSelectedColor(gradient)}
                    >
                        {/* Icône Check centrée sur la couleur sélectionnée */}
                        {selectedColor === gradient && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Check className="w-6 h-6 text-white drop-shadow-md" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ColorsSelector;
