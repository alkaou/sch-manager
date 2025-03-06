import React, { useState } from "react";
import { FaCalculator, FaCalendarAlt, FaRegLightbulb, FaPlus } from "react-icons/fa";
import AdvancedCalculator from "./AdvancedCalculator.jsx";
import AdvancedCalendar from "./AdvancedCalendar.jsx";
import { useLanguage } from "./contexts.js";

const FloatingMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const { live_language } = useLanguage();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleCalculator = () => {
    setShowCalculator(!showCalculator);
    setMenuOpen(false);
  };
  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
    setMenuOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Boutons flottants */}
      <div className="flex flex-col items-end space-y-4">
        {menuOpen && (
          <>
            <button
              onClick={toggleCalculator}
              className="flex items-center p-3 bg-blue-600 text-white rounded-full shadow-lg transition-transform duration-300 transform hover:scale-110 focus:outline-none"
            >
              <FaCalculator title={live_language.calculator_text} size={20} />
            </button>
            <button
              onClick={toggleCalendar}
              className="flex items-center p-3 bg-green-600 text-white rounded-full shadow-lg transition-transform duration-300 transform hover:scale-110 focus:outline-none"
            >
              <FaCalendarAlt title={live_language.calendar_text} size={20} />
            </button>
            <button
              onClick={() => console.log("Option Idée sélectionnée")}
              className="flex items-center p-3 bg-yellow-500 text-white rounded-full shadow-lg transition-transform duration-300 transform hover:scale-110 focus:outline-none"
              // title="Idée"
            >
              <FaRegLightbulb size={20} />
            </button>
          </>
        )}
        <button
          onClick={toggleMenu}
          className="floating-button flex items-center justify-center p-4 bg-red-600 text-white rounded-full shadow-2xl transition-transform duration-300 transform hover:rotate-90 focus:outline-none"
        >
          <FaPlus size={24} className={`transition-transform duration-300 ${menuOpen ? "rotate-45" : "rotate-0"}`} />
        </button>
      </div>

      {/* Modale pour AdvancedCalculator */}
      {showCalculator && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-60">
          <div className="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-lg transform transition-all duration-300 ease-out scale-100">
            <div className="flex justify-end">
              <button onClick={toggleCalculator} className="text-gray-500 hover:text-gray-800 focus:outline-none">
                Fermer
              </button>
            </div>
            <AdvancedCalculator onClose={() => setShowCalculator(false)} />
          </div>
        </div>
      )}

      {/* Modale pour AdvancedCalendar */}
      {showCalendar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-60">
          <div className="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-lg transform transition-all duration-300 ease-out scale-100">
            <div className="flex justify-end">
              <button onClick={toggleCalendar} className="text-gray-500 hover:text-gray-800 focus:outline-none">
                Fermer
              </button>
            </div>
            <AdvancedCalendar onClose={() => setShowCalendar(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingMenu;
