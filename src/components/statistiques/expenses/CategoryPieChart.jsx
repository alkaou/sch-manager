import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { useLanguage } from "../../contexts";
import { translate } from "../statistique_translator";

const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f97316",
  "#10b981",
  "#f59e0b",
  "#6366f1",
];

const CustomTooltip = ({ active, payload, language }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-3 bg-gray-800 bg-opacity-90 text-white rounded-lg shadow-xl border border-gray-700">
        <p className="font-bold mb-1">
          {translate(`category_${data.name}`, language)}
        </p>
        <p className="text-sm">{`Total: ${new Intl.NumberFormat().format(
          data.value
        )} (${data.percent.toFixed(1)}%)`}</p>
      </div>
    );
  }
  return null;
};

const CategoryPieChart = ({ data, schoolYear }) => {
  const { language } = useLanguage();
  const t = (key) => translate(key, language);

  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  const chartData = data.map((item) => ({
    ...item,
    percent: (item.value / total) * 100,
  }));

  return (
    <motion.div
      className="w-full min-h-[300px] p-4 bg-gray-800/50 rounded-xl shadow-lg flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-lg font-semibold mb-2 text-white">{`${t(
        "expenses_by_category_for"
      )} ${schoolYear.title}`}</h3>
      {chartData && chartData.length > 0 ? (
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip language={language} />} />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconType="circle"
                formatter={(value, entry) => (
                  <span className="text-white text-sm">
                    {translate(`category_${value}`, language)}
                  </span>
                )}
              />
              <Pie
                data={chartData}
                cx="40%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center text-center">
          <div>
            <p className="text-white font-semibold">{t("no_data_for_year")}</p>
            <p className="text-xs text-white mt-1">
              {t("no_expense_data_for_category")}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CategoryPieChart;
