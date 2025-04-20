import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { FaChartBar, FaExclamationTriangle } from "react-icons/fa";

const StatistiquesPageContent = ({
  app_bg_color,
  text_color,
  theme,
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const iconVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  return (
    <div className={`p-4 mt-20 ml-20 flex justify-center items-center min-h-[80vh] ${app_bg_color} ${text_color}`}>
      <motion.div 
        className={`max-w-2xl p-8 rounded-lg shadow-lg border border-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white text-gray-700'}`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="flex justify-center mb-6"
          variants={itemVariants}
        >
          <motion.div
            animate="animate"
            variants={iconVariants}
            className="text-6xl text-yellow-500"
          >
            <FaExclamationTriangle />
          </motion.div>
        </motion.div>
        
        <motion.h1 
          className="text-3xl font-bold text-center mb-6"
          variants={itemVariants}
        >
          Module de Statistiques
        </motion.h1>
        
        <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <p className="text-xl mb-4">
            Nous vous prions de nous excuser pour ce désagrément.
          </p>
          <p className="mb-4">
            Le module de statistiques avancées est actuellement en cours de développement 
            pour vous offrir une expérience exceptionnelle d'analyse de données.
          </p>
          <p>
            Notre équipe travaille avec passion pour intégrer cette fonctionnalité 
            très prochainement avec des graphiques interactifs et des analyses détaillées.
          </p>
        </motion.div>
        
        <motion.div 
          className="flex justify-center"
          variants={itemVariants}
        >
          <motion.div
            className="p-4 rounded-full bg-blue-100 dark:bg-blue-900"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaChartBar className="text-4xl text-blue-600 dark:text-blue-300" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const StatistiquesPage = () => {
  const context = useOutletContext();
  return <StatistiquesPageContent {...context} />;
};

export default StatistiquesPage;
