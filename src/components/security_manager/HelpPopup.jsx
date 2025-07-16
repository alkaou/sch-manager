import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X } from 'lucide-react';
import { useLanguage, useTheme } from '../contexts';
import { translate } from './security_translator.js';

const HelpPopup = ({ onClose }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { y: "-50vh", opacity: 0 },
    visible: { y: "0", opacity: 1, transition: { type: "spring", stiffness: 100 } },
    exit: { y: "50vh", opacity: 0 },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[1000000]"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <motion.div
          className={`relative w-11/12 max-w-2xl p-6 sm:p-8 rounded-2xl shadow-2xl ${isDark ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        >
          <motion.button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={24} />
          </motion.button>

          <div className="flex items-center mb-6">
            <HelpCircle size={32} className="text-blue-500 mr-4" />
            <h2 className="text-2xl sm:text-3xl font-bold">
              {translate('helpTitle', language)}
            </h2>
          </div>

          <div className="space-y-4 text-sm sm:text-base">
            <p>{translate('helpIntro', language)}</p>
            <ul className="list-disc list-inside space-y-3 pl-2">
              <li>{translate('helpConfirm', language)}</li>
              <li>{translate('helpSettings', language)}</li>
            </ul>
            <div className={`mt-6 p-4 rounded-lg border ${isDark ? 'bg-yellow-900/20 border-yellow-500/30' : 'bg-yellow-50 border-yellow-300'}`}>
              <p className={`font-semibold ${isDark ? 'text-yellow-300' : 'text-yellow-800'}`}>
                {translate('helpWarning', language)}
              </p>
            </div>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HelpPopup;
