import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateEnrollmentReport, getCurrentSchoolYear } from '../utils/database_methods';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell, AreaChart, Area
} from 'recharts';

// Couleurs pour les graphiques
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const GENDER_COLORS = {male: '#0088FE', female: '#FF69B4'};

const EnrollmentStats = ({ 
  app_bg_color, 
  text_color, 
  theme, 
  setShowEnrollmentStats,
  database 
}) => {
  const [report, setReport] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [chartType, setChartType] = useState('bar');
  const [chartData, setChartData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    if (database) {
      try {
        const generatedReport = generateEnrollmentReport(database);
        setReport(generatedReport);
        
        // Set default selected year to the current year if available, otherwise the latest year
        const currentYear = getCurrentSchoolYear();
        if (generatedReport.years.includes(currentYear)) {
          setSelectedYear(currentYear);
        } else if (generatedReport.years.length > 0) {
          setSelectedYear(generatedReport.years[generatedReport.years.length - 1]);
        }
        
        // Préparer les données pour les graphiques de tendance
        if (generatedReport.years.length > 0) {
          const trend = generatedReport.years.map(year => ({
            name: year,
            total: generatedReport.totalsByYear[year] || 0,
            males: generatedReport.malesByYear?.[year] || 0,
            females: generatedReport.femalesByYear?.[year] || 0
          }));
          setTrendData(trend);
        }
      } catch (err) {
        setError("Erreur lors de la génération du rapport: " + err.message);
      } finally {
        setIsLoading(false);
      }
    }
  }, [database]);
  
  // Préparer les données de graphique quand l'année sélectionnée change
  useEffect(() => {
    if (report && selectedYear) {
      const classData = report.classesByYear[selectedYear];
      
      if (classData) {
        // Données pour le graphique par classe
        const formattedData = Object.entries(classData).map(([className, data]) => ({
          name: className,
          total: data.total || 0,
          males: data.males || 0,
          females: data.females || 0
        })).sort((a, b) => {
          // Trier par niveau de classe
          const levelA = parseInt(a.name.match(/^\d+/)?.[0] || 0);
          const levelB = parseInt(b.name.match(/^\d+/)?.[0] || 0);
          return levelA - levelB;
        });
        
        setChartData(formattedData);
        
        // Données pour le graphique de répartition par sexe
        const genderChartData = [
          { name: 'Garçons', value: report.malesByYear[selectedYear] || 0, color: GENDER_COLORS.male },
          { name: 'Filles', value: report.femalesByYear[selectedYear] || 0, color: GENDER_COLORS.female }
        ];
        
        setGenderData(genderChartData);
      }
    }
  }, [report, selectedYear]);

  // Styles conditionnels basés sur le thème
  const formBgColor = theme === "dark" ? "bg-gray-800" : app_bg_color;
  const cardBgColor = theme === "dark" ? "bg-gray-700" : "bg-white";
  const textClass = theme === "dark" ? text_color : "text-gray-600";
  const textHeadingClass = theme === "dark" ? text_color : "text-gray-800";
  const shinyBorderColor = theme === "dark" ? "border-blue-400" : "border-purple-400";
  const tabActiveBgColor = theme === "dark" ? "bg-blue-600" : "bg-purple-500";
  const tabInactiveBgColor = theme === "dark" ? "bg-gray-700/60" : "bg-gray-200";
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  if (isLoading) {
    return (
      <motion.div
        className={`mx-auto p-6 ${formBgColor} mt-10 rounded-xl shadow-2xl border-2 ${shinyBorderColor}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "90%" }}
      >
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className={`mx-auto p-6 ${formBgColor} mt-10 rounded-xl shadow-2xl border-2 border-red-500`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "90%" }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${textHeadingClass}`}>Statistiques des Effectifs</h2>
          <button
            onClick={() => setShowEnrollmentStats(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>{error}</p>
        </div>
      </motion.div>
    );
  }

  if (!report || report.years.length === 0) {
    return (
      <motion.div
        className={`mx-auto p-6 ${formBgColor} mt-10 rounded-xl shadow-2xl border-2 ${shinyBorderColor}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "90%" }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${textHeadingClass}`}>Statistiques des Effectifs</h2>
          <button
            onClick={() => setShowEnrollmentStats(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          <p>Aucune donnée d'effectif disponible. Les statistiques seront automatiquement créées lorsque vous ajouterez des élèves.</p>
        </div>
      </motion.div>
    );
  }

  // Obtenir les données pour l'année sélectionnée
  const yearData = report?.classesByYear?.[selectedYear] || {};
  const totalStudents = report?.totalsByYear?.[selectedYear] || 0;
  const maleStudents = report?.malesByYear?.[selectedYear] || 0; 
  const femaleStudents = report?.femalesByYear?.[selectedYear] || 0;

  return (
    <motion.div
      className={`mx-auto p-6 ${formBgColor} mt-10 rounded-xl shadow-2xl border-2 ${shinyBorderColor}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ width: "90%" }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${textHeadingClass}`}>Statistiques des Effectifs</h2>
        <button
          onClick={() => setShowEnrollmentStats(false)}
          className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Sélecteur d'année scolaire */}
      <motion.div 
        className="mb-6"
        variants={itemVariants}
      >
        <label className={`block mb-2 font-medium ${textClass}`}>Année Scolaire:</label>
        <select
          className={`${cardBgColor} border ${text_color} rounded-md p-2 w-64`}
          value={selectedYear || ''}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {report.years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        
        <motion.div 
          className={`mt-4 ${cardBgColor} p-4 rounded-lg shadow-lg`}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <div className={`font-bold ${textHeadingClass} text-xl mb-2`}>
            Total des élèves: {totalStudents}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: GENDER_COLORS.male }}></div>
              <span className={textClass}>Garçons: <span className="font-bold">{maleStudents} ({totalStudents > 0 ? Math.round(maleStudents / totalStudents * 100) : 0}%)</span></span>
            </motion.div>
            
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: GENDER_COLORS.female }}></div>
              <span className={textClass}>Filles: <span className="font-bold">{femaleStudents} ({totalStudents > 0 ? Math.round(femaleStudents / totalStudents * 100) : 0}%)</span></span>
            </motion.div>
          </div>
          
          {report.years.length >= 2 && (
            <motion.div 
              className={`mt-2 ${textClass}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Évolution depuis la première année: 
              <span className={report.evolution.absolute >= 0 ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                {' '}{report.evolution.absolute >= 0 ? '+' : ''}{report.evolution.absolute} élèves 
                ({report.evolution.absolute >= 0 ? '+' : ''}{report.evolution.percentage}%)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <span className={report.evolution.males.absolute >= 0 ? "text-green-500" : "text-red-500"}>
                    Garçons: {report.evolution.males.absolute >= 0 ? '+' : ''}{report.evolution.males.absolute} ({report.evolution.males.absolute >= 0 ? '+' : ''}{report.evolution.males.percentage}%)
                  </span>
                </div>
                <div>
                  <span className={report.evolution.females.absolute >= 0 ? "text-green-500" : "text-red-500"}>
                    Filles: {report.evolution.females.absolute >= 0 ? '+' : ''}{report.evolution.females.absolute} ({report.evolution.females.absolute >= 0 ? '+' : ''}{report.evolution.females.percentage}%)
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Onglets de visualisation */}
      <div className="flex flex-wrap gap-2 mb-4">
        <motion.button
          className={`px-4 py-2 rounded-lg text-white font-medium ${activeTab === 'overview' ? tabActiveBgColor : tabInactiveBgColor}`}
          onClick={() => setActiveTab('overview')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Vue d'ensemble
        </motion.button>
        <motion.button
          className={`px-4 py-2 rounded-lg text-white font-medium ${activeTab === 'gender' ? tabActiveBgColor : tabInactiveBgColor}`}
          onClick={() => setActiveTab('gender')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Répartition par sexe
        </motion.button>
        <motion.button
          className={`px-4 py-2 rounded-lg text-white font-medium ${activeTab === 'evolution' ? tabActiveBgColor : tabInactiveBgColor}`}
          onClick={() => setActiveTab('evolution')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Évolution
        </motion.button>
        <motion.button
          className={`px-4 py-2 rounded-lg text-white font-medium ${activeTab === 'details' ? tabActiveBgColor : tabInactiveBgColor}`}
          onClick={() => setActiveTab('details')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Détails
        </motion.button>
      </div>

      {/* Sélecteur de type de graphique */}
      {activeTab !== 'details' && (
        <motion.div 
          className="mb-4 flex gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button 
            className={`px-3 py-1 rounded ${chartType === 'bar' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setChartType('bar')}
          >
            Barres
          </button>
          <button 
            className={`px-3 py-1 rounded ${chartType === 'pie' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setChartType('pie')}
          >
            Camembert
          </button>
          <button 
            className={`px-3 py-1 rounded ${chartType === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setChartType('line')}
          >
            Ligne
          </button>
          <button 
            className={`px-3 py-1 rounded ${chartType === 'area' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setChartType('area')}
          >
            Aire
          </button>
        </motion.div>
      )}

      {/* Contenu de l'onglet Vue d'ensemble */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            className={`${cardBgColor} p-6 rounded-lg shadow-lg mb-6`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className={`text-xl font-bold mb-4 ${textHeadingClass}`}>
              Répartition par Classe - {selectedYear}
            </h3>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' && (
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" name="Total" fill="#8884d8" animationDuration={1500} />
                    <Bar dataKey="males" name="Garçons" fill={GENDER_COLORS.male} animationDuration={1500} />
                    <Bar dataKey="females" name="Filles" fill={GENDER_COLORS.female} animationDuration={1500} />
                  </BarChart>
                )}
                {chartType === 'line' && (
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total" name="Total" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
                    <Line type="monotone" dataKey="males" name="Garçons" stroke={GENDER_COLORS.male} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="females" name="Filles" stroke={GENDER_COLORS.female} activeDot={{ r: 6 }} />
                  </LineChart>
                )}
                {chartType === 'pie' && (
                  <PieChart>
                    <Pie 
                      data={chartData} 
                      dataKey="total" 
                      nameKey="name" 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={80} 
                      label
                      animationDuration={1500}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                )}
                {chartType === 'area' && (
                  <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="males" name="Garçons" stackId="1" stroke={GENDER_COLORS.male} fill={GENDER_COLORS.male} />
                    <Area type="monotone" dataKey="females" name="Filles" stackId="1" stroke={GENDER_COLORS.female} fill={GENDER_COLORS.female} />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
        
        {/* Contenu de l'onglet Répartition par sexe */}
        {activeTab === 'gender' && (
          <motion.div 
            key="gender"
            className={`${cardBgColor} p-6 rounded-lg shadow-lg mb-6`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className={`text-xl font-bold mb-4 ${textHeadingClass}`}>
              Répartition par Sexe - {selectedYear}
            </h3>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'pie' && (
                  <PieChart>
                    <Pie 
                      data={genderData} 
                      dataKey="value" 
                      nameKey="name"
                      cx="50%" 
                      cy="50%" 
                      outerRadius={80} 
                      label
                      animationDuration={1500}
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                )}
                {chartType === 'bar' && (
                  <BarChart data={genderData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Nombre d'élèves" animationDuration={1500}>
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
        
        {/* Contenu de l'onglet Évolution */}
        {activeTab === 'evolution' && (
          <motion.div 
            key="evolution"
            className={`${cardBgColor} p-6 rounded-lg shadow-lg mb-6`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className={`text-xl font-bold mb-4 ${textHeadingClass}`}>
              Évolution des Effectifs
            </h3>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' && (
                  <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total" name="Total" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
                    <Line type="monotone" dataKey="males" name="Garçons" stroke={GENDER_COLORS.male} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="females" name="Filles" stroke={GENDER_COLORS.female} activeDot={{ r: 6 }} />
                  </LineChart>
                )}
                {chartType === 'bar' && (
                  <BarChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="males" name="Garçons" fill={GENDER_COLORS.male} animationDuration={1500} />
                    <Bar dataKey="females" name="Filles" fill={GENDER_COLORS.female} animationDuration={1500} />
                  </BarChart>
                )}
                {chartType === 'area' && (
                  <AreaChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="total" name="Total" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="males" name="Garçons" stroke={GENDER_COLORS.male} fill={GENDER_COLORS.male} fillOpacity={0.6} />
                    <Area type="monotone" dataKey="females" name="Filles" stroke={GENDER_COLORS.female} fill={GENDER_COLORS.female} fillOpacity={0.6} />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
        
        {/* Contenu de l'onglet Détails */}
        {activeTab === 'details' && (
          <motion.div 
            key="details"
            className={`${cardBgColor} p-6 rounded-lg shadow-lg`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className={`text-xl font-bold mb-4 ${textHeadingClass}`}>
              Détail des Effectifs - {selectedYear}
            </h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left">Classe</th>
                    <th className="px-4 py-2 text-center">Garçons</th>
                    <th className="px-4 py-2 text-center">Filles</th>
                    <th className="px-4 py-2 text-center">Total</th>
                    <th className="px-4 py-2 text-center">% du total</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((classData, index) => (
                    <motion.tr 
                      key={classData.name} 
                      className="border-b border-gray-200 dark:border-gray-700"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td className={`px-4 py-2 font-medium ${textClass}`}>{classData.name}</td>
                      <td className={`px-4 py-2 text-center ${textClass}`}>
                        {classData.males} 
                        <span className="text-xs ml-1">
                          ({classData.total > 0 ? Math.round(classData.males / classData.total * 100) : 0}%)
                        </span>
                      </td>
                      <td className={`px-4 py-2 text-center ${textClass}`}>
                        {classData.females}
                        <span className="text-xs ml-1">
                          ({classData.total > 0 ? Math.round(classData.females / classData.total * 100) : 0}%)
                        </span>
                      </td>
                      <td className={`px-4 py-2 text-center font-semibold ${textClass}`}>{classData.total}</td>
                      <td className={`px-4 py-2 text-center ${textClass}`}>
                        {totalStudents > 0 ? (classData.total / totalStudents * 100).toFixed(1) : 0}%
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
                <tfoot className="font-semibold bg-gray-50 dark:bg-gray-900">
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: chartData.length * 0.05 }}
                  >
                    <td className={`px-4 py-2 ${textClass}`}>TOTAL</td>
                    <td className={`px-4 py-2 text-center ${textClass}`}>
                      {maleStudents} 
                      <span className="text-xs ml-1">
                        ({totalStudents > 0 ? Math.round(maleStudents / totalStudents * 100) : 0}%)
                      </span>
                    </td>
                    <td className={`px-4 py-2 text-center ${textClass}`}>
                      {femaleStudents}
                      <span className="text-xs ml-1">
                        ({totalStudents > 0 ? Math.round(femaleStudents / totalStudents * 100) : 0}%)
                      </span>
                    </td>
                    <td className={`px-4 py-2 text-center ${textClass}`}>{totalStudents}</td>
                    <td className={`px-4 py-2 text-center ${textClass}`}>100%</td>
                  </motion.tr>
                </tfoot>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EnrollmentStats; 