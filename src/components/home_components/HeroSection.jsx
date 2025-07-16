import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Database,
  BookOpen,
  Users,
  BarChart2,
  Shield,
  Palette,
  ShieldCheck,
} from "lucide-react";

import { useLanguage, useTheme, useProtections } from "../contexts";

const HeroSection = ({ setIsOpenPopup, data, isOthersBGColors, refreshData }) => {
  const { live_language } = useLanguage();
  const { openPasswordPoupAndPastAction } = useProtections();
  const navigate = useNavigate();

  const { text_color, app_bg_color, gradients } = useTheme();

  const iconsTextColor =
    app_bg_color !== gradients[1] && app_bg_color !== gradients[2]
      ? "text-green-600"
      : text_color;

  const handleCreateDb = () => {
    setIsOpenPopup("DB_CREATOR");
  };

  const create_db_text = live_language.create_btn_text || "CRÉER";
  const update_db_text = live_language.update_btn_text || "MODIFIER";

  const db_is_existing = data && data?.name ? true : false;

  const togglePalletteColor = () => {
    setIsOpenPopup(true);
  };

  const toggleSecurityPopup = () => {
    refreshData();
    openPasswordPoupAndPastAction();
  };

  const navigateToStartedPage = () => {
    refreshData();
    if (db_is_existing && data.security && data.security.password) {
      openPasswordPoupAndPastAction("navigateToStartedPage");
      return;
    }
    navigate("/started_page");
  };

  // Animation variants for staggered children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <section
      id="home"
      className={`relative pt-10 sm:pt-14 md:pt-16 lg:pt-20 pb-8 sm:pb-10 md:pb-12 lg:pb-14 overflow-hidden`}
    >
      {/* Background decoration - animated circles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-8 sm:-top-10 md:-top-12 lg:-top-16 -right-8 sm:-right-10 md:-right-12 lg:-right-16 w-24 sm:w-32 md:w-40 lg:w-48 h-24 sm:h-32 md:h-40 lg:h-48 rounded-full bg-blue-500 opacity-10 animate-pulse"></div>
        <div className="absolute top-16 sm:top-20 md:top-24 lg:top-30 -left-12 sm:-left-16 md:-left-20 lg:-left-24 w-36 sm:w-48 md:w-64 lg:w-80 h-36 sm:h-48 md:h-64 lg:h-80 rounded-full bg-purple-500 opacity-10 animate-pulse"></div>
        <div className="absolute bottom-4 sm:bottom-5 md:bottom-6 lg:bottom-8 right-4 sm:right-6 md:right-8 lg:right-10 w-16 sm:w-20 md:w-24 lg:w-32 h-16 sm:h-20 md:h-24 lg:h-32 rounded-full bg-green-500 opacity-10 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-2 sm:px-3 md:px-4 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-5 md:gap-6 lg:gap-8 lg:space-y-0">
          {/* Left side - Text content */}
          <motion.div
            className="w-full lg:w-1/2 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1
              className={`
                  text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-5 p-1 sm:p-2 md:p-3 bg-clip-text text-transparent 
                  ${
                    isOthersBGColors
                      ? "bg-gradient-to-r from-white to-gray-50"
                      : "bg-gradient-to-r from-blue-600 to-purple-600"
                  }
              `}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {live_language.welcome_text ||
                "Gérez votre établissement sans aucune compétence en informatique !"}
            </motion.h1>

            <motion.p
              className="text-sm sm:text-base md:text-lg mb-4 sm:mb-5 md:mb-6 opacity-90 max-w-xl mx-auto lg:mx-0 px-1 sm:px-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {live_language.hero_description ||
                "Une plateforme puissante et intuitive qui simplifie la gestion quotidienne de votre école. Bulletins, compositions, listes d'élèves, et analyses statistiques en quelques clics."}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center lg:justify-start gap-2 sm:gap-3 md:gap-4 mt-8"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <motion.button
                variants={item}
                onClick={handleCreateDb}
                className="py-1.5 sm:py-2 md:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center text-xs sm:text-sm px-4 min-w-max"
              >
                <Database className="mr-1.5 sm:mr-2 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5" />
                {db_is_existing ? update_db_text : create_db_text}
              </motion.button>

              {db_is_existing && (
                <motion.button
                  variants={item}
                  onClick={navigateToStartedPage}
                  className="py-1.5 sm:py-2 md:py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center text-xs sm:text-sm px-4 min-w-max"
                >
                  <BookOpen className="mr-1.5 sm:mr-2 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5" />
                  {live_language.dashboard_text || "TABLEAU DE BORD"}
                </motion.button>
              )}

              <motion.button
                variants={item}
                onClick={togglePalletteColor}
                className="uppercase py-1.5 sm:py-2 md:py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center text-xs sm:text-sm px-4 min-w-max"
              >
                <Palette className="mr-1.5 sm:mr-2 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5" />
                {live_language.theme_text || "THEME"}
              </motion.button>

              <motion.button
                variants={item}
                onClick={toggleSecurityPopup}
                className="uppercase py-1.5 sm:py-2 md:py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center text-xs sm:text-sm px-4 min-w-max"
              >
                <ShieldCheck className="mr-1.5 sm:mr-2 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5" />
                {live_language.security_text || "SECURITE"}
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right side - Illustration/Features */}
          <motion.div
            className="w-full lg:w-1/2 mt-6 lg:mt-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <div className="relative">
              {/* Main image/illustration */}
              <motion.div
                className="w-full h-44 sm:h-52 md:h-60 lg:h-72 xl:h-80 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-xl shadow-2xl overflow-hidden flex items-center justify-center"
                whileHover={{
                  scale: 1.02,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <svg
                  className="w-2/3 h-2/3 text-blue-600 dark:text-blue-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 1.5,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                  />
                  <motion.path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 1.5,
                      ease: "easeInOut",
                      delay: 0.8,
                    }}
                  />
                  <motion.path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 1.5,
                      ease: "easeInOut",
                      delay: 0.65,
                    }}
                  />
                </svg>
              </motion.div>

              {/* Floating feature cards */}
              <motion.div
                className={`${iconsTextColor} absolute -bottom-2 sm:-bottom-3 -left-2 sm:-left-3 p-1.5 sm:p-2 md:p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="flex items-center">
                  <Users className="text-blue-600 mr-1 sm:mr-1.5 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                  <span className="font-semibold text-xs sm:text-xs md:text-sm">
                    {live_language.students_management || "Gestion des élèves"}
                  </span>
                </div>
              </motion.div>

              <motion.div
                className={`${iconsTextColor} absolute -top-2 sm:-top-3 -right-2 sm:-right-3 p-1.5 sm:p-2 md:p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="flex items-center">
                  <BarChart2 className="text-purple-600 mr-1 sm:mr-1.5 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                  <span className="font-semibold text-xs sm:text-xs md:text-sm">
                    {live_language.analytics_nav || "Analyses"}
                  </span>
                </div>
              </motion.div>

              <motion.div
                className={`${iconsTextColor} absolute top-1/2 right-0 transform translate-x-1/3 -translate-y-1/2 p-1.5 sm:p-2 md:p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                whileHover={{
                  x: -5,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="flex items-center">
                  <Shield className="text-green-600 mr-1 sm:mr-1.5 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                  <span className="font-semibold text-xs sm:text-xs md:text-sm">
                    {live_language.security_text || "Sécurité"}
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
