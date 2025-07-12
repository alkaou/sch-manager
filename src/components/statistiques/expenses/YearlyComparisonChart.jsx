import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { useLanguage } from "../../contexts";
import { translate } from "../statistique_translator";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-gray-800 bg-opacity-90 text-white rounded-lg shadow-xl border border-gray-700">
        <p className="font-bold mb-1">{label}</p>
        <p className="text-sm">{`Total: ${new Intl.NumberFormat().format(
          payload[0].value
        )}`}</p>
      </div>
    );
  }
  return null;
};

const YearlyComparisonChart = ({ data }) => {
  const { language } = useLanguage();
  const t = (key) => translate(key, language);

  const chartData = data
    .sort((a, b) => a.created_at - b.created_at)
    .map((item) => ({
      name: item.title,
      total: item.total,
    }));
  const locale = language === "Anglais" ? "en-US" : "fr-FR";

  return (
    <motion.div
      className="w-full h-full p-4 bg-gray-800/50 rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold mb-4 text-white">
        {t("yearly_expense_comparison")}
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={"#FFFFFF"} />
          <XAxis dataKey="name" stroke={"#FFFFFF"} fontSize={12} />
          <YAxis
            stroke={"#FFFFFF"}
            fontSize={12}
            tickFormatter={(value) =>
              new Intl.NumberFormat(locale, {
                notation: "compact",
                compactDisplay: "short",
              }).format(value)
            }
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(100, 116, 139, 0.1)" }}
          />
          <Legend
            formatter={(value) => (
              <span className="text-white">{t(value)}</span>
            )}
          />
          <Bar
            dataKey="total"
            name="total_expenses"
            fill="#8b5cf6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default YearlyComparisonChart;
