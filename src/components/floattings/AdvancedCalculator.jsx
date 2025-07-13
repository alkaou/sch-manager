import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { evaluate } from "mathjs";
import { useTheme, useLanguage } from "../contexts";

const AdvancedCalculator = ({ onClose }) => {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const { theme } = useTheme();
  const { language } = useLanguage();

  const handleButtonClick = (value) => {
    if (value === "=") {
      try {
        const evaluatedResult = evaluate(expression);
        setResult(evaluatedResult.toString());
      } catch {
        const error = language === "Français" ? "Erreur" : language === "Anglais" ? "Error" : "Fili";
        setResult(error);
      }
    } else if (value === "AC") {
      setExpression("");
      setResult("");
    } else if (value === "DEL") {
      setExpression(expression.slice(0, -1));
    } else {
      setExpression(expression + value);
    }
  };

  const buttons = [
    "AC", "DEL", "(", ")",
    "7", "8", "9", "/",
    "4", "5", "6", "*",
    "1", "2", "3", "-",
    "0", ".", "=", "+",
  ];

  const scientificButtons = [
    "sin", "cos", "tan",
    "log", "sqrt", "^",
    "pi", "e" 
  ];

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  const buttonVariants = {
    hover: { scale: 1.1, transition: { type: "spring", stiffness: 400, damping: 10 } },
    tap: { scale: 0.9 },
  };

  const bgColor = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const textColor = theme === "dark" ? "text-white" : "text-gray-800";
  const inputBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const buttonBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-200";
  const operatorButtonBgColor = theme === "dark" ? "bg-yellow-500" : "bg-yellow-400";

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`p-4 rounded-lg shadow-2xl w-auto max-w-md ${bgColor} ${textColor}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Calculatrice Scientifique</h2>
          <motion.button onClick={onClose} variants={buttonVariants} whileHover="hover" whileTap="tap" className="text-red-500">
            <FaTimes size={24} />
          </motion.button>
        </div>

        <div className={`p-4 rounded-md mb-4 ${inputBgColor}`}>
          <div className="text-right text-2xl break-all">{expression || "0"}</div>
          <div className="text-right text-4xl font-bold break-all">{result}</div>
        </div>

        <div className="flex gap-4">
          <div className="grid grid-cols-4 gap-2">
            {buttons.map((btn) => (
              <motion.button
                key={btn}
                onClick={() => handleButtonClick(btn)}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className={`p-4 text-xl rounded-lg ${ /[-+*/=]/.test(btn) ? operatorButtonBgColor : buttonBgColor }`}>
                {btn}
              </motion.button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {scientificButtons.map((btn) => (
              <motion.button
                key={btn}
                onClick={() => handleButtonClick(btn)}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className={`p-4 text-xl rounded-lg ${buttonBgColor}`}>
                {btn}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdvancedCalculator;
