import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, PieChart } from 'lucide-react';

const LoadingSpinner = ({ theme }) => {
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  // Animation variants pour les icônes flottantes
  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div 
        className={`${cardBg} rounded-xl shadow-lg border ${borderColor} p-12 text-center max-w-md`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Icônes animées */}
        <div className="flex justify-center items-center gap-6 mb-8">
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="text-blue-500"
          >
            <BarChart3 className="w-8 h-8" />
          </motion.div>
          
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="text-green-500"
            style={{ animationDelay: '0.5s' }}
          >
            <TrendingUp className="w-8 h-8" />
          </motion.div>
          
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="text-purple-500"
            style={{ animationDelay: '1s' }}
          >
            <PieChart className="w-8 h-8" />
          </motion.div>
        </div>

        {/* Spinner principal */}
        <motion.div 
          className="w-16 h-16 mx-auto mb-6"
          variants={pulseVariants}
          animate="animate"
        >
          <div className={`
            w-full h-full rounded-full border-4 border-t-blue-500 border-r-green-500 
            border-b-purple-500 border-l-transparent animate-spin
          `}></div>
        </motion.div>

        {/* Texte de chargement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold mb-2">
            Chargement des statistiques...
          </h3>
          <p className="text-sm opacity-70">
            Analyse des données en cours
          </p>
        </motion.div>

        {/* Barres de progression animées */}
        <div className="mt-6 space-y-2">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className={`h-1 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{
                  duration: 2,
                  delay: 0.5 + i * 0.2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut'
                }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;