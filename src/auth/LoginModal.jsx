import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAuth } from "./AuthContext";
import { useTheme } from "../components/contexts";
import { useLanguage } from "../components/contexts";
import translations from "./auth_translator";

const LoginModal = ({ isOpen, onClose }) => {
  const { login, loading, error } = useAuth();
  const { theme } = useTheme();
  const { language } = useLanguage();

  // Translation helper function
  const t = (key) => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]["Français"];
  };

  const bgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const textColor = theme === "dark" ? "text-gray-200" : "text-gray-800";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";

  const handleGoogleSignIn = async () => {
    try {
      await login();
      onClose(); // Ferme la modal après une connexion réussie
    } catch (err) {
      console.error("Échec de la connexion:", err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className={`${bgColor} rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-red-600 hover:text-white dark:hover:bg-gray-700 transition-colors"
              >
                <X size={20} className={textColor} />
              </button>
              <h2 className={`text-2xl font-bold ${textColor}`}>
                {t("login_to_school_manager")}
              </h2>
              <p
                className={`mt-2 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t("sign_in_to_access")}
              </p>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className={`w-full hover:scale-105 transition flex items-center justify-center gap-3 py-3 px-4 ${borderColor} border rounded-lg transition-colors ${textColor}`}
                >
                  {/* Google Icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span className="font-medium">
                    {loading ? t("signing_in") : t("sign_in_with_google")}
                  </span>
                </button>
              </div>

              <div className="mt-6 text-center">
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("terms_agreement")}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
