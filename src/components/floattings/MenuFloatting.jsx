import React, { useState } from "react";
import { FaCalculator, FaCalendarAlt, FaRegLightbulb, FaPlus } from "react-icons/fa";
import AdvancedCalculator from "./AdvancedCalculator.jsx";
import AdvancedCalendar from "./AdvancedCalendar.jsx";
import { useLanguage } from "../contexts";

const FloatingMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [playedAnimation, setPlayedAnimation] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const { live_language } = useLanguage();

  const toggleMenu = () => {
    if (menuOpen === true) {
      setPlayedAnimation(false);
      setTimeout(() => {
        setMenuOpen(false);
      }, 500)
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

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Boutons flottants */}
      <div className="flex flex-col items-end space-y-4">
        {menuOpen && (
          <>
            <button
              onClick={toggleCalculator}
              className={`flex ${playedAnimation ? "animate-fadeIn" : "custom-animation"} items-center p-3 bg-blue-600 text-white rounded-full shadow-lg transition-transform duration-300 transform hover:scale-110 focus:outline-none`}
            >
              <FaCalculator title={live_language.calculator_text} size={20} />
            </button>
            <button
              onClick={toggleCalendar}
              className={`flex ${playedAnimation ? "animate-fadeIn" : "custom-animation"} items-center p-3 bg-green-600 text-white rounded-full shadow-lg transition-transform duration-300 transform hover:scale-110 focus:outline-none`}
            >
              <FaCalendarAlt title={live_language.calendar_text} size={20} />
            </button>
            <button
              onClick={() => console.log("Option Idée sélectionnée")}
              className={`flex ${playedAnimation ? "animate-fadeIn" : "custom-animation"} items-center p-3 bg-yellow-500 text-white rounded-full shadow-lg transition-transform duration-300 transform hover:scale-110 focus:outline-none`}
            // title="Idée"
            >
              <FaRegLightbulb size={20} />
            </button>
          </>
        )}
        <button
          onClick={toggleMenu}
          className="floating-button flex items-center justify-center p-4 bg-blue-500 text-white rounded-full shadow-xl transition-transform duration-300 transform hover:scale-110 focus:outline-none"
        >
          <FaPlus size={24} className={`transition-transform duration-300 ${menuOpen ? "rotate-45" : "rotate-0"}`} />
        </button>
      </div>

      {/* Modale pour AdvancedCalculator */}
      {showCalculator && (
        <AdvancedCalculator onClose={() => setShowCalculator(false)} />
      )}

      {/* Modale pour AdvancedCalendar */}
      {showCalendar && (
        <AdvancedCalendar onClose={() => setShowCalendar(false)} />
      )}
    </div>
  );
};

export default FloatingMenu;
