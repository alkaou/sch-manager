import React, { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

import HomePage from "../pages/HomePage.jsx";
import StartedPage from "../pages/StartedPage.jsx";
import { checkThemeForBgColor } from "../utils/colors.js";

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

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setThemeColor }}>
            <div
                className={`min-h-screen flex flex-col transition-all duration-500 ${themeColorSelect[theme]}`}
            >
                {children}
            </div>
        </ThemeContext.Provider>
    );
};

const RoutesManager = () => {
    return (
        <Router>
            <ThemeProvider>
                <Routes>
                    <Route exact path="/" element={<HomePage />} />
                    <Route exact path="/started" element={<StartedPage />} />
                </Routes>
            </ThemeProvider>
        </Router>
    );
};

export default RoutesManager;
