import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2 } from "lucide-react";
import { useLanguage, useTheme } from "../contexts";
import { translate } from "./security_translator.js";
import { verifyPassword } from "./security_methodes.js";
import PasswordInput from "./PasswordInput.jsx";

const SecurityConfirmation = ({
  onConfirm,
  onSettings,
  hasPassword,
  db,
  onConfirmAction,
}) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = () => {
    if (!password) return;
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      // Simule un délai réseau
      const isValid = verifyPassword(password, db);
      if (isValid) {
        onConfirm();
      } else {
        setError(translate("incorrectPassword", language));
        setIsLoading(false);
      }
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleConfirm();
    }
  };

  if (!hasPassword || !onConfirmAction) {
    return (
      <div
        className={`text-center p-8 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-100"
          }`}
      >
        {hasPassword ?
          <>
            <p className="p-4 font-bold">{translate("message_indication", language)}</p>
            <p className="p-2">{translate("message_indication_1", language)}</p>
          </>

          : (
            <>
              <h3 className="text-xl font-semibold mb-2">
                {translate("secureYourData", language)}
              </h3>
              <p className="mb-4">{translate("setupPasswordPrompt", language)}</p>
              <motion.button
                onClick={onSettings}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {translate("setupNow", language)}
              </motion.button>
            </>
          )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-6">
        <ShieldCheck size={48} className="mx-auto text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold">
          {translate("confirmAccess", language)}
        </h2>
        <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
          {translate("enterPasswordToContinue", language)}
        </p>
      </div>

      <div className="space-y-4">
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={translate("password", language)}
        />
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <motion.button
          onClick={handleConfirm}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -2 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
        >
          {isLoading && <Loader2 className="animate-spin mr-2" size={20} />}
          {translate("validate", language)}
        </motion.button>
      </div>
    </div>
  );
};

export default SecurityConfirmation;
