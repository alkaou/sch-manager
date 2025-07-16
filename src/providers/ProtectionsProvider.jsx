import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ProtectionsContext } from "../components/contexts";
import SecurityManager from "../components/security_manager/SecurityManager.jsx";

const ProtectionsProvider = ({ children }) => {

  const navigate = useNavigate();
  const [isShowSecurityPopup, setIsShowSecurityPopup] = useState(false);
  const [onConfirmAction, setOnConfirmAction] = useState(null);

  const openPasswordPoupAndPastAction = (action = null) => {
    setIsShowSecurityPopup(true);
    if (action) {
      setOnConfirmAction(action);
    }
  };

  const handleAuthenticated = () => {
    // Action à effectuer après une authentification réussie
    // console.log("User authenticated successfully!");
    if (onConfirmAction) {
      setIsShowSecurityPopup(false);
      if (onConfirmAction === "navigateToStartedPage") {
        navigate("/started_page");
      }
    }
  };

  const onClose = ()=> {
    setIsShowSecurityPopup(false);
    setOnConfirmAction(null);
  };

  const protectionsValues = {
    isShowSecurityPopup,
    setIsShowSecurityPopup,
    openPasswordPoupAndPastAction,
  };


  return (
    <ProtectionsContext.Provider value={protectionsValues}>
      <AnimatePresence>
        {isShowSecurityPopup && (
          <motion.div
            style={{ zIndex: 9999 }}
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SecurityManager
              onClose={onClose}
              onConfirm={handleAuthenticated}
              onConfirmAction={onConfirmAction}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </ProtectionsContext.Provider>
  );
};

export default ProtectionsProvider;
