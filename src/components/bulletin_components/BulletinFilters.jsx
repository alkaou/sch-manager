import React from "react";
import { motion } from "framer-motion";
import { Filter, CheckSquare, SortAsc, SortDesc } from "lucide-react";

const BulletinFilters = ({
  textClass,
  cardBgColor,
  borderColor,
  sortOption,
  setSortOption,
  selectedStudents,
  filteredStudents,
  selectAllStudents,
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
          className={`text-base font-bold ${textClass} flex items-center gap-2`}
        >
          <Filter size={16} />
          {t.filters}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sort options */}
        <div>
          <label className={`block mb-1.5 font-medium text-sm ${textClass}`}>
            {t.sortBy}
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setSortOption("rank")}
              className={`py-1.5 px-2 rounded border ${borderColor} ${
                sortOption === "rank"
                  ? "bg-blue-600 text-white"
                  : `${cardBgColor} ${textClass}`
              } flex items-center justify-center gap-1 text-sm`}
            >
              <SortDesc size={14} />
              {t.rank}
            </button>
            <button
              onClick={() => setSortOption("name")}
              className={`py-1.5 px-2 rounded border ${borderColor} ${
                sortOption === "name"
                  ? "bg-blue-600 text-white"
                  : `${cardBgColor} ${textClass}`
              } flex items-center justify-center gap-1 text-sm`}
            >
              <SortAsc size={14} />
              {t.name}
            </button>
            <button
              onClick={() => setSortOption("average")}
              className={`py-1.5 px-2 rounded border ${borderColor} ${
                sortOption === "average"
                  ? "bg-blue-600 text-white"
                  : `${cardBgColor} ${textClass}`
              } flex items-center justify-center gap-1 text-sm`}
            >
              <SortDesc size={14} />
              {t.average}
            </button>
          </div>
        </div>

        {/* Selection */}
        <div>
          <label className={`block mb-1.5 font-medium text-sm ${textClass}`}>
            {t.selectAll}
          </label>
          <button
            onClick={selectAllStudents}
            className={`w-full py-1.5 px-2 rounded border ${borderColor} ${
              selectedStudents.length === filteredStudents.length &&
              filteredStudents.length > 0
                ? "bg-blue-600 text-white"
                : `${cardBgColor} ${textClass}`
            } flex items-center justify-center gap-2 text-sm`}
          >
            <CheckSquare size={16} />
            {selectedStudents.length === filteredStudents.length &&
            filteredStudents.length > 0
              ? t.unSelectAll
              : t.selectAll}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BulletinFilters;
