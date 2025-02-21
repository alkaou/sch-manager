import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { evaluate } from "mathjs"; // Bibliothèque pour les calculs avancés

const AdvancedCalculator = ({ onClose }) => {
  const [expression, setExpression] = useState("");

  const handleButtonClick = (value) => {
    if (value === "=") {
      try {
        setExpression(evaluate(expression).toString());
      } catch {
        setExpression("Erreur");
      }
    } else if (value === "C") {
      setExpression("");
    } else {
      setExpression(expression + value);
    }
  };

  const buttons = [
    "7", "8", "9", "/", "sin", "cos",
    "4", "5", "6", "*", "tan", "log",
    "1", "2", "3", "-", "(", ")",
    "0", ".", "=", "+", "C", "√"
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-80 animate-slideIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Calculatrice</h2>
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
