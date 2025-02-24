import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { evaluate } from "mathjs"; // Bibliothèque pour les calculs avancés

import { useTheme, useLanguage } from './contexts.js';

const AdvancedCalculator = ({ onClose }) => {
  const [expression, setExpression] = useState("");

  const { app_bg_color, text_color, theme } = useTheme();
  const { live_language } = useLanguage();

  const handleButtonClick = (value) => {
    if (value === "=") {
      try {
        setExpression(evaluate(expression).toString());
      } catch {
        setExpression(live_language.error_calculate_text);
      }
    } else if (value === "AC") {
      // Efface toute l'expression
      setExpression("");
    } else if (value === "DEL") {
      // Supprime le dernier caractère
      setExpression(expression.slice(0, -1));
    } else if (value === "π") {
      // Ajoute "pi" (mathjs reconnaît "pi")
      setExpression(expression + "pi");
    } else if (value === "x²") {
      // Transforme le dernier nombre en son carré en ajoutant l'opérateur d'exposant
      setExpression(expression + "^2");
    } else if (value === "exp") {
      // Prépare la fonction exponentielle (exp(x))
      setExpression(expression + "exp(");
    } else if (value === "abs") {
      // Prépare la fonction valeur absolue (abs(x))
      setExpression(expression + "abs(");
    } else if (value === "%") {
      // Pourcentage : multiplie par 0.01 (peut être ajusté en fonction de vos besoins)
      setExpression(expression + "*0.01");
    } else {
      setExpression(expression + value);
    }
  };

  // Organisation des boutons sur 5 lignes et 6 colonnes (30 boutons)
  const buttons = [
    "AC", "DEL", "(", ")", "√", "π",
    "7", "8", "9", "/", "sin", "cos",
    "4", "5", "6", "*", "tan", "log",
    "1", "2", "3", "-", "x²", "exp",
    "0", ".", "=", "+", "abs", "%"
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`
          bg-white p-6 rounded-lg shadow-xl w-80 animate-slideIn
          ${theme === "light" ? "text-gray-600" : app_bg_color} text-black
      `}>

        <div className="flex justify-between items-center mb-4">
          <h2 className={`${theme === "light" ? "" : text_color} text-lg font-semibold`}>{live_language.calculator_text}</h2>
          <button onClick={onClose} className="text-red-500">
            <FaTimes size={24} />
          </button>
        </div>

        <input
          type="text"
          value={expression}
          readOnly
          className="w-full p-2 mb-4 border rounded text-right text-lg"
        />

        <div className="grid grid-cols-6 gap-2">
          {buttons.map((btn) => (
            <button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              className="p-3 bg-gray-200 rounded hover:bg-gray-300 transition"
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedCalculator;
