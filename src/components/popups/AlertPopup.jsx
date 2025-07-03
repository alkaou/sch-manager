import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts";

const AlertPopup = ({
  isOpenAlertPopup, 
  setIsOpenAlertPopup, 
  title,
  message
}) => {
  const { theme, app_bg_color } = useTheme();

  const popup_bg_color = theme === "dark" ? "bg-gray-800" : app_bg_color;
  const textClass = theme === "dark" ? "text-white" : "text-gray-600";
  const inputBorderColor = theme === "dark" ? "border-gray-600" : "border-gray-300";
  const buttonColor = "bg-blue-600 hover:bg-blue-700";

  return (
    <AnimatePresence>
      {isOpenAlertPopup && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`${popup_bg_color} ${textClass} dark:bg-gray-800 p-6 rounded-lg shadow-xl ${inputBorderColor} border max-w-md w-full`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-center">{title || "Information"}</h3>
            <p className="mb-6 text-center">
              {message || "Message d'information"}
            </p>
            <div className="flex justify-center">
              <motion.button
                type="button"
                onClick={setIsOpenAlertPopup}
                className={`text-white px-4 py-2 rounded border border-2 ${buttonColor}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                OK
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertPopup;