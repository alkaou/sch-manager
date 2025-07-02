import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  RotateCw,
} from "lucide-react";
import { useLanguage, useTheme, useFlashNotification } from "../contexts";
import { getCurrentSchoolYear } from "../../utils/schoolYear";
import {
  getSnapshotsByYear,
  calculateEnrollmentStats,
  updateCurrentSnapshot,
} from "../../utils/snapshotManager";
import StatsCard from "./StatsCard.jsx";
import EnrollmentChart from "./EnrollmentChart.jsx";
import ClassBreakdown from "./ClassBreakdown.jsx";
import YearSelector from "./YearSelector.jsx";
import translations from "./enrollements_traduction";

const EnrollmentStats = ({ database, refreshData }) => {
  const { language } = useLanguage();
  const { theme, app_bg_color, text_color } = useTheme();
  const { setFlashMessage } = useFlashNotification();

  // Traduction helper
  const t = (key) => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]["Français"];
  };

  // États locaux
  const [selectedYear, setSelectedYear] = useState(getCurrentSchoolYear());
  const [chartType, setChartType] = useState("line");
  const [isLoading, setIsLoading] = useState(false);
  const [isForceUpdating, setIsForceUpdating] = useState(false);

  // Calcul des statistiques
  const stats = useMemo(() => {
    if (!database?.snapshots) return null;
    return calculateEnrollmentStats(database.snapshots, selectedYear);
  }, [database?.snapshots, selectedYear]);

  // Données pour les graphiques
  const chartData = useMemo(() => {
    if (!database?.snapshots) return [];

    const snapshots = getSnapshotsByYear(database.snapshots, selectedYear);
    return snapshots.map((snapshot) => ({
      schoolYear: snapshot.schoolYear,
      total: snapshot.summary.totalStudents,
      male: snapshot.summary.totalMale,
      female: snapshot.summary.totalFemale,
      date: new Date(snapshot.timestamp).toLocaleDateString(),
    }));
  }, [database?.snapshots, selectedYear]);

  // Classes data pour la répartition par classe
  const classData = useMemo(() => {
    if (!stats) return [];
    return stats.classBreakdown || [];
  }, [stats]);

  // Années disponibles
  const availableYears = useMemo(() => {
    if (!database?.snapshots) return [getCurrentSchoolYear()];

    const years = [...new Set(database.snapshots.map((s) => s.schoolYear))];
    return years.sort().reverse();
  }, [database?.snapshots]);

  // Gestion du rafraîchissement
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await refreshData();
      setFlashMessage({
        message: t("refresh_data_enrollment"),
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      // console.error("Erreur lors du rafraîchissement:", error);
      setFlashMessage({
        message: t("error_refresh_data_enrollment"),
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Force la mise à jour du snapshot courant
  const handleForceUpdateSnapshot = async () => {
    setIsForceUpdating(true);
    try {
      if (database) {
        const success = await updateCurrentSnapshot(database);
        if (success) {
          await refreshData();
          setFlashMessage({
            message: t("update_data_enrollment"),
            type: "success",
            duration: 3000,
          });
        } else {
          setFlashMessage({
            message: t("no_update_data_enrollment"),
            type: "warning",
            duration: 3000,
          });
        }
      }
    } catch (error) {
      // console.error("Erreur lors de la mise à jour forcée du snapshot:", error);
      setFlashMessage({
        message: t("error_update_data_enrollment"),
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsForceUpdating(false);
    }
  };

  // Styles adaptatifs
  const containerBgColor = theme === "dark" ? "bg-gray-900" : app_bg_color;
  const headerBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const buttonBgColor =
    theme === "dark"
      ? "bg-gray-700 hover:bg-gray-600"
      : "bg-white hover:bg-gray-50";
  const buttonTextColor = theme === "dark" ? "text-gray-300" : "text-gray-700";
  const activeBgColor = theme === "dark" ? "bg-blue-600" : "bg-blue-500";
  const accentBgColor =
    theme === "dark"
      ? "bg-green-600 hover:bg-green-500"
      : "bg-green-500 hover:bg-green-400";

  if (!stats) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${containerBgColor} p-6 rounded-xl`}
      >
        <div className="text-center py-12">
          <Users
            className={`w-16 h-16 mx-auto mb-4 ${
              theme === "dark" ? "text-gray-600" : "text-gray-400"
            }`}
          />
          <p
            className={`${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            } text-lg`}
          >
            {t("no_data_available")}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`${containerBgColor} min-h-screen p-6 space-y-6`}
    >
      {/* En-tête avec contrôles */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`${headerBgColor} rounded-xl p-6 shadow-lg border ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1
              className={`text-2xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              } mb-2`}
            >
              {t("enrollment_statistics")}
            </h1>
            <p
              className={`${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {t("enrollment_tracking")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Sélecteur d'année */}
            <YearSelector
              years={availableYears}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              theme={theme}
            />

            {/* Sélecteur de type de graphique */}
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              {[
                { type: "line", icon: LineChart, label: t("line_chart") },
                { type: "bar", icon: BarChart3, label: t("bar_chart") },
                { type: "pie", icon: PieChart, label: t("pie_chart") },
              ].map(({ type, icon: Icon, label }) => (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setChartType(type)}
                  title={t("change_chart")}
                  className={`
                    px-3 py-2 text-sm font-medium transition-all duration-200
                    ${
                      chartType === type
                        ? `${activeBgColor} text-white`
                        : `${buttonBgColor} ${buttonTextColor} border-r border-gray-300`
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                </motion.button>
              ))}
            </div>

            {/* Bouton de rafraîchissement */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={isLoading}
              title={t("refresh_data")}
              className={`
                ${buttonBgColor} ${buttonTextColor}
                px-4 py-2 rounded-lg border border-gray-300
                transition-all duration-200 flex items-center gap-2
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              {t("refresh")}
            </motion.button>

            {/* Bouton de mise à jour forcée du snapshot - Amélioré et plus visible */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleForceUpdateSnapshot}
              disabled={isForceUpdating}
              title={t("force_to_load_enrollment")}
              className={`
                ${accentBgColor} text-white
                px-4 py-2 rounded-lg border border-gray-300
                transition-all duration-200 flex items-center gap-2
                disabled:opacity-50 disabled:cursor-not-allowed
                font-medium shadow-md
              `}
            >
              <RotateCw
                className={`w-4 h-4 ${isForceUpdating ? "animate-spin" : ""}`}
              />
              {t("force_to_load_enrollment")}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Cartes de statistiques */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatsCard
          title={t("total_students")}
          value={stats.current.total}
          previousValue={stats.previous?.total}
          icon={Users}
          theme={theme}
          app_bg_color={app_bg_color}
          text_color={text_color}
        />

        <StatsCard
          title={t("boys")}
          value={stats.current.male}
          previousValue={stats.previous?.male}
          icon={UserCheck}
          theme={theme}
          app_bg_color={app_bg_color}
          text_color={text_color}
        />

        <StatsCard
          title={t("girls")}
          value={stats.current.female}
          previousValue={stats.previous?.female}
          icon={UserCheck}
          theme={theme}
          app_bg_color={app_bg_color}
          text_color={text_color}
        />

        <StatsCard
          title={t("evolution")}
          value={`${stats.growthRate > 0 ? "+" : ""}${stats.growthRate}%`}
          previousValue={null}
          icon={TrendingUp}
          theme={theme}
          app_bg_color={app_bg_color}
          text_color={text_color}
          evolutionTextColor={
            stats.growthRate > 0
              ? "text-green-600"
              : stats.growthRate === 0
              ? ""
              : "text-red-600"
          }
        />
      </motion.div>

      {/* Graphiques et analyses */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Graphique principal */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2"
        >
          <EnrollmentChart
            data={chartData}
            chartType={chartType}
            theme={theme}
            app_bg_color={app_bg_color}
            text_color={text_color}
            title={`${t("enrollment_evolution")} - ${selectedYear}`}
          />
        </motion.div>

        {/* Répartition par classe */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ClassBreakdown
            classData={classData}
            selectedYear={selectedYear}
            theme={theme}
            app_bg_color={app_bg_color}
            text_color={text_color}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EnrollmentStats;
