// RoutesManager.jsx
import React from "react"; 
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import ThemeProvider from "../providers/ThemeProvider.jsx";
import LanguageProvider from "../providers/LanguageProvider.jsx";
import LoaderPageProvider from "../providers/LoaderPageContext.jsx";
import FlashNotificationProvider from "../providers/FlashNotificationProvider.jsx";

import HomePage from "../pages/HomePage.jsx";
import AdvancedLayout from "../layouts/AdvancedLayout.jsx";
import StartedPage from "../pages/StartedPage.jsx";
import CompositionsPage from "../pages/CompositionsPage.jsx";
import BulletinsPage from "../pages/BulletinsPage.jsx";
import ListeElevesPage from "../pages/ListeElevesPage.jsx";
import PayementsPage from "../pages/PayementsPage.jsx";
import StatistiquesPage from "../pages/StatistiquesPage.jsx";
import DatabasePage from "../pages/DatabasePage.jsx";

const RoutesManager = () => {
  return (
    <Router>
      <ThemeProvider>
        <FlashNotificationProvider>
          <LoaderPageProvider>
            <LanguageProvider>
              <Routes>
                <Route path="/" element={<HomePage />} />
                {/* Route parent pour le layout avancé */}
                <Route element={<AdvancedLayout />}>
                  <Route path="/started_page" element={<StartedPage />} />
                  <Route path="/compositions" element={<CompositionsPage />} />
                  <Route path="/bulletins" element={<BulletinsPage />} />
                  <Route path="/liste_eleves" element={<ListeElevesPage />} />
                  <Route path="/payements" element={<PayementsPage />} />
                  <Route path="/statistiques" element={<StatistiquesPage />} />
                  <Route path="/database" element={<DatabasePage />} />
                </Route>
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </LanguageProvider>
          </LoaderPageProvider>
        </FlashNotificationProvider>
      </ThemeProvider>
    </Router>
  );
};

export default RoutesManager;
