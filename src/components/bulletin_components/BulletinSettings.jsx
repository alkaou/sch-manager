import React from "react";
import { motion } from "framer-motion";
import { Sliders } from "lucide-react";
import { useLanguage } from "../contexts";

const BulletinSettings = ({
  theme,
  textClass,
  cardBgColor,
  borderColor,
  bulletinsPerPage,
  setBulletinsPerPage,
  bulletinLanguage,
  setBulletinLanguage,
  bulletinType,
  setBulletinType,
  t,
}) => {
  // Animation variants
  const panelVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 },
    },
  };

  const { language } = useLanguage();

  return (
    <motion.div
      className={`${cardBgColor} border-b ${borderColor} shadow-lg p-4`}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={panelVariants}
    >
      <div className="flex justify-between items-center mb-3">
        <h3
          className={`text-base font-semibold ${textClass} flex items-center gap-2`}
        >
          <Sliders size={16} />
          {t.settings}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bulletins per page */}
        <div>
          <label className={`block mb-1.5 font-medium text-sm ${textClass}`}>
            {t.bulletinsPerPage}
          </label>
          <div className="flex items-center">
            <span className={`${textClass} mr-2 text-sm`}>1</span>
            <input
              type="range"
              min="1"
              max="2"
              step="1"
              value={bulletinsPerPage}
              onChange={(e) => setBulletinsPerPage(parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer"
            />
            <span className={`${textClass} ml-2 text-sm`}>2</span>
          </div>
          <div className={`text-center mt-1.5 text-sm ${textClass}`}>
            {bulletinsPerPage === 1
              ? language === "Bambara"
                ? "Jɔlen (Sɛbɛn 1/paji)"
                : "Portrait (1 bulletin/page)"
              : language === "Bambara"
              ? "Dalen (Sɛbɛn 2/paji)"
              : language === "Français"
              ? "Paysage (2 bulletins/page)"
              : "Landscape (2 bulletins/page)"}
          </div>
        </div>

        {/* Bulletin language */}
        <div>
          <label className={`block mb-1.5 font-medium text-sm ${textClass}`}>
            {t.bulletinLanguage}
          </label>
          <select
            value={bulletinLanguage}
            onChange={(e) => setBulletinLanguage(e.target.value)}
            className={`
              w-full py-1.5 px-2 rounded border ${borderColor} text-sm
              ${
                theme === "dark"
                  ? `${cardBgColor} ${textClass}`
                  : "bg-gray-200 text-gray-700"
              } 
            `}
          >
            <option value="Français">Français</option>
            <option value="Bambara">Bamanakan</option>
            <option value="Anglais">English</option>
          </select>
        </div>

        {/* Bulletin type */}
        <div>
          <label className={`block mb-1.5 font-medium text-sm ${textClass}`}>
            {t.bulletinType}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setBulletinType("type1")}
              className={`py-1.5 px-2 rounded border text-sm ${borderColor} ${
                bulletinType === "type1"
                  ? "bg-blue-600 text-white"
                  : `${cardBgColor} ${textClass}`
              }`}
            >
              {t.type1}
            </button>
            <button
              onClick={() => setBulletinType("type2")}
              className={`py-1.5 px-2 rounded border text-sm ${borderColor} ${
                bulletinType === "type2"
                  ? "bg-blue-600 text-white"
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
