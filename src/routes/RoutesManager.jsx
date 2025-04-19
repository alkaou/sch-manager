// RoutesManager.jsx
import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import StartedPage from "../pages/StartedPage.jsx";
import CompositionsPage from "../pages/CompositionsPage.jsx";
import BulletinsPage from "../pages/BulletinsPage.jsx";
import ListeElevesPage from "../pages/ListeElevesPage.jsx";
import PayementsPage from "../pages/PayementsPage.jsx";
import StatistiquesPage from "../pages/StatistiquesPage.jsx";
import ReadPage from "../pages/ReadPage.jsx";
import DatabasePage from "../pages/DatabasePage.jsx";
import HelpersPage from "../pages/HelpersPage.jsx";
import AdvancedLayout from "../layouts/AdvancedLayout.jsx";
import ThemeProvider from "../providers/ThemeProvider.jsx";
import FlashNotificationProvider from "../providers/FlashNotificationProvider.jsx";
import LoaderPageProvider from "../providers/LoaderPageContext.jsx";
import LanguageProvider from "../providers/LanguageProvider.jsx";
import { AuthProvider, UserProfile } from "../auth";

const RoutesManager = () => {
  return (
    <Router>
      <ThemeProvider>
        <FlashNotificationProvider>
          <LoaderPageProvider>
            <LanguageProvider>
              <AuthProvider>
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
                    <Route path="/read" element={<ReadPage />} />
                    <Route path="/helpers" element={<HelpersPage />} />
                    <Route path="/profile-auth" element={<UserProfile />} />
                  </Route>
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </AuthProvider>
            </LanguageProvider>
          </LoaderPageProvider>
        </FlashNotificationProvider>
      </ThemeProvider>
    </Router>
  );
};

export default RoutesManager;