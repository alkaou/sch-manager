import React, { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

import { checkThemeForBgColor, gradients } from "../utils/colors";
import { ThemeContext } from "../components/contexts";

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("light");
    const [themeColorSelect, setThemeColorSelect] = useState("");

    useEffect(() => {
        let appTheme = secureLocalStorage.getItem("theme");
        if (appTheme !== undefined && appTheme !== null) {
            setTheme(appTheme);
            // console.log(appTheme);
        }
        let bg_colors = checkThemeForBgColor();
        setThemeColorSelect(bg_colors);
        // console.log(bg_colors);
    }, [theme]);


    const toggleTheme = () => {
        const appTheme = theme === "light" ? "dark" : "light";
        setTheme(appTheme);
        secureLocalStorage.setItem("theme", appTheme);
        // console.log(BG_COLORS[theme]);
    };

    const setThemeColor = (newColor) => {
        setThemeColorSelect(newColor);
        // console.log(newColor);
    };

    const app_bg_color = themeColorSelect[theme];
    const text_color = app_bg_color === gradients[1] || app_bg_color === gradients[2] ? "text-gray-700" : "text-white";

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setThemeColor, app_bg_color, text_color, gradients }}>
            <div
                className={`min-h-screen flex flex-col transition-all duration-500 ${app_bg_color}`}
            >
                {children}
            </div>
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;