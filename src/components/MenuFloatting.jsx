import React, { useState } from "react";
import { FaCalculator, FaCalendarAlt, FaRegLightbulb } from "react-icons/fa";
import AdvancedCalculator from "./AdvancedCalculator.jsx";
import AdvancedCalendar from "./AdvancedCalendar.jsx";
import { useLanguage } from "./contexts.js";

const FloatingMenu = () => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const { live_language } = useLanguage();

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Boutons flottants */}
      <div className="relative group">
        <div className="flex flex-col items-end space-y-3 transition-all duration-500">
          {/* Bouton Calculatrice */}
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="p-3 rounded-full bg-yellow-400 text-white shadow-lg transform scale-0 group-hover:scale-100 transition-all duration-500"
          >
            <FaCalculator title={live_language.calculator_text} size={20} />
          </button>

          {/* Bouton Calendrier */}
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="p-3 rounded-full bg-blue-400 text-white shadow-lg transform scale-0 group-hover:scale-100 transition-all duration-500"
          >
            <FaCalendarAlt title={live_language.calendar_text} size={20} />
          </button>

          {/* Bouton principal */}
          <button className="p-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-xl">
            <FaRegLightbulb size={24} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>
      </div>

      {/* Affichage des composants */}
      {showCalculator && <AdvancedCalculator onClose={() => setShowCalculator(false)} />}
      {showCalendar && <AdvancedCalendar onClose={() => setShowCalendar(false)} />}
    </div>
  );
};

export default FloatingMenu;
