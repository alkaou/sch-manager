import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../contexts";

export default function IA({ onClose }) {
  const { theme } = useTheme();

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`p-6 rounded-lg shadow-xl w-80 ${
          theme === "dark"
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-700"
        }`}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Fatoumata IA</h2>
          <button onClick={onClose} className="text-red-500 hover:text-red-700">
            Fermer
          </button>
        </div>
        <p>Bonjour ! Comment puis-je vous aider aujourd'hui ?</p>
      </motion.div>
    </motion.div>
  );
}
