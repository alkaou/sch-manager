import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, BarChart2 } from "lucide-react";
import { useLanguage } from "../contexts";
import { translate } from "./statistique_translator";
import PageLoading from "../partials/PageLoading.jsx";
import EnrollmentStats from "../enrollements/EnrollmentStats.jsx";
import StatisticsExpenses from "./StatisticsExpenses.jsx";
import { updateCurrentSnapshot } from "../../utils/snapshotManager";

const StatisticsMainContent = ({
  activeStat,
  theme,
  database,
  loadingData,
  refreshData,
  app_bg_color,
  text_color,
}) => {
  const { language } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const getBackgroundColor = () => {
    return theme === "dark" ? "bg-gray-800" : "bg-white";
  };

  const getTextColor = () => {
    return theme === "dark" ? "text-gray-300" : "text-gray-600";
  };

  useEffect(() => {
    const initializeSnapshot = async () => {
      if (database && !loadingData) {
        try {
          await updateCurrentSnapshot(database);
        } catch (error) {
          console.error(
            "Erreur lors de la génération du snapshot initial:",
            error
          );
        }
      }
    };

    initializeSnapshot();
  }, [database, loadingData]);

  return (
    <motion.div
      key={activeStat} // Permet de ré-animer le composant à chaque changement de stat
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`h-full w-full rounded-lg shadow-lg flex flex-col ${app_bg_color} ${text_color} overflow-y-auto scrollbar-custom`}
      style={{
        border: theme === "dark" ? "1px solid #4A5568" : "1px solid #E2E8F0",
      }}
    >
      {!database || loadingData ? (
        <div className="flex-grow flex justify-center items-center">
          <PageLoading />
        </div>
      ) : (
        <>
          {activeStat === "students_stats" ? (
            <div className="h-full w-full">
              <EnrollmentStats database={database} refreshData={refreshData} />
            </div>
          ) : activeStat === "expense_stats" ? (
            <div className="h-full w-full">
              <StatisticsExpenses database={database} theme={theme} />
            </div>
          ) : (
            <>
              {activeStat === "" ? (
                <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
                  <BarChart2 size={64} className="text-yellow-500 mb-6" />
                  <h2 className="text-2xl font-semibold">
                    {translate("welcome", language)}
                  </h2>
                  <p className="text-lg mt-4">
                    {translate("welcome_to_statistique_description", language)}
                  </p>
                </div>
              ) : (
                <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
                  <AlertTriangle size={64} className="text-yellow-500 mb-6" />
                  <h2 className="text-2xl font-semibold">
                    {translate(activeStat, language)}
                  </h2>
                  <p className="text-lg mt-4">
                    {translate("no_stats_available", language)}
                  </p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </motion.div>
  );
};

export default StatisticsMainContent;
