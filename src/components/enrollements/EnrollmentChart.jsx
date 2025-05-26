import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import translations from './enrollements_traduction';
import { useLanguage } from '../contexts';

const EnrollmentChart = ({
  data,
  chartType = 'line',
  theme,
  app_bg_color,
  text_color,
  title,
  className = ""
}) => {
  const { language } = useLanguage();

  // Fonction helper pour les traductions
  const t = (key) => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]["Français"];
  };

  // Couleurs adaptatives selon le thème
  const chartColors = useMemo(() => {
    if (theme === "dark") {
      return {
        primary: '#60A5FA',
        secondary: '#34D399',
        tertiary: '#F472B6',
        grid: '#374151',
        text: '#D1D5DB',
        background: '#1F2937'
      };
    }
    return {
      primary: '#3B82F6',
      secondary: '#10B981',
      tertiary: '#EC4899',
      grid: '#E5E7EB',
      text: '#6B7280',
      background: '#FFFFFF'
    };
  }, [theme]);

  // Couleurs pour le graphique en secteurs
  const pieColors = [
    chartColors.primary,
    chartColors.secondary,
    chartColors.tertiary,
    '#F59E0B',
    '#8B5CF6',
    '#EF4444'
  ];

  // Tooltip personnalisé
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`
            ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}
            border rounded-lg p-3 shadow-lg backdrop-blur-sm
          `}
        >
          <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"} text-sm font-medium mb-2`}>
            {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name === 'total' ? t('total_students') : 
                 entry.name === 'male' ? t('boys') : 
                 entry.name === 'female' ? t('girls') : entry.name}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </motion.div>
      );
    }
    return null;
  };

  // Rendu du graphique linéaire
  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
        <XAxis 
          dataKey="schoolYear" 
          stroke={chartColors.text}
          fontSize={12}
          tickLine={false}
        />
        <YAxis 
          stroke={chartColors.text}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="total"
          name="total"
          stroke={chartColors.primary}
          strokeWidth={3}
          dot={{ fill: chartColors.primary, strokeWidth: 2, r: 6 }}
          activeDot={{ r: 8, stroke: chartColors.primary, strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="male"
          name="male"
          stroke={chartColors.secondary}
          strokeWidth={2}
          dot={{ fill: chartColors.secondary, strokeWidth: 2, r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="female"
          name="female"
          stroke={chartColors.tertiary}
          strokeWidth={2}
          dot={{ fill: chartColors.tertiary, strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  // Rendu du graphique en barres
  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
        <XAxis 
          dataKey="schoolYear" 
          stroke={chartColors.text}
          fontSize={12}
          tickLine={false}
        />
        <YAxis 
          stroke={chartColors.text}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="total" name="total" fill={chartColors.primary} radius={[4, 4, 0, 0]} />
        <Bar dataKey="male" name="male" fill={chartColors.secondary} radius={[4, 4, 0, 0]} />
        <Bar dataKey="female" name="female" fill={chartColors.tertiary} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  // Rendu du graphique en secteurs
  const renderPieChart = () => {
    const pieData = data.length > 0 ? [
      { name: t('boys'), value: data[data.length - 1]?.male || 0 },
      { name: t('girls'), value: data[data.length - 1]?.female || 0 }
    ] : [];

    return (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return renderBarChart();
      case 'pie':
        return renderPieChart();
      default:
        return renderLineChart();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`
        ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}
        border rounded-xl p-6 shadow-lg ${className}
      `}
    >
      {title && (
        <motion.h3 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`
            ${theme === "dark" ? "text-white" : "text-gray-900"}
            text-lg font-semibold mb-6
          `}
        >
          {title}
        </motion.h3>
      )}
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {renderChart()}
      </motion.div>
    </motion.div>
  );
};

export default EnrollmentChart;