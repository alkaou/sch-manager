import React from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useTheme } from "./contexts";


const ActionConfirmePopup = ({
  isOpenConfirmPopup, setIsOpenConfirmPopup, handleConfirmeAction, title,
  message, actionType = "danger", element_info, text_color
}) => {

  const { theme, app_bg_color } = useTheme();

  const popup_bg_color = theme === "dark" ? "bg-gray-800" : app_bg_color;
  const textClass = text_color ? text_color : theme === "dark" ? "text-white" : "text-gray-600";
  const inputBorderColor = theme === "dark" ? "border-gray-600" : "border-gray-300";
  const confirmeButtonColor = actionType === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700";


  return (
    <AnimatePresence>
      {isOpenConfirmPopup && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`${popup_bg_color} ${textClass} dark:bg-gray-800 p-6 rounded-lg shadow-xl ${inputBorderColor} border`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-center">{title ? title : "Passer un titre de confirmation !"}</h3>
            <p className="mb-6 text-center">
              {message ? message : "Passer un message de confirmation !"} {element_info ? element_info : ""}
            </p>
            <div className="flex justify-around">
              <motion.button
                type="button"
                onClick={handleConfirmeAction}
                className={`text-white px-4 py-2 rounded ${confirmeButtonColor}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Confirmer
              </motion.button>
              <motion.button
                type="button"
                onClick={setIsOpenConfirmPopup}
                className="text-white px-4 py-2 rounded bg-gray-500 hover:bg-gray-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Annuler
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ActionConfirmePopup;
