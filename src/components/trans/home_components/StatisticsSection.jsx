import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, BarChart2, PieChart, Users, DollarSign,
  ChevronUp, ArrowRight
} from 'lucide-react';

import { useLanguage, useTheme } from '../contexts';

const StatisticsSection = ({ isOthersBGColors }) => {
  const { theme, text_color } = useTheme();
  const { live_language } = useLanguage();

  // State for animated counters
  const [studentCount, setStudentCount] = useState(0);
  const [revenueCount, setRevenueCount] = useState(0);
  const [successRate, setSuccessRate] = useState(0);

  // Data for line chart - Average scores by year
  const yearsData = ['2022', '2023', '2024', '2025'];
  const scoresData = [68, 72, 79, 85];
  const maxScore = Math.max(...scoresData) + 10;

  // Data for bar chart - Student enrollment
  const enrollmentData = [698, 986, 1798, 2485];
  const maxEnrollment = Math.max(...enrollmentData) * 1.2;

  // Data for comparison chart - Revenue vs Expenses
  const revenueData = [2400000, 3100000, 4250000, 5500000];
  const expensesData = [1900000, 2400000, 3100000, 3950000];
  const maxFinancial = Math.max(...revenueData, ...expensesData) * 1.1;

  // Animation for the counters
  useEffect(() => {
    const studentTimer = setInterval(() => {
      setStudentCount(prev => {
        const target = 2485;
        const increment = Math.ceil((target - prev) / 20);
        const newValue = prev + increment;
        return newValue >= target ? target : newValue;
      });
    }, 50);

    const revenueTimer = setInterval(() => {
      setRevenueCount(prev => {
        const target = 15750000;
        const increment = Math.ceil((target - prev) / 20);
        const newValue = prev + increment;
        return newValue >= target ? target : newValue;
      });
    }, 50);

    const successTimer = setInterval(() => {
      setSuccessRate(prev => {
        const target = 92;
        const increment = (target - prev) / 20;
        const newValue = prev + increment;
        return newValue >= target ? target : newValue;
      });
    }, 50);

    return () => {
      clearInterval(studentTimer);
      clearInterval(revenueTimer);
      clearInterval(successTimer);
    };
  }, []);

  // Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Get height percentage for chart visualization
  const getHeight = (value, max) => {
    return (value / max) * 100;
  };

  const isDarkMode = theme === 'dark';
  const _texts_color = isOthersBGColors ? "text-gray-700" : text_color;

  return (
    <section id="statistics" className="py-20 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50 to-transparent dark:via-blue-900/10 -z-10"></div>

      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${text_color} inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600`}>
            {live_language.statistics_title || "Performance Statistics"}
          </h2>
          <p className={`max-w-2xl mx-auto text-lg ${text_color} opacity-75`}>
            {live_language.statistics_subtitle || "Visualize the impact of our solution on your school's performance."}
          </p>
        </motion.div>

        {/* Statistics Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 ${_texts_color}`}>
          <motion.div
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm opacity-60">{live_language.total_students || "Total Students"}</p>
                <h3 className="text-3xl font-bold mt-1">{formatNumber(studentCount)}</h3>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
            </div>
            <div className="flex items-center text-green-600">
              <ChevronUp size={16} />
              <span className="text-sm font-medium ml-1">18.3%</span>
              <span className="text-sm opacity-60 ml-2">{live_language.vs_prev_year || "vs prev year"}</span>
            </div>
          </motion.div>

          <motion.div
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm opacity-60">{live_language.total_revenue || "Total Revenue"}</p>
                <h3 className="text-3xl font-bold mt-1">{formatNumber(revenueCount)} F</h3>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <DollarSign className="text-green-600 dark:text-green-400" size={24} />
              </div>
            </div>
            <div className="flex items-center text-green-600">
              <ChevronUp size={16} />
              <span className="text-sm font-medium ml-1">23.5%</span>
              <span className="text-sm opacity-60 ml-2">{live_language.vs_prev_year || "vs prev year"}</span>
            </div>
          </motion.div>

          <motion.div
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm opacity-60">{live_language.success_rate || "Success Rate"}</p>
                <h3 className="text-3xl font-bold mt-1">{successRate.toFixed(1)}%</h3>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <TrendingUp className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
            </div>
            <div className="flex items-center text-green-600">
              <ChevronUp size={16} />
              <span className="text-sm font-medium ml-1">7.8%</span>
              <span className="text-sm opacity-60 ml-2">{live_language.vs_prev_year || "vs prev year"}</span>
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10 ${_texts_color}`}>
          {/* Line Chart - Average Scores by Year */}
          <motion.div
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold">{live_language.avg_scores || "Average Scores"}</h3>
              <BarChart2 size={20} className="opacity-60" />
            </div>

            <div className="relative h-64">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs opacity-60 pb-6">
                <span>100</span>
                <span>75</span>
                <span>50</span>
                <span>25</span>
                <span>0</span>
              </div>

              {/* Chart area */}
              <div className="ml-8 h-full flex items-end justify-around">
                {scoresData.map((score, index) => (
                  <div key={index} className="relative flex flex-col items-center w-full">
                    {/* Line connecting points */}
                    {index < scoresData.length - 1 && (
                      <motion.div
                        className="absolute h-px bg-blue-500 origin-left"
                        style={{
                          width: '100%',
                          bottom: `${getHeight(score, maxScore)}%`,
                          transform: `rotate(${Math.atan2(
                            getHeight(scoresData[index + 1], maxScore) - getHeight(score, maxScore),
                            100
                          )}rad)`,
                          transformOrigin: 'left bottom'
                        }}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
                      />
                    )}

                    {/* Data point */}
                    <motion.div
                      className="w-20 flex flex-col items-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
                    >
                      <motion.div
                        className="w-3 h-3 rounded-full bg-blue-600 shadow-md relative z-10 mb-1"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 15,
                          delay: 0.8 + index * 0.2
                        }}
                        whileHover={{ scale: 1.5 }}
                      />
                      <motion.div
                        className="h-1 w-1 bg-blue-600 opacity-20 rounded-full absolute bottom-0"
                        style={{ height: `${getHeight(score, maxScore)}%` }}
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
                      />
                      <span className="text-xs font-semibold mt-2">{yearsData[index]}</span>
                      <span className="text-sm font-bold">{score}%</span>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Bar Chart - Student Enrollment */}
          <motion.div
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold">{live_language.student_enrollment || "Student Enrollment"}</h3>
              <PieChart size={20} className="opacity-60" />
            </div>

            <div className="relative h-64">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs opacity-60 pb-6">
                <span>{maxEnrollment.toFixed(0)}</span>
                <span>{(maxEnrollment * 0.75).toFixed(0)}</span>
                <span>{(maxEnrollment * 0.5).toFixed(0)}</span>
                <span>{(maxEnrollment * 0.25).toFixed(0)}</span>
                <span>0</span>
              </div>

              {/* Chart area */}
              <div className="ml-8 h-full flex items-end justify-around pt-6">
                {enrollmentData.map((count, index) => (
                  <div key={index} className="relative flex flex-col items-center justify-end h-full w-full">
                    <motion.div
                      className="w-12 bg-purple-600 rounded-t-md"
                      style={{
                        height: `${getHeight(count, maxEnrollment)}%`
                      }}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.3 + index * 0.2 }}
                      whileHover={{
                        scaleX: 1.1,
                        backgroundColor: isDarkMode ? '#a855f7' : '#7c3aed'
                      }}
                    >
                      <motion.div
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-bold"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.8 + index * 0.2 }}
                      >
                        {count}
                      </motion.div>
                    </motion.div>
                    <span className="text-xs font-semibold mt-2">{yearsData[index]}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Revenue vs Expenses Chart */}
        <motion.div
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg mb-10 ${_texts_color}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold">{live_language.revenue_vs_expenses || "Revenue vs Expenses"}</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm">{live_language.revenue || "Revenue"}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm">{live_language.expenses || "Expenses"}</span>
              </div>
            </div>
          </div>

          <div className="relative h-80">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs opacity-60 pb-6">
              <span>{(maxFinancial / 1000000).toFixed(1)}M</span>
              <span>{(maxFinancial * 0.75 / 1000000).toFixed(1)}M</span>
              <span>{(maxFinancial * 0.5 / 1000000).toFixed(1)}M</span>
              <span>{(maxFinancial * 0.25 / 1000000).toFixed(1)}M</span>
              <span>0</span>
            </div>

            {/* Chart area */}
            <div className="ml-12 h-full flex items-end justify-around pt-6">
              {yearsData.map((year, index) => (
                <div key={index} className="relative flex items-end justify-center h-full w-full">
                  {/* Revenue bar */}
                  <motion.div
                    className="w-10 bg-green-500 rounded-t-md mx-1"
                    style={{
                      height: `${getHeight(revenueData[index], maxFinancial)}%`
                    }}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.3 + index * 0.1 }}
                    whileHover={{
                      scaleX: 1.1,
                      backgroundColor: isDarkMode ? '#10b981' : '#059669'
                    }}
                  >
                    <motion.div
                      className="absolute -top-8 left-1/3 transform -translate-x-1/2 text-xs font-bold text-green-600"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                    >
                      {(revenueData[index] / 1000000).toFixed(1)}M
                    </motion.div>
                  </motion.div>

                  {/* Expenses bar */}
                  <motion.div
                    className="w-10 bg-red-500 rounded-t-md mx-1"
                    style={{
                      height: `${getHeight(expensesData[index], maxFinancial)}%`
                    }}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.4 + index * 0.1 }}
                    whileHover={{
                      scaleX: 1.1,
                      backgroundColor: isDarkMode ? '#ef4444' : '#dc2626'
                    }}
                  >
                    <motion.div
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-red-600"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                    >
                      {(expensesData[index] / 1000000).toFixed(1)}M
                    </motion.div>
                  </motion.div>

                  <span className="absolute -bottom-6 text-xs font-semibold">{year}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Call to action */}
        <motion.div
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'} p-8 rounded-xl text-center ${_texts_color}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold mb-3">
            {live_language.impact_title || "See the impact on your institution"}
          </h3>
          <p className="max-w-2xl mx-auto mb-6 opacity-75">
            {live_language.impact_description || "These statistics are based on the average performance of institutions using our platform. Find out how you can achieve similar results."}
          </p>
          <motion.button
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {live_language.learn_more || "Learn more"}
            <ArrowRight className="ml-2" size={18} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default StatisticsSection; 