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
import { getBambaraMonth } from "../../../utils/helpers";

const CustomTooltip = ({ active, payload, language, schoolYear }) => {
  if (active && payload && payload.length) {
    // Utiliser les données directement du payload pour obtenir les bonnes informations
    const dataPoint = payload[0].payload;
    const monthNumber = dataPoint.monthNumber;
    const year = dataPoint.year;
    const monthKey = dataPoint.monthKey;

    const IntMonthKey = parseInt(monthKey);
    const Monthyear = IntMonthKey > 9 ? year - 1 : year;

    // console.log(dataPoint);

    // Créer une date avec le bon mois et année
    const date = new Date(year, monthNumber - 1, 1);
    const _monthName = date.toLocaleString(
      language === "Français" ? "fr-FR" : "en-US",
      { month: "long" }
    );

    const monthName =
      language === "Bambara" ? getBambaraMonth(_monthName) : _monthName;

    return (
      <div className="p-3 bg-gray-800 bg-opacity-90 text-white rounded-lg shadow-xl border border-gray-700">
        <p className="font-bold mb-1">{`${monthName} ${Monthyear}`}</p>
        <p className="text-sm">{`Total: ${new Intl.NumberFormat().format(
          payload[0].value
        )}`}</p>
      </div>
    );
  }
  return null;
};

const MonthlyChart = ({ data, theme, schoolYear }) => {
  const { language } = useLanguage();
  const t = (key) => translate(key, language);
  const locale = language === 'Anglais' ? 'en-US' : 'fr-FR';

  const chartData = data.map((item) => {
    // Utiliser les nouvelles données structurées
    const date = new Date(item.year, item.monthNumber - 1, 1);
    const monthLabel = date.toLocaleString(
      locale,
      { month: "short" }
    );

    return {
      ...item,
      monthLabel,
    };
  });

  return (
    <motion.div
      className="w-full h-full p-4 bg-gray-800/50 rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold mb-4 text-white">{`${t(
        "monthly_expenses_for"
      )} ${schoolYear.title}`}</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme === "dark" ? "#4A5568" : "#E2E8F0"}
          />
          <XAxis
            dataKey="monthLabel"
            stroke={theme === "dark" ? "#A0AEC0" : "#4A5568"}
            fontSize={12}
          />
          <YAxis
            stroke={theme === "dark" ? "#A0AEC0" : "#4A5568"}
            fontSize={12}
            tickFormatter={(value) =>
              new Intl.NumberFormat(locale, {
                notation: "compact",
                compactDisplay: "short",
              }).format(value)
            }
          />
          <Tooltip
            content={
              <CustomTooltip language={language} schoolYear={schoolYear} />
            }
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
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default MonthlyChart;
