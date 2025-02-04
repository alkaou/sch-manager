import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Popup = ({ isOpenPopup, setIsOpenPopup, children }) => {
  return (
    <AnimatePresence>
      {isOpenPopup && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpenPopup(false)}
        >
          <motion.div
            className="relative bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl max-w-xl w-full max-h-[80vh] overflow-auto"
            initial={{ scale: 0.5, opacity: 0, y: -50 }}
            animate={{ scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }}
            exit={{ scale: 0.5, opacity: 0, y: 50, transition: { duration: 0.3 } }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton de fermeture */}
            <button
              className="absolute top-4 right-4 p-2 bg-gray-200 dark:bg-gray-800 rounded-full shadow-md hover:scale-110 transition-all duration-300"
              onClick={() => setIsOpenPopup(false)}
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>

            {/* Contenu dynamique */}
            <div className="overflow-hidden">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Popup;
