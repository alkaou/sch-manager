import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDownIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import translations from "./enrollements_traduction";
import { useLanguage } from "../contexts";
import { getClasseName } from "../../utils/helpers";

/**
 * Composant pour afficher la répartition détaillée par classe
 * @param {Object} props - Props du composant
 * @param {Array} props.classData - Données des classes
 * @param {string} props.selectedYear - Année scolaire sélectionnée
 * @param {boolean} props.isDarkMode - Mode sombre activé
 */
const ClassBreakdown = ({ classData = [], selectedYear, theme }) => {
  const [expandedClasses, setExpandedClasses] = useState(new Set());
  const [sortBy, setSortBy] = useState("total"); // 'total', 'name', 'male', 'female'
  const [sortOrder, setSortOrder] = useState("desc");
  const { language } = useLanguage();
  const isDarkMode = theme === "dark";

  // Fonction helper pour les traductions
  const t = (key) => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]["Français"];
  };

  // Trier les données de classe
  const sortedClassData = useMemo(() => {
    if (!classData || classData.length === 0) return [];

    return [...classData].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.className || "";
          bValue = b.className || "";
          break;
        case "male":
          aValue = a.male || 0;
          bValue = b.male || 0;
          break;
        case "female":
          aValue = a.female || 0;
          bValue = b.female || 0;
          break;
        default:
          aValue = a.total || 0;
          bValue = b.total || 0;
      }

      if (typeof aValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });
  }, [classData, sortBy, sortOrder]);

  // Basculer l'expansion d'une classe
  const toggleClassExpansion = (classId) => {
    const newExpanded = new Set(expandedClasses);
    if (newExpanded.has(classId)) {
      newExpanded.delete(classId);
    } else {
      newExpanded.add(classId);
    }
    setExpandedClasses(newExpanded);
  };

  // Changer le tri
  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
  };

  // Calculer le pourcentage de genre
  const getGenderPercentage = (count, total) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  // Obtenir la couleur de la barre de progression
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (!classData || classData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-8 text-center rounded-xl border-2 border-dashed ${
          isDarkMode
            ? "border-gray-600 bg-gray-800/50 text-gray-300"
            : "border-gray-300 bg-gray-50 text-gray-500"
        }`}
      >
        <ChartBarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">{t("no_data_available")}</p>
        <p className="text-sm">
          {t("will_appear_here")} {selectedYear}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* En-tête avec options de tri */}
      <div
        className={`flex flex-wrap items-center justify-between p-4 rounded-lg ${
          isDarkMode ? "bg-gray-800" : "bg-gray-50"
        }`}
      >
        <h3
          className={`text-lg font-semibold flex items-center gap-2 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          <AcademicCapIcon className="w-5 h-5" />
          {t("class_breakdown")} ({sortedClassData.length} {t("classes_count")})
        </h3>

        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {t("sort_by")}:
          </span>
          {[
            { key: "total", label: t("total") },
            { key: "name", label: t("name") },
            { key: "male", label: t("male") },
            { key: "female", label: t("female") },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleSort(key)}
              title={`${t("sort_by")} ${label}`}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                sortBy === key
                  ? isDarkMode
                    ? "bg-blue-600 text-white"
                    : "bg-blue-500 text-white"
                  : isDarkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {label}
              {sortBy === key && (
                <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des classes */}
      <div className="space-y-3">
        <AnimatePresence>
          {sortedClassData.map((classItem, index) => {
            const isExpanded = expandedClasses.has(classItem.classId);
            const total = classItem.total || 0;
            const male = classItem.male || 0;
            const female = classItem.female || 0;
            const malePercentage = getGenderPercentage(male, total);
            const femalePercentage = getGenderPercentage(female, total);

            return (
              <motion.div
                key={classItem.classId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-xl border transition-all duration-200 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                    : "bg-white border-gray-200 hover:border-gray-300"
                } hover:shadow-lg`}
              >
                {/* En-tête de classe */}
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => toggleClassExpansion(classItem.classId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isDarkMode ? "bg-blue-600" : "bg-blue-500"
                        }`}
                      >
                        <UserGroupIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4
                          className={`font-semibold text-lg ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {getClasseName(
                            `${classItem.level} ${
                              classItem.className ? classItem.className : ""
                            }`,
                            language
                          )}
                        </h4>
                        {classItem.level && (
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {t("level")}: {classItem.level}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div
                          className={`text-2xl font-bold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {total}
                        </div>
                        <div
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {t("students")}
                        </div>
                      </div>

                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDownIcon
                          className={`w-5 h-5 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Barres de progression pour les genres */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span
                        className={
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }
                      >
                        {t("boys_count")}: {male} ({malePercentage}%)
                      </span>
                      <span
                        className={
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }
                      >
                        {t("girls_count")}: {female} ({femalePercentage}%)
                      </span>
                    </div>

                    <div
                      className={`h-2 rounded-full overflow-hidden ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    >
                      <div className="h-full flex">
                        <div
                          className="bg-blue-500 transition-all duration-500"
                          style={{ width: `${malePercentage}%` }}
                        />
                        <div
                          className="bg-pink-500 transition-all duration-500"
                          style={{ width: `${femalePercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Détails étendus */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`border-t overflow-hidden ${
                        isDarkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <div className="p-4">
                        <h5
                          className={`font-medium mb-3 ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {t("student_list")} ({classItem.students?.length || 0}
                          )
                        </h5>

                        {classItem.students && classItem.students.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {classItem.students.map((student, studentIndex) => (
                              <motion.div
                                key={student.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: studentIndex * 0.05 }}
                                className={`p-2 rounded-lg flex items-center gap-2 ${
                                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                                }`}
                              >
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    student.sexe === "M"
                                      ? "bg-blue-500"
                                      : "bg-pink-500"
                                  }`}
                                />
                                <span
                                  className={`text-sm ${
                                    isDarkMode
                                      ? "text-gray-300"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {student.name}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <p
                            className={`text-sm italic ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {t("no_students")}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ClassBreakdown;
