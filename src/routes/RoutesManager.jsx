import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import ThemeProvider from "../providers/ThemeProvider.jsx";
import LanguageProvider from "../providers/LanguageProvider.jsx";
import LoaderPageProvider from "../providers/LoaderPageContext.jsx";

import HomePage from "../pages/HomePage.jsx";
import StartedPage from "../pages/StartedPage.jsx";


const RoutesManager = () => {
    return (
        <Router>
            <ThemeProvider>
                <LoaderPageProvider>
                    <LanguageProvider>
                        <Routes>
                            <Route exact path="/" element={<HomePage />} />
                            <Route exact path="/started_page" element={<StartedPage />} />
                        </Routes>
                    </LanguageProvider>
                </LoaderPageProvider>
            </ThemeProvider>
        </Router>
    );
};

export default RoutesManager;
