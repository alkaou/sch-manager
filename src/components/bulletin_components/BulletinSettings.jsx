import React from 'react';
import { motion } from 'framer-motion';
import { Sliders } from 'lucide-react';

const BulletinSettings = ({
  // theme,
  textClass,
  cardBgColor,
  borderColor,
  bulletinsPerPage,
  setBulletinsPerPage,
  bulletinLanguage,
  setBulletinLanguage,
  bulletinType,
  setBulletinType,
  t
}) => {
  // Animation variants
  const panelVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      className={`${cardBgColor} border-b ${borderColor} shadow-lg p-6`}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={panelVariants}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-lg font-bold ${textClass} flex items-center gap-2`}>
          <Sliders size={18} />
          {t.settings}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bulletins per page */}
        <div>
          <label className={`block mb-2 font-medium ${textClass}`}>{t.bulletinsPerPage}</label>
          <div className="flex items-center">
            <span className={`${textClass} mr-2`}>1</span>
            <input
              type="range"
              min="1"
              max="2"
              step="1"
              value={bulletinsPerPage}
              onChange={(e) => setBulletinsPerPage(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
            />
            <span className={`${textClass} ml-2`}>2</span>
          </div>
          <div className={`text-center mt-2 ${textClass}`}>
            {bulletinsPerPage === 1 ? 'Portrait (1 bulletin/page)' : 'Paysage (2 bulletins/page)'}
          </div>
        </div>

        {/* Bulletin language */}
        <div>
          <label className={`block mb-2 font-medium ${textClass}`}>{t.bulletinLanguage}</label>
          <select
            value={bulletinLanguage}
            onChange={(e) => setBulletinLanguage(e.target.value)}
            className={`w-full p-2 rounded border ${borderColor} ${cardBgColor} ${textClass}`}
          >
            <option value="Français">Français</option>
            <option value="Anglais">English</option>
            <option value="Bambara">Bambara</option>
          </select>
        </div>

        {/* Bulletin type */}
        <div>
          <label className={`block mb-2 font-medium ${textClass}`}>{t.bulletinType}</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setBulletinType('type1')}
              className={`p-2 rounded border ${borderColor} ${bulletinType === 'type1'
                ? 'bg-blue-600 text-white'
                : `${cardBgColor} ${textClass}`
                }`}
            >
              {t.type1}
            </button>
            <button
              onClick={() => setBulletinType('type2')}
              className={`p-2 rounded border ${borderColor} ${bulletinType === 'type2'
                ? 'bg-blue-600 text-white'
                : `${cardBgColor} ${textClass}`
                }`}
            >
              {t.type2}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BulletinSettings;