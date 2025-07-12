import React from "react";
import { useLanguage } from "../../contexts";
import { translate } from "../statistique_translator";
import { Calendar, DollarSign } from "lucide-react";

const ComparisonControls = ({
  expensesYears,
  revenueYears,
  selectedExpenseYear,
  setSelectedExpenseYear,
  selectedRevenueYear,
  setSelectedRevenueYear,
  theme,
  // text_color,
}) => {
  const { language } = useLanguage();

  const handleExpenseYearChange = (e) => {
    const yearId = e.target.value;
    const selected = expensesYears.find((y) => y.id === yearId);
    setSelectedExpenseYear(selected);
  };

  const handleRevenueYearChange = (e) => {
    const yearId = e.target.value;
    const selected = revenueYears.find((y) => y.id === yearId);
    setSelectedRevenueYear(selected);
  };

  const selectStyles = `w-full p-3 rounded-lg border ${
    theme === "dark" ? "bg-gray-800 text-white" : "text-gray-800"
  } focus:ring-2 focus:ring-blue-500 transition-shadow duration-300`;

  return (
    <div
      className={`p-4 rounded-xl shadow-md border-2 ${
        theme === "light" ? "bg-white text-gray-800" : ""
      }`}
    >
      <h3 className={`text-xl font-bold mb-4 uppercase`}>
        {translate("comparison_settings", language)}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Select for Expenses Year */}
        <div>
          <label
            htmlFor="expense-year-select"
            className={`flex items-center text-sm font-medium mb-2 opacity-80`}
          >
            <DollarSign className="w-4 h-4 mr-2 text-red-500" />
            {translate("select_expense_year", language)}
          </label>
          <select
            id="expense-year-select"
            value={selectedExpenseYear?.id || ""}
            onChange={handleExpenseYearChange}
            className={selectStyles}
          >
            {expensesYears.map((year) => (
              <option key={year.id} value={year.id}>
                {year.title}
              </option>
            ))}
          </select>
        </div>

        {/* Select for Revenue Year */}
        <div>
          <label
            htmlFor="revenue-year-select"
            className={`flex items-center text-sm font-medium mb-2 opacity-80`}
          >
            <Calendar className="w-4 h-4 mr-2 text-green-500" />
            {translate("select_revenue_year", language)}
          </label>
          <select
            id="revenue-year-select"
            value={selectedRevenueYear?.id || ""}
            onChange={handleRevenueYearChange}
            className={selectStyles}
          >
            {revenueYears.map((year) => (
              <option key={year.id} value={year.id}>
                {`${translate("year", language)} ${year.startDate.substring(
                  0,
                  4
                )}-${year.endDate.substring(0, 4)}`}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ComparisonControls;
