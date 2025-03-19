import React from 'react';
import { motion } from 'framer-motion';
import { X, FileText, Settings, Globe, SlidersHorizontal } from 'lucide-react';
import { translations } from '../../utils/bulletin_translation';

const BulletinSettings = ({
  // theme,
  cardBgColor,
  textClass,
  buttonPrimary,
  buttonSecondary,
  bulletinsPerPage,
  setBulletinsPerPage,
  selectedBulletinType,
  setSelectedBulletinType,
  bulletinLanguage,
  setBulletinLanguage,
  language,
  closeSettings
}) => {
  // Animation variants
  const panelVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      className="absolute z-20 top-20 right-6 w-full max-w-md"
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className={`${cardBgColor} ${textClass} rounded-lg shadow-xl p-5 border border-gray-200 dark:border-gray-700`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center">
            <Settings size={20} className="mr-2" />
            {translations[language].settings}
          </h3>
          <button
            onClick={closeSettings}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Bulletins per page setting */}
          <div>
            <label className="block mb-2 font-medium flex items-center">
              <SlidersHorizontal size={18} className="mr-2" />
              {translations[language].bulletinsPerPage}
            </label>
            <div className="flex items-center">
              <input
                type="range"
                min="1"
                max="2"
                step="1"
                value={bulletinsPerPage}
                onChange={(e) => setBulletinsPerPage(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <span className="ml-3 font-bold text-lg">{bulletinsPerPage}</span>
            </div>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {bulletinsPerPage === 1
                ? "1 bulletin par page (Portrait)"
                : "2 bulletins par page (Paysage)"}
            </div>
          </div>

          {/* Bulletin type setting */}
          <div>
            <label className="block mb-2 font-medium flex items-center">
              <FileText size={18} className="mr-2" />
              {translations[language].bulletinType}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedBulletinType('type1')}
                className={`p-3 rounded-lg border-2 transition-all ${selectedBulletinType === 'type1'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-gray-300 dark:border-gray-700'
                  }`}
              >
                <div className="text-center">
                  <div className="font-medium">{translations[language].type1}</div>
                  <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">DEF</div>
                </div>
              </button>

              <button
                onClick={() => setSelectedBulletinType('type2')}
                className={`p-3 rounded-lg border-2 transition-all ${selectedBulletinType === 'type2'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-gray-300 dark:border-gray-700'
                  }`}
              >
                <div className="text-center">
                  <div className="font-medium">{translations[language].type2}</div>
                  <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">Standard</div>
                </div>
              </button>
            </div>
          </div>

          {/* Bulletin language setting */}
          <div>
            <label className="block mb-2 font-medium flex items-center">
              <Globe size={18} className="mr-2" />
              {translations[language].bulletinLanguage}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Français', 'Anglais', 'Bambara'].map(lang => (
                <button
                  key={lang}
                  onClick={() => setBulletinLanguage(lang)}
                  className={`py-2 px-3 rounded-lg transition-all ${bulletinLanguage === lang
                      ? `${buttonPrimary} text-white`
                      : `${buttonSecondary} text-gray-700 dark:text-gray-200`
                    }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BulletinSettings;