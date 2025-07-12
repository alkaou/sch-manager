// RoutesManager.jsx
import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import StartedPage from "../pages/StartedPage.jsx";
import CompositionsPage from "../pages/CompositionsPage.jsx";
import BulletinsPage from "../pages/BulletinsPage.jsx";
import ListesPage from "../pages/ListesPage.jsx";
import PayementsPage from "../pages/PayementsPage.jsx";
import StatistiquesPage from "../pages/StatistiquesPage.jsx";
import ReadPage from "../pages/ReadPage.jsx";
import DatabasePage from "../pages/DatabasePage.jsx";
import HelpersPage from "../pages/HelpersPage.jsx";
import PrivacyPolicy from "../pages/PrivacyPolicy.jsx";
import TermsOfUse from "../pages/TermsOfUse.jsx";
import CommunityPage from "../pages/CommunityPage.jsx";
import AboutPage from "../pages/AboutPage.jsx";
import EmployesPage from "../pages/EmployesPage.jsx";
import DepensesPage from "../pages/DepensesPage.jsx";
import EventsPage from "../pages/EventsPage.jsx";


import AdvancedLayout from "../layouts/AdvancedLayout.jsx";
import ThemeProvider from "../providers/ThemeProvider.jsx";
import FlashNotificationProvider from "../providers/FlashNotificationProvider.jsx";
import ProtectionsProvider from "../providers/ProtectionsProvider.jsx";
import LanguageProvider from "../providers/LanguageProvider.jsx";
import { AuthProvider, UserProfile } from "../auth";

const RoutesManager = () => {
  return (
    <Router>
      <ThemeProvider>
        <FlashNotificationProvider>
          <ProtectionsProvider>
            <LanguageProvider>
              <AuthProvider>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-use" element={<TermsOfUse />} />
                  <Route path="/tuto_helpers" element={<HelpersPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/community" element={<CommunityPage />} />
                  <Route path="/no_data_profile-auth" element={<UserProfile />} />
                  {/* Route parent pour le layout avancé */}
                  <Route element={<AdvancedLayout />}>
                    <Route path="/started_page" element={<StartedPage />} />
                    <Route path="/compositions" element={<CompositionsPage />} />
                    <Route path="/bulletins" element={<BulletinsPage />} />
                    <Route path="/liste_eleves" element={<ListesPage />} />
                    <Route path="/payements" element={<PayementsPage />} />
                    <Route path="/statistiques" element={<StatistiquesPage />} />
                    <Route path="/database" element={<DatabasePage />} />
                    <Route path="/read" element={<ReadPage />} />
                    <Route path="/helpers" element={<HelpersPage />} />
                    <Route path="/profile-auth" element={<UserProfile />} />
                    <Route path="/employes" element={<EmployesPage />} />
                    <Route path="/depenses" element={<DepensesPage />} />
                    <Route path="/events" element={<EventsPage />} />
                  </Route>
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </AuthProvider>
            </LanguageProvider>
          </ProtectionsProvider>
        </FlashNotificationProvider>
      </ThemeProvider>
    </Router>
  );
};

export default RoutesManager;