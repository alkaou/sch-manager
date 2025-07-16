import React, { useState } from "react";
import { FaCalculator, FaCalendarAlt, FaPlus } from "react-icons/fa";
import { Brain } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import AdvancedCalculator from "./AdvancedCalculator.jsx";
import AdvancedCalendar from "./AdvancedCalendar.jsx";
import IA from "../ia/ia.jsx";
import { useLanguage } from "../contexts";

const FloatingMenu = () => {
  const { live_language, language } = useLanguage();

  const [menuOpen, setMenuOpen] = useState(false);
  const [playedAnimation, setPlayedAnimation] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showIA, setShowIA] = useState(false);

  const toggleMenu = () => {
    if (menuOpen === true) {
      setPlayedAnimation(false);
      setTimeout(() => {
        setMenuOpen(false);
      }, 500);
    } else {
      setPlayedAnimation(true);
      setMenuOpen(true);
    }
  };
  const toggleCalculator = () => {
    setShowCalculator(!showCalculator);
    setMenuOpen(false);
  };
  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
    setMenuOpen(false);
  };

  const toggleIA = () => {
    setShowIA(!showIA);
    setMenuOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Boutons flottants */}
      <div className="flex flex-col items-end space-y-4">
        {menuOpen && (
          <>
            <button
              onClick={toggleCalculator}
              className={`flex ${
                playedAnimation ? "animate-fadeIn" : "custom-animation"
              } items-center p-3 bg-blue-600 text-white rounded-full shadow-lg transition-transform duration-300 transform hover:scale-110 focus:outline-none`}
            >
              <FaCalculator title={live_language.calculator_text} size={20} />
            </button>
            <button
              onClick={toggleCalendar}
              className={`flex ${
                playedAnimation ? "animate-fadeIn" : "custom-animation"
              } items-center p-3 bg-green-600 text-white rounded-full shadow-lg transition-transform duration-300 transform hover:scale-110 focus:outline-none`}
            >
              <FaCalendarAlt title={live_language.calendar_text} size={20} />
            </button>
            <button
              onClick={toggleIA}
              className={`${
                playedAnimation ? "animate-fadeIn" : "custom-animation"
              } items-center p-3 bg-gradient-to-r from-blue-400 via-cyan-500 to-purple-600 text-white rounded-full shadow-lg transition-transform duration-300 transform hover:scale-110 focus:outline-none`}
              title={
                language === "Français"
                  ? "Fatoumata Assistante IA"
                  : language === "Anglais"
                  ? "Fatoumata AI Assistant"
                  : "Fatumata aw Dɛmɛbaga Kekunman"
              }
            >
              <Brain size={20} />
              <div style={{ size: "12px" }}>
                <strong>IA</strong>
              </div>
            </button>
          </>
        )}
        <button
          onClick={toggleMenu}
          className="floating-button flex items-center justify-center p-4 bg-blue-500 text-white rounded-full shadow-xl transition-transform duration-300 transform hover:scale-110 focus:outline-none"
        >
          <FaPlus
            size={24}
            className={`transition-transform duration-300 ${
              menuOpen ? "rotate-45" : "rotate-0"
            }`}
          />
        </button>
      </div>

      <AnimatePresence>
        {/* Modale pour AdvancedCalculator */}
        {showCalculator && (
          <AdvancedCalculator onClose={() => setShowCalculator(false)} />
        )}

        {/* Modale pour AdvancedCalendar */}
        {showCalendar && (
          <AdvancedCalendar onClose={() => setShowCalendar(false)} />
        )}

        {/* Modale pour IA */}
        {showIA && <IA isOpen={showIA} onClose={() => setShowIA(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default FloatingMenu;
