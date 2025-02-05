import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import ThemeProvider from "../providers/ThemeProvider.jsx";
import LanguageProvider from "../providers/LanguageProvider.jsx";
import HomePage from "../pages/HomePage.jsx";
import StartedPage from "../pages/StartedPage.jsx";


const RoutesManager = () => {
    return (
        <Router>
            <ThemeProvider>
                <LanguageProvider>
                    <Routes>
                        <Route exact path="/" element={<HomePage />} />
                        <Route exact path="/started" element={<StartedPage />} />
                    </Routes>
                </LanguageProvider>
            </ThemeProvider>
        </Router>
    );
};

export default RoutesManager;
