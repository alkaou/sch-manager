import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaDatabase, FaLock, FaSignInAlt } from "react-icons/fa";

const NotConnectedView = ({ theme, setLoginModalOpen, isAuthenticated }) => {
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`rounded-lg p-8 ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-700"
        } shadow-xl max-w-4xl mx-auto`}
    >
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className={`p-6 rounded-full mb-6 ${isDark ? "bg-gray-700" : "bg-gray-100"
            }`}
        >
          <FaLock className={`text-6xl`} />
        </motion.div>

        <h2 className={`text-2xl font-bold mb-4`}>
          Connexion Requise
        </h2>

        <p className={`mb-8 text-lg opacity-80`}>
          Pour accéder au système de sauvegarde de base de données à distance,
          veuillez vous connecter à votre compte. Cette fonctionnalité vous permet
          de sauvegarder vos données en toute sécurité et d'y accéder depuis n'importe quel appareil.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className={`p-6 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"
              } flex flex-col items-center`}
          >
            <FaDatabase className={`text-4xl mb-4`} />
            <h3 className={`text-xl font-semibold mb-2`}>
              Sauvegarde Sécurisée
            </h3>
            <p className={`text-sm opacity-80`}>
              Protégez vos données contre les pertes accidentelles en les sauvegardant dans le cloud.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className={`p-6 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"
              } flex flex-col items-center`}
          >
            <FaDatabase className={`text-4xl mb-4`} />
            <h3 className={`text-xl font-semibold mb-2`}>
              Synchronisation
            </h3>
            <p className={`text-sm opacity-80`}>
              Synchronisez facilement vos données entre différents appareils ou après une réinstallation.
            </p>
          </motion.div>
        </div>

        {!isAuthenticated && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8"
          >
            <Link
              onClick={() => setLoginModalOpen(true)}
              className={`flex items-center gap-2 px-8 py-3 rounded-full ${isDark
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
                } text-white font-medium transition-colors`}
            >
              <FaSignInAlt />
              Se Connecter
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default NotConnectedView;