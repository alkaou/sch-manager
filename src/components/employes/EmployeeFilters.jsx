import React from "react";
import { motion } from "framer-motion";
import { Search, SortAsc, SortDesc } from "lucide-react";
import { useTheme, useLanguage } from "../contexts";
import { translate } from "./employes_translator";
import { return_prof_trans } from "./utils";

const EmployeeFilters = ({ filters, setFilters, positionName }) => {
  const { app_bg_color, text_color, theme, gradients } = useTheme();
  const { language } = useLanguage();

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  // Theme-based styling
  const containerBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const inputBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const buttonColor =
    theme === "dark"
      ? "bg-gray-700 hover:bg-gray-600"
      : "bg-gray-200 hover:bg-gray-300";
  const activeFilterBg =
    theme === "dark" ? "bg-blue-900 bg-opacity-30" : "bg-blue-100";

  const _text_color =
    app_bg_color === gradients[1] ||
    app_bg_color === gradients[2] ||
    theme === "dark"
      ? text_color
      : "text-gray-700";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`${containerBg} border ${borderColor} rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 shadow-md`}
    >
      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2 sm:gap-4">
        {/* Position Title */}
        <div className="w-full sm:flex-1 mb-2 sm:mb-0">
          <h2 className={`text-lg sm:text-xl font-bold ${_text_color}`}>
            {translate("employees", language)} :{" "}
            {return_prof_trans(positionName, language)}
          </h2>
        </div>

        {/* Search */}
        <div className="w-full sm:w-auto sm:flex-1">
          <div
            className={`flex items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-md ${inputBgColor}`}
          >
            <Search size={16} className={`${_text_color} opacity-60 mr-2`} />
            <input
              type="text"
              placeholder={translate("search_employees", language)}
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
              className={`bg-transparent outline-none w-full text-sm ${_text_color}`}
            />
          </div>
        </div>

        <div className="flex w-full sm:w-auto gap-2">
          {/* Status Filter */}
          <div className="flex-1 sm:flex-none">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm rounded-md appearance-none ${inputBgColor} ${_text_color} pr-8 cursor-pointer focus:ring-2 focus:ring-blue-500`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.5rem center",
                backgroundSize: "1.5em 1.5em",
              }}
            >
              <option value="All">{translate("all_statuses", language)}</option>
              <option value="actif">{translate("active_1", language)}</option>
              <option value="inactif">{translate("inactive_1", language)}</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex-1 sm:flex-none">
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm rounded-md appearance-none ${inputBgColor} ${_text_color} pr-8 cursor-pointer focus:ring-2 focus:ring-blue-500`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.5rem center",
                backgroundSize: "1.5em 1.5em",
              }}
            >
              <option value="name">{translate("name", language)}</option>
              <option value="added_at">
                {translate("sort_by_added_date", language)}
              </option>
              <option value="service_started_at">
                {translate("sort_by_service_start", language)}
              </option>
              <option value="status">
                {translate("sort_by_status", language)}
              </option>
            </select>
          </div>

          {/* Sort Direction Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSortOrder}
            className={`p-1.5 sm:p-2 rounded-md ${buttonColor} ${_text_color}`}
            title={
              filters.sortOrder === "asc"
                ? translate("tri_order_ascendant", language)
                : translate("tri_order_descendant", language)
            }
          >
            {filters.sortOrder === "asc" ? (
              <SortAsc size={18} />
            ) : (
              <SortDesc size={18} />
            )}
          </motion.button>
        </div>
      </div>

      {/* Active filters display */}
      {(filters.searchTerm || filters.status !== "All") && (
        <div className="mt-3 flex flex-wrap gap-2 items-center">
          <span className={`text-xs sm:text-sm ${_text_color}`}>
            {translate("filters_actifs", language)} :
          </span>

          {filters.searchTerm && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`px-2 py-1 rounded-md ${activeFilterBg} text-xs sm:text-sm ${_text_color} flex items-center`}
            >
              <span>
                {translate("search_notify", language)} : {filters.searchTerm}
              </span>
              <button
                onClick={() => handleFilterChange("searchTerm", "")}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </motion.div>
          )}

          {filters.status !== "All" && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`px-2 py-1 rounded-md ${activeFilterBg} text-xs sm:text-sm ${_text_color} flex items-center`}
            >
              <span>
                {translate("status", language)}:{" "}
                {filters.status === "actif"
                  ? translate("active_1", language)
                  : translate("inactive_1", language)}
              </span>
              <button
                onClick={() => handleFilterChange("status", "All")}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setFilters((prev) => ({
                ...prev,
                searchTerm: "",
                status: "All",
              }));
            }}
            className={`px-2 py-1 text-xs sm:text-sm ${buttonColor} ${_text_color} rounded-md ml-auto`}
          >
            {translate("reinitialise_filter", language)}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default EmployeeFilters;
