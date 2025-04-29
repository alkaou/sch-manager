import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Database, BookOpen, Users, BarChart2, Shield, Palette } from 'lucide-react';

import { useLanguage, useTheme } from '../contexts';

const HeroSection = ({ setIsOpenPopup, data, isOthersBGColors }) => {
  const { live_language } = useLanguage();
  const navigate = useNavigate();

  const { text_color, app_bg_color, gradients } = useTheme();

  const iconsTextColor = app_bg_color !== gradients[1] &&
    app_bg_color !== gradients[2] ?
    "text-green-600" : text_color;

  const handleCreateDb = () => {
    setIsOpenPopup("DB_CREATOR");
  };

  const create_db_text = live_language.create_btn_text || "CRÉER";
  const update_db_text = live_language.update_btn_text || "MODIFIER";

  const db_is_existing = data && data?.name ? true : false;

  const togglePalletteColor = () => {
    setIsOpenPopup(true);
  };

  // Animation variants for staggered children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <section id="home" className={`relative pt-24 pb-16 overflow-hidden`}>
      {/* Background decoration - animated circles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-500 opacity-10 animate-pulse"></div>
        <div className="absolute top-40 -left-32 w-96 h-96 rounded-full bg-purple-500 opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-green-500 opacity-10 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-10 lg:space-y-0 lg:space-x-10">

          {/* Left side - Text content */}
          <motion.div
            className="w-full lg:w-1/2 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1
              className={`
                  text-4xl p-4 md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent 
                  ${isOthersBGColors ? "bg-gradient-to-r from-white to-gray-50" : "bg-gradient-to-r from-blue-600 to-purple-600"}
              `}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {live_language.welcome_text || "Gérez votre établissement sans aucune compétence en informatique !"}
            </motion.h1>

            <motion.p
              className="text-lg mb-8 opacity-90 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {live_language.hero_description || "Une plateforme puissante et intuitive qui simplifie la gestion quotidienne de votre école. Bulletins, compositions, listes d'élèves, et analyses statistiques en quelques clics."}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <motion.button
                variants={item}
                onClick={handleCreateDb}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
              >
                <Database className="mr-2" size={20} />
                {db_is_existing ? update_db_text : create_db_text}
              </motion.button>

              {db_is_existing && (
                <motion.button
                  variants={item}
                  onClick={() => navigate('/started_page')}
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                >
                  <BookOpen className="mr-2" size={20} />
                  {live_language.dashboard_text || "TABLEAU DE BORD"}
                </motion.button>
              )}

              <motion.button
                variants={item}
                onClick={togglePalletteColor}
                className="uppercase px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
              >
                <Palette className="mr-2" size={20} />
                {live_language.theme_text || "THEME"}
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right side - Illustration/Features */}
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <div className="relative">
              {/* Main image/illustration */}
              <motion.div
                className="w-full h-80 lg:h-96 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-xl shadow-2xl overflow-hidden flex items-center justify-center"
                whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <svg className="w-3/4 h-3/4 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <motion.path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                  />
                  <motion.path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.8 }}
                  />
                  <motion.path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.65 }}
                  />
                </svg>
              </motion.div>

              {/* Floating feature cards */}
              <motion.div
                className={`${iconsTextColor} absolute -bottom-5 -left-5 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <div className="flex items-center">
                  <Users className="text-blue-600 mr-2" size={24} />
                  <span className="font-semibold">{live_language.students_management || "Gestion des élèves"}</span>
                </div>
              </motion.div>

              <motion.div
                className={`${iconsTextColor} absolute -top-5 -right-5 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <div className="flex items-center">
                  <BarChart2 className="text-purple-600 mr-2" size={24} />
                  <span className="font-semibold">{live_language.analytics_nav || "Analyses"}</span>
                </div>
              </motion.div>

              <motion.div
                className={`${iconsTextColor} absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                whileHover={{ x: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <div className="flex items-center">
                  <Shield className="text-green-600 mr-2" size={24} />
                  <span className="font-semibold">{live_language.security_text || "Sécurité"}</span>
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