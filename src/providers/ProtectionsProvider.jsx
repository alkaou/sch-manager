import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProtectionsContext } from "../components/contexts";

const ProtectionsProvider = ({ children }) => {
  const [isShowSecurityPopup, setIsShowSecurityPopup] = useState(false);

  const protectionsValues = {
    isShowSecurityPopup,
    setIsShowSecurityPopup,
  };

  return (
    <ProtectionsContext.Provider value={protectionsValues}>
      {isShowSecurityPopup && (
        <AnimatePresence>
          <motion.div
            style={{ zIndex: 999999 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button onClick={() => setIsShowSecurityPopup(false)}>
              Fermer
            </button>
          </motion.div>
        </AnimatePresence>
      )}
      {children}
    </ProtectionsContext.Provider>
  );
};

export default ProtectionsProvider;
